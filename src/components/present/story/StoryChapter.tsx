"use client";

import type { StoryChapterDef } from "@/lib/story-landing";
import { useCollageReveal } from "@/hooks/useCollageReveal";

export function StoryChapter({
  def,
  children,
  isFirst = false,
}: {
  def: StoryChapterDef;
  children: React.ReactNode;
  isFirst?: boolean;
}) {
  const { ref, visible, className } = useCollageReveal<HTMLElement>();

  return (
    <section
      ref={ref}
      id={`chapter-${def.id}`}
      className={`story-chapter ${className} ${visible ? "story-chapter--visible" : ""}`.trim()}
      aria-labelledby={`chapter-title-${def.id}`}
    >
      {!isFirst && (
        <header className="story-chapter__header">
          <span className="story-chapter__emoji" aria-hidden>
            {def.emoji}
          </span>
          <div>
            <h2 className="story-chapter__title" id={`chapter-title-${def.id}`}>
              {def.title}
            </h2>
            {def.subtitle && (
              <p className="story-chapter__subtitle">{def.subtitle}</p>
            )}
          </div>
        </header>
      )}
      <div className="story-chapter__body">{children}</div>
    </section>
  );
}

export function StoryOpeningBadge({ def }: { def: StoryChapterDef }) {
  return (
    <div className="story-opening-badge" aria-hidden>
      <span className="story-opening-badge__emoji">{def.emoji}</span>
      <span className="story-opening-badge__line" />
    </div>
  );
}
