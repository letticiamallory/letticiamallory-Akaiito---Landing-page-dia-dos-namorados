import Link from "next/link";

const FOOTER_LINKS = [
  { href: "/termos", label: "Termos" },
  { href: "/privacidade", label: "Privacidade" },
  { href: "/contato", label: "Contato" },
] as const;

export function SiteFooter() {
  return (
    <footer className="bg-[var(--bg)] border-t border-[var(--border)]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-12 flex justify-between items-center flex-wrap gap-8">
        <Link href="/" className="font-display font-bold text-white no-underline hover:text-[var(--rose-pale)] transition-colors">
          Akaiito
        </Link>
        <nav className="flex gap-8">
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[0.72rem] tracking-widest uppercase text-[var(--text-dim)] hover:text-[var(--text)] transition-colors no-underline"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="text-xs text-[var(--text-dim)]">© 2026 Akaiito</div>
      </div>
    </footer>
  );
}
