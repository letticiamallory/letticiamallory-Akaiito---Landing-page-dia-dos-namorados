/**
 * Verificação pré-deploy: env, banco, Mercado Pago, Resend e build.
 *
 * Uso:
 *   npm run verify-deploy
 *   npm run verify-deploy -- --send-email   # envia e-mail de teste (VERIFY_TEST_EMAIL)
 *   npm run verify-deploy -- --skip-build   # pula npm run build
 */
import { execSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { createPreference, shouldUseSandboxCheckout } from "../src/lib/mercadopago";
import { getEmailFrom, isEmailConfigured } from "../src/lib/email/client";
import { sendGiftLinkEmail } from "../src/lib/email/send-gift-link";
import { ensureSchema } from "../src/lib/db";
import { sql } from "drizzle-orm";
import { db } from "../src/lib/db";

type Status = "ok" | "warn" | "fail" | "skip";

interface CheckResult {
  name: string;
  status: Status;
  detail: string;
}

const results: CheckResult[] = [];
const args = new Set(process.argv.slice(2));
const sendTestEmail = args.has("--send-email");
const skipBuild = args.has("--skip-build");

function loadEnvLocal() {
  const path = join(process.cwd(), ".env.local");
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}

function record(name: string, status: Status, detail: string) {
  results.push({ name, status, detail });
  const icon = { ok: "✓", warn: "!", fail: "✗", skip: "–" }[status];
  const label = { ok: "OK", warn: "AVISO", fail: "FALHA", skip: "PULADO" }[status];
  console.log(`${icon} ${name}: ${label} — ${detail}`);
}

function getMercadoPagoToken(): string | undefined {
  const test = process.env.MERCADOPAGO_TEST_ACCESS_TOKEN?.trim();
  const live = process.env.MERCADOPAGO_ACCESS_TOKEN?.trim();
  return live || test || undefined;
}

function extractEmailDomain(from: string): string | null {
  const match = from.match(/<([^>]+)>/) ?? from.match(/([\w.-]+@[\w.-]+\.\w+)/);
  return match?.[1]?.split("@")[1] ?? null;
}

async function checkEnv() {
  const required = [
    "DATABASE_URL",
    "NEXT_PUBLIC_BASE_URL",
    "MERCADOPAGO_ACCESS_TOKEN",
    "RESEND_API_KEY",
  ] as const;

  const missing = required.filter((key) => !process.env[key]?.trim());
  if (missing.length) {
    record("Variáveis de ambiente", "fail", `Faltando: ${missing.join(", ")}`);
    return;
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!.trim();
  const sandbox = shouldUseSandboxCheckout(baseUrl);
  const warnings: string[] = [];

  if (!process.env.EMAIL_FROM?.trim()) {
    warnings.push(`EMAIL_FROM ausente — usando padrão: ${getEmailFrom()}`);
  }
  if (baseUrl.includes("seu-projeto") || baseUrl.includes("localhost")) {
    warnings.push("NEXT_PUBLIC_BASE_URL ainda parece placeholder/local");
  }
  if (!baseUrl.startsWith("https://") && !baseUrl.includes("localhost")) {
    warnings.push("NEXT_PUBLIC_BASE_URL sem HTTPS — webhook/auto_return do MP podem falhar");
  }

  record(
    "Variáveis de ambiente",
    warnings.length ? "warn" : "ok",
    `Configuradas. MP sandbox=${sandbox ? "sim" : "não"}${warnings.length ? ` · ${warnings.join("; ")}` : ""}`
  );
}

async function checkDatabase() {
  try {
    await ensureSchema();
    await db.execute(sql`SELECT 1`);
    record("Banco de dados (Supabase/Postgres)", "ok", "Conexão e tabela gifts OK");
  } catch (error) {
    const root =
      error instanceof Error && "cause" in error && error.cause instanceof Error
        ? error.cause
        : error;
    const code =
      root && typeof root === "object" && "code" in root ? String(root.code) : "";
    const message = root instanceof Error ? root.message : String(error);
    const hint =
      code === "CONNECT_TIMEOUT" || /CONNECT_TIMEOUT/i.test(message)
        ? "Confira DATABASE_URL (Supabase pooler) e rede/firewall"
        : code === "28P01" || /password authentication failed/i.test(message)
          ? "Senha incorreta em DATABASE_URL"
          : code === "ECONNREFUSED"
            ? "Postgres inacessível — rode npm run db:up (local) ou confira Supabase"
            : "";
    record(
      "Banco de dados (Supabase/Postgres)",
      "fail",
      [message, hint].filter(Boolean).join(" · ")
    );
  }
}

async function checkMercadoPago() {
  const token = getMercadoPagoToken();
  if (!token) {
    record("Mercado Pago", "fail", "Token não configurado");
    return;
  }

  try {
    const meRes = await fetch("https://api.mercadopago.com/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!meRes.ok) {
      const body = await meRes.text();
      record("Mercado Pago (token)", "fail", `HTTP ${meRes.status}: ${body.slice(0, 120)}`);
      return;
    }

    const me = (await meRes.json()) as { id?: number; nickname?: string };
    const isTest = token.startsWith("TEST-");
    record(
      "Mercado Pago (token)",
      "ok",
      `Conta ${me.nickname ?? me.id ?? "?"} · ${isTest ? "credencial de teste" : "credencial de produção"}`
    );

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!.replace(/\/$/, "");
    const giftId = `verify-${Date.now()}`;
    const preference = await createPreference({
      giftId,
      productId: "historia",
      buyerEmail: process.env.VERIFY_TEST_EMAIL?.trim() || "teste@example.com",
      baseUrl,
      amountCents: 490,
    });

    const checkout = shouldUseSandboxCheckout(baseUrl)
      ? preference.sandboxInitPoint
      : preference.initPoint;

    if (!preference.preferenceId || !checkout) {
      record("Mercado Pago (checkout)", "fail", "Preferência criada sem init_point");
      return;
    }

    record(
      "Mercado Pago (checkout)",
      "ok",
      `Preferência ${preference.preferenceId} · URL gerada (${shouldUseSandboxCheckout(baseUrl) ? "sandbox" : "produção"})`
    );
  } catch (error) {
    record(
      "Mercado Pago",
      "fail",
      error instanceof Error ? error.message : String(error)
    );
  }
}

async function checkResend() {
  if (!isEmailConfigured()) {
    record("Resend", "fail", "RESEND_API_KEY não configurada");
    return;
  }

  const apiKey = process.env.RESEND_API_KEY!.trim();
  const from = getEmailFrom();
  const domain = extractEmailDomain(from);

  try {
    const domainsRes = await fetch("https://api.resend.com/domains", {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    if (!domainsRes.ok) {
      const body = await domainsRes.text();
      record("Resend (API)", "fail", `HTTP ${domainsRes.status}: ${body.slice(0, 120)}`);
      return;
    }

    const payload = (await domainsRes.json()) as {
      data?: Array<{ name: string; status: string }>;
    };
    const domains = payload.data ?? [];
    const verified = domains.filter((d) => d.status === "verified").map((d) => d.name);

    if (!domain) {
      record("Resend (domínio)", "warn", `EMAIL_FROM inválido: ${from}`);
    } else if (!verified.includes(domain)) {
      record(
        "Resend (domínio)",
        "fail",
        `${domain} não verificado no Resend. Verificados: ${verified.join(", ") || "nenhum"}`
      );
      return;
    } else {
      record("Resend (domínio)", "ok", `${domain} verificado · remetente: ${from}`);
    }

    const testEmail = process.env.VERIFY_TEST_EMAIL?.trim();
    if (!sendTestEmail) {
      record(
        "Resend (envio)",
        "skip",
        "Use --send-email e VERIFY_TEST_EMAIL no .env.local para testar envio real"
      );
      return;
    }
    if (!testEmail) {
      record("Resend (envio)", "warn", "VERIFY_TEST_EMAIL não definido — envio de teste pulado");
      return;
    }

    const result = await sendGiftLinkEmail({
      to: testEmail,
      slug: "teste-verificacao",
      giftData: JSON.stringify({ pageConfig: { coupleNames: "Teste & Verificação" } }),
      baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
    });

    if (result.sent) {
      record("Resend (envio)", "ok", `E-mail de teste enviado para ${testEmail} (id: ${result.id ?? "?"})`);
    } else {
      record("Resend (envio)", "fail", `Não enviado: ${result.reason}`);
    }
  } catch (error) {
    record("Resend", "fail", error instanceof Error ? error.message : String(error));
  }
}

async function checkBuild() {
  if (skipBuild) {
    record("Build de produção", "skip", "Pulado (--skip-build)");
    return;
  }

  try {
    execSync("npm run build", { stdio: "pipe", encoding: "utf8" });
    record("Build de produção", "ok", "next build concluído sem erros");
  } catch (error) {
    const stdout =
      error && typeof error === "object" && "stdout" in error
        ? String((error as { stdout?: string }).stdout ?? "")
        : "";
    const stderr =
      error && typeof error === "object" && "stderr" in error
        ? String((error as { stderr?: string }).stderr ?? "")
        : "";
    const snippet = (stderr || stdout).split("\n").slice(-8).join(" ").trim();
    record("Build de produção", "fail", snippet || "Falha no build");
  }
}

function printSummary() {
  const failed = results.filter((r) => r.status === "fail").length;
  const warned = results.filter((r) => r.status === "warn").length;
  const passed = results.filter((r) => r.status === "ok").length;

  console.log("\n--- Resumo ---");
  console.log(`✓ ${passed} ok · ! ${warned} avisos · ✗ ${failed} falhas`);

  if (failed > 0) {
    console.log("\nCorrija as falhas antes do deploy.");
    process.exit(1);
  }
  if (warned > 0) {
    console.log("\nHá avisos — revise, mas pode seguir com deploy se fizer sentido.");
  } else {
    console.log("\nTudo certo para deploy.");
  }
}

async function main() {
  console.log("Akaiito — verificação pré-deploy\n");
  loadEnvLocal();

  await checkEnv();
  await checkDatabase();
  await checkMercadoPago();
  await checkResend();
  await checkBuild();
  printSummary();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
