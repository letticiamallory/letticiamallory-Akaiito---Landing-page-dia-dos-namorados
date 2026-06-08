"use client";

import type { CounterTogetherData } from "@/lib/builder/types";
import { formatRelationshipDate, useRelationshipCounter } from "@/hooks/useHistoriaPage";

function CounterUnit({
  value,
  label,
  live = false,
}: {
  value: number;
  label: string;
  live?: boolean;
}) {
  return (
    <div className={`love-counter__unit${live ? " love-counter__unit--live" : ""}`}>
      <span className="love-counter__value">{String(value).padStart(2, "0")}</span>
      <span className="love-counter__label">{label}</span>
    </div>
  );
}

export function LoveCounterScreen({ data }: { data: CounterTogetherData }) {
  if (!data.startDate) return null;

  const counter = useRelationshipCounter(data.startDate);
  const units = [
    { key: "years" as const, label: "anos", show: data.showYears },
    { key: "months" as const, label: "meses", show: data.showMonths },
    { key: "days" as const, label: "dias", show: data.showDays },
    { key: "hours" as const, label: "horas", show: data.showHours },
    { key: "minutes" as const, label: "min", show: true, live: true },
    { key: "seconds" as const, label: "seg", show: true, live: true },
  ].filter((u) => u.show);

  return (
    <div className="love-counter">
      <p className="love-counter__headline">{data.label || "Estamos juntos há"}</p>
      <p className="love-counter__since">desde {formatRelationshipDate(data.startDate)}</p>

      <div className="love-counter__grid">
        {units.map((u) => (
          <CounterUnit
            key={u.key}
            value={counter[u.key]}
            label={u.label}
            live={u.live}
          />
        ))}
      </div>

      <div className="love-counter__pulse" aria-hidden>
        <span>♥</span>
      </div>
    </div>
  );
}
