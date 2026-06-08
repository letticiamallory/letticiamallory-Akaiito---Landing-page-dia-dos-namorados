"use client";

import couple1 from "@/assets/demo/couple-1.jpg";
import couple2 from "@/assets/demo/couple-2.jpg";
import couple3 from "@/assets/demo/couple-3.jpg";
import { ValentineCameraExperience } from "@/components/present/panda/ValentineCameraExperience";
import "@/components/present/panda/valentine-camera.css";
import { MockupShell } from "../MockupShell";

export function PresentScreenshotPreview() {
  return (
    <MockupShell className="mockup-shell--present-shot">
      <div className="mockup-present-shot__scroll">
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

        <article className="panda-card panda-card--visible panda-card--hero panda-card--full mockup-present-shot__camera-card">
          <div className="panda-card__body">
            <div className="panda-hero">
              <div className="panda-hero__glass">
                <div className="panda-hero__camera">
                  <ValentineCameraExperience
                    compact
                    frozenPhase="polaroid2-float"
                    photos={[
                      { url: couple2.src, label: "para sempre ♡" },
                      { url: couple3.src, label: "te amo muito" },
                    ]}
                  />
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </MockupShell>
  );
}
