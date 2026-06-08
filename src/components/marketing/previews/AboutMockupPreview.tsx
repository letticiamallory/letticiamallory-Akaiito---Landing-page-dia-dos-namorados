"use client";

import { PandaAboutCard } from "@/components/present/panda/PandaAboutCard";
import { DEFAULT_BOUQUET } from "@/lib/bouquet-catalog";
import { MockupShell } from "../MockupShell";

const DEMO_HERO = {
  person1Name: "Letticia",
  person2Name: "João",
  tagline: "Uma história de amor",
  bouquet: DEFAULT_BOUQUET,
};

const DEMO_COUNTER = {
  startDate: "2022-03-15",
  label: "Estamos juntos há",
  showYears: true,
  showMonths: true,
  showDays: true,
  showHours: true,
  showMinutes: true,
  showSeconds: true,
};

export function AboutMockupPreview({ active: _active }: { active: boolean }) {
  return (
    <MockupShell className="mockup-shell--pad">
      <PandaAboutCard hero={DEMO_HERO} counter={DEMO_COUNTER} liveCounter={false} />
    </MockupShell>
  );
}
