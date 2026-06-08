import {
  SCRAPBOOK_BACKGROUND,
  type ScrapbookBackgroundVariant,
} from "@/lib/scrapbook-background";
import "./scrapbook-background.css";

export function ScrapbookBackground({
  variant = SCRAPBOOK_BACKGROUND,
  className = "",
}: {
  variant?: ScrapbookBackgroundVariant;
  className?: string;
}) {
  return (
    <div
      className={`scrapbook-bg scrapbook-bg--${variant} ${className}`.trim()}
      aria-hidden
    />
  );
}
