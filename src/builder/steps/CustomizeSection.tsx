"use client";

import { useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BuilderShell } from "@/builder/components/BuilderShell";
import { StepProgress } from "@/builder/components/StepProgress";
import { PresentCardForm } from "@/builder/forms/PresentCardForm";
import { buildPresentCustomizeSteps } from "@/lib/builder/present-cards.steps";
import { getCoupleNames, sortSections } from "@/lib/builder/utils";
import { useBuilderStore } from "@/builder/store/builder.store";

export function CustomizeSectionStep({ stepIndex }: { stepIndex: number }) {
  const router = useRouter();
  const rawSections = useBuilderStore((s) => s.sections);
  const sections = useMemo(() => sortSections(rawSections), [rawSections]);
  const updateSectionData = useBuilderStore((s) => s.updateSectionData);
  const setCurrentSectionIndex = useBuilderStore((s) => s.setCurrentSectionIndex);
  const setStep = useBuilderStore((s) => s.setStep);

  const steps = useMemo(() => buildPresentCustomizeSteps(sections), [sections]);
  const step = steps[stepIndex];

  useEffect(() => {
    setStep("customize");
    setCurrentSectionIndex(stepIndex);
  }, [stepIndex, setStep, setCurrentSectionIndex]);

  useEffect(() => {
    if (steps.length === 0) {
      router.replace("/criar/secoes");
      return;
    }
    if (!step) {
      router.replace(`/criar/personalizar/${Math.max(0, steps.length - 1)}`);
    }
  }, [step, steps.length, router]);

  if (!step) return null;

  const coupleNames = getCoupleNames(sections);
  const total = steps.length;
  const isLast = stepIndex >= total - 1;

  function goTo(index: number) {
    setCurrentSectionIndex(index);
    router.push(`/criar/personalizar/${index}`);
  }

  function handleNext() {
    if (isLast) {
      setStep("preview");
      router.push("/criar/preview");
      return;
    }
    goTo(stepIndex + 1);
  }

  function handleSkip() {
    handleNext();
  }

  return (
    <BuilderShell
      title="Personalizar card"
      backHref={stepIndex > 0 ? `/criar/personalizar/${stepIndex - 1}` : "/criar/secoes"}
      homeHref="/"
      progress={<StepProgress current={stepIndex} total={total} />}
      footer={
        <div className="flex flex-wrap gap-3 justify-between items-center">
          <button
            type="button"
            className="text-sm text-[var(--text-muted)]"
            onClick={handleSkip}
          >
            Pular
          </button>
          <div className="flex gap-3">
            {stepIndex > 0 && (
              <button
                type="button"
                className="btn-secondary text-sm px-4 py-2"
                onClick={() => goTo(stepIndex - 1)}
              >
                Anterior
              </button>
            )}
            <button type="button" onClick={handleNext} className="btn-primary btn-rose">
              {isLast ? "Ver preview" : "Próximo card"}
            </button>
          </div>
        </div>
      }
    >
      <PresentCardForm
        step={step}
        coupleNames={coupleNames}
        sections={sections}
        onChange={updateSectionData}
        onUpdateSection={updateSectionData}
      />
    </BuilderShell>
  );
}

