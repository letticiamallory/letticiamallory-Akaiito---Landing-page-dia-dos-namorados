import { notFound, redirect } from "next/navigation";
import { getGiftBySlug } from "@/lib/gifts";
import { parseGiftData } from "@/lib/gift-types";
import { isScrapbookPresentData } from "@/lib/builder/types";
import { ScrapbookPresentGift } from "@/components/gifts/scrapbook-present-gift";
import type { HistoriaData } from "@/lib/gift-types";
import { HistoriaGift } from "@/components/gifts/historia-gift";
import { DEMO_PRESENT, DEMO_PRESENT_SLUG } from "@/data/demo-present";

export default async function PresentePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  if (slug === DEMO_PRESENT_SLUG) {
    return <ScrapbookPresentGift data={DEMO_PRESENT} slug={slug} />;
  }

  const gift = await getGiftBySlug(slug);

  if (!gift || gift.status !== "paid") notFound();

  const data = parseGiftData(gift.data);

  if (isScrapbookPresentData(data)) {
    return <ScrapbookPresentGift data={data} slug={slug} />;
  }

  if (gift.productId === "historia") {
    return <HistoriaGift data={data as HistoriaData} slug={slug} />;
  }

  redirect(`/p/${slug}`);
}
