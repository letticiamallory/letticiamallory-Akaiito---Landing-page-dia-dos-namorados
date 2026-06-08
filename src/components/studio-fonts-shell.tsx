import { studioFontClassName } from "@/lib/fonts-studio";

export function StudioFontsShell({ children }: { children: React.ReactNode }) {
  return <div className={studioFontClassName}>{children}</div>;
}
