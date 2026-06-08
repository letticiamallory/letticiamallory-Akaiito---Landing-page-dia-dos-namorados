"use client";

export function StepProgress({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={`h-1.5 rounded-full transition-all ${
            i < current
              ? "w-6 bg-[var(--rose)]"
              : i === current
                ? "w-8 bg-[var(--rose)]"
                : "w-3 bg-[var(--border2)]"
          }`}
        />
      ))}
      <span className="text-xs text-[var(--text-muted)] ml-2 whitespace-nowrap">
        {current + 1} de {total}
      </span>
    </div>
  );
}
