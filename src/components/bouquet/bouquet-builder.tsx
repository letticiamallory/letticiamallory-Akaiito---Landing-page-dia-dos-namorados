"use client";

import { useState } from "react";
import type { BouquetConfig, MainFlowerId, SupportFlowerId } from "@/lib/bouquet-catalog";
import {
  DEFAULT_BOUQUET,
  MAIN_FLOWERS,
  SUPPORT_FLOWERS,
} from "@/lib/bouquet-catalog";
import { BouquetPreview } from "./bouquet-preview";
import "./bouquet-builder.css";

interface BouquetBuilderProps {
  value: BouquetConfig;
  onChange: (config: BouquetConfig) => void;
}

const STEPS = ["Principal", "Apoio"] as const;

export function BouquetBuilder({ value, onChange }: BouquetBuilderProps) {
  const [step, setStep] = useState(0);

  const canPreview = Boolean(value.mainFlowerId && value.supportFlowerId);

  return (
    <div className="flex flex-col gap-6">
      <div className="bouquet-builder-panel">
        <h3 className="bouquet-builder-title">Monte seu buquê aqui!</h3>
        <p className="text-sm text-[var(--text-muted)] mb-4">
          Escolha a flor principal e a flor de apoio.
        </p>

        <div className="flex gap-2 mb-5 flex-wrap">
          {STEPS.map((label, i) => (
            <button
              key={label}
              type="button"
              onClick={() => setStep(i)}
              className="text-[0.65rem] px-3 py-1.5 rounded-full border transition-all cursor-pointer"
              style={{
                borderColor: step === i ? "var(--rose)" : "var(--border2)",
                background: step === i ? "rgba(196,66,106,0.15)" : "transparent",
                color: step === i ? "var(--rose)" : "var(--text-muted)",
              }}
            >
              {i + 1}. {label}
            </button>
          ))}
        </div>

        {canPreview && (
          <div className="mb-6">
            <BouquetPreview config={value} />
          </div>
        )}

        {step === 0 && (
          <div>
            <label className="block text-xs tracking-widest uppercase text-[var(--text-muted)] mb-3">
              Flor principal
            </label>
            <div className="bouquet-flower-gallery">
              {(Object.keys(MAIN_FLOWERS) as MainFlowerId[]).map((id) => {
                const flower = MAIN_FLOWERS[id];
                return (
                  <button
                    key={id}
                    type="button"
                    className={`bouquet-flower-option ${value.mainFlowerId === id ? "selected" : ""}`}
                    onClick={() => onChange({ ...value, mainFlowerId: id })}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={flower.thumb} alt={flower.name} />
                    <span>{flower.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <label className="block text-xs tracking-widest uppercase text-[var(--text-muted)] mb-3">
              Flor de apoio
            </label>
            <div className="bouquet-flower-gallery">
              {(Object.keys(SUPPORT_FLOWERS) as SupportFlowerId[]).map((id) => {
                const flower = SUPPORT_FLOWERS[id];
                return (
                  <button
                    key={id}
                    type="button"
                    className={`bouquet-flower-option ${value.supportFlowerId === id ? "selected" : ""}`}
                    onClick={() => onChange({ ...value, supportFlowerId: id })}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={flower.thumb} alt={flower.name} />
                    <span>{flower.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex justify-between mt-6">
          <button
            type="button"
            disabled={step === 0}
            onClick={() => setStep((s) => s - 1)}
            className="text-sm text-[var(--text-muted)] disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
          >
            Anterior
          </button>
          {step < STEPS.length - 1 && (
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              className="text-sm text-[var(--rose)] cursor-pointer"
            >
              Próximo
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export { DEFAULT_BOUQUET };
