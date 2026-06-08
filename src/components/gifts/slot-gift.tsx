"use client";

import { useState } from "react";
import type { SlotData } from "@/lib/gift-types";

const SYMBOLS = ["💕", "🌹", "✨", "💌", "🎁"];

export function SlotGift({
  data,
  embedded = false,
}: {
  data: SlotData;
  embedded?: boolean;
}) {
  const [spins, setSpins] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [revealed, setRevealed] = useState<string[]>([]);
  const maxSpins = 5;
  const surprises = data.surprises.length
    ? data.surprises
    : ["Um jantar romântico", "Massagem", "Viagem surpresa", "Carta de amor", "Presente especial"];

  const shellClass = embedded
    ? "hp-slot-quiz flex flex-col items-center justify-center px-6 py-10"
    : "min-h-screen bg-[var(--bg)] flex flex-col items-center justify-center px-6 py-16";

  function spin() {
    if (spinning || spins >= maxSpins) return;
    setSpinning(true);
    setResult(null);

    setTimeout(() => {
      const surprise = surprises[spins % surprises.length];
      setResult(surprise);
      setRevealed((prev) => [...prev, surprise]);
      setSpins(spins + 1);
      setSpinning(false);
    }, 2000);
  }

  return (
    <div className={shellClass}>
      {!embedded && (
        <>
          <p className="text-xs tracking-widest uppercase text-[var(--text-muted)] mb-2">
            De {data.senderName} para {data.receiverName}
          </p>
          <h1 className="font-display text-3xl font-bold mb-2">Máquina de Surpresas</h1>
        </>
      )}
      {embedded && (
        <p className="text-xs tracking-widest uppercase text-[var(--text-muted)] mb-4">
          De {data.senderName} para {data.receiverName}
        </p>
      )}
      <p className="text-sm text-[var(--text-muted)] mb-10">{maxSpins - spins} giros restantes</p>

      <div className="bg-[var(--surface)] border-2 border-[var(--border2)] rounded-2xl p-8 w-full max-w-sm">
        <div className="flex justify-center gap-3 mb-8 h-16 items-center overflow-hidden">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-16 h-16 bg-[var(--surface2)] rounded-xl flex items-center justify-center text-3xl border border-[var(--border)]"
              style={spinning ? { animation: `floatA 0.2s ease-in-out infinite ${i * 0.1}s` } : undefined}
            >
              {spinning ? SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)] : result ? "🎁" : SYMBOLS[i]}
            </div>
          ))}
        </div>

        {result && !spinning && (
          <div className="text-center mb-6 p-4 bg-[rgba(196,66,106,0.1)] border border-[rgba(196,66,106,0.2)] rounded-xl">
            <p className="text-xs uppercase tracking-widest text-[var(--rose)] mb-2">Sua surpresa!</p>
            <p className="font-display font-bold text-lg">{result}</p>
          </div>
        )}

        <button
          onClick={spin}
          disabled={spinning || spins >= maxSpins}
          className="btn-primary btn-rose w-full justify-center disabled:opacity-40"
        >
          {spinning ? "Girando..." : spins >= maxSpins ? "Acabou!" : "GIRAR 🎰"}
        </button>
      </div>

      {revealed.length > 0 && (
        <div className="mt-10 w-full max-w-sm">
          <p className="text-xs tracking-widest uppercase text-[var(--text-dim)] mb-3">Surpresas reveladas</p>
          {revealed.map((s, i) => (
            <div key={i} className="text-sm text-[var(--text-muted)] py-2 border-b border-[var(--border)]">
              {i + 1}. {s}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
