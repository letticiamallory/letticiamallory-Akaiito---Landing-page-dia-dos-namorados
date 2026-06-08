"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Watermark } from "@/builder/components/Watermark";

const ScrapbookPresentPage = dynamic(
  () =>
    import("@/components/present/ScrapbookPresentPage").then((m) => m.ScrapbookPresentPage),
  {
    loading: () => (
      <div className="min-h-[70vh] flex items-center justify-center text-sm text-white/60">
        Carregando preview…
      </div>
    ),
    ssr: false,
  }
);
import { buildPresentData, sortSections } from "@/lib/builder/utils";
import {
  BASE_PRICE_CENTS,
  getPremiumSectionNames,
} from "@/lib/builder/pricing";
import { formatPrice } from "@/lib/products";
import { Field } from "@/components/create-form-fields";
import { useBuilderStore } from "@/builder/store/builder.store";
import { warmPresentAssets } from "@/lib/present-preload";

export function PreviewStep() {
  const rawSections = useBuilderStore((s) => s.sections);
  const sections = useMemo(() => sortSections(rawSections), [rawSections]);
  const buyerEmail = useBuilderStore((s) => s.buyerEmail);
  const setBuyerEmail = useBuilderStore((s) => s.setBuyerEmail);
  const reset = useBuilderStore((s) => s.reset);
  const setStep = useBuilderStore((s) => s.setStep);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setStep("preview");
  }, [setStep]);

  const presentData = buildPresentData(sections);
  const premium = getPremiumSectionNames(sections);

  async function handleCheckout() {
    if (!buyerEmail.trim()) {
      alert("Informe seu e-mail para receber o link.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/gifts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: "historia",
          data: presentData,
          buyerEmail,
          amountCents: BASE_PRICE_CENTS,
        }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Erro ao criar presente");
      await warmPresentAssets(result.id, presentData);
      reset();
      window.location.href = result.checkoutUrl || `/pagamento/${result.id}`;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro desconhecido");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <Watermark variant="panda" />
      <header className="border-b border-[var(--border)] bg-[var(--bg)]/90 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <Link
            href={`/criar/personalizar/${sections.length - 1}`}
            className="text-sm text-[var(--text-muted)] no-underline hover:text-[var(--text)]"
          >
            Voltar
          </Link>
          <p className="text-sm text-[var(--text-muted)]">
            Preview: role para ver a página inteira
          </p>
        </div>
      </header>

      {/* Landing page completa com marca d&apos;água */}
      <div className="relative bg-[#C52929]">
        <ScrapbookPresentPage data={presentData} preview />
      </div>

      {/* Checkout abaixo do preview */}
      <div className="border-t border-[var(--border)] bg-[var(--bg2)]">
        <div className="max-w-lg mx-auto px-6 py-12">
          <h1 className="font-display text-2xl font-extrabold tracking-tight mb-2">
            Seu presente está quase pronto
          </h1>
          <p className="text-sm text-[var(--text-muted)] mb-8">
            A marca d&apos;água some após o pagamento. Revise tudo acima antes de comprar.
          </p>

          <div className="rounded-2xl border border-[var(--border2)] bg-[var(--surface)] p-6 mb-6">
            <h3 className="font-display font-bold mb-4">Resumo do pedido</h3>
            <ul className="text-sm text-[var(--text-muted)] space-y-2 mb-4">
              <li>✓ {sections.length} seções selecionadas</li>
              {premium.length > 0 && <li>✓ Inclui: {premium.join(", ")}</li>}
            </ul>
            <div className="font-display text-2xl font-bold text-[var(--rose)]">
              {formatPrice(BASE_PRICE_CENTS)}
            </div>
            <p className="text-xs text-[var(--text-dim)] mt-1">
              Preço único, tudo incluído, sem custo extra por seções
            </p>
          </div>

          <Field
            label="Seu e-mail (para receber o link)"
            value={buyerEmail}
            onChange={setBuyerEmail}
            type="email"
            placeholder="seu@email.com"
            required
          />

          {error && <p className="text-sm text-red-400 mt-2">{error}</p>}

          <div className="flex flex-col gap-3 mt-6">
            <button
              type="button"
              disabled={loading}
              onClick={handleCheckout}
              className="btn-primary btn-rose w-full justify-center"
            >
              {loading ? "Criando..." : "Comprar e gerar link"}
            </button>
            <Link
              href="/criar/secoes"
              className="text-sm text-[var(--text-muted)] no-underline text-center"
            >
              Editar seções
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
