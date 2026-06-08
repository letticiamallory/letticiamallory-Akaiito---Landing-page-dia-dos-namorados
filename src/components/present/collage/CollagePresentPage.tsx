"use client";

import { useCallback, useMemo } from "react";
import type {
  ChocolateBoxData,
  CounterTogetherData,
  CustomMessageData,
  FavoriteSongData,
  HeroCoupleData,
  LoveLetterData,
  MuseumOfUsData,
  PhotoCollageData,
  PolaroidCameraData,
  ScrapbookPresentData,
} from "@/lib/builder/types";
import { getCoupleNames, sortSections } from "@/lib/builder/utils";
import { buildPandaCards, type PandaCardId } from "@/lib/panda-present";
import { useBuilderStore } from "@/builder/store/builder.store";
import { LoveAmbient } from "@/components/present/love-landing/LoveAmbient";
import { LoveEmbeddedSection, LoveMuseumEmbed, LoveMuseumIntro } from "@/components/present/love-landing/LoveEmbeddedExperience";
import { LoveLetterScreen } from "@/components/present/love-landing/LoveLetterScreen";
import { PandaAboutCard } from "@/components/present/panda/PandaAboutCard";
import { PandaCard } from "@/components/present/panda/PandaCard";
import { PandaBouquetCard } from "@/components/present/panda/PandaBouquetCard";
import { PandaFarewellCard } from "@/components/present/panda/PandaFarewellCard";
import { PandaGalleryCard } from "@/components/present/panda/PandaGalleryCard";
import { PandaHeroCard } from "@/components/present/panda/PandaHeroCard";
import { PandaMusicCard } from "@/components/present/panda/PandaMusicCard";
import { PresentAssetPreloader } from "@/components/present/PresentAssetPreloader";
import "@/components/present/panda/panda-present.css";
import "./collage.css";

function sectionData<T>(sections: { sectionId: string; data: unknown }[], id: string) {
  return sections.find((s) => s.sectionId === id)?.data as T | undefined;
}

export function CollagePresentPage({
  data,
  preview = false,
}: {
  data: ScrapbookPresentData;
  preview?: boolean;
}) {
  const sorted = useMemo(() => sortSections(data.sections), [data.sections]);
  const cards = useMemo(() => buildPandaCards(sorted), [sorted]);

  const hero = sorted.find((s) => s.sectionId === "hero_couple");
  const { person1, person2 } = getCoupleNames(sorted);

  const updateSectionData = useBuilderStore((s) => s.updateSectionData);

  const handleFixHeroPhoto = useCallback(
    (url: string) => {
      if (!preview || !hero) return;
      const current = (hero.data as HeroCoupleData).backgroundPhoto;
      if (url === current) return;
      updateSectionData(hero.id, { backgroundPhoto: url });
    },
    [preview, hero, updateSectionData]
  );

  const renderCardContent = (cardId: PandaCardId, cardSections: typeof sorted) => {
    switch (cardId) {
      case "hero": {
        const polaroid = sectionData<PolaroidCameraData>(cardSections, "polaroid_camera");
        return <PandaHeroCard polaroid={polaroid} />;
      }
      case "music": {
        const music = sectionData<FavoriteSongData>(cardSections, "favorite_song");
        return music ? <PandaMusicCard data={music} /> : null;
      }
      case "about_couple": {
        const h = sectionData<HeroCoupleData>(cardSections, "hero_couple");
        const c =
          sectionData<CounterTogetherData>(cardSections, "counter_together") ??
          sectionData<CounterTogetherData>(sorted, "counter_together");
        return (
          <PandaAboutCard
            hero={h}
            counter={c}
            onPhotoResolved={preview ? handleFixHeroPhoto : undefined}
          />
        );
      }
      case "memories": {
        const d =
          sectionData<PhotoCollageData>(cardSections, "photo_collage") ??
          ({ photos: [], layout: "scattered" as const, moments: undefined });
        return (
          <PandaGalleryCard data={d} person1={person1 || "João"} person2={person2 || "Letticia"} />
        );
      }
      case "bouquet": {
        const hero = sectionData<HeroCoupleData>(cardSections, "hero_couple");
        return (
          <PandaBouquetCard hero={hero} senderName={person1 || hero?.person1Name || "João"} />
        );
      }
      case "letter": {
        const d = sectionData<LoveLetterData>(cardSections, "love_letter");
        return d ? (
          <LoveLetterScreen
            data={d}
            senderName={person1 || "João"}
            receiverName={person2 || "Letticia"}
          />
        ) : null;
      }
      case "project_museum":
      case "project_chocolate":
      case "project_polaroid":
        return cardSections.map((section) => (
          <LoveEmbeddedSection
            key={section.id}
            section={section}
            person1={person1 || "João"}
            person2={person2 || "Letticia"}
          />
        ));
      case "forever": {
        const d = sectionData<CustomMessageData>(cardSections, "custom_message");
        return d ? <PandaFarewellCard data={d} /> : null;
      }
      default:
        return null;
    }
  };

  return (
    <div className={`panda-present collage-page${preview ? " collage-page--preview" : ""}`}>
      <PresentAssetPreloader data={data} />
      <div className="panda-present__frame">
        <LoveAmbient />

        <div className="panda-present__scroll">
          {cards.map((card) => {
            const isHero = card.def.id === "hero";
            const isMusic = card.def.id === "music";
            const isMuseum = card.def.id === "project_museum";
            const content = renderCardContent(card.def.id, card.sections);
            if (!content) return null;

            if (isMuseum) {
              const museumData = sectionData<MuseumOfUsData>(card.sections, "museum_of_us");
              if (!museumData) return null;
              const p1 = person1 || "João";
              const p2 = person2 || "Letticia";

              return (
                <PandaCard key={card.def.id} def={card.def} noPadding>
                  <LoveMuseumIntro data={museumData} person1={p1} person2={p2} />
                  <LoveMuseumEmbed
                    data={museumData}
                    person1={p1}
                    person2={p2}
                    hideIntro
                  />
                </PandaCard>
              );
            }

            return (
              <PandaCard
                key={card.def.id}
                def={card.def}
                noPadding={isHero || isMusic}
              >
                {content}
              </PandaCard>
            );
          })}
        </div>
      </div>
    </div>
  );
}
