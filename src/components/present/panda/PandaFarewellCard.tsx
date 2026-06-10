"use client";

import { useEffect, useRef, useState } from "react";
import type { CustomMessageData } from "@/lib/builder/types";
import { clampCustomMessageBody, clampCustomMessageCta } from "@/lib/custom-message";

const HEART_PATH =
  "M150.349 329.595C107.178 488.981 216.51 609.761 292.792 712.024C319.71 748.111 345.793 782.286 378.718 791.204C411.643 800.122 451.408 783.783 492.86 766.216C610.326 716.432 765.669 667.341 808.841 507.956C852.013 348.569 701.538 186.484 511.879 299.587C405.229 106.225 193.521 170.208 150.349 329.595Z";

export function PandaFarewellCard({ data }: { data: CustomMessageData }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [len, setLen] = useState(0);
  const body = clampCustomMessageBody(data.body);
  const ctaText = data.ctaText ? clampCustomMessageCta(data.ctaText) : data.ctaText;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.35 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || !body.trim()) return;
    setLen(0);
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setLen(i);
      if (i >= body.length) window.clearInterval(id);
    }, 30);
    return () => window.clearInterval(id);
  }, [visible, body]);

  if (!body.trim()) return null;

  return (
    <div className="panda-farewell" ref={ref}>
      <div className="panda-farewell__stage">
        <svg
          className="panda-farewell__heart"
          viewBox="100 56 802 785"
          preserveAspectRatio="xMidYMid meet"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <path d={HEART_PATH} fill="#4E1C16" />
        </svg>
        <div className="panda-farewell__heart-text" aria-label="Mensagem final">
          <p className="panda-farewell__body">{body.slice(0, len)}</p>
          {ctaText?.trim() && (
            <p className="panda-farewell__sign">{ctaText}</p>
          )}
        </div>
      </div>
    </div>
  );
}
