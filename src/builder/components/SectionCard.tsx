"use client";

import type { PresentCardItem } from "@/lib/builder/present-cards.catalog";

export function SectionCard({
  item,
  selected,
  onToggle,
}: {
  item: PresentCardItem;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={item.locked}
      className={[
        "relative text-left p-4 rounded-2xl border transition-all cursor-pointer",
        "bg-[var(--surface)] hover:border-[var(--rose)]/40",
        selected
          ? "border-[var(--rose)] ring-1 ring-[var(--rose)]/30"
          : "border-[var(--border2)]",
        item.locked ? "cursor-default opacity-90" : "",
      ].join(" ")}
    >
      <div className="absolute top-3 right-3 flex items-center gap-1.5">
        {item.premium && item.premiumBadge && (
          <span className="text-[0.6rem] tracking-wider uppercase px-2 py-0.5 rounded-full bg-[var(--wine)]/20 text-[var(--rose-pale)]">
            {item.premiumBadge}
          </span>
        )}
        {selected && (
          <span className="w-5 h-5 shrink-0 rounded-full bg-[var(--rose)] text-[10px] flex items-center justify-center text-white">
            ✓
          </span>
        )}
      </div>
      <div className="text-2xl mb-2">{item.icon}</div>
      <div className="font-display font-semibold text-sm mb-1">{item.name}</div>
      <p className="text-xs text-[var(--text-muted)] leading-relaxed">{item.description}</p>
      {item.locked && (
        <p className="text-[0.65rem] text-[var(--text-dim)] mt-2 uppercase tracking-wider">
          Obrigatório
        </p>
      )}
    </button>
  );
}
