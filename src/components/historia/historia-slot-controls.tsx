"use client";

import { Field } from "@/components/create-form-fields";

const SLOT_PLACEHOLDERS = [
  "Um jantar romântico",
  "Massagem relaxante",
  "Viagem surpresa",
  "Carta de amor",
  "Presente especial",
];

export function HistoriaSlotControls({
  surprises,
  onSurprisesChange,
}: {
  surprises: string[];
  onSurprisesChange: (surprises: string[]) => void;
}) {
  return (
    <div className="historia-slot-controls mt-4 pt-4 border-t border-[var(--border2)]">
      <p className="text-xs text-[var(--text-dim)] mb-4">
        Escreva até 5 surpresas que aparecem quando a pessoa gira a máquina (mín. 3).
      </p>
      {surprises.map((s, i) => (
        <Field
          key={i}
          label={`Surpresa ${i + 1}${i < 3 ? " *" : ""}`}
          value={s}
          onChange={(v) =>
            onSurprisesChange(surprises.map((x, idx) => (idx === i ? v : x)))
          }
          placeholder={SLOT_PLACEHOLDERS[i]}
        />
      ))}
    </div>
  );
}
