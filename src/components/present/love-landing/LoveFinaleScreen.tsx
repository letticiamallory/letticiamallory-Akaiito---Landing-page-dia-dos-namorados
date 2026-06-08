"use client";

import { useEffect, useRef, useState } from "react";
import type { CustomMessageData } from "@/lib/builder/types";

export function LoveFinaleScreen({ data }: { data: CustomMessageData }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [len, setLen] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || !data.body.trim()) return;
    setLen(0);
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setLen(i);
      if (i >= data.body.length) window.clearInterval(id);
    }, 32);
    return () => window.clearInterval(id);
  }, [visible, data.body]);

  if (!data.body.trim()) return null;

  return (
    <div className="love-finale" ref={ref}>
      <div className="love-finale__glow" aria-hidden />
      {data.title && <h2 className="love-finale__title">{data.title}</h2>}
      <p className="love-finale__body">{data.body.slice(0, len)}</p>
      {data.ctaText && <span className="love-finale__sign">{data.ctaText}</span>}
      <span className="love-finale__heart" aria-hidden>
        ♥
      </span>
    </div>
  );
}
