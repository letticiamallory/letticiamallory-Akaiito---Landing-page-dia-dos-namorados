"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { HistoriaData } from "@/lib/gift-types";
import { getHistoriaTheme } from "@/lib/historia-themes";
import { HistoriaCartaSection } from "./historia-carta-section";
import { MusicPolaroidHang } from "@/components/present/collage/MusicPolaroidHang";
import type { MusicPolaroidPair } from "@/lib/music-section-assets";
import { HistoriaPolaroidSection } from "./historia-polaroid-section";
import { HistoriaJoguinhoSection } from "./historia-joguinho-section";
import { HistoriaMuseuSection } from "./historia-museu-section";
import { HistoriaChocolatesSection } from "./historia-chocolates-section";
import { HistoriaSlotSection } from "./historia-slot-section";
import {
  ScrapbookDecor,
  ScrapbookSpread,
} from "./scrapbook/ScrapbookDecor";
import {
  ScrapbookPhotoFrame,
  ScrapbookTextPaper,
  galleryFrameVariant,
  galleryRotation,
} from "./scrapbook/ScrapbookFrame";
import type { ScrapbookSectionId } from "@/lib/scrapbook-decor";
import {
  formatRelationshipDate,
  useRelationshipCounter,
  useScrollReveal,
} from "@/hooks/useHistoriaPage";
import "./historia-page.css";
import "./scrapbook/scrapbook.css";

function RevealSection({
  children,
  className = "",
  scrapbookSection,
}: {
  children: React.ReactNode;
  className?: string;
  scrapbookSection: ScrapbookSectionId;
}) {
  const { ref, visible } = useScrollReveal<HTMLElement>();

  return (
    <section
      ref={ref}
      className={[
        "hp-reveal",
        visible ? "hp-reveal--visible" : "",
        "hp-section--scrapbook",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <ScrapbookSpread section={scrapbookSection} variant="auto">
        {children}
      </ScrapbookSpread>
    </section>
  );
}

function getEmbedUrl(url?: string): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (u.hostname.includes("spotify.com")) {
      return u.toString().replace("open.spotify.com/", "open.spotify.com/embed/");
    }
    if (u.hostname.includes("youtube.com")) {
      const id = u.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}`;
    }
    if (u.hostname.includes("youtu.be")) {
      const id = u.pathname.slice(1);
      if (id) return `https://www.youtube.com/embed/${id}`;
    }
  } catch {
    return null;
  }
  return null;
}

function StarField() {
  const stars = useMemo(
    () =>
      Array.from({ length: 80 }, (_, i) => ({
        id: i,
        left: `${(i * 17) % 100}%`,
        top: `${(i * 23) % 100}%`,
        size: (i % 3) + 1,
        delay: `${(i % 5) * 0.4}s`,
      })),
    []
  );
  return (
    <>
      {stars.map((s) => (
        <span
          key={s.id}
          style={{
            position: "absolute",
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            background: "#fff",
            borderRadius: "50%",
            opacity: 0.5 + (s.id % 5) * 0.1,
            animationDelay: s.delay,
          }}
        />
      ))}
    </>
  );
}

function TypewriterLetter({ text, enabled }: { text: string; enabled?: boolean }) {
  const [len, setLen] = useState(enabled ? 0 : text.length);

  useEffect(() => {
    if (!enabled) {
      setLen(text.length);
      return;
    }
    setLen(0);
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setLen(i);
      if (i >= text.length) window.clearInterval(id);
    }, 28);
    return () => window.clearInterval(id);
  }, [text, enabled]);

  return (
    <p className="hp-letter-body">
      {text.slice(0, len)}
      {enabled && len < text.length && <span className="hp-letter-cursor" />}
    </p>
  );
}

export function HistoriaPage({
  data,
  shareUrl,
  preview = false,
}: {
  data: HistoriaData;
  shareUrl?: string;
  preview?: boolean;
}) {
  const theme = getHistoriaTheme(data.theme);
  const coupleName =
    data.coupleDisplayName?.trim() ||
    `${data.senderName} & ${data.receiverName}`;
  const counter = useRelationshipCounter(data.relationshipStart);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [audioOn, setAudioOn] = useState(false);

  const embedUrl = getEmbedUrl(data.music?.embedUrl);
  const hasMusic = Boolean(
    data.music?.title || data.music?.artist || embedUrl
  );
  const hasFacts = data.facts && Object.values(data.facts).some(Boolean);
  const mapQuery = data.place?.address || data.place?.name;

  const copyLink = useCallback(async () => {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }, [shareUrl]);

  useEffect(() => {
    if (preview) return;
    const onScroll = () => {
      const bg = document.querySelector(".hp-hero-bg") as HTMLElement | null;
      if (bg) bg.style.transform = `translateY(${window.scrollY * 0.25}px) scale(1.05)`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [preview]);

  return (
    <div
      className="historia-page historia-page--colagem"
      style={theme.vars as React.CSSProperties}
    >
      {/* Hero */}
      <header className="hp-hero hp-hero--scrapbook">
        <ScrapbookDecor section="hero" />
        {data.heroPhotoUrl ? (
          <div
            className="hp-hero-bg hp-hero-bg--parallax"
            style={{ backgroundImage: `url(${data.heroPhotoUrl})` }}
          />
        ) : (
          <div className="hp-hero-fallback" />
        )}
        <div className="hp-hero-overlay" />
        <ScrapbookTextPaper variant="scalloped" className="hp-hero-content">
          <h1 className="hp-hero-names">{coupleName}</h1>
          <p className="hp-hero-sub">
            {data.heroSubtitle ||
              `desde ${formatRelationshipDate(data.relationshipStart)}`}
          </p>
        </ScrapbookTextPaper>
        {!preview && <span className="hp-hero-scroll">Role ↓</span>}
      </header>

      {/* Counter */}
      <RevealSection scrapbookSection="counter">
        <h2 className="hp-section-title">Estamos juntos há...</h2>
        <div className="hp-counter-grid">
          {(
            [
              ["years", "Anos"],
              ["months", "Meses"],
              ["days", "Dias"],
              ["hours", "Horas"],
              ["minutes", "Min"],
              ["seconds", "Seg"],
            ] as const
          ).map(([key, label]) => (
            <ScrapbookTextPaper
              key={key}
              variant="textured"
              className="hp-counter-item"
            >
              <div className="hp-counter-num">{counter[key]}</div>
              <div className="hp-counter-label">{label}</div>
            </ScrapbookTextPaper>
          ))}
        </div>
      </RevealSection>

      {/* Timeline */}
      {data.timeline.length > 0 && (
        <RevealSection scrapbookSection="timeline">
          <h2 className="hp-section-title">Nossa história</h2>
          <p className="hp-section-sub">Os marcos que construíram nosso amor</p>
          <div className="hp-timeline">
            {data.timeline.map((item) => (
              <article key={item.id} className="hp-timeline-item">
                <span className="hp-timeline-dot" />
                <ScrapbookTextPaper variant="textured" className="hp-timeline-card">
                  <div className="hp-timeline-date">
                    {item.emoji ? `${item.emoji} ` : ""}
                    {item.date}
                  </div>
                  <h3 className="hp-timeline-title">{item.title}</h3>
                  <p className="hp-timeline-desc">{item.description}</p>
                </ScrapbookTextPaper>
              </article>
            ))}
          </div>
        </RevealSection>
      )}

      {/* Music */}
      {hasMusic && (
        <RevealSection scrapbookSection="music">
          <h2 className="hp-section-title">A nossa música</h2>
          <div className="historia-music-block">
            <MusicPolaroidHang
              polaroids={{
                left: {
                  photoUrl: data.music?.polaroidLeftPhoto || data.heroPhotoUrl,
                  caption: data.music?.polaroidLeftCaption,
                },
                right: {
                  photoUrl: data.music?.polaroidRightPhoto || data.heroPhotoUrl,
                  caption: data.music?.polaroidRightCaption,
                },
              } satisfies MusicPolaroidPair}
            />
            <div className="hp-music-card">
            <div className="hp-music-visual">
              <div className="hp-music-art">🎵</div>
              <div style={{ flex: 1 }}>
                {data.music?.title && (
                  <div className="hp-music-title">{data.music.title}</div>
                )}
                {data.music?.artist && (
                  <div className="hp-music-artist">
                    {data.music.artist}
                    {data.music.album ? ` · ${data.music.album}` : ""}
                  </div>
                )}
                <div className="hp-music-bars" aria-hidden>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <span key={n} className="hp-music-bar" style={{ height: 20 }} />
                  ))}
                </div>
              </div>
            </div>
            <div className="hp-music-progress">
              <div className="hp-music-progress-fill" />
            </div>
            {data.music?.story && (
              <p className="hp-music-story">{data.music.story}</p>
            )}
            {embedUrl && (
              <div className="hp-embed-wrap">
                <iframe
                  src={embedUrl}
                  title="Player de música"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                />
              </div>
            )}
            </div>
          </div>
        </RevealSection>
      )}

      {/* Gallery */}
      {data.photos.length > 0 && (
        <RevealSection scrapbookSection="gallery">
          <h2 className="hp-section-title">
            {data.galleryTitle || "Nossos momentos"}
          </h2>
          <div className="hp-gallery hp-gallery--scrapbook">
            {data.photos.map((photo, i) => (
              <ScrapbookPhotoFrame
                key={photo.url + i}
                variant={galleryFrameVariant(i)}
                src={photo.url}
                alt={photo.caption || ""}
                caption={photo.caption}
                rotation={galleryRotation(i)}
                onClick={!preview ? () => setLightbox(i) : undefined}
              />
            ))}
          </div>
        </RevealSection>
      )}

      {lightbox !== null && data.photos[lightbox] && (
        <div
          className="hp-lightbox"
          onClick={() => setLightbox(null)}
          onKeyDown={(e) => e.key === "Escape" && setLightbox(null)}
          role="dialog"
        >
          <button
            type="button"
            className="hp-lightbox-close"
            onClick={() => setLightbox(null)}
            aria-label="Fechar"
          >
            ×
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={data.photos[lightbox].url} alt="" />
          {data.photos[lightbox].caption && (
            <p className="hp-lightbox-caption">{data.photos[lightbox].caption}</p>
          )}
        </div>
      )}

      {/* Letter */}
      {data.letter?.trim() && (
        <RevealSection scrapbookSection="letter">
          <ScrapbookTextPaper variant="scalloped" className="hp-letter">
            <h2 className="hp-letter-title">
              {data.letterTitle || `Para ${data.receiverName}`}
            </h2>
            <TypewriterLetter
              text={data.letter}
              enabled={data.letterTypewriter && !preview}
            />
          </ScrapbookTextPaper>
        </RevealSection>
      )}

      {/* Carta animada + buquê */}
      {data.modules?.carta && (
        <RevealSection
          scrapbookSection="carta"
          className="hp-carta-module"
        >
          <h2 className="hp-section-title">Uma surpresa para você</h2>
          <p className="hp-section-sub">Toque no envelope para abrir</p>
          <HistoriaCartaSection
            module={data.modules.carta}
            senderName={data.senderName}
            receiverName={data.receiverName}
          />
        </RevealSection>
      )}

      {/* Câmera polaroid */}
      {data.modules?.polaroid && (
        <RevealSection
          scrapbookSection="polaroid"
          className="hp-polaroid-module"
        >
          <h2 className="hp-section-title">Câmera do Amor</h2>
          <p className="hp-section-sub">Uma surpresa interativa só para vocês</p>
          <HistoriaPolaroidSection
            module={data.modules.polaroid}
            senderName={data.senderName}
            receiverName={data.receiverName}
          />
        </RevealSection>
      )}

      {/* Joguinho do casal */}
      {data.modules?.joguinho && (
        <RevealSection
          scrapbookSection="joguinho"
          className="hp-joguinho-module"
        >
          <h2 className="hp-section-title">Quiz do casal</h2>
          <p className="hp-section-sub">Descubram o quanto combinam</p>
          <HistoriaJoguinhoSection
            module={data.modules.joguinho}
            senderName={data.senderName}
            receiverName={data.receiverName}
          />
        </RevealSection>
      )}

      {/* Museu de Nós */}
      {data.modules?.museu && data.modules.museu.elements.length > 0 && (
        <RevealSection
          scrapbookSection="museu"
          className="hp-museu-module"
        >
          <h2 className="hp-section-title">
            {data.modules.museu.museumTitle || "Museu de Nós"}
          </h2>
          {data.modules.museu.museumDate && (
            <p className="hp-section-sub">{data.modules.museu.museumDate}</p>
          )}
          <HistoriaMuseuSection
            module={data.modules.museu}
            senderName={data.senderName}
            receiverName={data.receiverName}
          />
        </RevealSection>
      )}

      {/* Caixa de chocolates */}
      {data.modules?.chocolates && data.modules.chocolates.placements.length > 0 && (
        <RevealSection
          scrapbookSection="chocolates"
          className="hp-chocolates-module"
        >
          <h2 className="hp-section-title">
            {data.modules.chocolates.boxTitle || "Caixa de Chocolates"}
          </h2>
          <p className="hp-section-sub">Uma doce surpresa feita só para você</p>
          <HistoriaChocolatesSection
            module={data.modules.chocolates}
            senderName={data.senderName}
            receiverName={data.receiverName}
          />
        </RevealSection>
      )}

      {/* Máquina de surpresas */}
      {data.modules?.slot && data.modules.slot.surprises.length > 0 && (
        <RevealSection
          scrapbookSection="slot"
          className="hp-slot-module"
        >
          <h2 className="hp-section-title">Máquina de Surpresas</h2>
          <p className="hp-section-sub">Gire e descubra o que te espera</p>
          <HistoriaSlotSection
            module={data.modules.slot}
            senderName={data.senderName}
            receiverName={data.receiverName}
          />
        </RevealSection>
      )}

      {/* Star map */}
      {data.starMap?.date && (
        <RevealSection scrapbookSection="stars">
          <h2 className="hp-section-title">O céu naquela noite</h2>
          <p className="hp-section-sub">O céu na noite em que tudo começou</p>
          <div className="hp-stars">
            <StarField />
            <div className="hp-stars-label">
              <h3>{formatRelationshipDate(data.starMap.date)}</h3>
              {data.starMap.city && <p>{data.starMap.city}</p>}
            </div>
          </div>
        </RevealSection>
      )}

      {/* Map */}
      {data.place?.name && mapQuery && (
        <RevealSection scrapbookSection="map">
          <h2 className="hp-section-title">Nosso lugar</h2>
          <div className="hp-map-wrap">
            <iframe
              title="Mapa"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&z=15&output=embed`}
            />
          </div>
          <div className="hp-place-info">
            <p className="hp-place-name">{data.place.name}</p>
            {data.place.description && (
              <p className="hp-section-sub" style={{ marginTop: "0.75rem" }}>
                {data.place.description}
              </p>
            )}
          </div>
        </RevealSection>
      )}

      {/* Facts */}
      {hasFacts && (
        <RevealSection scrapbookSection="facts">
          <h2 className="hp-section-title">Fatos do casal</h2>
          <div className="hp-facts-grid">
            {data.facts?.howWeMet && (
              <div className="hp-fact-card">
                <div className="hp-fact-icon">💑</div>
                <div className="hp-fact-label">Como nos conhecemos</div>
                <p className="hp-fact-value">{data.facts.howWeMet}</p>
              </div>
            )}
            {data.facts?.favoriteMovie && (
              <div className="hp-fact-card">
                <div className="hp-fact-icon">🎬</div>
                <div className="hp-fact-label">Filme favorito</div>
                <p className="hp-fact-value">{data.facts.favoriteMovie}</p>
              </div>
            )}
            {data.facts?.favoriteFood && (
              <div className="hp-fact-card">
                <div className="hp-fact-icon">🍕</div>
                <div className="hp-fact-label">Comida favorita</div>
                <p className="hp-fact-value">{data.facts.favoriteFood}</p>
              </div>
            )}
            {data.facts?.dreamDestination && (
              <div className="hp-fact-card">
                <div className="hp-fact-icon">✈️</div>
                <div className="hp-fact-label">Destino dos sonhos</div>
                <p className="hp-fact-value">{data.facts.dreamDestination}</p>
              </div>
            )}
            {data.facts?.insideJoke && (
              <div className="hp-fact-card">
                <div className="hp-fact-icon">😂</div>
                <div className="hp-fact-label">Piada interna</div>
                <p className="hp-fact-value">{data.facts.insideJoke}</p>
              </div>
            )}
            {data.facts?.lovesAboutYou && (
              <div className="hp-fact-card">
                <div className="hp-fact-icon">🌟</div>
                <div className="hp-fact-label">
                  O que {data.senderName} ama em {data.receiverName}
                </div>
                <p className="hp-fact-value">{data.facts.lovesAboutYou}</p>
              </div>
            )}
            {data.facts?.lovesAboutThem && (
              <div className="hp-fact-card">
                <div className="hp-fact-icon">💫</div>
                <div className="hp-fact-label">
                  O que {data.receiverName} ama em {data.senderName}
                </div>
                <p className="hp-fact-value">{data.facts.lovesAboutThem}</p>
              </div>
            )}
          </div>
        </RevealSection>
      )}

      {/* Footer */}
      <footer className="hp-footer hp-footer--scrapbook">
        <ScrapbookSpread section="footer" variant="auto">
          <p className="hp-footer-brand">Akaiito</p>
          <p className="hp-footer-phrase">
            {data.footerPhrase ||
              `Feito com amor por ${data.senderName}`}
          </p>
          {shareUrl && !preview && (
            <button type="button" className="hp-share-btn" onClick={copyLink}>
              {copied ? "Link copiado!" : "Compartilhar link"}
            </button>
          )}
        </ScrapbookSpread>
      </footer>

      {hasMusic && embedUrl && !preview && (
        <div className="hp-audio-player">
          <button
            type="button"
            className="hp-audio-btn"
            onClick={() => setAudioOn((v) => !v)}
            aria-label={audioOn ? "Pausar" : "Ouvir música"}
          >
            {audioOn ? "⏸" : "▶"}
          </button>
          <span className="hp-audio-label">
            {data.music?.title || "Nossa música"}
          </span>
        </div>
      )}
    </div>
  );
}
