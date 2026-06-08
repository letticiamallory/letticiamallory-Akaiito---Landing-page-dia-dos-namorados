"use client";

import couple1 from "@/assets/demo/couple-1.jpg";
import couple2 from "@/assets/demo/couple-2.jpg";
import couple3 from "@/assets/demo/couple-3.jpg";
import { MockupShell } from "../MockupShell";

const MOMENTS = [
  { title: "Nossos Dates", image: couple1.src },
  { title: "Fotos aleatórias", image: couple2.src },
  { title: "Primeira viagem", image: couple3.src },
] as const;

export function MemoriesMockupPreview({ active: _active }: { active: boolean }) {
  return (
    <MockupShell className="mockup-shell--memories" center>
      <article className="panda-card panda-card--visible panda-card--dark mockup-memories-card-shell">
        <div className="panda-card__body">
          <div className="panda-gallery">
            <p className="panda-gallery__subtitle">Toque em um momento para ver as fotos</p>
            <div className="panda-gallery__moments">
              {MOMENTS.map((moment) => (
                <div key={moment.title} className="panda-gallery__moment" aria-hidden>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={moment.image}
                    alt=""
                    className="panda-gallery__moment-cover"
                    draggable={false}
                  />
                  <span className="panda-gallery__moment-label">{moment.title}</span>
                </div>
              ))}
            </div>
            <p className="panda-gallery__hint">Memórias de Letticia e João</p>
          </div>
        </div>
      </article>
    </MockupShell>
  );
}
