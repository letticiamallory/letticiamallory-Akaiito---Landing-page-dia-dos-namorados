"use client";

import couple1 from "@/assets/demo/couple-1.jpg";
import { MockupShell } from "../MockupShell";

export function MusicMockupPreview({ active: _active }: { active: boolean }) {
  return (
    <MockupShell className="mockup-shell--music" center>
      <article className="panda-card panda-card--visible panda-card--dark panda-card--flush mockup-music-card-shell">
        <div className="panda-card__body">
          <div className="panda-music-card">
            <div className="panda-music-card__glass">
              <div className="panda-music-card__cover-wrap">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={couple1.src}
                  alt=""
                  className="panda-music-card__cover"
                  draggable={false}
                />
              </div>

              <div className="panda-music-card__meta">
                <p className="panda-music-card__title">
                  John Michael Howell, JVKE, &amp; ZVC - A Thousand Years [OFFICIAL LYRIC VIDEO]
                </p>
                <p className="panda-music-card__subtitle">a trilha do nosso amor</p>
              </div>

              <div className="panda-music-card__bar" aria-hidden>
                <span className="panda-music-card__fill mockup-music-progress--static" />
              </div>

              <div className="panda-music-card__controls">
                <span aria-hidden>⏮</span>
                <button type="button" className="panda-music-card__play" aria-label="Tocar música">
                  ▶
                </button>
                <span aria-hidden>⏭</span>
              </div>
            </div>
          </div>
        </div>
      </article>
    </MockupShell>
  );
}
