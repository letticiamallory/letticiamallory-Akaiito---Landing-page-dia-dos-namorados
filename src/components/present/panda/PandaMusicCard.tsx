"use client";

import { useEffect, useRef } from "react";
import type { FavoriteSongData } from "@/lib/builder/types";
import { useMusicTrackDisplay } from "@/hooks/useMusicTrackDisplay";
import { useYouTubePlayer } from "@/hooks/useYouTubePlayer";

function resolveCoverUrl(data: FavoriteSongData, videoId: string | null): string {
  const uploaded = data.albumCover?.trim();
  if (uploaded) return uploaded;
  if (videoId) return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  return "";
}

export function PandaMusicCard({ data }: { data: FavoriteSongData }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const userPausedRef = useRef(false);
  const { songTitle, videoId } = useMusicTrackDisplay(data);
  const subtitle = data.note?.trim();
  const coverUrl = resolveCoverUrl(data, videoId);
  const { containerRef, ready, playing, progress, currentLabel, remainingLabel, play, pause } =
    useYouTubePlayer(videoId ?? undefined);

  useEffect(() => {
    const el = rootRef.current;
    if (!el || !videoId) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!ready) return;
        if (entry.isIntersecting && !userPausedRef.current) {
          play();
        }
      },
      { threshold: 0.35 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [ready, videoId, play]);

  function handleTogglePlay() {
    if (playing) {
      userPausedRef.current = true;
      pause();
      return;
    }
    userPausedRef.current = false;
    play();
  }

  return (
    <div className="panda-music-card" ref={rootRef}>
      <div ref={containerRef} className="panda-youtube-player-host" aria-hidden />

      <div className="panda-music-card__glass">
        <div className="panda-music-card__cover-wrap">
          {coverUrl ? (
            <img src={coverUrl} alt="" className="panda-music-card__cover" />
          ) : (
            <div className="panda-music-card__cover panda-music-card__cover--placeholder" aria-hidden>
              ♪
            </div>
          )}
        </div>

        <div className="panda-music-card__meta">
          <p className="panda-music-card__title">{songTitle || "Sua música"}</p>
          {subtitle && <p className="panda-music-card__subtitle">{subtitle}</p>}
        </div>

        <div className="panda-music-card__progress">
          {ready && (
            <div className="panda-music-card__times" aria-hidden>
              <span>{currentLabel}</span>
              <span>{remainingLabel}</span>
            </div>
          )}
          <div className="panda-music-card__bar" aria-hidden>
            <span
              className="panda-music-card__fill"
              style={
                ready
                  ? {
                      width: `${progress * 100}%`,
                      transition: playing ? "width 0.2s linear" : "none",
                    }
                  : undefined
              }
            />
          </div>
        </div>

        <div className="panda-music-card__controls">
          <span aria-hidden>⏮</span>
          <button
            type="button"
            className="panda-music-card__play"
            onClick={handleTogglePlay}
            disabled={!videoId || !ready}
            aria-label={playing ? "Pausar música" : "Tocar música"}
          >
            {playing ? "⏸" : "▶"}
          </button>
          <span aria-hidden>⏭</span>
        </div>
      </div>
    </div>
  );
}
