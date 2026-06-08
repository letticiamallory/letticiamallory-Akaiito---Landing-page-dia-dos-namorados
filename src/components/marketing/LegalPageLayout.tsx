import type { ReactNode } from "react";
import Link from "next/link";
import { Nav } from "@/components/nav";
import { SiteFooter } from "@/components/marketing/SiteFooter";

export function LegalPageLayout({
  eyebrow,
  title,
  updatedAt,
  children,
}: {
  eyebrow: string;
  title: string;
  updatedAt: string;
  children: ReactNode;
}) {
  return (
    <>
      <Nav />
      <main className="min-h-screen pt-28 pb-20">
        <div className="max-w-3xl mx-auto px-6 md:px-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-[var(--text-dim)] hover:text-[var(--text)] transition-colors no-underline mb-8"
          >
            ← Voltar ao início
          </Link>

          <p className="text-[0.65rem] tracking-[0.2em] uppercase text-[var(--rose)] mb-3">
            {eyebrow}
          </p>
          <h1 className="font-display text-[clamp(2rem,4vw,3rem)] font-bold leading-tight tracking-tight mb-3">
            {title}
          </h1>
          <p className="text-sm text-[var(--text-dim)] mb-10">Última atualização: {updatedAt}</p>

          <div className="legal-prose">{children}</div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
