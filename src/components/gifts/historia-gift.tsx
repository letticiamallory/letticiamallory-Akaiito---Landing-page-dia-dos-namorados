"use client";

import { useEffect, useState } from "react";
import type { HistoriaData } from "@/lib/gift-types";
import { HistoriaPage } from "@/components/historia/HistoriaPage";

export function HistoriaGift({ data, slug }: { data: HistoriaData; slug?: string }) {
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    if (slug && typeof window !== "undefined") {
      setShareUrl(`${window.location.origin}/p/${slug}`);
    }
  }, [slug]);

  return <HistoriaPage data={data} shareUrl={shareUrl || undefined} />;
}
