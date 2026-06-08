"use client";

import { useEffect, useState } from "react";
import { POLAROID_FRAME, valentineAssetUrls } from "@/data/polaroid-assets";

export function usePreloadAssets(extra: string[] = []) {
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const urls = [...valentineAssetUrls(), POLAROID_FRAME, ...extra];
    let loaded = 0;

    const promises = urls.map(
      (url) =>
        new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = () => {
            loaded += 1;
            setProgress(Math.round((loaded / urls.length) * 100));
            resolve();
          };
          img.onerror = () => {
            loaded += 1;
            setProgress(Math.round((loaded / urls.length) * 100));
            resolve();
          };
          img.src = url;
        })
    );

    Promise.all(promises).then(() => setReady(true));
  }, [extra]);

  return { ready, progress };
}
