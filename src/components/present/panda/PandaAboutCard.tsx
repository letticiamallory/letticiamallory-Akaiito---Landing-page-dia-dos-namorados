"use client";

import type { CounterTogetherData, HeroCoupleData } from "@/lib/builder/types";
import { HeroEnvelopePhoto } from "@/components/present/canva/HeroEnvelopePhoto";
import { useRelationshipCounter } from "@/hooks/useHistoriaPage";

const CANVA_HERO_ASSETS = "/scrapbook/canva/hero";

const COUNTER_UNITS = [
  { key: "years" as const, label: "Anos" },
  { key: "months" as const, label: "Meses" },
  { key: "days" as const, label: "Dias" },
  { key: "hours" as const, label: "Horas" },
  { key: "minutes" as const, label: "Minutos" },
  { key: "seconds" as const, label: "Segundos" },
];

function CounterCell({
  value,
  label,
  live = false,
  placeholder = false,
}: {
  value: number;
  label: string;
  live?: boolean;
  placeholder?: boolean;
}) {
  const display = placeholder
    ? "-"
    : live
      ? String(value).padStart(2, "0")
      : String(value);

  return (
    <div className={`panda-about__cell${live ? " panda-about__cell--live" : ""}`}>
      <span className="panda-about__cell-value">{display}</span>
      <span className="panda-about__cell-label">{label}</span>
    </div>
  );
}

export function PandaAboutCard({
  hero,
  counter,
  onPhotoResolved,
  liveCounter = true,
}: {
  hero?: HeroCoupleData;
  counter?: CounterTogetherData;
  onPhotoResolved?: (url: string) => void;
  liveCounter?: boolean;
}) {
  const names =
    hero?.person1Name && hero?.person2Name
      ? `${hero.person1Name.trim()} e ${hero.person2Name.trim()}`
      : "João e Letticia";

  const startDate = counter?.startDate?.trim() || "";
  const hasStartDate = Boolean(startDate) && !Number.isNaN(new Date(startDate).getTime());
  const counterData = useRelationshipCounter(
    hasStartDate ? startDate : "2000-01-01",
    liveCounter
  );

  const sinceYear = hasStartDate ? new Date(startDate).getFullYear() : null;

  const visibleUnits = COUNTER_UNITS.filter((u) => {
    if (u.key === "years") return counter?.showYears !== false;
    if (u.key === "months") return counter?.showMonths !== false;
    if (u.key === "days") return counter?.showDays !== false;
    if (u.key === "hours") return counter?.showHours !== false;
    return true;
  });

  return (
    <div className="panda-about">
      {(hero?.backgroundPhoto || onPhotoResolved) && (
        <div className="panda-about__photo">
          <div className="panda-about__gold-frame">
            <div className="panda-about__gold-frame-rotator">
              <div className="panda-about__gold-frame-photo">
                <HeroEnvelopePhoto
                  candidate={hero?.backgroundPhoto}
                  alt={`Foto de ${names}`}
                  onResolved={onPhotoResolved}
                />
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="panda-about__gold-frame-art"
                src={`${CANVA_HERO_ASSETS}/gold-frame.png`}
                alt=""
                aria-hidden
              />
            </div>
          </div>
        </div>
      )}

      <div className="panda-about__info">
        <h3 className="panda-about__names">{names}</h3>
        {sinceYear ? (
          <p className="panda-about__since">Juntos desde {sinceYear}</p>
        ) : hero?.tagline ? (
          <p className="panda-about__since">{hero.tagline}</p>
        ) : null}
      </div>

      <div className="panda-about__counter">
        <p className="panda-about__counter-label">
          {counter?.label?.trim() || "Estamos juntos há"}
        </p>
        <div className="panda-about__grid" aria-live="polite">
          {visibleUnits.map((u) => (
            <CounterCell
              key={u.key}
              value={counterData[u.key]}
              label={u.label}
              live={hasStartDate && (u.key === "minutes" || u.key === "seconds")}
              placeholder={!hasStartDate}
            />
          ))}
        </div>
        {!hasStartDate && (
          <p className="panda-about__counter-hint">
            Defina a data em que ficaram juntos no passo &quot;Hero do Casal&quot;
          </p>
        )}
      </div>
    </div>
  );
}
