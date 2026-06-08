"use client";

export function CreateFormStudioShell({
  icon,
  title,
  subtitle,
  price,
  children,
  footer,
  onSubmit,
  loading,
  error,
  submitLabel,
}: {
  icon: string;
  title: string;
  subtitle: string;
  price: string;
  children: React.ReactNode;
  footer: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  error?: string;
  submitLabel?: string;
}) {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <div className="border-b border-[var(--border)] bg-[var(--bg)]/90 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-6 py-4 md:px-10 flex flex-wrap items-center justify-between gap-4">
          <a
            href="/"
            className="font-display text-sm font-bold text-[var(--text-muted)] no-underline hover:text-[var(--text)]"
          >
            Voltar
          </a>
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-2xl shrink-0">{icon}</span>
            <div className="min-w-0">
              <p className="text-[0.6rem] tracking-[0.2em] uppercase text-[var(--rose)] mb-0.5">
                Estúdio de personalização
              </p>
              <h1 className="font-display text-lg md:text-xl font-extrabold tracking-tight truncate">
                {title}
              </h1>
            </div>
          </div>
          <div className="font-display font-bold text-[var(--rose)] shrink-0">{price}</div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10 md:px-10 md:py-14">
        <p className="text-sm text-[var(--text-muted)] max-w-2xl mb-10">{subtitle}</p>
        <form onSubmit={onSubmit} className="flex flex-col gap-10">
          {children}
          <div className="border-t border-[var(--border)] pt-8 flex flex-col gap-5 max-w-md">
            {footer}
            {error && <p className="text-sm text-red-400">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary btn-rose w-full justify-center"
            >
              {loading ? "Criando..." : submitLabel ?? "Ir para pagamento"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
