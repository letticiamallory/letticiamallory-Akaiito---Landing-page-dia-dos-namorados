"use client";

import { useCallback, useState } from "react";
import { CAMERA_GIFT_ARROW } from "@/lib/camera-assets";
import { getCachedGiftBoxMarkup } from "@/lib/present-preload";
import "./gift-box.css";

export interface GiftBoxProps {
  compact?: boolean;
  /** Controlado externamente */
  isOpen?: boolean;
  onOpen?: () => void;
}

export function GiftBox({ compact = false, isOpen: isOpenProp, onOpen }: GiftBoxProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const markup = getCachedGiftBoxMarkup();

  const isOpen = isOpenProp ?? internalOpen;

  const handleOpen = useCallback(() => {
    if (isOpen) return;
    setInternalOpen(true);
    onOpen?.();
  }, [isOpen, onOpen]);

  return (
    <div
      className={[
        "gift-box",
        compact && "gift-box--compact",
        isOpen && "gift-box--open",
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={!isOpen ? handleOpen : undefined}
      onKeyDown={
        !isOpen
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleOpen();
              }
            }
          : undefined
      }
      role={!isOpen ? "button" : undefined}
      tabIndex={!isOpen ? 0 : undefined}
      aria-label={!isOpen ? "Clique para abrir o presente" : undefined}
    >
      <div className="gift-box__stage">
        {!isOpen && (
          <div className="gift-box__open-hint" aria-hidden>
            <span className="gift-box__open-label">abra a caixa</span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={CAMERA_GIFT_ARROW}
              alt=""
              className="gift-box__open-arrow"
              draggable={false}
            />
          </div>
        )}
        <div className="gift-box__viewport">
          <div
            className="gift-box__svg"
            aria-hidden={!markup}
            dangerouslySetInnerHTML={markup ? { __html: markup } : undefined}
          />
        </div>
      </div>
    </div>
  );
}
