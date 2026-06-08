"use client";

import { useEffect } from "react";
import { MuseumEditor } from "./Editor";
import { useMuseumStore } from "@/store/museum.store";

export function MuseuStudio({
  senderName,
  receiverName,
  onSenderName,
  onReceiverName,
}: {
  senderName: string;
  receiverName: string;
  onSenderName: (v: string) => void;
  onReceiverName: (v: string) => void;
}) {
  const setMeta = useMuseumStore((s) => s.setMeta);
  const reset = useMuseumStore((s) => s.reset);
  const coupleName = useMuseumStore((s) => s.coupleName);

  useEffect(() => {
    reset();
  }, [reset]);

  useEffect(() => {
    const couple = [senderName, receiverName].filter(Boolean).join(" & ");
    if (couple && couple !== coupleName) {
      setMeta({ coupleName: couple });
    }
  }, [senderName, receiverName, coupleName, setMeta]);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs tracking-widest uppercase text-[var(--text-dim)]">Seu nome</span>
          <input
            className="w-full px-3 py-2.5 bg-[var(--bg)] border border-[var(--border2)] rounded-lg text-[var(--text)]"
            value={senderName}
            onChange={(e) => onSenderName(e.target.value)}
            placeholder="João"
            required
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs tracking-widest uppercase text-[var(--text-dim)]">Nome dela(e)</span>
          <input
            className="w-full px-3 py-2.5 bg-[var(--bg)] border border-[var(--border2)] rounded-lg text-[var(--text)]"
            value={receiverName}
            onChange={(e) => onReceiverName(e.target.value)}
            placeholder="Ana"
            required
          />
        </label>
      </div>

      <p className="text-sm text-[var(--text-muted)] max-w-2xl">
        Arraste quadros para personalizar o salão. Pessoas são opcionais.
        Duplo clique no quadro para adicionar foto.
      </p>

      <div className="rounded-xl overflow-hidden border border-[var(--border)] -mx-2 md:mx-0">
        <MuseumEditor />
      </div>
    </div>
  );
}
