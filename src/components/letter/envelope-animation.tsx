"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { BouquetConfig } from "@/lib/bouquet-catalog";
import type { LetterConfig } from "@/lib/letter-catalog";
import { ENVELOPE_STYLES, SEAL_OVERLAY, envelopeSize } from "@/lib/letter-catalog";
import { BouquetPreview } from "@/components/bouquet/bouquet-preview";
import { EnvelopeImage } from "./envelope-image";
import { WaxSealImage } from "./wax-seal-image";
import { LetterPaper } from "./letter-paper";
import "./envelope-animation.css";

const ENVELOPE_W = 280;

function useTypewriter(text: string, active: boolean, speed = 28) {
  const [display, setDisplay] = useState("");

  useEffect(() => {
    if (!active) {
      setDisplay("");
      return;
    }
    setDisplay("");
    let i = 0;
    const timer = setInterval(() => {
      i += 1;
      setDisplay(text.slice(0, i));
      if (i >= text.length) clearInterval(timer);
    }, speed);
    return () => clearInterval(timer);
  }, [text, active, speed]);

  return display;
}

function LetterContent({
  receiverName,
  senderName,
  message,
  typedMessage,
  isOpen,
}: {
  receiverName: string;
  senderName: string;
  message: string;
  typedMessage: string;
  isOpen: boolean;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scroll = scrollRef.current;
    if (!scroll || !isOpen) return;
    scroll.scrollTop = scroll.scrollHeight;
  }, [typedMessage, isOpen]);

  return (
    <>
      <p className="letter-line letter-line--dear">Querida {receiverName},</p>
      <div ref={scrollRef} className="letter-paper__scroll">
        <div className="letter-line letter-line--message whitespace-pre-wrap">
          {isOpen ? typedMessage : ""}
          {isOpen && typedMessage.length < message.length && (
            <span className="letter-cursor" />
          )}
        </div>
        <p className="letter-line letter-line--sign">
          Com amor,
          <br />
          {senderName}
        </p>
      </div>
    </>
  );
}

export function EnvelopeAnimation({
  config,
  senderName,
  receiverName,
  message,
  bouquet,
  compact = false,
  autoOpen,
  frozenOpen = false,
}: {
  config: LetterConfig;
  senderName: string;
  receiverName: string;
  message: string;
  bouquet?: BouquetConfig;
  /** Card embutido (panda) — mantém proporção do envelope sem esticar */
  compact?: boolean;
  /** Marketing mockup — abre/fecha controlado externamente */
  autoOpen?: boolean;
  /** Print estático — carta aberta com texto completo */
  frozenOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(frozenOpen);
  const envelope = ENVELOPE_STYLES[config.envelopeId];
  const closedSize = envelopeSize(envelope.closedAspect, ENVELOPE_W);
  const openSize = envelopeSize(envelope.openAspect, ENVELOPE_W);
  const boxSize = isOpen ? openSize : closedSize;
  const envelopeFitWidth = compact ? Math.min(ENVELOPE_W, 260) : ENVELOPE_W;
  const sealSize = envelopeFitWidth * SEAL_OVERLAY.sizeRatio;
  const [startTyping, setStartTyping] = useState(frozenOpen);
  const animatedMessage = useTypewriter(message, frozenOpen ? false : startTyping);
  const typedMessage = frozenOpen ? message : animatedMessage;
  const stateClass = isOpen ? "open" : "close";

  useEffect(() => {
    if (!isOpen) {
      setStartTyping(false);
      return;
    }
    const t = window.setTimeout(() => setStartTyping(true), 1000);
    return () => window.clearTimeout(t);
  }, [isOpen]);

  const openEnvelope = useCallback(() => {
    if (isOpen) return;
    setIsOpen(true);
  }, [isOpen]);

  useEffect(() => {
    if (frozenOpen || autoOpen === undefined) return;
    setIsOpen(autoOpen);
    if (!autoOpen) setStartTyping(false);
  }, [autoOpen, frozenOpen]);

  const letterProps = {
    receiverName,
    senderName,
    message,
    typedMessage,
    isOpen,
  };

  const envelopeAspect = isOpen ? envelope.openAspect : envelope.closedAspect;

  return (
    <div
      className={`envelope-gift-scene flex flex-col items-center px-4 py-8 ${
        isOpen ? "envelope-gift-scene--open" : ""
      }${compact ? " envelope-gift-scene--compact" : ""}`}
    >
      {!isOpen && !compact && (
        <>
          <p className="envelope-gift-scene__hint">Toque no envelope para abrir</p>
          <p className="envelope-gift-scene__recipient font-display text-xl font-bold mb-8">Para {receiverName}</p>
        </>
      )}

      <div className="evnelope-wrapper evnelope-wrapper--open">
        <div className={`gift-stage${isOpen ? " gift-stage--open" : ""}${bouquet ? "" : " gift-stage--no-bouquet"}`}>
          {isOpen && (
            <div className="gift-letter-slot">
              <LetterPaper variant="beside">
                <LetterContent {...letterProps} />
              </LetterPaper>
            </div>
          )}

          {bouquet && (
            <div className="gift-bouquet-slot">
              <BouquetPreview config={bouquet} showLabel={false} />
            </div>
          )}

          <div
            className={`evnelope ${stateClass}`}
            style={
              compact
                ? {
                    width: `min(${envelopeFitWidth}px, 86vw)`,
                    aspectRatio: String(envelopeAspect),
                  }
                : { width: boxSize.width, height: boxSize.height }
            }
          >
          <div
            className="front flap has-image"
            style={{ backgroundImage: `url(${envelope.closedSrc})` }}
            aria-hidden
          />

          <div className="front pocket has-image" aria-hidden={!isOpen}>
            <EnvelopeImage
              envelopeId={config.envelopeId}
              variant="open"
              fitWidth={envelopeFitWidth}
              className={compact ? "envelope-img-fit" : "w-full h-full"}
            />
          </div>

          {/* Fechado: só a carta dentro do envelope */}
          {!isOpen && (
            <div className="gift-reveal gift-reveal--inside">
              <LetterPaper variant="inside">
                <LetterContent {...letterProps} />
              </LetterPaper>
            </div>
          )}

          <div className="evnelope-skin-closed">
            <EnvelopeImage
              envelopeId={config.envelopeId}
              variant="closed"
              fitWidth={envelopeFitWidth}
              className={compact ? "envelope-img-fit" : "w-full h-full"}
            />
            <div
              className="evnelope-wax"
              style={{ left: SEAL_OVERLAY.left, top: SEAL_OVERLAY.top }}
            >
              <WaxSealImage sealId={config.waxId} fitWidth={sealSize} />
            </div>
          </div>

          {!isOpen && (
            <button
              type="button"
              className="evnelope-hit"
              onClick={openEnvelope}
              aria-label="Abrir envelope"
            />
          )}
          </div>
        </div>
      </div>

      {!isOpen && (
        <p className="text-xs text-[var(--text-dim)] mt-8">De {senderName}, com amor</p>
      )}

      {isOpen && typedMessage.length >= message.length && message.length > 0 && (
        <p className="envelope-gift-footer text-xs tracking-widest uppercase text-[var(--text-muted)] mt-6">
          Feito com amor para {receiverName}
        </p>
      )}
    </div>
  );
}
