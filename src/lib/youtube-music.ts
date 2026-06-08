export function parseYouTubeVideoId(raw?: string): string | null {
  if (!raw?.trim()) return null;

  try {
    const url = new URL(raw.trim());

    if (url.hostname.includes("youtu.be")) {
      const id = url.pathname.slice(1).split("/")[0];
      return id || null;
    }

    if (url.hostname.includes("youtube.com")) {
      const fromQuery = url.searchParams.get("v");
      if (fromQuery) return fromQuery;

      const embedMatch = url.pathname.match(/\/embed\/([^/?]+)/);
      if (embedMatch?.[1]) return embedMatch[1];

      const shortsMatch = url.pathname.match(/\/shorts\/([^/?]+)/);
      if (shortsMatch?.[1]) return shortsMatch[1];
    }
  } catch {
    return null;
  }

  return null;
}

export function isYouTubeMusicUrl(raw?: string): boolean {
  return Boolean(parseYouTubeVideoId(raw));
}

export function normalizeYouTubeWatchUrl(raw?: string): string | null {
  const videoId = parseYouTubeVideoId(raw);
  return videoId ? `https://www.youtube.com/watch?v=${videoId}` : null;
}

export function getYouTubeEmbedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}`;
}
