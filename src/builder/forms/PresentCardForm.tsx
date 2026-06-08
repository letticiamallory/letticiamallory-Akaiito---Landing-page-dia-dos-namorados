"use client";

import type { PresentCustomizeStep } from "@/lib/builder/present-cards.steps";
import type { BuilderSection, SectionData } from "@/lib/builder/types";
import { SectionForm } from "@/builder/forms/SectionForm";
import { BouquetBuilder } from "@/components/bouquet/bouquet-builder";
import { DEFAULT_BOUQUET } from "@/lib/bouquet-catalog";
import type { HeroCoupleData } from "@/lib/builder/types";

function CardHeader({ card }: { card: PresentCustomizeStep["card"] }) {
  return (
    <div>
      <div className="text-3xl mb-2">{card.icon}</div>
      <h2 className="font-display text-xl font-bold mb-1">{card.name}</h2>
      <p className="text-sm text-[var(--text-muted)]">{card.description}</p>
    </div>
  );
}

export function PresentCardForm({
  step,
  coupleNames,
  sections,
  onChange,
  onUpdateSection,
}: {
  step: PresentCustomizeStep;
  coupleNames: { person1: string; person2: string };
  sections: BuilderSection[];
  onChange: (sectionId: string, patch: Partial<SectionData>) => void;
  onUpdateSection: (sectionId: string, patch: Partial<SectionData>) => void;
}) {
  const { cardId, card, sections: stepSections } = step;

  if (cardId === "bouquet") {
    const hero = stepSections[0];
    const heroData = hero.data as HeroCoupleData;
    return (
      <div className="flex flex-col gap-8">
        <CardHeader card={card} />
        <BouquetBuilder
          value={heroData.bouquet ?? DEFAULT_BOUQUET}
          onChange={(bouquet) => onChange(hero.id, { bouquet })}
        />
      </div>
    );
  }

  if (cardId === "about_couple") {
    const hero = stepSections.find((s) => s.sectionId === "hero_couple");
    const counter = stepSections.find((s) => s.sectionId === "counter_together");

    return (
      <div className="flex flex-col gap-8">
        <CardHeader card={card} />
        {hero && (
          <SectionForm
            section={hero}
            coupleNames={coupleNames}
            sections={sections}
            fieldsOnly
            onChange={(patch) => onChange(hero.id, patch)}
            onUpdateSection={onUpdateSection}
          />
        )}
        {counter && (
          <div className="pt-6 border-t border-[var(--border2)]">
            <h3 className="font-display text-base font-semibold mb-1">Contador ao vivo</h3>
            <p className="text-xs text-[var(--text-muted)] mb-4">
              Anos, meses, dias e horas juntos, atualiza enquanto ele(a) lê.
            </p>
            <SectionForm
              section={counter}
              coupleNames={coupleNames}
              sections={sections}
              fieldsOnly
              onChange={(patch) => onChange(counter.id, patch)}
              onUpdateSection={onUpdateSection}
            />
          </div>
        )}
      </div>
    );
  }

  const section = stepSections[0];
  if (!section) return null;

  return (
    <div className="flex flex-col gap-8">
      <CardHeader card={card} />
      <SectionForm
        section={section}
        coupleNames={coupleNames}
        sections={sections}
        fieldsOnly
        onChange={(patch) => onChange(section.id, patch)}
        onUpdateSection={onUpdateSection}
      />
    </div>
  );
}
