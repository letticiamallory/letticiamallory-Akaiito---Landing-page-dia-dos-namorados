"use client";

import { useState } from "react";
import type { JoguinhoData } from "@/lib/gift-types";

const QUESTIONS = [
  { q: "Qual é a comida favorita de vocês juntos?", opts: ["Pizza", "Sushi", "Comida caseira", "Doces"] },
  { q: "Onde vocês se veem daqui a 5 anos?", opts: ["Viajando o mundo", "Com filhos", "No mesmo lugar, juntos", "Construindo sonhos"] },
  { q: "O que mais te faz rir nela(e)?", opts: ["O jeito dela(e)", "Piadas internas", "Situações bobas", "Tudo"] },
  { q: "Qual música define vocês?", opts: ["Romântica", "Animada", "Nostálgica", "Todas as acima"] },
];

export function JoguinhoGift({
  data,
  embedded = false,
}: {
  data: JoguinhoData;
  embedded?: boolean;
}) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [done, setDone] = useState(false);

  const shellClass = embedded
    ? "hp-joguinho-quiz flex flex-col items-center justify-center px-6 py-12 text-center"
    : "min-h-screen bg-[var(--bg)] flex flex-col items-center justify-center px-6 py-16 text-center";

  const quizShellClass = embedded
    ? "hp-joguinho-quiz flex flex-col items-center justify-center px-6 py-12"
    : "min-h-screen bg-[var(--bg)] flex flex-col items-center justify-center px-6 py-16";

  const compatibility = done
    ? Math.min(99, 75 + answers.reduce((a, b) => a + b, 0) * 3 + (data.senderName.length + data.receiverName.length) % 10)
    : 0;

  function answer(idx: number) {
    const next = [...answers, idx];
    setAnswers(next);
    if (step >= QUESTIONS.length - 1) {
      setDone(true);
    } else {
      setStep(step + 1);
    }
  }

  if (done) {
    return (
      <div className={shellClass}>
        <div className="text-6xl mb-6">💕</div>
        <h1 className="font-display text-4xl font-extrabold mb-2">{compatibility}% compatíveis!</h1>
        <p className="font-serif italic text-xl text-[var(--rose)] mb-6">
          {data.senderName} & {data.receiverName}
        </p>
        {data.loveMessage && (
          <p className="text-[var(--text-muted)] max-w-md leading-relaxed mb-8">&ldquo;{data.loveMessage}&rdquo;</p>
        )}
        <div className="flex gap-4">
          {data.senderPhoto && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={data.senderPhoto} alt={data.senderName} className="w-20 h-20 rounded-full object-cover border-2 border-[var(--rose)]" />
          )}
          {data.receiverPhoto && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={data.receiverPhoto} alt={data.receiverName} className="w-20 h-20 rounded-full object-cover border-2 border-[var(--rose)]" />
          )}
        </div>
        <p className="text-xs text-[var(--text-dim)] mt-8 uppercase tracking-widest">
          {embedded ? "Role para continuar ↓" : "Feito com amor no Akaiito"}
        </p>
      </div>
    );
  }

  const q = QUESTIONS[step];

  return (
    <div className={quizShellClass}>
      <p className="text-xs tracking-widest uppercase text-[var(--text-muted)] mb-2">
        {data.senderName} quer saber...
      </p>
      <h1 className="font-display text-2xl font-bold text-center mb-8 max-w-sm">
        Quiz de compatibilidade: {data.senderName} & {data.receiverName}
      </h1>
      <div className="w-full max-w-md">
        <div className="text-xs text-[var(--text-dim)] mb-4">Pergunta {step + 1} de {QUESTIONS.length}</div>
        <p className="font-display text-lg mb-6">{q.q}</p>
        <div className="flex flex-col gap-3">
          {q.opts.map((opt, i) => (
            <button
              key={opt}
              onClick={() => answer(i)}
              className="input-field text-left cursor-pointer hover:border-[var(--rose)] transition-colors bg-[var(--surface)]"
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
