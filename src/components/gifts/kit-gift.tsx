"use client";

import { useState } from "react";
import type { KitData } from "@/lib/gift-types";
import { JoguinhoGift } from "./joguinho-gift";
import { CartaGift } from "./carta-gift";
import { MuseuGift } from "./museu-gift";
import { SlotGift } from "./slot-gift";

const EXPERIENCES = [
  { id: "carta", label: "Carta com Buquê", icon: "💌" },
  { id: "joguinho", label: "Joguinho do Casal", icon: "🎮" },
  { id: "museu", label: "Museu de Nós", icon: "🏛️" },
  { id: "slot", label: "Máquina de Surpresas", icon: "🎰" },
] as const;

export function KitGift({ data }: { data: KitData }) {
  const [active, setActive] = useState<string | null>(null);

  if (active === "joguinho" && data.joguinho) return <JoguinhoGift data={data.joguinho} />;
  if (active === "carta" && data.carta) return <CartaGift data={data.carta} />;
  if (active === "museu" && data.museu) return <MuseuGift data={data.museu} />;
  if (active === "slot" && data.slot) return <SlotGift data={data.slot} />;

  return (
    <div className="min-h-screen bg-[var(--bg)] flex flex-col items-center justify-center px-6 py-16">
      <div className="text-5xl mb-6">✨</div>
      <h1 className="font-display text-3xl font-bold mb-2">Kit Completo dos Namorados</h1>
      <p className="text-[var(--text-muted)] text-sm mb-10 text-center">
        {data.senderName} preparou 4 surpresas para {data.receiverName}
      </p>
      <div className="grid grid-cols-2 gap-4 w-full max-w-md">
        {EXPERIENCES.map((exp) => (
          <button
            key={exp.id}
            onClick={() => setActive(exp.id)}
            className="bg-[var(--surface)] border border-[var(--border2)] rounded-2xl p-6 flex flex-col items-center gap-3 hover:border-[var(--rose)] transition-colors cursor-pointer"
          >
            <span className="text-3xl">{exp.icon}</span>
            <span className="font-display text-sm font-semibold text-center">{exp.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
