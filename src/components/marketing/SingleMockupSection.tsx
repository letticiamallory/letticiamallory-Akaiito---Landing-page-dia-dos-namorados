"use client";

import Link from "next/link";
import { PhoneMockup } from "@/components/marketing/PhoneMockup";
import { PresentScreenshotPreview } from "@/components/marketing/previews/PresentScreenshotPreview";
import { formatPrice, PRODUCTS } from "@/lib/products";

const FEATURES = [
  { emoji: "🎵", title: "Trilha sonora", desc: "A música de vocês com capa e player" },
  { emoji: "🎁", title: "Câmera polaroid", desc: "Caixa animada + fotos saindo em polaroid" },
  { emoji: "💕", title: "Contador ao vivo", desc: "Dias, horas e minutos juntos em tempo real" },
  { emoji: "💌", title: "Carta de amor", desc: "Envelope animado com sua mensagem" },
  { emoji: "🖼️", title: "Galeria de memórias", desc: "Fotos organizadas por momentos" },
  { emoji: "🏛️", title: "Museu de Nós", desc: "Salão interativo com quadros e fotos (extra)" },
  { emoji: "🍫", title: "Caixa de bombons", desc: "Caixa que abre e anima a cada mordida (extra)" },
] as const;

export function SingleMockupSection() {
  const price = formatPrice(PRODUCTS[0].priceCents);

  return (
    <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-20 last:mb-0">
      <div className="fade-up flex justify-center">
        <PhoneMockup priority>
          <PresentScreenshotPreview />
        </PhoneMockup>
      </div>

      <div className="fade-up d1 flex flex-col gap-8">
        <div>
          <div className="text-[0.65rem] tracking-[0.2em] uppercase text-[var(--rose)] mb-4 flex items-center gap-3 before:content-[''] before:block before:w-6 before:h-px before:bg-current before:opacity-50">
            O presente completo
          </div>
          <h3 className="font-display text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight mb-3">
            Tudo que a pessoa vai receber, num só link.
          </h3>
          <p className="text-sm leading-relaxed text-[var(--text-muted)] max-w-xl">
            Cada parte foi pensada pra emocionar, do primeiro toque até a última mensagem. Você
            escolhe o que entra, personaliza cada detalhe e manda o link.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {FEATURES.map((item) => (
            <div key={item.title} className="flex gap-3 items-start">
              <span className="text-lg shrink-0" aria-hidden>
                {item.emoji}
              </span>
              <div>
                <p className="text-sm font-semibold text-[var(--text)]">{item.title}</p>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-4 pt-2">
          <p className="text-sm text-[var(--text-muted)]">
            <strong className="text-[var(--text)] font-display text-xl">{price}</strong>
            {", "}
            tudo incluído, sem surpresa
          </p>
          <Link href="/criar/secoes" className="btn-primary btn-rose no-underline text-sm">
            Monte um demo
          </Link>
        </div>
      </div>
    </div>
  );
}
