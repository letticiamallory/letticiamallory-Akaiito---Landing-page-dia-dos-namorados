"use client";

import type { ReactNode } from "react";

import "@/components/present/panda/card-material.css";
import "@/components/present/panda/scrapbook-cards.css";
import "./mockup-panda-lite.css";
import "./mockup-preview.css";

export function MockupShell({
  children,
  className = "",
  center = false,
}: {
  children: ReactNode;
  className?: string;
  center?: boolean;
}) {
  return (
    <div
      className={[
        "mockup-shell",
        "panda-present",
        "collage-page",
        center && "mockup-shell--center",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="mockup-shell__inner">{children}</div>
    </div>
  );
}
