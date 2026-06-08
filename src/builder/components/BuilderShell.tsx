"use client";

import Link from "next/link";

export function BuilderShell({
  title,
  subtitle,
  backHref,
  homeHref,
  progress,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  backHref?: string;
  homeHref?: string;
  progress?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <header className="relative border-b border-[var(--border)] bg-[var(--bg)]/90 backdrop-blur-md sticky top-0 z-30">
        <Link
          href={homeHref ?? "/"}
          className="absolute left-6 md:left-12 top-1/2 -translate-y-1/2 font-display text-sm font-bold tracking-tight no-underline text-white z-10"
        >
          {homeHref ? "Início" : "Akaiito"}
        </Link>
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          {backHref ? (
            <Link
              href={backHref}
              className="text-sm text-[var(--text-muted)] no-underline hover:text-[var(--text)] shrink-0"
            >
              Voltar
            </Link>
          ) : (
            <span className="shrink-0" aria-hidden />
          )}
          {progress}
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10 md:py-14">
        <div className="mb-8">
          <h1 className="font-display text-2xl md:text-3xl font-extrabold tracking-tight mb-2">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-[var(--text-muted)] leading-relaxed">{subtitle}</p>
          )}
        </div>
        {children}
      </main>

      {footer && (
        <footer className="sticky bottom-0 z-30 border-t border-[var(--border)] bg-[var(--bg)]/95 backdrop-blur-md">
          <div className="max-w-3xl mx-auto px-6 py-4">{footer}</div>
        </footer>
      )}
    </div>
  );
}
