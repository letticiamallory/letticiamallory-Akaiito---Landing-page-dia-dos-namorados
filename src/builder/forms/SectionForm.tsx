"use client";

import type { BuilderSection, SectionData, PolaroidCameraData, MuseumOfUsData, ChocolateBoxData, LoveLetterData, HeroCoupleData, FavoriteSongData, CounterTogetherData, PhotoCollageData } from "@/lib/builder/types";
import { getSectionCatalogItem } from "@/lib/builder/sections.catalog";
import {
  clampPhotoMomentTitle,
  DEFAULT_PHOTO_MOMENTS,
  getPhotoMoments,
  PHOTO_MOMENT_TITLE_MAX_CHARS,
} from "@/lib/photo-moments";
import { Field, TextAreaField, ImageUpload, BulkPhotoUpload } from "@/components/create-form-fields";
import { clampHeroTagline, HERO_TAGLINE_MAX_CHARS } from "@/lib/hero-tagline";
import { HistoriaMuseuControls } from "@/components/historia/historia-museu-controls";
import { HistoriaPolaroidControls } from "@/components/historia/historia-polaroid-controls";
import { HistoriaChocolatesControls } from "@/components/historia/historia-chocolates-controls";
import { HistoriaCartaControls } from "@/components/historia/historia-carta-controls";
import { DEFAULT_LETTER, LETTER_MESSAGE_MAX_CHARS, clampLetterMessage } from "@/lib/letter-catalog";
import {
  clampCustomMessageBody,
  clampCustomMessageCta,
  CUSTOM_MESSAGE_BODY_MAX_CHARS,
  CUSTOM_MESSAGE_CTA_MAX_CHARS,
} from "@/lib/custom-message";
import { normalizeMusicPageUrl, isYouTubeMusicUrl } from "@/lib/music-metadata";

async function fetchTrackMetadataFromUrl(rawUrl: string) {
  const pageUrl = normalizeMusicPageUrl(rawUrl);
  if (!pageUrl) return null;

  try {
    const res = await fetch(`/api/music-metadata?url=${encodeURIComponent(pageUrl)}`);
    if (!res.ok) return null;
    return (await res.json()) as { songTitle: string; artistName?: string };
  } catch {
    return null;
  }
}

function SectionHint({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs text-[var(--text-muted)] leading-relaxed -mt-1 mb-1">
      {children}
    </p>
  );
}

export function SectionForm({
  section,
  onChange,
  coupleNames,
  sections = [],
  onUpdateSection,
  fieldsOnly = false,
}: {
  section: BuilderSection;
  onChange: (patch: Partial<SectionData>) => void;
  coupleNames: { person1: string; person2: string };
  sections?: BuilderSection[];
  onUpdateSection?: (sectionId: string, patch: Partial<SectionData>) => void;
  fieldsOnly?: boolean;
}) {
  const catalog = getSectionCatalogItem(section.sectionId);
  const d = section.data;
  const counterSection = sections.find((s) => s.sectionId === "counter_together");
  const counterData = counterSection?.data as CounterTogetherData | undefined;

  const fields = (
    <>
        {section.sectionId === "hero_couple" && (
          <>
            <SectionHint>
              Aparece no card <strong>Sobre o casal</strong>. O buquê é personalizado no passo{" "}
              <strong>Buquê especial</strong>.
            </SectionHint>
            <Field
              label="Seu nome"
              value={(d as HeroCoupleData).person1Name}
              onChange={(v) => onChange({ person1Name: v })}
              placeholder="João"
              required
            />
            <Field
              label="Nome do(a) parceiro(a)"
              value={(d as HeroCoupleData).person2Name}
              onChange={(v) => onChange({ person2Name: v })}
              placeholder="Letícia"
              required
            />
            <Field
              label="Data em que ficaram juntos"
              type="date"
              value={counterData?.startDate || ""}
              onChange={(v) => {
                if (counterSection && onUpdateSection) {
                  onUpdateSection(counterSection.id, { startDate: v });
                }
              }}
              required
            />
            <Field
              label="Frase curta (opcional)"
              value={(d as HeroCoupleData).tagline || ""}
              onChange={(v) => onChange({ tagline: clampHeroTagline(v) })}
              placeholder="Uma história de amor..."
              maxLength={HERO_TAGLINE_MAX_CHARS}
            />
            <SectionHint>
              Se a data acima estiver preenchida, mostramos &quot;Juntos desde [ano]&quot;. Caso contrário,
              usamos esta frase.
            </SectionHint>
            <ImageUpload
              label="Foto do casal"
              value={(d as HeroCoupleData).backgroundPhoto}
              onChange={(v) => onChange({ backgroundPhoto: v })}
            />
            <p className="text-xs text-[var(--text-dim)] -mt-2">
              Recomendado: retrato, 800 × 950 px (proporção 4:5). Formatos JPG ou PNG.
            </p>
          </>
        )}

        {section.sectionId === "counter_together" && (() => {
          const counter = d as CounterTogetherData;
          return (
          <>
            <SectionHint>
              A data usada no contador é a mesma de <strong>Data em que ficaram juntos</strong>, no
              início deste passo. Aqui você escolhe o que aparece no contador.
            </SectionHint>
            <p className="text-xs text-[var(--text-dim)]">Unidades exibidas no contador:</p>
            <div className="flex flex-wrap gap-4">
              {(
                [
                  ["showYears", "Anos"],
                  ["showMonths", "Meses"],
                  ["showDays", "Dias"],
                  ["showHours", "Horas"],
                ] as const
              ).map(([key, label]) => (
                <label key={key} className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                  <input
                    type="checkbox"
                    checked={counter[key]}
                    onChange={(e) => onChange({ [key]: e.target.checked } as Partial<SectionData>)}
                  />
                  {label}
                </label>
              ))}
            </div>
          </>
          );
        })()}

        {section.sectionId === "photo_collage" && (() => {
          const collage = d as PhotoCollageData;
          const moments = getPhotoMoments(collage);

          return (
          <>
            <SectionHint>
              Cada momento vira um card no presente. Ao tocar, abre uma galeria estilo stories com as fotos
              daquele momento.
            </SectionHint>
            {moments.map((moment, mi) => (
              <Field
                key={moment.id}
                label={`Momento ${mi + 1}`}
                value={moment.title}
                onChange={(title) => {
                  const next = [...moments];
                  next[mi] = { ...moment, title: clampPhotoMomentTitle(title) };
                  onChange({ moments: next });
                }}
                placeholder={DEFAULT_PHOTO_MOMENTS[mi]?.title ?? "Título do momento"}
                maxLength={PHOTO_MOMENT_TITLE_MAX_CHARS}
              />
            ))}
            <BulkPhotoUpload
              photos={collage.photos}
              moments={moments}
              onChange={(photos) => onChange({ photos })}
            />
          </>
          );
        })()}

        {section.sectionId === "favorite_song" && (() => {
          const song = d as FavoriteSongData;
          const invalidUrl = Boolean(song.embedUrl.trim()) && !isYouTubeMusicUrl(song.embedUrl);

          return (
          <>
            <SectionHint>
              Aparece em um card próprio com capa de álbum e player. Cole o link do YouTube e envie uma
              foto quadrada para a capa.
            </SectionHint>
            <Field
              label="Link da música (YouTube)"
              value={song.embedUrl}
              onChange={async (v) => {
                const patch: Partial<FavoriteSongData> = { embedUrl: v, platform: "youtube" };
                if (!v.trim() || !isYouTubeMusicUrl(v)) {
                  onChange(patch);
                  return;
                }

                const metadata = await fetchTrackMetadataFromUrl(v);
                if (metadata?.songTitle) {
                  patch.songTitle = metadata.songTitle;
                  patch.artistName = metadata.artistName ?? "";
                }

                onChange(patch);
              }}
              placeholder="https://www.youtube.com/watch?v=..."
              required
            />
            {invalidUrl && (
              <p className="text-xs text-red-400">
                Use um link válido do YouTube (youtube.com ou youtu.be).
              </p>
            )}
            {song.songTitle && !invalidUrl && (
              <p className="text-xs text-[var(--text-dim)]">
                Título preenchido automaticamente pelo YouTube. Você pode editar abaixo.
              </p>
            )}
            <Field
              label="Título da música"
              value={song.songTitle || ""}
              onChange={(songTitle) => onChange({ songTitle: songTitle.slice(0, 120) })}
              placeholder="Nome da música"
            />
            <Field
              label="Subtítulo do card"
              value={song.note || ""}
              onChange={(note) => onChange({ note: note.slice(0, 80) })}
              placeholder="Ex.: a trilha do nosso amor"
            />
            <ImageUpload
              label="Capa do álbum"
              value={song.albumCover || ""}
              onChange={(albumCover) => onChange({ albumCover })}
            />
            <p className="text-xs text-[var(--text-dim)] -mt-2">
              Recomendado: 800 × 600 px (proporção 4:3). Aparece no player como capa de álbum.
            </p>
          </>
          );
        })()}

        {section.sectionId === "love_letter" && (
          <>
            <SectionHint>
              Aparece no card <strong>Carta de amor</strong>: envelope animado, papel, selo e texto.
            </SectionHint>
            <TextAreaField
              label={`Texto da carta (máx ${LETTER_MESSAGE_MAX_CHARS})`}
              value={(d as LoveLetterData).message || ""}
              onChange={(v) => onChange({ message: clampLetterMessage(v) })}
              placeholder="Querida Ana, hoje eu quero te dizer que..."
              required
            />
            <p className="text-xs text-[var(--text-dim)] -mt-3">
              {((d as LoveLetterData).message || "").length}/{LETTER_MESSAGE_MAX_CHARS}
            </p>
            <HistoriaCartaControls
              message={(d as LoveLetterData).message || ""}
              onMessageChange={(v) => onChange({ message: clampLetterMessage(v) })}
              letter={(d as LoveLetterData).letter ?? DEFAULT_LETTER}
              onLetterChange={(letter) => onChange({ letter })}
              hideMessage
              hideBouquet
            />
          </>
        )}

        {section.sectionId === "museum_of_us" && (
          <>
            <SectionHint>
              Aparece como card interativo <strong>Museu de Nós</strong> na página. Monte quadros e cenas
              no editor abaixo.
            </SectionHint>
            <HistoriaMuseuControls
              senderName={coupleNames.person1}
              receiverName={coupleNames.person2}
              value={{
                museumTitle: (d as MuseumOfUsData).museumTitle || "Museu de Nós",
                museumDate: (d as MuseumOfUsData).museumDate || "",
                elements: (d as MuseumOfUsData).elements,
              }}
              onChange={(patch) => onChange(patch)}
            />
          </>
        )}

        {section.sectionId === "polaroid_camera" && (
          <>
            <SectionHint>
              Aparece no card <strong>A surpresa começa aqui</strong>: caixa, câmera e polaroids.
            </SectionHint>
            <HistoriaPolaroidControls
            variant="hero"
            message={(d as PolaroidCameraData).message}
            onMessageChange={(v) => onChange({ message: v })}
            photos={(d as PolaroidCameraData).photos}
            onPhotosChange={(photos) => onChange({ photos })}
            labelTexts={(d as PolaroidCameraData).labelTexts || []}
            onLabelTextsChange={(labelTexts) => onChange({ labelTexts })}
          />
          </>
        )}

        {section.sectionId === "chocolate_box" && (
          <>
            <SectionHint>
              Aparece como card <strong>Caixa de Bombons</strong>: a pessoa abre a caixa e mordisca cada
              chocolate.
            </SectionHint>
            <HistoriaChocolatesControls
            senderName={coupleNames.person1}
            receiverName={coupleNames.person2}
            value={{
              boxTitle: (d as ChocolateBoxData).boxTitle || "",
              message: (d as ChocolateBoxData).message || "",
              placements: (d as ChocolateBoxData).placements,
            }}
            onChange={(patch) => onChange(patch)}
          />
          </>
        )}

        {section.sectionId === "custom_message" && (
          <>
            <SectionHint>
              Aparece dentro do coração no card final: mensagem curta com efeito de digitação e
              assinatura.
            </SectionHint>
            <Field
              label={`Mensagem final (máx. ${CUSTOM_MESSAGE_BODY_MAX_CHARS})`}
              value={(d as { body: string }).body}
              onChange={(v) => onChange({ body: clampCustomMessageBody(v) })}
              placeholder="Te amo para sempre"
              required
              maxLength={CUSTOM_MESSAGE_BODY_MAX_CHARS}
            />
            <Field
              label={`Assinatura (opcional, máx. ${CUSTOM_MESSAGE_CTA_MAX_CHARS})`}
              value={(d as { ctaText?: string }).ctaText || ""}
              onChange={(v) => onChange({ ctaText: clampCustomMessageCta(v) })}
              placeholder="Te amo ♡"
              maxLength={CUSTOM_MESSAGE_CTA_MAX_CHARS}
            />
          </>
        )}
    </>
  );

  if (fieldsOnly) {
    return <div className="flex flex-col gap-4">{fields}</div>;
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <div className="text-3xl mb-2">{catalog.icon}</div>
        <h2 className="font-display text-xl font-bold mb-1">{catalog.name}</h2>
        <p className="text-sm text-[var(--text-muted)]">{catalog.description}</p>
      </div>
      <div className="flex flex-col gap-4">{fields}</div>
    </div>
  );
}
