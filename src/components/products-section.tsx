import Link from "next/link";
import { SingleMockupSection } from "@/components/marketing/SingleMockupSection";
import { PRODUCTS, formatPrice } from "@/lib/products";

export function ProductsSection() {
  const product = PRODUCTS[0];

  return (
    <section className="bg-[var(--bg2)]" id="produtos">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-20 md:py-32">
        <div className="mb-12">
          <div className="fade-up text-[0.65rem] tracking-[0.2em] uppercase text-[var(--rose)] mb-4 flex items-center gap-3 before:content-[''] before:block before:w-6 before:h-px before:bg-current before:opacity-50">
            Para o dia 12 de junho
          </div>
          <h2 className="fade-up d1 font-display text-[clamp(2rem,4vw,3.5rem)] font-bold leading-tight tracking-tight">
            <em className="font-serif italic font-normal text-[var(--rose)]">Um presente que ele(a) nunca vai esquecer.</em>
          </h2>
          <p className="fade-up d2 text-sm leading-relaxed text-[var(--text-muted)] mt-4 max-w-2xl">
            Monte a página do jeito de vocês, mande o link e deixa ele(a) se emocionar, foto por foto, mensagem por mensagem.
          </p>
        </div>

        <div
          className="fade-up card p-8 md:p-12 flex flex-col gap-8 relative overflow-hidden ring-1 ring-[rgba(196,66,106,0.25)] mb-16"
          style={{
            background:
              "linear-gradient(135deg, rgba(26,10,18,0.95) 0%, var(--surface) 45%, var(--bg2) 100%)",
          }}
        >
          <div className="flex justify-between items-start flex-wrap gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[var(--surface2)] border border-[var(--border2)] flex items-center justify-center text-2xl">
              {product.icon}
            </div>
            <span className="text-[0.6rem] tracking-widest uppercase text-[var(--cream)] bg-[var(--rose)] border border-[rgba(196,66,106,0.5)] px-3 py-1.5 rounded-full">
              {product.badge}
            </span>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div>
              <div className="font-display font-semibold text-3xl tracking-tight">{product.name}</div>
              <p className="text-sm text-[var(--text-muted)] mt-2 max-w-xl">{product.description}</p>
              <p className="text-xs text-[var(--text-dim)] mt-4">
                Câmera polaroid, caixa de bombons, museu do casal e outros extras disponíveis
              </p>
            </div>
            <div className="flex items-center gap-6 flex-wrap">
              <div className="font-display font-bold text-3xl tracking-tight">
                {formatPrice(product.priceCents)}, tudo incluído, sem surpresa
              </div>
              <Link
                href="/criar/secoes"
                className="btn-primary btn-rose no-underline"
              >
                Criar agora
              </Link>
            </div>
          </div>
        </div>

        <SingleMockupSection />
      </div>
    </section>
  );
}
