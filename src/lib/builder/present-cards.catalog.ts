import type { BuilderSection, SectionId } from "./types";

export interface PresentCardItem {
  id: string;
  icon: string;
  name: string;
  description: string;
  sectionIds: SectionId[];
  locked?: boolean;
  premium?: boolean;
  premiumBadge?: string;
}

/** Cards exibidos na página final — espelham o presente entregue */
export const PRESENT_CARDS_CATALOG: PresentCardItem[] = [
  {
    id: "music",
    icon: "🎵",
    name: "Trilha sonora de vocês",
    description:
      "A música que toca quando vocês se lembram um do outro, com capa, player e uma frase só de vocês.",
    sectionIds: ["favorite_song"],
    locked: true,
  },
  {
    id: "hero",
    icon: "🎁",
    name: "A surpresa começa aqui",
    description:
      "Ele(a) toca na caixa, a câmera aparece, o flash dispara, e as fotos de vocês saem voando em polaroid.",
    sectionIds: ["polaroid_camera"],
    locked: true,
  },
  {
    id: "about_couple",
    icon: "💕",
    name: "A história de vocês",
    description:
      "Foto, nomes e o tempo exato que vocês estão juntos, atualizando ao vivo enquanto ele(a) lê.",
    sectionIds: ["hero_couple", "counter_together"],
    locked: true,
  },
  {
    id: "memories",
    icon: "🖼️",
    name: "As memórias de vocês",
    description:
      "Organize os momentos que marcaram: viagens, dates, fotos aleatórias. Cada um abre uma galeria pra ele(a) rolar com calma.",
    sectionIds: ["photo_collage"],
  },
  {
    id: "letter",
    icon: "💌",
    name: "A carta que você escreve",
    description:
      "Ele(a) toca no envelope, o selo quebra e a carta aparece, com as suas palavras, do jeito que você escreveu.",
    sectionIds: ["love_letter"],
  },
  {
    id: "museum",
    icon: "🏛️",
    name: "Museu de Nós",
    description:
      "Um museu só de vocês: quadros com as fotos do casal nas paredes, visitantes passeando e uma experiência que ele(a) nunca vai ter visto antes.",
    sectionIds: ["museum_of_us"],
    premium: true,
    premiumBadge: "Extra",
  },
  {
    id: "chocolate",
    icon: "🍫",
    name: "Caixa de Bombons",
    description:
      "Você monta a caixa, ele(a) abre a tampa e morde um a um.",
    sectionIds: ["chocolate_box"],
    premium: true,
    premiumBadge: "Extra",
  },
  {
    id: "forever",
    icon: "♾️",
    name: "Despedida",
    description:
      "A mensagem final da página: título, texto com efeito de digitação e assinatura.",
    sectionIds: ["custom_message"],
    locked: true,
  },
];

export function isPresentCardSelected(
  sections: BuilderSection[],
  card: PresentCardItem
): boolean {
  return card.sectionIds.every((id) => sections.some((s) => s.sectionId === id));
}

export function countSelectedPresentCards(sections: BuilderSection[]): number {
  return PRESENT_CARDS_CATALOG.filter((card) => isPresentCardSelected(sections, card)).length;
}
