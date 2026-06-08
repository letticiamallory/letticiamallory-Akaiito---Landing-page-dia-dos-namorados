"use client";



import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { BuilderShell } from "@/builder/components/BuilderShell";

import { SectionCard } from "@/builder/components/SectionCard";

import { MIN_SECTIONS } from "@/lib/builder/sections.catalog";

import {

  countSelectedPresentCards,

  isPresentCardSelected,

  PRESENT_CARDS_CATALOG,

} from "@/lib/builder/present-cards.catalog";

import { buildPresentCustomizeSteps } from "@/lib/builder/present-cards.steps";

import { getBuilderResumePath, hasDraftProgress } from "@/lib/builder/draft-utils";

import { useBuilderStore } from "@/builder/store/builder.store";



export function ChooseSectionsStep() {

  const router = useRouter();

  const sections = useBuilderStore((s) => s.sections);

  const builderStep = useBuilderStore((s) => s.builderStep);

  const buyerEmail = useBuilderStore((s) => s.buyerEmail);

  const togglePresentCard = useBuilderStore((s) => s.togglePresentCard);

  const setStep = useBuilderStore((s) => s.setStep);

  const setCurrentSectionIndex = useBuilderStore((s) => s.setCurrentSectionIndex);

  const [resumePrompt, setResumePrompt] = useState(false);

  const [hydrated, setHydrated] = useState(false);



  const selectedCards = countSelectedPresentCards(sections);

  const customizeSteps = buildPresentCustomizeSteps(sections);



  useEffect(() => {

    const finishHydration = () => setHydrated(true);

    if (useBuilderStore.persist.hasHydrated()) {

      finishHydration();

      return;

    }

    return useBuilderStore.persist.onFinishHydration(finishHydration);

  }, []);



  useEffect(() => {

    if (!hydrated) return;

    const state = useBuilderStore.getState();

    setResumePrompt(hasDraftProgress(state));

  }, [hydrated, sections, builderStep, buyerEmail]);



  function handleContinue() {

    if (sections.length < MIN_SECTIONS) {

      alert(`Selecione pelo menos ${MIN_SECTIONS} cards.`);

      return;

    }

    setStep("customize");

    setCurrentSectionIndex(0);

    router.push("/criar/personalizar/0");

  }



  function handleResume() {

    setResumePrompt(false);

    const state = useBuilderStore.getState();

    router.push(getBuilderResumePath(state));

  }



  if (!hydrated) return null;



  return (

    <BuilderShell

      title="Monte sua história"

      subtitle="Escolha os cards da página, é exatamente o que ele(a) vai ver no celular."

      homeHref="/"

      footer={

        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">

          <p className="text-xs text-[var(--text-muted)]">

            {selectedCards} cards · {customizeSteps.length} passos para personalizar

          </p>

          <button type="button" onClick={handleContinue} className="btn-primary btn-rose">

            Continuar

          </button>

        </div>

      }

    >

      {resumePrompt && (

        <div className="mb-6 p-4 rounded-xl border border-[var(--rose)]/30 bg-[var(--rose)]/5 flex flex-wrap items-center justify-between gap-3">

          <p className="text-sm text-[var(--text-muted)]">

            Você tem uma criação em andamento.

          </p>

          <button

            type="button"

            className="text-sm font-semibold text-[var(--rose)]"

            onClick={handleResume}

          >

            Continuar editando

          </button>

        </div>

      )}



      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">

        {PRESENT_CARDS_CATALOG.map((card) => (

          <SectionCard

            key={card.id}

            item={card}

            selected={isPresentCardSelected(sections, card)}

            onToggle={() => togglePresentCard(card.sectionIds, card.locked)}

          />

        ))}

      </div>

    </BuilderShell>

  );

}


