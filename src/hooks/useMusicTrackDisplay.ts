"use client";

import { useEffect, useState } from "react";
import type { FavoriteSongData } from "@/lib/builder/types";
import {
  normalizeMusicPageUrl,
  parseYouTubeVideoId,
  resolveMusicDisplay,
  type MusicMetadata,
} from "@/lib/music-metadata";

export function useMusicTrackDisplay(data: FavoriteSongData) {
  const [fetched, setFetched] = useState<MusicMetadata | null>(null);
  const videoId = parseYouTubeVideoId(data.embedUrl) ?? fetched?.videoId ?? null;

  useEffect(() => {
    const pageUrl = normalizeMusicPageUrl(data.embedUrl);
    if (!pageUrl) {
      setFetched(null);
      return;
    }

    let cancelled = false;

    fetch(`/api/music-metadata?url=${encodeURIComponent(pageUrl)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((json: MusicMetadata | null) => {
        if (!cancelled && json?.songTitle) setFetched(json);
      })
      .catch(() => {
        if (!cancelled) setFetched(null);
      });

    return () => {
      cancelled = true;
    };
  }, [data.embedUrl]);

  return {
    ...resolveMusicDisplay(data, fetched),
    videoId,
    embedUrl: fetched?.embedUrl,
  };
}
