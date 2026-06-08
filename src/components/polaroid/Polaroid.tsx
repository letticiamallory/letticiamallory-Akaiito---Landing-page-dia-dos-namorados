"use client";

import { motion } from "framer-motion";
import {
  POLAROID_FRAME,
  POLAROID_FRAME_VB,
  POLAROID_PHOTO_RECT,
} from "@/data/polaroid-assets";

export function Polaroid({
  photoUrl,
  label,
  rotation = 0,
  finalX,
  finalY,
  delay = 0,
  preview = false,
}: {
  photoUrl?: string;
  label?: string;
  rotation?: number;
  finalX: number;
  finalY: number;
  delay?: number;
  preview?: boolean;
}) {
  const photoStyle = {
    left: `${(POLAROID_PHOTO_RECT.x / POLAROID_FRAME_VB.w) * 100}%`,
    top: `${(POLAROID_PHOTO_RECT.y / POLAROID_FRAME_VB.h) * 100}%`,
    width: `${(POLAROID_PHOTO_RECT.w / POLAROID_FRAME_VB.w) * 100}%`,
    height: `${(POLAROID_PHOTO_RECT.h / POLAROID_FRAME_VB.h) * 100}%`,
  };

  return (
    <motion.div
      className="polaroid-card"
      initial={preview ? false : { y: 200, x: "-50%", opacity: 0, rotate: 0, filter: "blur(10px)" }}
      animate={
        preview
          ? {
              y: finalY,
              x: `calc(-50% + ${finalX}px)`,
              opacity: 1,
              rotate: rotation,
              filter: "blur(0px)",
            }
          : {
              y: finalY,
              x: `calc(-50% + ${finalX}px)`,
              opacity: 1,
              rotate: rotation,
              filter: "blur(0px)",
            }
      }
      transition={
        preview
          ? { duration: 0 }
          : {
              type: "spring",
              stiffness: 120,
              damping: 18,
              delay,
            }
      }
    >
      <div style={{ position: "relative" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={POLAROID_FRAME} alt="" className="polaroid-card-frame" draggable={false} />
        {photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photoUrl} alt="" className="polaroid-card-photo" style={photoStyle} draggable={false} />
        ) : (
          <div
            className="polaroid-card-photo"
            style={{
              ...photoStyle,
              background: "linear-gradient(135deg, #facac9, #f29f9f)",
            }}
          />
        )}
        {label && <p className="polaroid-card-label">{label}</p>}
      </div>
    </motion.div>
  );
}
