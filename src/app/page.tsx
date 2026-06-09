import dynamic from "next/dynamic";
import Link from "next/link";
import { FaqSection } from "@/components/faq-section";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import { BrowserMockupCard } from "@/components/marketing/BrowserMockupCard";
import { Nav } from "@/components/nav";
import { FadeUpObserver, NavScroll } from "@/components/client-effects";
import { formatPrice, PRODUCTS } from "@/lib/products";

const HeroTriplePhoneMockup = dynamic(
  () => import("@/components/marketing/HeroTriplePhoneMockup").then((m) => m.HeroTriplePhoneMockup),
  {
    loading: () => (
      <div className="min-h-[360px] rounded-2xl bg-[var(--surface2)]/30 animate-pulse" aria-hidden />
    ),
  }
);

const BouquetEditorDemo = dynamic(
  () => import("@/components/marketing/BouquetEditorDemo").then((m) => m.BouquetEditorDemo),
  {
    loading: () => (
      <div className="min-h-[220px] rounded-xl bg-[var(--surface2)]/30 animate-pulse" aria-hidden />
    ),
  }
);

const ProductsSection = dynamic(
  () => import("@/components/products-section").then((m) => m.ProductsSection),
  {
    loading: () => <div className="min-h-[480px] bg-[var(--bg2)]" id="produtos" aria-hidden />,
  }
);

const price = formatPrice(PRODUCTS[0].priceCents);

export default function HomePage() {
  return (
    <>
      <FadeUpObserver />
      <NavScroll />
      <Nav />

      <section className="relative overflow-hidden bg-[var(--bg)]">
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            background: `
              radial-gradient(ellipse 90% 80% at 58% 48%, rgba(196,66,106,0.13) 0%, transparent 58%),
              radial-gradient(ellipse 70% 60% at 25% 55%, rgba(139,26,58,0.07) 0%, transparent 52%),
              radial-gradient(ellipse 100% 90% at 50% 50%, rgba(232,116,138,0.05) 0%, transparent 72%)
            `,
            animation: "glowPulse 6s ease-in-out infinite",
          }}
        />
        <div className="absolute inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_120%_100%_at_50%_50%,transparent_35%,rgba(13,10,11,0.85)_100%)]" />
        <div className="relative z-[2] max-w-[1400px] mx-auto grid lg:grid-cols-2 items-center min-h-screen px-6 md:px-12 pt-28 pb-20 gap-16">
          <div className="flex flex-col gap-8">
            <div className="fade-up inline-flex items-center gap-2.5 text-[0.7rem] tracking-[0.15em] uppercase text-[var(--text-muted)] px-3.5 py-1.5 border border-[var(--border2)] rounded-full w-fit">
              <div className="w-1.5 h-1.5 bg-[var(--rose)] rounded-full" style={{ animation: "glow 2s ease-in-out infinite" }} />
              12 de junho · Dia dos Namorados
            </div>
            <h1 className="fade-up d1 font-hero text-[clamp(3rem,6vw,5.4rem)] font-light leading-[0.95] tracking-[-0.02em]">
              O presente
              <br />
              que chega
              <br />
              <em className="font-serif italic font-normal text-[var(--rose)] block text-[1.05em] leading-[0.85] mt-1">
                em segundos.
              </em>
            </h1>
            <p className="fade-up d2 text-base leading-relaxed text-[var(--text-muted)] max-w-md font-light">
              Música, carta, fotos, contador e surpresas interativas, tudo numa página que ele(a) rola no celular.
            </p>
            <div className="fade-up d3 flex gap-4 items-center flex-wrap">
              <Link href="/criar/secoes" className="btn-primary no-underline">
                Criar o presente
              </Link>
              <Link href="#produtos" className="btn-secondary no-underline">
                Ver o que inclui
              </Link>
            </div>
            <div className="fade-up d4 flex items-center gap-5">
              <div className="font-display font-bold text-xl text-[var(--rose)]">{price}</div>
              <p className="text-xs text-[var(--text-muted)] leading-snug">
                <strong className="text-[var(--text)] font-medium">Tudo incluído.</strong>
                <br />
                Link para sempre. Sem mensalidade.
              </p>
            </div>
          </div>
          <div className="fade-up d2 hidden lg:block w-full">
            <HeroTriplePhoneMockup />
          </div>
        </div>
      </section>

      <div className="bg-[var(--surface)] border-y border-[var(--border)]">
        <div className="max-w-[1400px] mx-auto grid md:grid-cols-3 gap-px bg-[var(--border)] px-0 py-0">
          {[
            {
              quote:
                "Montei num domingo de noite, nem demorou. Joguei umas fotos nossas, mandei o link e pronto. Ela abriu no celular, passou pela polaroid, entrou no museuzinho e chorou na carta. Surpreendeu até quem montou.",
              author: "Rafael M. · São Paulo",
            },
            {
              quote:
                "Não parece daqueles presentes prontos de internet. Cada parte tem uma coisinha diferente pra explorar. No celular ficou lindo rolando, parece colagem de álbum de verdade.",
              author: "Camila R. · Belo Horizonte",
            },
            {
              quote:
                "Paguei no Pix, o link veio na hora. Copiei, joguei no WhatsApp e foi. Nem cadastro, nem mensalidade, só o presente, do jeito que prometeram.",
              author: "Pedro A. · Curitiba",
            },
          ].map((t, i) => (
            <div key={i} className={`fade-up d${i} bg-[var(--surface)] p-8`}>
              <div className="flex gap-1 mb-4 text-[var(--rose)] text-sm">★★★★★</div>
              <p className="font-serif italic text-base leading-relaxed mb-5">&ldquo;{t.quote}&rdquo;</p>
              <div className="text-[0.72rem] tracking-widest uppercase text-[var(--text-dim)]">{t.author}</div>
            </div>
          ))}
        </div>
      </div>

      <ProductsSection />

      <section className="max-w-[1400px] mx-auto px-6 md:px-12 py-20 md:py-32" id="como-funciona">
        <div className="fade-up text-[0.65rem] tracking-[0.2em] uppercase text-[var(--rose)] mb-4 flex items-center gap-3 before:content-[''] before:block before:w-6 before:h-px before:bg-current before:opacity-50">
          Simples e rápido
        </div>
        <h2 className="fade-up d1 font-display text-[clamp(2rem,4vw,3.5rem)] font-bold leading-tight tracking-tight mb-12">
          Rápido de criar.
          <br />
          <em className="font-serif italic font-normal text-[var(--rose)]">Impossível de esquecer.</em>
        </h2>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            {[
              { n: "01", title: "Monte a história de vocês", desc: "Música, carta, fotos, contador e surpresas, tudo numa página que ele(a) rola no celular." },
              { n: "02", title: "Escolha o visual", desc: "Veja ao vivo como vai ficar enquanto edita, sem surpresa na hora de enviar." },
              { n: "03", title: "Paga com Pix", desc: "Aprovação na hora via Mercado Pago. Sem cadastro, sem cartão, sem complicação." },
              { n: "04", title: "Manda o link", desc: "Recebe o link na hora e manda pelo WhatsApp, Instagram, onde quiser, quando quiser." },
            ].map((step, i) => (
              <div key={step.n} className={`fade-up d${i} flex gap-6 py-7 border-b border-[var(--border)] first:border-t`}>
                <div className="font-display text-xs font-bold text-[var(--text-dim)] tracking-wider min-w-8">{step.n}</div>
                <div>
                  <div className="font-display font-semibold tracking-tight mb-1">{step.title}</div>
                  <p className="text-sm leading-relaxed text-[var(--text-muted)]">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="fade-up d1 hidden lg:block">
            <BrowserMockupCard>
              <BouquetEditorDemo />
            </BrowserMockupCard>
          </div>
        </div>
      </section>

      <div className="overflow-hidden border-y border-[var(--border)] py-3 bg-[var(--bg2)]">
        <div className="flex whitespace-nowrap" style={{ animation: "scroll 25s linear infinite" }}>
          {[...Array(2)].map((_, dup) =>
            [
              "Visual de colagem",
              "Carta animada com buquê",
              "Câmera polaroid",
              "Museu interativo",
              "Caixa de chocolates",
              "Entrega imediata via Pix",
            ].map((item) => (
              <span
                key={`${dup}-${item}`}
                className="font-display text-xs font-medium tracking-widest uppercase text-[var(--text-dim)] px-8 inline-flex items-center gap-8 after:content-['·'] after:text-[var(--wine-light)] after:text-xl"
              >
                {item}
              </span>
            ))
          )}
        </div>
      </div>

      <FaqSection />

      <section className="bg-[var(--wine)] relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-16 md:py-20 flex justify-between items-center gap-8 flex-wrap">
          <div>
            <div className="text-xs tracking-[0.2em] uppercase text-[rgba(245,237,230,0.55)] mb-3">Dias contados</div>
            <h2 className="font-display text-[clamp(1.8rem,4vw,3rem)] font-bold tracking-tight text-[var(--cream)] leading-tight">
              Não deixa pra
              <br />
              <em className="font-serif italic font-normal">última hora.</em>
            </h2>
          </div>
          <div className="flex flex-col gap-4">
            <p className="text-sm text-[rgba(245,237,230,0.6)] max-w-xs leading-relaxed">
              12 de junho chega rápido. Cria agora, guarda o link e manda na hora certa.
            </p>
            <Link href="/criar/secoes" className="font-display text-[0.95rem] font-semibold text-[var(--wine)] bg-[var(--cream)] px-8 py-3.5 rounded-full no-underline inline-flex items-center hover:bg-white hover:-translate-y-0.5 transition-all w-fit">
              Criar o presente
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
