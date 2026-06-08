"use client";

import { useEffect, useRef } from "react";
import type { ChocolatePlacement } from "@/lib/gift-types";
import { Field } from "@/components/create-form-fields";
import { ChocolateEditor } from "@/components/chocolate/Editor";
import { useChocolateStore } from "@/store/chocolate.store";
import "@/components/chocolate/chocolate-box.css";

export interface HistoriaChocolatesValue {
  boxTitle: string;
  message: string;
  placements: ChocolatePlacement[];
}

export function HistoriaChocolatesControls({
  senderName,
  receiverName,
  value,
  onChange,
}: {
  senderName: string;
  receiverName: string;
  value: HistoriaChocolatesValue;
  onChange: (patch: Partial<HistoriaChocolatesValue>) => void;
}) {
  const placements = useChocolateStore((s) => s.placements);
  const boxTitle = useChocolateStore((s) => s.boxTitle);
  const loadPlacements = useChocolateStore((s) => s.loadPlacements);
  const reset = useChocolateStore((s) => s.reset);
  const setMeta = useChocolateStore((s) => s.setMeta);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    const couple = [senderName, receiverName].filter(Boolean).join(" & ");
    if (value.placements.length) {
      loadPlacements(value.placements, {
        boxTitle: value.boxTitle || "Caixa de Chocolates",
        coupleName: couple,
      });
    } else {
      reset();
      setMeta({
        coupleName: couple,
        boxTitle: value.boxTitle || "Caixa de Chocolates",
      });
    }
    return () => reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const couple = [senderName, receiverName].filter(Boolean).join(" & ");
    if (couple) setMeta({ coupleName: couple });
  }, [senderName, receiverName, setMeta]);

  useEffect(() => {
    if (
      value.boxTitle === boxTitle &&
      JSON.stringify(value.placements) === JSON.stringify(placements)
    ) {
      return;
    }
    onChangeRef.current({ placements, boxTitle });
  }, [placements, boxTitle, value.boxTitle, value.placements]);

  return (
    <div className="historia-chocolates-controls mt-6 pt-6 border-t border-[var(--border2)] space-y-5">
      <Field
        label="Título da caixa"
        value={value.boxTitle}
        onChange={(v) => {
          setMeta({ boxTitle: v });
          onChange({ boxTitle: v });
        }}
      />
      <p className="text-sm leading-relaxed text-[var(--text-muted)]">
        Arraste os chocolates para os compartimentos. Quem recebe clica na caixa para abrir.
      </p>
      <div className="historia-module-editor-wrap rounded-xl border border-[var(--border2)]">
        <ChocolateEditor />
      </div>
    </div>
  );
}
