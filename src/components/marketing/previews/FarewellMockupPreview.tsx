"use client";

import { useEffect, useRef, useState } from "react";
import type { CustomMessageData } from "@/lib/builder/types";
import { MockupShell } from "../MockupShell";

const DEMO_DATA: CustomMessageData = {
  title: "Para sempre",
  body: "Obrigado por fazer parte da minha história.",
  ctaText: "Te amo ♡",
};

function FarewellLoopCard({ active }: { active: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [len, setLen] = useState(0);
  const body = DEMO_DATA.body;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!active || !visible || !body.trim()) {
      setLen(0);
      return;
    }

    let cancelled = false;
    let intervalId = 0;

    const type = () => {
      setLen(0);
      let i = 0;
      intervalId = window.setInterval(() => {
        if (cancelled) return;
        i += 1;
        setLen(i);
        if (i >= body.length) window.clearInterval(intervalId);
      }, 30);
    };

    const erase = () => {
      window.clearInterval(intervalId);
      let i = body.length;
      intervalId = window.setInterval(() => {
        if (cancelled) return;
        i -= 1;
        setLen(Math.max(0, i));
        if (i <= 0) window.clearInterval(intervalId);
      }, 18);
    };

    type();
    const pauseTimer = window.setTimeout(erase, body.length * 30 + 2000);

    const loopTimer = window.setInterval(() => {
      type();
      window.setTimeout(erase, body.length * 30 + 2000);
    }, body.length * 30 + 2000 + body.length * 18 + 800);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
      window.clearTimeout(pauseTimer);
      window.clearTimeout(loopTimer);
    };
  }, [active, visible, body]);

  return (
    <div ref={ref}>
      <div className="panda-farewell">
        <div className="panda-farewell__stage">
          <svg
            className="panda-farewell__heart"
            viewBox="100 56 802 785"
            preserveAspectRatio="xMidYMid meet"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
          >
            <path
              d="M150.349 329.595C107.178 488.981 216.51 609.761 292.792 712.024C319.71 748.111 345.793 782.286 378.718 791.204C411.643 800.122 451.408 783.783 492.86 766.216C610.326 716.432 765.669 667.341 808.841 507.956C852.013 348.569 701.538 186.484 511.879 299.587C405.229 106.225 193.521 170.208 150.349 329.595Z"
              fill="#4E1C16"
            />
          </svg>
          <div className="panda-farewell__heart-text" aria-label="Mensagem final">
            <p className="panda-farewell__body">{body.slice(0, len)}</p>
            {DEMO_DATA.ctaText?.trim() && len >= body.length && (
              <p className="panda-farewell__sign">{DEMO_DATA.ctaText}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function FarewellMockupPreview({ active }: { active: boolean }) {
  return (
    <MockupShell center>
      <FarewellLoopCard active={active} />
    </MockupShell>
  );
}
