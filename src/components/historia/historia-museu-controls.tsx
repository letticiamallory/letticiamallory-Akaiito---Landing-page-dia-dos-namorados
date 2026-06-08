"use client";

import { useEffect, useRef } from "react";
import type { MuseumElement } from "@/lib/gift-types";
import { Field } from "@/components/create-form-fields";
import { MuseumEditor } from "@/components/museum/Editor";
import { useMuseumStore } from "@/store/museum.store";
import "@/components/museum/museum-editor.css";

export interface HistoriaMuseuValue {
  museumTitle: string;
  museumDate: string;
  elements: MuseumElement[];
}

function elementsEqual(a: MuseumElement[], b: MuseumElement[]): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function HistoriaMuseuControls({
  senderName,
  receiverName,
  value,
  onChange,
}: {
  senderName: string;
  receiverName: string;
  value: HistoriaMuseuValue;
  onChange: (patch: Partial<HistoriaMuseuValue>) => void;
}) {
  const elements = useMuseumStore((s) => s.elements);
  const museumTitle = useMuseumStore((s) => s.museumTitle);
  const museumDate = useMuseumStore((s) => s.museumDate);
  const loadFromElements = useMuseumStore((s) => s.loadFromElements);
  const reset = useMuseumStore((s) => s.reset);
  const setMeta = useMuseumStore((s) => s.setMeta);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    const couple = [senderName, receiverName].filter(Boolean).join(" & ");
    if (value.elements.length) {
      loadFromElements(value.elements, {
        museumTitle: value.museumTitle || "Museu de Nós",
        museumDate: value.museumDate,
        coupleName: couple,
      });
    } else {
      reset();
      setMeta({
        coupleName: couple,
        museumTitle: value.museumTitle || "Museu de Nós",
        museumDate: value.museumDate,
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
      value.museumTitle === museumTitle &&
      value.museumDate === museumDate &&
      elementsEqual(value.elements, elements)
    ) {
      return;
    }
    onChangeRef.current({ museumTitle, museumDate, elements });
  }, [elements, museumTitle, museumDate, value.museumTitle, value.museumDate, value.elements]);

  return (
    <div className="historia-museu-controls mt-6 pt-6 border-t border-[var(--border2)] space-y-5">
      <Field
        label="Título do museu"
        value={value.museumTitle}
        onChange={(v) => {
          setMeta({ museumTitle: v });
          onChange({ museumTitle: v });
        }}
      />
      <Field
        label="Data ou subtítulo (opcional)"
        value={value.museumDate}
        onChange={(v) => {
          setMeta({ museumDate: v });
          onChange({ museumDate: v });
        }}
        placeholder="Junho de 2024"
      />
      <p className="text-sm leading-relaxed text-[var(--text-muted)]">
        O título e a data aparecem na placa do salão. Arraste quadros para personalizar. Pessoas são opcionais.
        Duplo clique no quadro à direita para adicionar foto. Use &quot;Ampliar&quot; para ver o salão em tela cheia.
        Clique no quadro e use × para excluir, ou exclua pela lista &quot;No salão&quot; ao lado.
      </p>
      <div className="historia-module-editor-wrap historia-module-editor-wrap--museum rounded-xl border border-[var(--border2)]">
        <MuseumEditor />
      </div>
    </div>
  );
}
