"use client";

import Link from "next/link";

export function ObrigadoClient({ slug, origin }: { slug: string; origin: string }) {
  const link = `${origin}/presente/${slug}`;

  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <div className="text-5xl mb-6">💕</div>
        <h1 className="font-display text-3xl font-extrabold mb-3">Presente pronto!</h1>
        <p className="text-sm text-[var(--text-muted)] mb-8 leading-relaxed">
          Seu link exclusivo foi gerado. Compartilhe com quem você ama.
        </p>
        <div className="bg-[var(--surface)] border border-[var(--border2)] rounded-xl p-4 mb-6 text-sm break-all">
          {link}
        </div>
        <div className="flex flex-col gap-3">
          <button
            type="button"
            className="btn-primary btn-rose w-full justify-center"
            onClick={() => navigator.clipboard.writeText(link)}
          >
            Copiar link
          </button>
          <Link href={`/presente/${slug}`} className="text-sm text-[var(--rose)] no-underline">
            Ver presente
          </Link>
        </div>
      </div>
    </div>
  );
}
