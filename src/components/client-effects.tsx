"use client";

import { useEffect } from "react";

export function FadeUpObserver() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("in");
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll(".fade-up").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return null;
}

export function NavScroll() {
  useEffect(() => {
    const navEl = document.querySelector("nav");
    if (!navEl) return;

    const onScroll = () => {
      if (window.scrollY > 80) {
        (navEl as HTMLElement).style.background = "rgba(13,10,11,0.95)";
        (navEl as HTMLElement).style.backdropFilter = "blur(12px)";
        (navEl as HTMLElement).style.borderBottom = "1px solid rgba(255,255,255,0.06)";
      } else {
        (navEl as HTMLElement).style.background =
          "linear-gradient(to bottom,rgba(13,10,11,0.9) 0%,transparent 100%)";
        (navEl as HTMLElement).style.backdropFilter = "none";
        (navEl as HTMLElement).style.borderBottom = "none";
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return null;
}
