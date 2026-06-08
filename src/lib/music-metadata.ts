import {
  getYouTubeEmbedUrl,
  isYouTubeMusicUrl,
  normalizeYouTubeWatchUrl,
  parseYouTubeVideoId,
} from "@/lib/youtube-music";

export type MusicDisplay = {
  songTitle: string;
  artistName: string;
};

export type MusicMetadata = MusicDisplay & {
  videoId: string;
  embedUrl: string;
};

export function normalizeMusicPageUrl(raw?: string): string | null {
  return normalizeYouTubeWatchUrl(raw);
}

export { isYouTubeMusicUrl, parseYouTubeVideoId };

export async function fetchMusicMetadata(rawUrl: string): Promise<MusicMetadata | null> {
  const pageUrl = normalizeYouTubeWatchUrl(rawUrl);
  const videoId = parseYouTubeVideoId(rawUrl);
  if (!pageUrl || !videoId) return null;

  try {
    const endpoint = `https://www.youtube.com/oembed?url=${encodeURIComponent(pageUrl)}&format=json`;
    const res = await fetch(endpoint, {
      headers: { Accept: "application/json" },
      next: { revalidate: 86400 },
    });

    if (!res.ok) return null;

    const data = (await res.json()) as { title?: string; author_name?: string };
    const songTitle = data.title?.trim();
    if (!songTitle) return null;

    return {
      songTitle,
      artistName: data.author_name?.trim() ?? "",
      videoId,
      embedUrl: getYouTubeEmbedUrl(videoId),
    };
  } catch {
    return null;
  }
}

export function resolveMusicDisplay(
  data: { songTitle?: string; artistName?: string; embedUrl?: string },
  fetched?: MusicMetadata | null
): MusicDisplay {
  const userTitle = data.songTitle?.trim();
  const userArtist = data.artistName?.trim();

  return {
    songTitle: userTitle || fetched?.songTitle?.trim() || "Nossa música",
    artistName: userArtist || fetched?.artistName?.trim() || "",
  };
}
