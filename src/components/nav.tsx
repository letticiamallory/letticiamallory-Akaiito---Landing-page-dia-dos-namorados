import Link from "next/link";

const NAV_SECTIONS = [
  { href: "#produtos", label: "Surpresas" },
  { href: "#como-funciona", label: "Como criar" },
  { href: "#faq", label: "Perguntas" },
] as const;

const navLinkClass =
  "text-xs tracking-widest uppercase text-[var(--text-muted)] hover:text-[var(--text)] transition-colors no-underline";

export function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] flex justify-between items-center px-6 md:px-12 py-6 bg-gradient-to-b from-[rgba(13,10,11,0.9)] to-transparent">
      <Link href="/" className="font-display text-base font-bold tracking-tight text-white shrink-0">
        Akaiito
      </Link>
      <ul className="hidden md:flex items-center gap-6 lg:gap-8 list-none m-0 p-0 absolute left-1/2 -translate-x-1/2">
        {NAV_SECTIONS.map((section) => (
          <li key={section.href}>
            <a href={section.href} className={navLinkClass}>
              {section.label}
            </a>
          </li>
        ))}
      </ul>
      <Link
        href="/criar/secoes"
        className="font-display text-xs font-semibold tracking-wide uppercase text-[var(--bg)] bg-[var(--rose)] px-5 py-2 rounded-full no-underline hover:bg-[var(--wine-light)] hover:-translate-y-px transition-all whitespace-nowrap shrink-0"
      >
        Criar história
      </Link>
    </nav>
  );
}
