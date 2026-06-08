"use client";

import {
  POLAROID_FRAME_VB,
  POLAROID_PHOTO_RECT,
} from "@/data/valentine-camera-assets";
import { CAMERA_POLAROID_FRAME } from "@/lib/camera-assets";
import {
  SLOT_ANCHOR,
  type EjectKeyframe,
} from "@/components/present/camera/camera-sequence";

const photoWindowStyle = {
  left: `${(POLAROID_PHOTO_RECT.x / POLAROID_FRAME_VB.w) * 100}%`,
  top: `${(POLAROID_PHOTO_RECT.y / POLAROID_FRAME_VB.h) * 100}%`,
  width: `${(POLAROID_PHOTO_RECT.w / POLAROID_FRAME_VB.w) * 100}%`,
  height: `${(POLAROID_PHOTO_RECT.h / POLAROID_FRAME_VB.h) * 100}%`,
};

const CLIP_CLASS: Record<NonNullable<EjectKeyframe["clip"]>, string> = {
  "step-1": "cam-stage__polaroid-clip--step-1",
  "step-2": "cam-stage__polaroid-clip--step-2",
  "step-3": "cam-stage__polaroid-clip--step-3",
  "step-near": "cam-stage__polaroid-clip--step-near",
  "step-full": "cam-stage__polaroid-clip--step-full",
  none: "cam-stage__polaroid-clip--step-out",
};

export function CameraPolaroidPeek({
  photoUrl,
  label,
  frame,
  animateIn = false,
}: {
  photoUrl?: string;
  label?: string;
  frame: EjectKeyframe;
  animateIn?: boolean;
}) {
  const floating = !frame.behindCamera;
  const showLabel = frame.clip !== "step-1";

  const slot = floating
    ? {
        leftPct: frame.floatLeftPct ?? SLOT_ANCHOR.leftPct,
        widthPct: SLOT_ANCHOR.widthPct,
        topPct: frame.floatTopPct ?? -18,
      }
    : SLOT_ANCHOR;

  const tiltClass =
    frame.tilt === "left"
      ? "cam-stage__polaroid--tilt-left"
      : frame.tilt === "right"
        ? "cam-stage__polaroid--tilt-right"
        : null;

  return (
    <div
      className={[
        "cam-stage__polaroid-clip",
        CLIP_CLASS[frame.clip],
        floating && "cam-stage__polaroid-clip--float",
        animateIn && "cam-stage__polaroid-clip--animate-in",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div
        className={[
          "cam-stage__polaroid",
          floating && "cam-stage__polaroid--floating",
          tiltClass,
        ]
          .filter(Boolean)
          .join(" ")}
        style={{
          left: `${slot.leftPct}%`,
          width: `${slot.widthPct}%`,
          top: `${slot.topPct}%`,
          ["--cam-eject-y" as string]: frame.tilt ? "0%" : frame.translateY,
        }}
      >
        <div className="cam-stage__polaroid-inner">
          <div className="cam-stage__polaroid-window" style={photoWindowStyle}>
            {photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={photoUrl}
                alt=""
                className="cam-stage__polaroid-photo"
                draggable={false}
              />
            ) : (
              <div className="cam-stage__polaroid-photo cam-stage__polaroid-photo--placeholder" />
            )}
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={CAMERA_POLAROID_FRAME}
            alt=""
            className="cam-stage__polaroid-frame"
            draggable={false}
          />
          {label ? (
            <p
              className={[
                "cam-stage__polaroid-label",
                showLabel && "cam-stage__polaroid-label--visible",
                floating && "cam-stage__polaroid-label--full",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {label}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
