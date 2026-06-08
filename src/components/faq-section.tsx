"use client";

import { useId, useState } from "react";

const FAQ_ITEMS = [
  {
    question: "Precisa criar conta?",
    answer: "Não. Você paga, recebe o link e manda. Sem cadastro, sem senha, sem app.",
  },
  {
    question: "O link expira?",
    answer: "Não. O link é para sempre, a pessoa pode abrir quantas vezes quiser.",
  },
  {
    question: "Quanto tempo leva pra criar?",
    answer:
      "Em média 5 minutos. Você preenche as informações, paga com Pix e o link chega na hora.",
  },
  {
    question: "Posso editar depois de pagar?",
    answer:
      "Não por enquanto. Revise tudo antes de finalizar. Em caso de erro, entre em contato.",
  },
  {
    question: "Funciona no celular sem instalar nada?",
    answer: "Sim. É um link normal, abre no navegador do celular, sem app.",
  },
  {
    question: "Como a pessoa recebe o presente?",
    answer:
      "Você recebe o link e manda pelo WhatsApp, Instagram ou como quiser. Basta clicar para abrir.",
  },
  {
    question: "O pagamento é seguro?",
    answer: "Sim. Processado via Mercado Pago com Pix. Aprovação instantânea.",
  },
  {
    question: "E se o Pix não for aprovado?",
    answer:
      "O link só é gerado após confirmação do pagamento. Se der problema, o valor não é cobrado.",
  },
] as const;

function FaqItem({
  question,
  answer,
  open,
  onToggle,
}: {
  question: string;
  answer: string;
  open: boolean;
  onToggle: () => void;
}) {
  const panelId = useId();
  const buttonId = useId();

  return (
    <div className="border-b border-[var(--border)] first:border-t">
      <button
        id={buttonId}
        type="button"
        className="w-full flex items-start justify-between gap-6 py-7 text-left bg-transparent border-0 cursor-pointer group"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={panelId}
      >
        <span className="font-display font-semibold tracking-tight text-[var(--text)] group-hover:text-[var(--rose-pale)] transition-colors">
          {question}
        </span>
        <span
          className="font-display text-lg text-[var(--text-dim)] shrink-0 leading-none transition-transform duration-300 ease-out"
          style={{ transform: open ? "rotate(45deg)" : "rotate(0deg)" }}
          aria-hidden
        >
          +
        </span>
      </button>
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        className="grid transition-[grid-template-rows] duration-300 ease-out"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <p className="text-sm leading-relaxed text-[var(--text-muted)] pb-7 pr-8 max-w-2xl">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="bg-[var(--bg)]" id="faq">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-20 md:py-32">
        <div className="fade-up text-[0.65rem] tracking-[0.2em] uppercase text-[var(--rose)] mb-4 flex items-center gap-3 before:content-[''] before:block before:w-6 before:h-px before:bg-current before:opacity-50">
          Dúvidas
        </div>
        <h2 className="fade-up d1 font-display text-[clamp(2rem,4vw,3.5rem)] font-bold leading-tight tracking-tight mb-12">
          Perguntas frequentes
        </h2>

        <div className="fade-up d2 max-w-3xl">
          {FAQ_ITEMS.map((item, index) => (
            <FaqItem
              key={item.question}
              question={item.question}
              answer={item.answer}
              open={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
