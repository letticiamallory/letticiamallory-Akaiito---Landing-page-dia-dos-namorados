import type { ReactNode } from "react";

export function BrowserMockupCard({ children }: { children: ReactNode }) {
  return (
    <div className="bg-[var(--surface)] border border-[var(--border2)] rounded-2xl p-8 flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-[#FF5F57]" />
        <div className="w-2 h-2 rounded-full bg-[#FFBD2E]" />
        <div className="w-2 h-2 rounded-full bg-[#28C840]" />
        <div className="flex-1 bg-[var(--surface2)] rounded px-3 py-1 text-xs text-[var(--text-dim)]">
          akaiito.com.br/p/a3f9k2
        </div>
      </div>
      <div className="rounded-xl min-h-[220px] relative overflow-hidden">{children}</div>
    </div>
  );
}
