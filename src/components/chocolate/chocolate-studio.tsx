"use client";

import { useEffect } from "react";
import { ChocolateEditor } from "./Editor";
import { useChocolateStore } from "@/store/chocolate.store";

export function ChocolateStudio({
  senderName,
  receiverName,
  message,
  onSenderName,
  onReceiverName,
  onMessageChange,
}: {
  senderName: string;
  receiverName: string;
  message: string;
  onSenderName: (v: string) => void;
  onReceiverName: (v: string) => void;
  onMessageChange: (v: string) => void;
}) {
  const setMeta = useChocolateStore((s) => s.setMeta);
  const reset = useChocolateStore((s) => s.reset);
  const coupleName = useChocolateStore((s) => s.coupleName);

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

      <label className="flex flex-col gap-1.5 max-w-lg">
        <span className="text-xs tracking-widest uppercase text-[var(--text-dim)]">
          Mensagem na caixa (opcional)
        </span>
        <textarea
          className="w-full px-3 py-2.5 bg-[var(--bg)] border border-[var(--border2)] rounded-lg text-[var(--text)] min-h-[80px] resize-y"
          value={message}
          onChange={(e) => onMessageChange(e.target.value)}
          placeholder="Para você, com amor..."
        />
      </label>

      <p className="text-sm text-[var(--text-muted)] max-w-2xl">
        Arraste os chocolates para os compartimentos da caixa. Depois de pagar, quem receber verá a caixa fechada. Ao clicar, a tampa abre com os chocolates que você escolheu.
      </p>

      <div className="rounded-xl overflow-hidden border border-[var(--border)] -mx-2 md:mx-0">
        <ChocolateEditor />
      </div>
    </div>
  );
}
