"use client";

import type {
  BuilderSection,
  ChocolateBoxData,
  MuseumOfUsData,
  PolaroidCameraData,
} from "@/lib/builder/types";
import type { MuseumElement } from "@/lib/gift-types";
import { HistoriaChocolatesSection } from "@/components/historia/historia-chocolates-section";
import { HistoriaMuseuSection } from "@/components/historia/historia-museu-section";
import { HistoriaPolaroidSection } from "@/components/historia/historia-polaroid-section";
import "@/components/historia/historia-page.css";

function getMuseumEmbedMeta(
  data: MuseumOfUsData,
  person1: string,
  person2: string
) {
  const sender = data.person1Name?.trim() || person1;
  const receiver = data.person2Name?.trim() || person2;
  const coupleName =
    data.person1Name && data.person2Name
      ? `${data.person1Name.trim()} & ${data.person2Name.trim()}`
      : `${sender} & ${receiver}`;
  const pieceCount =
    data.elements?.filter((el: MuseumElement) => el.type === "frame").length ?? 0;
  const museumTitle = data.museumTitle?.trim() || "Museu de Nós";

  return { sender, receiver, coupleName, pieceCount, museumTitle };
}

export function LoveMuseumIntro({
  data,
  person1,
  person2,
}: {
  data: MuseumOfUsData;
  person1: string;
  person2: string;
}) {
  const { pieceCount, museumTitle, coupleName } = getMuseumEmbedMeta(data, person1, person2);

  return (
    <header className="love-museum-intro">
      <p className="love-museum-intro__eyebrow">{museumTitle}</p>
      <h3 className="love-museum-intro__title">{coupleName}</h3>
      {data.museumDate?.trim() ? (
        <p className="love-museum-intro__date">{data.museumDate.trim()}</p>
      ) : null}
      <p className="love-museum-intro__text">
        {pieceCount > 0
          ? `${pieceCount} ${pieceCount === 1 ? "quadro" : "quadros"} com os momentos que marcaram essa história. Entra, olha com calma e revive cada memória.`
          : "Uma galeria só nossa. Cada quadro guarda um pedacinho da nossa história."}
      </p>
    </header>
  );
}

export function LoveMuseumEmbed({
  data,
  person1,
  person2,
  hideIntro = false,
}: {
  data: MuseumOfUsData;
  person1: string;
  person2: string;
  hideIntro?: boolean;
}) {
  const { sender, receiver, coupleName } = getMuseumEmbedMeta(data, person1, person2);

  return (
    <div className="love-embed love-embed--museum">
      {!hideIntro ? <LoveMuseumIntro data={data} person1={person1} person2={person2} /> : null}
      <HistoriaMuseuSection
        module={{
          elements: data.elements ?? [],
          museumTitle: data.museumTitle,
          museumDate: data.museumDate,
          coupleName,
        }}
        senderName={sender}
        receiverName={receiver}
      />
    </div>
  );
}

export function LovePolaroidEmbed({
  data,
  person1,
  person2,
}: {
  data: PolaroidCameraData;
  person1: string;
  person2: string;
}) {
  const hasPhotos = data.photos?.some((p) => p.url);
  if (!hasPhotos && !data.message?.trim()) return null;

  return (
    <div className="love-embed love-embed--polaroid">
      <HistoriaPolaroidSection
        module={{
          message: data.message,
          photos: data.photos,
          labelTexts: data.labelTexts,
        }}
        senderName={person1}
        receiverName={person2}
      />
    </div>
  );
}

export function LoveChocolateEmbed({
  data,
  person1,
  person2,
}: {
  data: ChocolateBoxData;
  person1: string;
  person2: string;
}) {
  if (!data.placements?.length) return null;

  return (
    <div className="love-embed love-embed--chocolate">
      <HistoriaChocolatesSection
        module={{
          boxTitle: data.boxTitle,
          message: data.message,
          placements: data.placements,
        }}
        senderName={person1}
        receiverName={person2}
      />
    </div>
  );
}

export function LoveEmbeddedSection({
  section,
  person1,
  person2,
}: {
  section: BuilderSection;
  person1: string;
  person2: string;
}) {
  switch (section.sectionId) {
    case "museum_of_us":
      return (
        <LoveMuseumEmbed
          data={section.data as MuseumOfUsData}
          person1={person1}
          person2={person2}
        />
      );
    case "polaroid_camera":
      return (
        <LovePolaroidEmbed
          data={section.data as PolaroidCameraData}
          person1={person1}
          person2={person2}
        />
      );
    case "chocolate_box":
      return (
        <LoveChocolateEmbed
          data={section.data as ChocolateBoxData}
          person1={person1}
          person2={person2}
        />
      );
    default:
      return null;
  }
}
