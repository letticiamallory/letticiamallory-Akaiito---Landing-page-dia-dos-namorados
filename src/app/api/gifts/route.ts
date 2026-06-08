import { NextRequest, NextResponse } from "next/server";
import { createGift } from "@/lib/gifts";
import { getProduct, type ProductId } from "@/lib/products";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productId, data, buyerEmail, amountCents } = body as {
      productId: ProductId;
      data: object;
      buyerEmail: string;
      amountCents?: number;
    };

    if (!productId || !data || !buyerEmail) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 });
    }

    if (!getProduct(productId)) {
      return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(buyerEmail)) {
      return NextResponse.json({ error: "E-mail inválido" }, { status: 400 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || req.nextUrl.origin;

    const result = await createGift({
      productId,
      data,
      buyerEmail,
      baseUrl,
      amountCents,
    });

    return NextResponse.json(result);
  } catch (err) {
    console.error("Create gift error:", err);
    const root = err instanceof Error && "cause" in err && err.cause instanceof Error ? err.cause : err;
    const code = root && typeof root === "object" && "code" in root ? String(root.code) : "";
    const messageText = err instanceof Error ? err.message : "";
    const causeText = root instanceof Error ? root.message : "";

    const mpMessage =
      err && typeof err === "object" && "message" in err && typeof err.message === "string"
        ? err.message
        : "";

    const message =
      mpMessage.includes("auto_return") || mpMessage.includes("back_url")
        ? "Erro no Mercado Pago ao gerar checkout. Tente novamente ou use URL pública (HTTPS) em NEXT_PUBLIC_BASE_URL."
        : code === "CONNECT_TIMEOUT" ||
            code === "ECONNREFUSED" ||
            /CONNECT_TIMEOUT|ECONNREFUSED/i.test(`${messageText} ${causeText}`)
          ? "Banco de dados indisponível. Rode npm run db:up e reinicie o servidor (npm run dev)."
          : code === "28P01" || /autentica/i.test(causeText)
            ? "Falha ao conectar no banco. Confira DATABASE_URL no .env.local (porta 5433)."
            : code === "22003" || /out of range for type integer/i.test(causeText)
              ? "Erro interno ao salvar data do presente. Reinicie o servidor e tente de novo."
              : /DATABASE_URL/i.test(messageText)
                ? "DATABASE_URL não configurada. Copie .env.example para .env.local."
                : mpMessage || messageText || "Erro ao criar presente";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
