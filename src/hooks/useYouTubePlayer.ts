"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type YTPlayerInstance = {
  playVideo: () => void;
  pauseVideo: () => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  getPlayerState: () => number;
  destroy: () => void;
};

declare global {
  interface Window {
    YT?: {
      Player: new (
        element: HTMLElement,
        config: {
          height: string;
          width: string;
          videoId: string;
          playerVars?: Record<string, number | string>;
          events?: {
            onReady?: (event: { target: YTPlayerInstance }) => void;
            onStateChange?: (event: { data: number }) => void;
          };
        }
      ) => YTPlayerInstance;
      PlayerState: {
        PLAYING: number;
        PAUSED: number;
        ENDED: number;
        BUFFERING: number;
      };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

let youtubeApiPromise: Promise<NonNullable<typeof window.YT>> | null = null;

function loadYouTubeIframeApi(): Promise<NonNullable<typeof window.YT>> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("YouTube API unavailable on server"));
  }

  if (window.YT?.Player) {
    return Promise.resolve(window.YT);
  }

  if (!youtubeApiPromise) {
    youtubeApiPromise = new Promise((resolve, reject) => {
      const previousReady = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        previousReady?.();
        if (window.YT?.Player) resolve(window.YT);
        else reject(new Error("YouTube API failed to load"));
      };

      if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
        const script = document.createElement("script");
        script.src = "https://www.youtube.com/iframe_api";
        script.async = true;
        script.onerror = () => reject(new Error("YouTube API script failed"));
        document.head.appendChild(script);
      }
    });
  }

  return youtubeApiPromise;
}

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const total = Math.floor(seconds);
  const mins = Math.floor(total / 60);
  const secs = total % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function useYouTubePlayer(videoId?: string) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayerInstance | null>(null);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentLabel, setCurrentLabel] = useState("0:00");
  const [remainingLabel, setRemainingLabel] = useState("-0:00");

  const destroyPlayer = useCallback(() => {
    playerRef.current?.destroy();
    playerRef.current = null;
    setReady(false);
    setPlaying(false);
    setProgress(0);
    setCurrentLabel("0:00");
    setRemainingLabel("-0:00");
  }, []);

  useEffect(() => {
    if (!videoId || !containerRef.current) {
      destroyPlayer();
      return;
    }

    let cancelled = false;
    setReady(false);
    setPlaying(false);

    loadYouTubeIframeApi()
      .then((YT) => {
        if (cancelled || !containerRef.current) return;

        destroyPlayer();
        containerRef.current.innerHTML = "";

        playerRef.current = new YT.Player(containerRef.current, {
          height: "1",
          width: "1",
          videoId,
          playerVars: {
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            fs: 0,
            iv_load_policy: 3,
            modestbranding: 1,
            playsinline: 1,
            rel: 0,
            origin: typeof window !== "undefined" ? window.location.origin : "",
          },
          events: {
            onReady: () => {
              if (!cancelled) setReady(true);
            },
            onStateChange: (event) => {
              const isPlaying = event.data === YT.PlayerState.PLAYING;
              setPlaying(isPlaying);
              if (event.data === YT.PlayerState.ENDED) {
                setProgress(0);
                setCurrentLabel("0:00");
              }
            },
          },
        });
      })
      .catch(() => {
        if (!cancelled) destroyPlayer();
      });

    return () => {
      cancelled = true;
      destroyPlayer();
    };
  }, [videoId, destroyPlayer]);

  useEffect(() => {
    if (!ready) return;

    const tick = () => {
      const player = playerRef.current;
      const YT = window.YT;
      if (!player || !YT) return;

      const state = player.getPlayerState();
      const { PLAYING, PAUSED, ENDED, BUFFERING } = YT.PlayerState;
      const isPlaying = state === PLAYING;
      const isBuffering = state === BUFFERING;

      setPlaying(isPlaying);

      if (state === ENDED) {
        setProgress(0);
        setCurrentLabel("0:00");
        const duration = player.getDuration();
        setRemainingLabel(
          duration > 0 ? `-${formatTime(duration)}` : "-0:00"
        );
        return;
      }

      const current = player.getCurrentTime();
      const duration = player.getDuration();
      if (!Number.isFinite(current) || !duration || duration <= 0) return;

      if (isPlaying || isBuffering || state === PAUSED) {
        setProgress(Math.min(1, Math.max(0, current / duration)));
        setCurrentLabel(formatTime(current));
        setRemainingLabel(`-${formatTime(Math.max(0, duration - current))}`);
      }
    };

    tick();
    const interval = window.setInterval(tick, 200);
    return () => window.clearInterval(interval);
  }, [ready]);

  const play = useCallback(() => {
    if (!ready || !playerRef.current) return;
    playerRef.current.playVideo();
  }, [ready]);

  const pause = useCallback(() => {
    if (!ready || !playerRef.current) return;
    playerRef.current.pauseVideo();
  }, [ready]);

  const togglePlay = useCallback(() => {
    if (playing) pause();
    else play();
  }, [playing, play, pause]);

  return {
    containerRef,
    ready,
    playing,
    progress,
    currentLabel,
    remainingLabel,
    play,
    pause,
    togglePlay,
  };
}
