"use client";

import type { BouquetConfig, MainFlowerId, SupportFlowerId } from "@/lib/bouquet-catalog";
import { MAIN_FLOWERS, SUPPORT_FLOWERS } from "@/lib/bouquet-catalog";
import type { EnvelopeStyleId, LetterConfig, WaxSealId } from "@/lib/letter-catalog";
import { ENVELOPE_STYLES, WAX_SEALS, WAX_SEAL_LIST, LETTER_MESSAGE_MAX_CHARS, clampLetterMessage } from "@/lib/letter-catalog";
import { EnvelopeThumb, LetterPreview } from "@/components/letter/letter-preview";
import { WaxSealImage } from "@/components/letter/wax-seal-image";
import { TextAreaField } from "@/components/create-form-fields";
import "@/components/carta/carta-studio.css";

export function HistoriaCartaControls({
  message,
  onMessageChange,
  letter,
  onLetterChange,
  bouquet,
  onBouquetChange,
  useMainLetter,
  onUseMainLetterChange,
  hideMessage = false,
  hideBouquet = false,
}: {
  message: string;
  onMessageChange: (v: string) => void;
  letter: LetterConfig;
  onLetterChange: (config: LetterConfig) => void;
  bouquet?: BouquetConfig;
  onBouquetChange?: (config: BouquetConfig) => void;
  useMainLetter?: boolean;
  onUseMainLetterChange?: (v: boolean) => void;
  /** Builder modular: mensagem editada fora deste bloco */
  hideMessage?: boolean;
  /** Buquê montado no hero do scrapbook */
  hideBouquet?: boolean;
}) {
  return (
    <div className="historia-carta-controls">
      {!hideMessage && onUseMainLetterChange !== undefined && useMainLetter !== undefined && (
        <label className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-4">
          <input
            type="checkbox"
            checked={useMainLetter}
            onChange={(e) => onUseMainLetterChange(e.target.checked)}
          />
          Usar o mesmo texto da carta de amor (passo Carta)
        </label>
      )}
      {!hideMessage && !useMainLetter && (
        <>
          <TextAreaField
            label={`Texto dentro do envelope (máx ${LETTER_MESSAGE_MAX_CHARS})`}
            value={message}
            onChange={(v) => onMessageChange(clampLetterMessage(v))}
            placeholder="Querida Ana, hoje eu quero te dizer que..."
          />
          <p className="text-xs text-[var(--text-dim)] -mt-3 mb-4">
            {message.length}/{LETTER_MESSAGE_MAX_CHARS}
          </p>
        </>
      )}

      <div className="historia-carta-preview" aria-label="Prévia do envelope">
        <p className="historia-carta-preview__label">Prévia do envelope</p>
        <LetterPreview config={letter} mode="envelope-with-seal" fitWidth={240} />
        <p className="historia-carta-preview__caption">
          {ENVELOPE_STYLES[letter.envelopeId].name} · {WAX_SEALS[letter.waxId].name}
        </p>
      </div>

      <section className="studio-section mt-4">
        <h3 className="studio-section-title">Envelope</h3>
        <div className="studio-picker-grid studio-picker-grid--envelope">
          {(Object.keys(ENVELOPE_STYLES) as EnvelopeStyleId[]).map((id) => (
            <button
              key={id}
              type="button"
              className={`studio-picker-btn ${letter.envelopeId === id ? "selected" : ""}`}
              onClick={() => onLetterChange({ ...letter, envelopeId: id })}
            >
              <EnvelopeThumb envelopeId={id} fitWidth={72} />
              <span>{ENVELOPE_STYLES[id].name}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="studio-section">
        <h3 className="studio-section-title">Selo de cera</h3>
        <div className="studio-picker-grid studio-picker-grid--seal">
          {WAX_SEAL_LIST.map(([id, seal]) => (
            <button
              key={id}
              type="button"
              className={`studio-picker-btn ${letter.waxId === id ? "selected" : ""}`}
              onClick={() => onLetterChange({ ...letter, waxId: id as WaxSealId })}
            >
              <WaxSealImage sealId={id} fitWidth={48} />
              <span>{seal.name}</span>
            </button>
          ))}
        </div>
      </section>

      {!hideBouquet && bouquet && onBouquetChange && (
      <section className="studio-section">
        <h3 className="studio-section-title">Buquê</h3>
        <div className="studio-flowers-row">
          <div>
            <p className="text-[0.65rem] tracking-widest uppercase text-[var(--text-dim)] mb-2">
              Principal
            </p>
            <div className="studio-bouquet-gallery">
              {(Object.keys(MAIN_FLOWERS) as MainFlowerId[]).map((id) => (
                <button
                  key={id}
                  type="button"
                  className={`studio-bouquet-option ${bouquet.mainFlowerId === id ? "selected" : ""}`}
                  onClick={() => onBouquetChange({ ...bouquet, mainFlowerId: id })}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={MAIN_FLOWERS[id].thumb} alt={MAIN_FLOWERS[id].name} />
                  <span>{MAIN_FLOWERS[id].name}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[0.65rem] tracking-widest uppercase text-[var(--text-dim)] mb-2">
              Apoio
            </p>
            <div className="studio-bouquet-gallery">
              {(Object.keys(SUPPORT_FLOWERS) as SupportFlowerId[]).map((id) => (
                <button
                  key={id}
                  type="button"
                  className={`studio-bouquet-option ${bouquet.supportFlowerId === id ? "selected" : ""}`}
                  onClick={() => onBouquetChange({ ...bouquet, supportFlowerId: id })}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={SUPPORT_FLOWERS[id].thumb} alt={SUPPORT_FLOWERS[id].name} />
                  <span>{SUPPORT_FLOWERS[id].name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
      )}
    </div>
  );
}
