"use client";

import type { BouquetConfig, MainFlowerId, SupportFlowerId } from "@/lib/bouquet-catalog";
import { MAIN_FLOWERS, SUPPORT_FLOWERS } from "@/lib/bouquet-catalog";
import type { EnvelopeStyleId, LetterConfig, WaxSealId } from "@/lib/letter-catalog";
import { ENVELOPE_STYLES, WAX_SEAL_LIST, LETTER_MESSAGE_MAX_CHARS, clampLetterMessage } from "@/lib/letter-catalog";
import { BouquetPreview } from "@/components/bouquet/bouquet-preview";
import { EnvelopeThumb, LetterPreview } from "@/components/letter/letter-preview";
import { WaxSealImage } from "@/components/letter/wax-seal-image";
import { Field } from "@/components/create-form-fields";
import "./carta-studio.css";

export interface CartaStudioProps {
  senderName: string;
  receiverName: string;
  onSenderName: (v: string) => void;
  onReceiverName: (v: string) => void;
  message: string;
  onMessageChange: (v: string) => void;
  letter: LetterConfig;
  onLetterChange: (config: LetterConfig) => void;
  bouquet: BouquetConfig;
  onBouquetChange: (config: BouquetConfig) => void;
}

export function CartaStudio({
  senderName,
  receiverName,
  onSenderName,
  onReceiverName,
  message,
  onMessageChange,
  letter,
  onLetterChange,
  bouquet,
  onBouquetChange,
}: CartaStudioProps) {
  const receiver = receiverName.trim() || "quem você ama";

  return (
    <div className="carta-studio">
      <aside className="carta-studio-stage" aria-label="Pré-visualização do presente">
        <div className="carta-stage-surface">
          <div className="carta-stage-letter">
            <LetterPreview
              config={letter}
              mode="envelope-with-seal"
              message={message}
              fitWidth={220}
            />
          </div>
          <div className="carta-stage-bouquet">
            <BouquetPreview config={bouquet} showLabel={false} />
          </div>
        </div>
        <p className="carta-stage-caption">
          Uma carta de {senderName.trim() || "você"} para {receiver}
        </p>
      </aside>

      <div className="carta-studio-controls">
        <section className="studio-section">
          <h3 className="studio-section-title">Quem envia e quem recebe</h3>
          <div className="studio-names">
            <Field
              label="Seu nome"
              value={senderName}
              onChange={onSenderName}
              placeholder="João"
              required
            />
            <Field
              label="Nome dela(e)"
              value={receiverName}
              onChange={onReceiverName}
              placeholder="Ana"
              required
            />
          </div>
        </section>

        <section className="studio-section">
          <h3 className="studio-section-title">Envelope</h3>
          <p className="studio-section-hint">Toque para trocar o estilo da carta fechada.</p>
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

        <section className="studio-section">
          <h3 className="studio-section-title">Sua carta de amor</h3>
          <p className="studio-section-hint">
            O texto aparece letra por letra quando o envelope for aberto (máx.{" "}
            {LETTER_MESSAGE_MAX_CHARS} caracteres).
          </p>
          <textarea
            className="input-field studio-message"
            value={message}
            onChange={(e) => onMessageChange(clampLetterMessage(e.target.value))}
            placeholder="Querida Ana, hoje eu quero te dizer que..."
            rows={6}
            maxLength={LETTER_MESSAGE_MAX_CHARS}
            required
          />
          <p className="text-xs text-[var(--text-dim)] mt-2">
            {message.length}/{LETTER_MESSAGE_MAX_CHARS}
          </p>
        </section>

        <hr className="studio-divider" />

        <section className="studio-section">
          <h3 className="studio-section-title">Buquê</h3>
          <p className="studio-section-hint">
            Cada combinação gera um buquê já embrulhado no preview (como no Build a Bouquet).
          </p>
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

      </div>
    </div>
  );
}
