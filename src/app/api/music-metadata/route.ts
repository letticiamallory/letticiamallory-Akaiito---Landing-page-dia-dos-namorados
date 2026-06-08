import { NextRequest, NextResponse } from "next/server";
import { fetchMusicMetadata, isYouTubeMusicUrl } from "@/lib/music-metadata";

export async function GET(req: NextRequest) {
  const url = new URL(req.url).searchParams.get("url");
  if (!url?.trim()) {
    return NextResponse.json({ error: "Informe o link do YouTube." }, { status: 400 });
  }

  if (!isYouTubeMusicUrl(url)) {
    return NextResponse.json({ error: "Use um link válido do YouTube." }, { status: 400 });
  }

  const metadata = await fetchMusicMetadata(url);
  if (!metadata) {
    return NextResponse.json({ error: "Não foi possível carregar essa faixa do YouTube." }, { status: 404 });
  }

  return NextResponse.json(metadata);
}
