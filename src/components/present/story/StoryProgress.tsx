"use client";

import { useEffect, useState } from "react";
import type { StoryChapterBlock, StoryChapterId } from "@/lib/story-landing";

export function StoryProgress({ chapters }: { chapters: StoryChapterBlock[] }) {
  const [active, setActive] = useState<StoryChapterId>(
    chapters[0]?.def.id ?? "opening"
  );

  useEffect(() => {
    const ids = chapters.map((c) => c.def.id);
    const elements = ids
      .map((id) => document.getElementById(`chapter-${id}`))
      .filter(Boolean) as HTMLElement[];

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target.id) {
          const id = visible[0].target.id.replace("chapter-", "") as StoryChapterId;
          setActive(id);
        }
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: [0, 0.25, 0.5] }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [chapters]);

  if (chapters.length <= 2) return null;

  return (
    <nav className="story-progress" aria-label="Capítulos da história">
      {chapters.map((chapter) => (
        <a
          key={chapter.def.id}
          href={`#chapter-${chapter.def.id}`}
          className={`story-progress__dot${
            active === chapter.def.id ? " story-progress__dot--active" : ""
          }`}
          title={chapter.def.title}
          aria-label={chapter.def.title}
          onClick={(e) => {
            e.preventDefault();
            document
              .getElementById(`chapter-${chapter.def.id}`)
              ?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
        >
          <span className="story-progress__emoji">{chapter.def.emoji}</span>
        </a>
      ))}
    </nav>
  );
}
