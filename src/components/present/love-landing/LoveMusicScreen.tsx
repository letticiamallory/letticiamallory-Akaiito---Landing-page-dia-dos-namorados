"use client";

import { useEffect, useRef, useState } from "react";
import type { FavoriteSongData } from "@/lib/builder/types";
import { getEmbedUrl } from "@/lib/love-present";
import { MusicPolaroidHang } from "@/components/present/collage/MusicPolaroidHang";
import type { MusicPolaroidPair } from "@/lib/music-section-assets";
import "@/components/present/collage/music-polaroid.css";

export function LoveMusicScreen({
  data,
  couplePhoto,
}: {
  data: FavoriteSongData;
  couplePhoto?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const embedUrl = getEmbedUrl(data.embedUrl);

  const polaroids: MusicPolaroidPair = {
    left: {
      photoUrl: data.polaroidLeftPhoto || couplePhoto,
      caption: data.polaroidLeftCaption,
    },
    right: {
      photoUrl: data.polaroidRightPhoto || couplePhoto,
      caption: data.polaroidRightCaption,
    },
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setPlaying(entry.isIntersecting),
      { threshold: 0.35 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  if (!data.songTitle && !data.artistName && !embedUrl) return null;

  return (
    <div className="love-music" ref={ref}>
      <MusicPolaroidHang polaroids={polaroids} />

      <div className="love-music__player">
        <div className={`love-music__disc${playing ? " love-music__disc--spin" : ""}`}>
          <div className="love-music__disc-cover">
            {couplePhoto ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={couplePhoto} alt="" />
            ) : (
              <span aria-hidden>♪</span>
            )}
          </div>
        </div>

        <div className="love-music__meta">
          {data.songTitle && <p className="love-music__title">{data.songTitle}</p>}
          {data.artistName && <p className="love-music__artist">{data.artistName}</p>}
          {data.note && <p className="love-music__note">{data.note}</p>}
        </div>

        {embedUrl && (
          <div className="love-music__embed">
            <iframe src={embedUrl} title="Música" loading="lazy" allow="autoplay; encrypted-media" />
          </div>
        )}
      </div>
    </div>
  );
}
