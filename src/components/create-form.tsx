"use client";

import { useState } from "react";
import { getProduct, formatPrice, type ProductId } from "@/lib/products";
import { Field } from "@/components/create-form-fields";
import { CreateFormStudioShell } from "@/components/create-form-studio-shell";
import {
  HistoriaStudio,
  buildHistoriaData,
  initialHistoriaFormState,
  validateHistoriaStep,
  HISTORIA_STEPS,
} from "@/components/historia/historia-studio";

function useCheckout(productId: ProductId) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function checkout(data: object, buyerEmail: string) {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/gifts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, data, buyerEmail }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Erro ao criar presente");
      window.location.href = result.checkoutUrl || `/pagamento/${result.id}`;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro desconhecido");
      setLoading(false);
    }
  }

  return { checkout, loading, error };
}

function HistoriaForm({ productId }: { productId: ProductId }) {
  const product = getProduct(productId)!;
  const { checkout, loading, error } = useCheckout(productId);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initialHistoriaFormState);
  const [buyerEmail, setBuyerEmail] = useState("");

  const patchForm = (patch: Partial<typeof form>) =>
    setForm((prev) => ({ ...prev, ...patch }));

  return (
    <CreateFormStudioShell
      icon={product.icon}
      title={product.name}
      subtitle={product.description}
      price={formatPrice(product.priceCents)}
      onSubmit={(e) => {
        e.preventDefault();
        const err = validateHistoriaStep(step, form);
        if (err) {
          alert(err);
          return;
        }
        if (step < HISTORIA_STEPS.length - 1) {
          setStep(step + 1);
          return;
        }
        if (!buyerEmail.trim()) {
          alert("Informe seu e-mail.");
          return;
        }
        checkout(buildHistoriaData(form), buyerEmail);
      }}
      loading={loading}
      error={error}
      submitLabel={
        step < HISTORIA_STEPS.length - 1 ? "Próximo" : "Ir para pagamento"
      }
      footer={
        step === HISTORIA_STEPS.length - 1 ? (
          <Field
            label="Seu e-mail (para receber o link)"
            value={buyerEmail}
            onChange={setBuyerEmail}
            type="email"
            placeholder="seu@email.com"
            required
          />
        ) : (
          <p className="text-xs text-[var(--text-dim)]">
            Etapa {step + 1} de {HISTORIA_STEPS.length}: {HISTORIA_STEPS[step]}
          </p>
        )
      }
    >
      <HistoriaStudio
        step={step}
        onStepChange={setStep}
        data={form}
        onChange={patchForm}
      />
    </CreateFormStudioShell>
  );
}

export function CreateForm({ productId }: { productId: ProductId }) {
  return <HistoriaForm productId="historia" />;
}
