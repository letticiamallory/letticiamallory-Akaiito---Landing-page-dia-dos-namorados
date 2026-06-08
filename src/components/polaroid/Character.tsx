"use client";

import { motion } from "framer-motion";
import { POLAROID_COLORS } from "@/data/polaroid-assets";

export function Character({ onTap }: { onTap?: () => void }) {
  return (
    <div className="polaroid-character-scene" onClick={onTap} role="presentation">
      <motion.div
        className="polaroid-character-wrap"
        animate={{ scaleY: [1, 1.04, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg viewBox="0 0 200 200" width="200" height="200" aria-hidden>
          {/* corpo */}
          <ellipse cx="100" cy="118" rx="72" ry="68" fill={POLAROID_COLORS.blushMid} />
          <ellipse cx="100" cy="125" rx="48" ry="38" fill={POLAROID_COLORS.blushDark} opacity="0.35" />
          {/* braço esquerdo */}
          <motion.ellipse
            cx="42"
            cy="108"
            rx="22"
            ry="14"
            fill={POLAROID_COLORS.blushMid}
            animate={{ rotate: [-5, 5, -5] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: "60px 108px" }}
          />
          {/* braço direito */}
          <motion.ellipse
            cx="158"
            cy="108"
            rx="22"
            ry="14"
            fill={POLAROID_COLORS.blushMid}
            animate={{ rotate: [5, -5, 5] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: "140px 108px" }}
          />
          {/* olhos */}
          <motion.g
            animate={{ scaleY: [1, 1, 0.05, 1] }}
            transition={{ duration: 4, repeat: Infinity, times: [0, 0.92, 0.94, 1] }}
            style={{ transformOrigin: "100px 88px" }}
          >
            <circle cx="78" cy="88" r="10" fill={POLAROID_COLORS.almostBlack} />
            <circle cx="122" cy="88" r="10" fill={POLAROID_COLORS.almostBlack} />
            <circle cx="81" cy="85" r="3" fill="#fff" />
            <circle cx="125" cy="85" r="3" fill="#fff" />
          </motion.g>
          {/* bochecha */}
          <ellipse cx="68" cy="102" rx="10" ry="6" fill={POLAROID_COLORS.blushButton} opacity="0.5" />
          <ellipse cx="132" cy="102" rx="10" ry="6" fill={POLAROID_COLORS.blushButton} opacity="0.5" />
        </svg>
      </motion.div>
      <p className="mt-8 text-sm tracking-widest uppercase" style={{ color: POLAROID_COLORS.redDark }}>
        Toque para fotografar
      </p>
    </div>
  );
}

export function CharacterHearts({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <>
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.span
          key={i}
          className="polaroid-heart-particle"
          initial={{ opacity: 1, y: 0, x: 90 + i * 8 }}
          animate={{ opacity: 0, y: -80 - i * 12, x: 70 + i * 20 }}
          transition={{ duration: 1.2, delay: i * 0.08 }}
          style={{ left: "50%", top: "38%" }}
        >
          ♡
        </motion.span>
      ))}
    </>
  );
}
