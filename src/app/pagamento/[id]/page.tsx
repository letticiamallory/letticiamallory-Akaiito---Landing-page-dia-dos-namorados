"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { PresentCheckoutPreloader } from "@/components/present/PresentCheckoutPreloader";
import type { ScrapbookPresentData } from "@/lib/builder/types";
import { readStashedPresent } from "@/lib/present-preload";

function PagamentoContent({ id }: { id: string }) {
  const searchParams = useSearchParams();
  const isDemo = searchParams.get("demo") === "1";
  const status = searchParams.get("status");
  const paymentId =
    searchParams.get("payment_id") ||
    searchParams.get("collection_id") ||
    undefined;
  const [link, setLink] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [demoMode, setDemoMode] = useState(isDemo);
  const [allowDevConfirm, setAllowDevConfirm] = useState(false);
  const [error, setError] = useState("");
  const [preloadData, setPreloadData] = useState<ScrapbookPresentData | null>(null);

  const confirmPayment = useCallback(
    async (options?: { demo?: boolean; verify?: boolean; devConfirm?: boolean }) => {
      try {
        const res = await fetch(`/api/gifts/${id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            demo: options?.demo ?? demoMode,
            verify: options?.verify,
            devConfirm: options?.devConfirm,
            paymentId,
          }),
        });
        const data = await res.json();
        if (res.ok && data.link) {
          setLink(data.link);
          setLoading(false);
          if (data.slug) {
            window.location.href = `/obrigado/${data.slug}`;
          }
          return true;
        }
        if (!res.ok && data.error) {
          setError(data.error);
        }
      } catch {
        setError("Erro ao confirmar pagamento");
      }
      return false;
    },
    [id, demoMode, paymentId]
  );

  useEffect(() => {
    async function init() {
      const infoRes = await fetch(`/api/gifts/${id}`);
      const info = await infoRes.json();
      if (info.demoMode) setDemoMode(true);
      if (info.allowDevConfirm) setAllowDevConfirm(true);
      setPreloadData(readStashedPresent(id) ?? info.presentData ?? null);

      if (info.status === "paid" && info.link) {
        setLink(info.link);
        setLoading(false);
        return;
      }

      if (status === "success" || paymentId) {
        const ok = await confirmPayment({ verify: true });
        if (ok) return;
      }

      if (demoMode || info.demoMode) {
        setLoading(false);
        return;
      }

      setLoading(false);
    }

    init();

    const interval = setInterval(async () => {
      const infoRes = await fetch(`/api/gifts/${id}`);
      const info = await infoRes.json();
      if (info.status === "paid" && info.link) {
        setLink(info.link);
        setLoading(false);
        clearInterval(interval);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [id, demoMode, status, paymentId, confirmPayment]);

  async function handleDemoPay() {
    setLoading(true);
    setError("");
    const ok = await confirmPayment({ demo: true });
    if (!ok) setLoading(false);
  }

  async function handleDevConfirm() {
    setLoading(true);
    setError("");
    const ok = await confirmPayment({ devConfirm: true });
    if (!ok) setLoading(false);
  }

  async function handleRetryVerify() {
    setLoading(true);
    setError("");
    const ok = await confirmPayment({ verify: true });
    if (!ok) setLoading(false);
  }

  function copyLink() {
    if (link) navigator.clipboard.writeText(link);
  }

  function shareWhatsApp() {
    if (!link) return;
    const text = encodeURIComponent(`Preparei uma surpresa especial para você 💕\n\n${link}`);
    window.open(`https://wa.me/?text=${text}`, "_blank");
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center px-6 py-24">
      <PresentCheckoutPreloader giftId={id} presentData={preloadData} />
      <div className="max-w-md w-full text-center">
        {loading && !link && (
          <>
            <div className="text-5xl mb-6 animate-pulse">💳</div>
            <h1 className="font-display text-2xl font-bold mb-3">Processando pagamento...</h1>
            <p className="text-sm text-[var(--text-muted)]">Aguarde a confirmação do Pix</p>
          </>
        )}

        {!loading && !link && demoMode && (
          <>
            <div className="text-5xl mb-6">🧪</div>
            <h1 className="font-display text-2xl font-bold mb-3">Modo demonstração</h1>
            <p className="text-sm text-[var(--text-muted)] mb-6">
              Mercado Pago não configurado. Simule o pagamento para gerar o link do presente.
            </p>
            {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
            <button onClick={handleDemoPay} className="btn-primary btn-rose">
              Simular pagamento Pix ✓
            </button>
          </>
        )}

        {!loading && !link && !demoMode && status === "failure" && (
          <>
            <div className="text-5xl mb-6">😔</div>
            <h1 className="font-display text-2xl font-bold mb-3">Pagamento não aprovado</h1>
            <a href="/" className="text-[var(--rose)] text-sm">
              Voltar e tentar novamente
            </a>
          </>
        )}

        {!loading && !link && !demoMode && status !== "failure" && (
          <>
            <div className="text-5xl mb-6">⏳</div>
            <h1 className="font-display text-2xl font-bold mb-3">Aguardando pagamento</h1>
            <p className="text-sm text-[var(--text-muted)] mb-6">
              {status === "success"
                ? "Recebemos o retorno do Mercado Pago, mas ainda não confirmamos o Pix. Tente verificar de novo."
                : "Assim que o Pix for confirmado, o link do presente aparece aqui."}
            </p>
            {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
            <div className="flex flex-col gap-3">
              <button onClick={handleRetryVerify} className="btn-primary btn-rose">
                Verificar pagamento
              </button>
              {allowDevConfirm && (
                <button onClick={handleDevConfirm} className="btn-secondary text-sm">
                  Gerar presente agora (dev)
                </button>
              )}
            </div>
          </>
        )}

        {link && (
          <>
            <div className="text-5xl mb-6">🎉</div>
            <h1 className="font-display text-2xl font-bold mb-2">Presente pronto!</h1>
            <p className="text-sm text-[var(--text-muted)] mb-6">
              Copie o link e mande para quem você ama
            </p>
            <div className="bg-[var(--surface)] border border-[var(--border2)] rounded-xl p-4 mb-6 break-all text-sm font-mono text-[var(--rose)]">
              {link}
            </div>
            <div className="flex flex-col gap-3">
              <button onClick={copyLink} className="btn-primary w-full justify-center">
                Copiar link
              </button>
              <button onClick={shareWhatsApp} className="btn-primary btn-rose w-full justify-center">
                Enviar no WhatsApp
              </button>
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[var(--text-muted)] hover:text-[var(--text)] mt-2"
              >
                Ver presente
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function PagamentoPage({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    params.then((p) => setId(p.id));
  }, [params]);

  if (!id) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
        <p className="text-[var(--text-muted)]">Carregando...</p>
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
          <p className="text-[var(--text-muted)]">Carregando...</p>
        </div>
      }
    >
      <PagamentoContent id={id} />
    </Suspense>
  );
}
