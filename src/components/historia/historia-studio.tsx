"use client";

import { useMemo, useState } from "react";
import { nanoid } from "nanoid";
import type { HistoriaData, HistoriaTimelineItem } from "@/lib/gift-types";
import { Field, TextAreaField, ImageUpload } from "@/components/create-form-fields";
import { clampPolaroidLabel, POLAROID_LABEL_MAX_CHARS } from "@/lib/polaroid-label";
import { HistoriaCartaControls } from "./historia-carta-controls";
import { HistoriaPolaroidControls } from "./historia-polaroid-controls";
import { HistoriaJoguinhoControls } from "./historia-joguinho-controls";
import { HistoriaMuseuControls } from "./historia-museu-controls";
import { HistoriaChocolatesControls } from "./historia-chocolates-controls";
import { HistoriaSlotControls } from "./historia-slot-controls";
import { HistoriaPage } from "./HistoriaPage";
import { DEFAULT_BOUQUET } from "@/lib/bouquet-catalog";
import { DEFAULT_LETTER, clampLetterMessage } from "@/lib/letter-catalog";
import type { BouquetConfig } from "@/lib/bouquet-catalog";
import type { LetterConfig } from "@/lib/letter-catalog";
import type { PolaroidPhoto, MuseumElement, ChocolatePlacement } from "@/lib/gift-types";
import type { HistoriaModules } from "@/lib/gift-types";
import "./historia-page.css";

const STEPS = ["Casal", "História", "Fotos", "Carta", "Surpresas", "Extras"] as const;

function emptyTimelineItem(): HistoriaTimelineItem {
  return { id: nanoid(8), date: "", title: "", description: "" };
}

function emptyPolaroidPhotos(): PolaroidPhoto[] {
  return Array.from({ length: 5 }, () => ({ url: "", label: "" }));
}

function buildModules(form: HistoriaFormState): HistoriaModules | undefined {
  const modules: HistoriaModules = {};
  if (form.cartaEnabled) {
    modules.carta = {
      message: form.cartaUseMainLetter ? form.letter : form.cartaMessage || form.letter,
      letter: form.cartaLetter,
      bouquet: form.cartaBouquet,
    };
  }
  if (form.polaroidEnabled) {
    modules.polaroid = {
      message: form.polaroidMessage,
      photos: form.polaroidPhotos.filter((p) => p.url),
      labelTexts: form.polaroidLabels,
    };
  }
  if (form.joguinhoEnabled) {
    modules.joguinho = {
      senderPhoto: form.joguinhoSenderPhoto || undefined,
      receiverPhoto: form.joguinhoReceiverPhoto || undefined,
      loveMessage: form.joguinhoLoveMessage || undefined,
    };
  }
  if (form.museuEnabled && form.museuElements.length) {
    modules.museu = {
      museumTitle: form.museuTitle || undefined,
      museumDate: form.museuDate || undefined,
      coupleName: `${form.senderName} & ${form.receiverName}`,
      elements: form.museuElements,
    };
  }
  if (form.chocolatesEnabled && form.chocolatesPlacements.length) {
    modules.chocolates = {
      boxTitle: form.chocolatesBoxTitle || undefined,
      message: form.chocolatesMessage || undefined,
      coupleName: `${form.senderName} & ${form.receiverName}`,
      placements: form.chocolatesPlacements,
    };
  }
  if (form.slotEnabled) {
    const surprises = form.slotSurprises.map((s) => s.trim()).filter(Boolean);
    if (surprises.length) modules.slot = { surprises };
  }
  return Object.keys(modules).length ? modules : undefined;
}

export function HistoriaStudio({
  step,
  onStepChange,
  data,
  onChange,
}: {
  step: number;
  onStepChange: (step: number) => void;
  data: HistoriaFormState;
  onChange: (patch: Partial<HistoriaFormState>) => void;
}) {
  const previewData = useMemo(() => buildHistoriaData(data), [data]);

  return (
    <div className="historia-studio">
      <div className="historia-studio-form">
        <div className="historia-step-tabs">
          {STEPS.map((label, i) => (
            <button
              key={label}
              type="button"
              className={`historia-step-tab ${i === step ? "historia-step-tab--active" : ""}`}
              onClick={() => onStepChange(i)}
            >
              {label}
            </button>
          ))}
        </div>

        {step === 0 && (
          <>
            <Field
              label="Seu nome"
              value={data.senderName}
              onChange={(v) => onChange({ senderName: v })}
              required
            />
            <Field
              label="Nome do(a) parceiro(a)"
              value={data.receiverName}
              onChange={(v) => onChange({ receiverName: v })}
              required
            />
            <Field
              label="Data de início do relacionamento"
              value={data.relationshipStart}
              onChange={(v) => onChange({ relationshipStart: v })}
              type="date"
              required
            />
            <Field
              label="Frase do hero (opcional)"
              value={data.heroSubtitle}
              onChange={(v) => onChange({ heroSubtitle: v })}
              placeholder="desde 14 de março de 2021"
            />
            <ImageUpload
              label="Foto do casal (hero)"
              value={data.heroPhotoUrl}
              onChange={(v) => onChange({ heroPhotoUrl: v })}
            />
          </>
        )}

        {step === 1 && (
          <>
            {data.timeline.map((item, i) => (
              <div key={item.id} className="historia-timeline-row">
                <Field
                  label={`Marco ${i + 1}: data`}
                  value={item.date}
                  onChange={(v) =>
                    onChange({
                      timeline: data.timeline.map((t) =>
                        t.id === item.id ? { ...t, date: v } : t
                      ),
                    })
                  }
                  placeholder="Março de 2021"
                />
                <Field
                  label="Título"
                  value={item.title}
                  onChange={(v) =>
                    onChange({
                      timeline: data.timeline.map((t) =>
                        t.id === item.id ? { ...t, title: v } : t
                      ),
                    })
                  }
                  placeholder="Primeiro encontro"
                />
                <TextAreaField
                  label="Descrição"
                  value={item.description}
                  onChange={(v) =>
                    onChange({
                      timeline: data.timeline.map((t) =>
                        t.id === item.id ? { ...t, description: v } : t
                      ),
                    })
                  }
                />
                {data.timeline.length > 1 && (
                  <button
                    type="button"
                    className="text-xs text-red-400 mt-2"
                    onClick={() =>
                      onChange({
                        timeline: data.timeline.filter((t) => t.id !== item.id),
                      })
                    }
                  >
                    Remover
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className="text-sm text-[var(--rose)]"
              onClick={() =>
                onChange({ timeline: [...data.timeline, emptyTimelineItem()] })
              }
            >
              + Adicionar marco
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <Field
              label="Título da galeria"
              value={data.galleryTitle}
              onChange={(v) => onChange({ galleryTitle: v })}
            />
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} className="mb-4">
                <ImageUpload
                  label={`Foto ${i + 1}${i < 4 ? " *" : ""}`}
                  value={data.photos[i]?.url || ""}
                  onChange={(url) => {
                    const photos = [...data.photos];
                    photos[i] = { url, caption: photos[i]?.caption || "" };
                    onChange({ photos });
                  }}
                />
                {data.photos[i]?.url && (
                  <Field
                    label="Legenda (opcional)"
                    value={data.photos[i]?.caption || ""}
                    onChange={(v) => {
                      const photos = [...data.photos];
                      photos[i] = { ...photos[i], caption: v };
                      onChange({ photos });
                    }}
                  />
                )}
              </div>
            ))}
            <Field
              label="Música: nome"
              value={data.musicTitle}
              onChange={(v) => onChange({ musicTitle: v })}
            />
            <Field
              label="Artista"
              value={data.musicArtist}
              onChange={(v) => onChange({ musicArtist: v })}
            />
            <Field
              label="Álbum (opcional)"
              value={data.musicAlbum}
              onChange={(v) => onChange({ musicAlbum: v })}
            />
            <Field
              label="Link do YouTube"
              value={data.musicEmbedUrl}
              onChange={(v) => onChange({ musicEmbedUrl: v })}
              placeholder="https://www.youtube.com/watch?v=..."
            />
            <TextAreaField
              label="Por que essa música é especial"
              value={data.musicStory}
              onChange={(v) => onChange({ musicStory: v })}
            />
            <p className="text-xs text-[var(--text-muted)] mt-4 mb-2">
              Polaroids no varal (acima do player)
            </p>
            <ImageUpload
              label="Polaroid esquerda: foto"
              value={data.musicPolaroidLeftPhoto}
              onChange={(v) => onChange({ musicPolaroidLeftPhoto: v })}
            />
            <Field
              label="Polaroid esquerda: legenda"
              value={data.musicPolaroidLeftCaption}
              onChange={(v) => onChange({ musicPolaroidLeftCaption: clampPolaroidLabel(v) })}
              maxLength={POLAROID_LABEL_MAX_CHARS}
            />
            <ImageUpload
              label="Polaroid direita: foto"
              value={data.musicPolaroidRightPhoto}
              onChange={(v) => onChange({ musicPolaroidRightPhoto: v })}
            />
            <Field
              label="Polaroid direita: legenda"
              value={data.musicPolaroidRightCaption}
              onChange={(v) => onChange({ musicPolaroidRightCaption: clampPolaroidLabel(v) })}
              maxLength={POLAROID_LABEL_MAX_CHARS}
            />
          </>
        )}

        {step === 3 && (
          <>
            <Field
              label="Título da carta"
              value={data.letterTitle}
              onChange={(v) => onChange({ letterTitle: v })}
              placeholder={`Para ${data.receiverName || "você"}`}
            />
            <TextAreaField
              label="Carta de amor *"
              value={data.letter}
              onChange={(v) => onChange({ letter: v })}
              required
            />
            <label className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
              <input
                type="checkbox"
                checked={data.letterTypewriter}
                onChange={(e) => onChange({ letterTypewriter: e.target.checked })}
              />
              Efeito de máquina de escrever
            </label>
          </>
        )}

        {step === 4 && (
          <>
            <p className="text-sm text-[var(--text-muted)] mb-4">
              Adicione experiências interativas à landing. Toque para ativar.
            </p>
            <label className="flex items-center gap-3 p-4 rounded-xl border border-[var(--border2)] cursor-pointer mb-4">
              <input
                type="checkbox"
                checked={data.cartaEnabled}
                onChange={(e) => onChange({ cartaEnabled: e.target.checked })}
              />
              <span>
                <strong className="block text-sm">💌 Carta animada com buquê</strong>
                <span className="text-xs text-[var(--text-dim)]">
                  Envelope que abre ao toque, com flores personalizadas
                </span>
              </span>
            </label>
            {data.cartaEnabled && (
              <HistoriaCartaControls
                message={data.cartaMessage}
                onMessageChange={(v) => onChange({ cartaMessage: clampLetterMessage(v) })}
                letter={data.cartaLetter}
                onLetterChange={(cartaLetter) => onChange({ cartaLetter })}
                bouquet={data.cartaBouquet}
                onBouquetChange={(cartaBouquet) => onChange({ cartaBouquet })}
                useMainLetter={data.cartaUseMainLetter}
                onUseMainLetterChange={(v) => onChange({ cartaUseMainLetter: v })}
              />
            )}

            <label className="flex items-center gap-3 p-4 rounded-xl border border-[var(--border2)] cursor-pointer mb-4 mt-6">
              <input
                type="checkbox"
                checked={data.polaroidEnabled}
                onChange={(e) => onChange({ polaroidEnabled: e.target.checked })}
              />
              <span>
                <strong className="block text-sm">📷 Câmera do Amor</strong>
                <span className="text-xs text-[var(--text-dim)]">
                  Experiência polaroid interativa com flash e fotos animadas
                </span>
              </span>
            </label>
            {data.polaroidEnabled && (
              <HistoriaPolaroidControls
                message={data.polaroidMessage}
                onMessageChange={(v) => onChange({ polaroidMessage: v })}
                photos={data.polaroidPhotos}
                onPhotosChange={(polaroidPhotos) => onChange({ polaroidPhotos })}
                labelTexts={data.polaroidLabels}
                onLabelTextsChange={(polaroidLabels) => onChange({ polaroidLabels })}
              />
            )}

            <label className="flex items-center gap-3 p-4 rounded-xl border border-[var(--border2)] cursor-pointer mb-4 mt-6">
              <input
                type="checkbox"
                checked={data.joguinhoEnabled}
                onChange={(e) => onChange({ joguinhoEnabled: e.target.checked })}
              />
              <span>
                <strong className="block text-sm">🎮 Joguinho do Casal</strong>
                <span className="text-xs text-[var(--text-dim)]">
                  Quiz de compatibilidade com resultado para compartilhar
                </span>
              </span>
            </label>
            {data.joguinhoEnabled && (
              <HistoriaJoguinhoControls
                senderPhoto={data.joguinhoSenderPhoto}
                receiverPhoto={data.joguinhoReceiverPhoto}
                loveMessage={data.joguinhoLoveMessage}
                onSenderPhotoChange={(v) => onChange({ joguinhoSenderPhoto: v })}
                onReceiverPhotoChange={(v) => onChange({ joguinhoReceiverPhoto: v })}
                onLoveMessageChange={(v) => onChange({ joguinhoLoveMessage: v })}
                receiverName={data.receiverName}
              />
            )}

            <label className="flex items-center gap-3 p-4 rounded-xl border border-[var(--border2)] cursor-pointer mb-4 mt-6">
              <input
                type="checkbox"
                checked={data.museuEnabled}
                onChange={(e) => onChange({ museuEnabled: e.target.checked })}
              />
              <span>
                <strong className="block text-sm">🏛️ Museu de Nós</strong>
                <span className="text-xs text-[var(--text-dim)]">
                  Salão interativo com quadros, fotos e visitantes
                </span>
              </span>
            </label>
            {data.museuEnabled && (
              <HistoriaMuseuControls
                senderName={data.senderName}
                receiverName={data.receiverName}
                value={{
                  museumTitle: data.museuTitle,
                  museumDate: data.museuDate,
                  elements: data.museuElements,
                }}
                onChange={(patch) =>
                  onChange({
                    museuTitle: patch.museumTitle ?? data.museuTitle,
                    museuDate: patch.museumDate ?? data.museuDate,
                    museuElements: patch.elements ?? data.museuElements,
                  })
                }
              />
            )}

            <label className="flex items-center gap-3 p-4 rounded-xl border border-[var(--border2)] cursor-pointer mb-4 mt-6">
              <input
                type="checkbox"
                checked={data.chocolatesEnabled}
                onChange={(e) => onChange({ chocolatesEnabled: e.target.checked })}
              />
              <span>
                <strong className="block text-sm">🍫 Caixa de Chocolates</strong>
                <span className="text-xs text-[var(--text-dim)]">
                  Monte a caixa. Quem recebe clica para abrir e mordiscar
                </span>
              </span>
            </label>
            {data.chocolatesEnabled && (
              <HistoriaChocolatesControls
                senderName={data.senderName}
                receiverName={data.receiverName}
                value={{
                  boxTitle: data.chocolatesBoxTitle,
                  message: data.chocolatesMessage,
                  placements: data.chocolatesPlacements,
                }}
                onChange={(patch) =>
                  onChange({
                    chocolatesBoxTitle: patch.boxTitle ?? data.chocolatesBoxTitle,
                    chocolatesMessage: patch.message ?? data.chocolatesMessage,
                    chocolatesPlacements: patch.placements ?? data.chocolatesPlacements,
                  })
                }
              />
            )}

            <label className="flex items-center gap-3 p-4 rounded-xl border border-[var(--border2)] cursor-pointer mb-4 mt-6">
              <input
                type="checkbox"
                checked={data.slotEnabled}
                onChange={(e) => onChange({ slotEnabled: e.target.checked })}
              />
              <span>
                <strong className="block text-sm">🎰 Máquina de Surpresas</strong>
                <span className="text-xs text-[var(--text-dim)]">
                  Cinco giros revelando presentes e recados que você escreveu
                </span>
              </span>
            </label>
            {data.slotEnabled && (
              <HistoriaSlotControls
                surprises={data.slotSurprises}
                onSurprisesChange={(slotSurprises) => onChange({ slotSurprises })}
              />
            )}
          </>
        )}

        {step === 5 && (
          <>
            <Field
              label="Nome do lugar especial"
              value={data.placeName}
              onChange={(v) => onChange({ placeName: v })}
            />
            <Field
              label="Endereço (para o mapa)"
              value={data.placeAddress}
              onChange={(v) => onChange({ placeAddress: v })}
            />
            <TextAreaField
              label="Descrição do lugar"
              value={data.placeDescription}
              onChange={(v) => onChange({ placeDescription: v })}
            />
            <Field
              label="Mapa estelar: data"
              value={data.starDate}
              onChange={(v) => onChange({ starDate: v })}
              type="date"
            />
            <Field
              label="Cidade (mapa estelar)"
              value={data.starCity}
              onChange={(v) => onChange({ starCity: v })}
            />
            <Field
              label="Como se conheceram"
              value={data.howWeMet}
              onChange={(v) => onChange({ howWeMet: v })}
            />
            <Field
              label="Filme favorito do casal"
              value={data.favoriteMovie}
              onChange={(v) => onChange({ favoriteMovie: v })}
            />
            <Field
              label="Comida favorita"
              value={data.favoriteFood}
              onChange={(v) => onChange({ favoriteFood: v })}
            />
            <Field
              label="Destino dos sonhos"
              value={data.dreamDestination}
              onChange={(v) => onChange({ dreamDestination: v })}
            />
            <Field
              label="Piada interna"
              value={data.insideJoke}
              onChange={(v) => onChange({ insideJoke: v })}
            />
            <TextAreaField
              label={`O que você ama em ${data.receiverName || "seu parceiro(a)"}`}
              value={data.lovesAboutYou}
              onChange={(v) => onChange({ lovesAboutYou: v })}
            />
            <TextAreaField
              label={`O que ${data.receiverName || "seu parceiro(a)"} ama em você`}
              value={data.lovesAboutThem}
              onChange={(v) => onChange({ lovesAboutThem: v })}
            />
            <Field
              label="Frase do rodapé"
              value={data.footerPhrase}
              onChange={(v) => onChange({ footerPhrase: v })}
              placeholder={`Feito com amor por ${data.senderName || "você"}`}
            />
          </>
        )}
      </div>

      <aside className="historia-studio-preview" aria-hidden>
        <div className="historia-preview-frame">
          <HistoriaPage data={previewData} preview />
        </div>
      </aside>
    </div>
  );
}

export interface HistoriaFormState {
  senderName: string;
  receiverName: string;
  relationshipStart: string;
  heroSubtitle: string;
  heroPhotoUrl: string;
  timeline: HistoriaTimelineItem[];
  photos: { url: string; caption: string }[];
  galleryTitle: string;
  musicTitle: string;
  musicArtist: string;
  musicAlbum: string;
  musicEmbedUrl: string;
  musicStory: string;
  musicPolaroidLeftPhoto: string;
  musicPolaroidLeftCaption: string;
  musicPolaroidRightPhoto: string;
  musicPolaroidRightCaption: string;
  letterTitle: string;
  letter: string;
  letterTypewriter: boolean;
  placeName: string;
  placeAddress: string;
  placeDescription: string;
  starDate: string;
  starCity: string;
  howWeMet: string;
  favoriteMovie: string;
  favoriteFood: string;
  dreamDestination: string;
  insideJoke: string;
  lovesAboutYou: string;
  lovesAboutThem: string;
  footerPhrase: string;
  cartaEnabled: boolean;
  cartaMessage: string;
  cartaUseMainLetter: boolean;
  cartaLetter: LetterConfig;
  cartaBouquet: BouquetConfig;
  polaroidEnabled: boolean;
  polaroidMessage: string;
  polaroidPhotos: PolaroidPhoto[];
  polaroidLabels: string[];
  joguinhoEnabled: boolean;
  joguinhoSenderPhoto: string;
  joguinhoReceiverPhoto: string;
  joguinhoLoveMessage: string;
  museuEnabled: boolean;
  museuTitle: string;
  museuDate: string;
  museuElements: MuseumElement[];
  chocolatesEnabled: boolean;
  chocolatesBoxTitle: string;
  chocolatesMessage: string;
  chocolatesPlacements: ChocolatePlacement[];
  slotEnabled: boolean;
  slotSurprises: string[];
}

export function initialHistoriaFormState(): HistoriaFormState {
  return {
    senderName: "",
    receiverName: "",
    relationshipStart: "",
    heroSubtitle: "",
    heroPhotoUrl: "",
    timeline: [emptyTimelineItem()],
    photos: [],
    galleryTitle: "Nossos momentos",
    musicTitle: "",
    musicArtist: "",
    musicAlbum: "",
    musicEmbedUrl: "",
    musicStory: "",
    musicPolaroidLeftPhoto: "",
    musicPolaroidLeftCaption: "",
    musicPolaroidRightPhoto: "",
    musicPolaroidRightCaption: "",
    letterTitle: "",
    letter: "",
    letterTypewriter: true,
    placeName: "",
    placeAddress: "",
    placeDescription: "",
    starDate: "",
    starCity: "",
    howWeMet: "",
    favoriteMovie: "",
    favoriteFood: "",
    dreamDestination: "",
    insideJoke: "",
    lovesAboutYou: "",
    lovesAboutThem: "",
    footerPhrase: "",
    cartaEnabled: false,
    cartaMessage: "",
    cartaUseMainLetter: true,
    cartaLetter: DEFAULT_LETTER,
    cartaBouquet: DEFAULT_BOUQUET,
    polaroidEnabled: false,
    polaroidMessage: "",
    polaroidPhotos: emptyPolaroidPhotos(),
    polaroidLabels: ["", "", "", "", ""],
    joguinhoEnabled: false,
    joguinhoSenderPhoto: "",
    joguinhoReceiverPhoto: "",
    joguinhoLoveMessage: "",
    museuEnabled: false,
    museuTitle: "Museu de Nós",
    museuDate: "",
    museuElements: [],
    chocolatesEnabled: false,
    chocolatesBoxTitle: "Caixa de Chocolates",
    chocolatesMessage: "",
    chocolatesPlacements: [],
    slotEnabled: false,
    slotSurprises: ["", "", "", "", ""],
  };
}

export function buildHistoriaData(form: HistoriaFormState): HistoriaData {
  return {
    senderName: form.senderName || "Ana",
    receiverName: form.receiverName || "Pedro",
    relationshipStart: form.relationshipStart || "2021-03-14",
    heroSubtitle: form.heroSubtitle || undefined,
    heroPhotoUrl: form.heroPhotoUrl || undefined,
    theme: "colagem",
    photos: form.photos.filter((p) => p.url).map((p) => ({
      url: p.url,
      caption: p.caption || undefined,
    })),
    galleryTitle: form.galleryTitle,
    timeline: form.timeline.filter((t) => t.title.trim()),
    letterTitle: form.letterTitle || undefined,
    letter: form.letter || "Sua carta de amor aparecerá aqui...",
    letterTypewriter: form.letterTypewriter,
    music:
      form.musicTitle || form.musicArtist || form.musicEmbedUrl
        ? {
            title: form.musicTitle,
            artist: form.musicArtist,
            album: form.musicAlbum,
            embedUrl: form.musicEmbedUrl,
            story: form.musicStory,
            polaroidLeftPhoto: form.musicPolaroidLeftPhoto || undefined,
            polaroidLeftCaption: form.musicPolaroidLeftCaption || undefined,
            polaroidRightPhoto: form.musicPolaroidRightPhoto || undefined,
            polaroidRightCaption: form.musicPolaroidRightCaption || undefined,
          }
        : undefined,
    place: form.placeName
      ? {
          name: form.placeName,
          address: form.placeAddress,
          description: form.placeDescription,
        }
      : undefined,
    starMap: form.starDate ? { date: form.starDate, city: form.starCity } : undefined,
    facts: {
      howWeMet: form.howWeMet || undefined,
      favoriteMovie: form.favoriteMovie || undefined,
      favoriteFood: form.favoriteFood || undefined,
      dreamDestination: form.dreamDestination || undefined,
      insideJoke: form.insideJoke || undefined,
      lovesAboutYou: form.lovesAboutYou || undefined,
      lovesAboutThem: form.lovesAboutThem || undefined,
    },
    footerPhrase: form.footerPhrase || undefined,
    modules: buildModules(form),
  };
}

export function validateHistoriaStep(step: number, form: HistoriaFormState): string | null {
  if (step === 0) {
    if (!form.senderName.trim() || !form.receiverName.trim()) return "Preencha os nomes.";
    if (!form.relationshipStart) return "Informe a data de início.";
  }
  if (step === 1 && !form.timeline.some((t) => t.title.trim())) {
    return "Adicione pelo menos um marco.";
  }
  if (step === 2 && form.photos.filter((p) => p.url).length < 4) {
    return "Envie pelo menos 4 fotos.";
  }
  if (step === 3 && !form.letter.trim()) return "Escreva a carta de amor.";
  if (step === 4 && form.cartaEnabled) {
    const msg = form.cartaUseMainLetter ? form.letter : form.cartaMessage;
    if (!msg.trim()) return "Escreva o texto do envelope ou use a carta principal.";
  }
  if (step === 4 && form.polaroidEnabled) {
    if (!form.polaroidMessage.trim()) return "Escreva a mensagem da câmera polaroid.";
    if (form.polaroidPhotos.filter((p) => p.url).length < 3) {
      return "Envie pelo menos 3 fotos para a câmera polaroid.";
    }
  }
  if (step === 4 && form.museuEnabled) {
    if (!form.museuElements.some((e) => e.type === "frame")) {
      return "Adicione pelo menos um quadro ao museu.";
    }
  }
  if (step === 4 && form.chocolatesEnabled) {
    if (!form.chocolatesPlacements.length) {
      return "Arraste pelo menos um chocolate para a caixa.";
    }
  }
  if (step === 4 && form.slotEnabled) {
    if (form.slotSurprises.filter((s) => s.trim()).length < 3) {
      return "Preencha pelo menos 3 surpresas na máquina.";
    }
  }
  return null;
}

export const HISTORIA_STEPS = STEPS;
