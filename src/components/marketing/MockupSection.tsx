"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { MockupPlaceholder } from "./PhoneMockup";

export function MockupSection({ children }: { children: (active: boolean) => ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: "120px 0px", threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="mockup-section">
      {visible ? children(true) : <MockupPlaceholder />}
    </div>
  );
}
