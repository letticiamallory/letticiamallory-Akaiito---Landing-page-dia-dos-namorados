"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { GiftBox } from "@/components/present/camera/GiftBox";
import { CameraPolaroidPeek } from "@/components/present/camera/CameraPolaroidPeek";
import {
  PHOTO1_FRAMES,
  PHOTO1_SETTLED,
  PHOTO2_DELAY_MS,
  PHOTO2_FRAMES,
} from "@/components/present/camera/camera-sequence";
import { CAMERA_FLASH, CAMERA_CLICK_ARROW, CAMERA_CLICK_LABEL, CAMERA_READY } from "@/lib/camera-assets";
import { vibrate } from "@/hooks/useScreenSequence";
import "@/components/present/camera/camera-stage.css";

export type CameraExperiencePhase =
  | "gift"
  | "gift-open"
  | "gift-exit"
  | "camera"
  | "camera-flashing"
  | "polaroid-float"
  | "polaroid2-float";

export interface ValentinePhoto {
  url: string;
  label?: string;
}

export function ValentineCameraExperience({
  compact = false,
  photos = [],
  autoPlay = false,
  frozenPhase,
}: {
  photos?: ValentinePhoto[];
  compact?: boolean;
  /** Marketing mockup — sequência automática em loop */
  autoPlay?: boolean;
  /** Estado fixo para print/mockup estático */
  frozenPhase?: CameraExperiencePhase;
}) {
  const [phase, setPhase] = useState<CameraExperiencePhase>(frozenPhase ?? "gift");
  const giftOpenTimer = useRef<number | null>(null);
  const giftExitTimer = useRef<number | null>(null);
  const flashTimer = useRef<number | null>(null);
  const photo2Timer = useRef<number | null>(null);
  const restartTimer = useRef<number | null>(null);
  const autoStartedRef = useRef(false);

  const primaryPhoto = photos[0];
  const secondaryPhoto = photos[1];
  const hasSecondPhoto = photos.length >= 2;

  const resetSequence = useCallback(() => {
    autoStartedRef.current = false;
    setPhase("gift");
  }, []);

  const clearTimers = useCallback(() => {
    for (const t of [giftOpenTimer, giftExitTimer, flashTimer, photo2Timer, restartTimer]) {
      if (t.current !== null) {
        window.clearTimeout(t.current);
        t.current = null;
      }
    }
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  useEffect(() => {
    if (frozenPhase) return;
    if (phase !== "polaroid-float" || !hasSecondPhoto) return;
    photo2Timer.current = window.setTimeout(() => {
      setPhase("polaroid2-float");
    }, PHOTO2_DELAY_MS);
    return () => {
      if (photo2Timer.current !== null) {
        window.clearTimeout(photo2Timer.current);
        photo2Timer.current = null;
      }
    };
  }, [phase, hasSecondPhoto]);

  const handleGiftOpen = useCallback(() => {
    setPhase("gift-open");
    giftOpenTimer.current = window.setTimeout(() => {
      setPhase("gift-exit");
      giftExitTimer.current = window.setTimeout(() => {
        setPhase("camera");
      }, 450);
    }, 1100);
  }, []);

  const handleCameraClick = useCallback(() => {
    if (phase !== "camera") return;
    vibrate(12);
    setPhase("camera-flashing");
    flashTimer.current = window.setTimeout(() => {
      setPhase("polaroid-float");
    }, 420);
  }, [phase]);

  useEffect(() => {
    if (frozenPhase || !autoPlay) return;

    if (phase === "gift" && !autoStartedRef.current) {
      autoStartedRef.current = true;
      giftOpenTimer.current = window.setTimeout(handleGiftOpen, 700);
      return;
    }

    if (phase === "camera") {
      giftOpenTimer.current = window.setTimeout(handleCameraClick, 900);
      return;
    }

    const finalPhase = hasSecondPhoto ? "polaroid2-float" : "polaroid-float";
    if (phase === finalPhase) {
      restartTimer.current = window.setTimeout(resetSequence, 1500);
    }
  }, [autoPlay, phase, hasSecondPhoto, handleGiftOpen, handleCameraClick, resetSequence]);

  useEffect(() => {
    if (frozenPhase || autoPlay) return;
    autoStartedRef.current = false;
    clearTimers();
  }, [autoPlay, clearTimers]);

  const activePhase = frozenPhase ?? phase;
  const showGift =
    activePhase === "gift" || activePhase === "gift-open" || activePhase === "gift-exit";
  const giftIsOpen = phase !== "gift";
  const showFirstPolaroid =
    phase === "polaroid-float" || phase === "polaroid2-float";
  const showSecondPolaroid = phase === "polaroid2-float" && hasSecondPhoto;
  const inPolaroidSequence = showFirstPolaroid;

  const showCameraStack =
    phase === "camera" || phase === "camera-flashing" || inPolaroidSequence;

  const canClickCamera = phase === "camera";
  const isFlashing = phase === "camera-flashing";
  const cameraSrc =
    phase === "camera-flashing" ? CAMERA_FLASH : CAMERA_READY;

  return (
    <div className={["cam-stage", compact && "cam-stage--compact"].filter(Boolean).join(" ")}>
      {showGift && (
        <div
          className={[
            "cam-stage__layer",
            "cam-stage__layer--gift",
            activePhase === "gift-exit" && "cam-stage__layer--gift-exit",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <GiftBox compact={compact} isOpen={giftIsOpen} onOpen={handleGiftOpen} />
        </div>
      )}

      {showCameraStack && (
        <div
          className={[
            "cam-stage__layer",
            "cam-stage__layer--camera",
            inPolaroidSequence && "cam-stage__layer--camera-fired",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <div className="cam-stage__stack">
            {showFirstPolaroid && (
              <CameraPolaroidPeek
                photoUrl={primaryPhoto?.url}
                label={primaryPhoto?.label}
                frame={
                  activePhase === "polaroid2-float"
                    ? PHOTO1_SETTLED
                    : PHOTO1_FRAMES["polaroid-float"]
                }
                animateIn={!frozenPhase && activePhase === "polaroid-float"}
              />
            )}

            {showSecondPolaroid && (
              <CameraPolaroidPeek
                photoUrl={secondaryPhoto?.url}
                label={secondaryPhoto?.label}
                frame={PHOTO2_FRAMES["polaroid2-float"]}
                animateIn={!frozenPhase}
              />
            )}

            <button
              type="button"
              className="cam-stage__camera-btn cam-stage__camera-btn--front"
              onClick={handleCameraClick}
              disabled={!canClickCamera}
              aria-label={canClickCamera ? "Clique para tirar foto" : undefined}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={cameraSrc}
                alt=""
                className={[
                  "cam-stage__camera-img",
                  isFlashing && "cam-stage__camera-img--flashing",
                ]
                  .filter(Boolean)
                  .join(" ")}
                draggable={false}
              />
            </button>

            {canClickCamera && (
              <div className="cam-stage__click-hint" aria-hidden>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={CAMERA_CLICK_ARROW}
                  alt=""
                  className="cam-stage__click-arrow"
                  draggable={false}
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={CAMERA_CLICK_LABEL}
                  alt=""
                  className="cam-stage__click-label"
                  draggable={false}
                />
              </div>
            )}
          </div>

          {isFlashing && (
            <>
              <div className="cam-stage__flash cam-stage__flash--burst" aria-hidden />
              <div className="cam-stage__flash cam-stage__flash--white" aria-hidden />
            </>
          )}
        </div>
      )}
    </div>
  );
}
