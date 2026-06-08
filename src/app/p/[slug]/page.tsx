import { notFound } from "next/navigation";
import { getGiftBySlug } from "@/lib/gifts";
import { parseGiftData } from "@/lib/gift-types";
import { isScrapbookPresentData } from "@/lib/builder/types";
import { ScrapbookPresentGift } from "@/components/gifts/scrapbook-present-gift";
import type { HistoriaData } from "@/lib/gift-types";
import { HistoriaGift } from "@/components/gifts/historia-gift";

export default async function PresentePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const gift = await getGiftBySlug(slug);

  if (!gift || gift.status !== "paid") notFound();

  const data = parseGiftData(gift.data);

  if (isScrapbookPresentData(data)) {
    return <ScrapbookPresentGift data={data} slug={slug} />;
  }

  switch (gift.productId) {
    case "historia":
      return <HistoriaGift data={data as HistoriaData} slug={slug} />;
    default:
      notFound();
  }
}
