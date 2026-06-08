"use client";

import { useState } from "react";
import type { EnvelopeStyleId, LetterConfig, WaxSealId } from "@/lib/letter-catalog";
import {
  DEFAULT_LETTER,
  ENVELOPE_STYLES,
  WAX_SEAL_LIST,
  LETTER_MESSAGE_MAX_CHARS,
  clampLetterMessage,
} from "@/lib/letter-catalog";
import { LetterPreview, EnvelopeThumb } from "./letter-preview";
import type { LetterPreviewMode } from "./letter-preview";
import { WaxSealImage } from "./wax-seal-image";

interface LetterBuilderProps {
  config: LetterConfig;
  onConfigChange: (config: LetterConfig) => void;
  message: string;
  onMessageChange: (message: string) => void;
}

const STEPS = ["Envelope", "Selo", "Carta"] as const;

export function LetterBuilder({
  config,
  onConfigChange,
  message,
  onMessageChange,
}: LetterBuilderProps) {
  const [step, setStep] = useState(0);

  const previewMode: LetterPreviewMode =
    step === 0 ? "envelope" : step === 1 ? "envelope-with-seal" : "letter";

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border border-[#C4A882]/60 bg-[#F5EDE6]/10 p-5 md:p-6">
        <h3 className="font-hero text-lg md:text-xl font-semibold tracking-wide text-[#E8DDD4] mb-2 uppercase">
          Personalize sua carta
        </h3>
        <p className="text-sm text-[var(--text-muted)] mb-4">
          Escolha o envelope, o selo de cera e escreva a mensagem.
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

        <div className="rounded-xl border border-[#C4A882]/40 bg-[#1a151a]/40 p-4 flex justify-center mb-5 min-h-[180px] items-center">
          <LetterPreview config={config} mode={previewMode} message={message} fitWidth={240} />
        </div>

        {step === 0 && (
          <div>
            <label className="block text-xs tracking-widest uppercase text-[var(--text-muted)] mb-3">
              Estilo do envelope
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(Object.keys(ENVELOPE_STYLES) as EnvelopeStyleId[]).map((id) => {
                const style = ENVELOPE_STYLES[id];
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => onConfigChange({ ...config, envelopeId: id })}
                    className="rounded-xl border-2 p-2 transition-all cursor-pointer flex flex-col items-center gap-2"
                    style={{
                      borderColor: config.envelopeId === id ? "var(--rose)" : "var(--border2)",
                      background: config.envelopeId === id ? "rgba(196,66,106,0.08)" : "var(--surface2)",
                    }}
                  >
                    <EnvelopeThumb envelopeId={id} fitWidth={80} />
                    <span className="text-[0.65rem] text-[var(--text-muted)]">{style.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <label className="block text-xs tracking-widest uppercase text-[var(--text-muted)] mb-3">
              Selo de cera
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
              {WAX_SEAL_LIST.map(([id, seal]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => onConfigChange({ ...config, waxId: id as WaxSealId })}
                  className="rounded-xl border-2 p-2 transition-all cursor-pointer flex flex-col items-center gap-2"
                  style={{
                    borderColor: config.waxId === id ? "var(--rose)" : "var(--border2)",
                    background: config.waxId === id ? "rgba(196,66,106,0.08)" : "var(--surface2)",
                  }}
                >
                  <WaxSealImage sealId={id} fitWidth={52} />
                  <span className="text-[0.6rem] text-[var(--text-muted)] text-center leading-tight">
                    {seal.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <label className="block text-xs tracking-widest uppercase text-[var(--text-muted)] mb-3">
              Sua carta de amor
            </label>
            <textarea
              className="input-field font-serif italic text-base leading-relaxed"
              value={message}
              onChange={(e) => onMessageChange(clampLetterMessage(e.target.value))}
              placeholder="Querida Ana, hoje eu quero te dizer que..."
              rows={8}
              maxLength={LETTER_MESSAGE_MAX_CHARS}
              required
            />
            <p className="text-xs text-[var(--text-dim)] mt-2">
              {message.length}/{LETTER_MESSAGE_MAX_CHARS}: o texto será revelado letra por letra quando
              o envelope for aberto.
            </p>
          </div>
        )}

        <div className="flex justify-between mt-5">
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

export { DEFAULT_LETTER };
