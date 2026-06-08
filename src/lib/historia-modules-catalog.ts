/** Catálogo de marketing — showcase visual estilo Love Panda */

export interface FeatureShowcaseItem {
  id: string;
  icon: string;
  title: string;
  description: string;
  highlights: string[];
  preview: string;
  previewAlt: string;
  optional?: boolean;
  badge?: string;
}

export const FEATURE_SHOWCASE_CORE: FeatureShowcaseItem[] = [
  {
    id: "music",
    icon: "🎵",
    title: "Trilha sonora de vocês",
    description:
      "A música que toca quando vocês se lembram um do outro, com capa, player e uma frase só de vocês.",
    highlights: [
      "Cole o link do YouTube",
      "Toca automaticamente ao abrir a página",
      "Adicione uma frase especial abaixo da música",
    ],
    preview: "/marketing/previews/music-card.svg",
    previewAlt: "Preview do card de música no celular",
  },
  {
    id: "hero",
    icon: "🎁",
    title: "A surpresa começa aqui",
    description:
      "Ele(a) toca na caixa, a câmera aparece, o flash dispara, e as fotos de vocês saem voando em polaroid.",
    highlights: [
      "Caixa animada pra abrir com o toque",
      "Câmera polaroid com as fotos do casal",
      "Funciona perfeitamente no celular",
    ],
    preview: "/marketing/previews/hero-gift.svg",
    previewAlt: "Preview da caixa de presente e câmera polaroid no celular",
  },
  {
    id: "about_couple",
    icon: "💕",
    title: "A história de vocês",
    description:
      "Foto, nomes e o tempo exato que vocês estão juntos, atualizando ao vivo enquanto ele(a) lê.",
    highlights: [
      "Foto do casal em destaque",
      "Nomes e uma frase só de vocês",
      "Contador ao vivo desde o primeiro dia",
    ],
    preview: "/marketing/previews/about-couple.webp",
    previewAlt: "Preview do card sobre o casal com foto e contador",
  },
  {
    id: "memories",
    icon: "🖼️",
    title: "As memórias de vocês",
    description:
      "Organize os momentos que marcaram: viagens, dates, fotos aleatórias. Cada um abre uma galeria pra ele(a) rolar com calma.",
    highlights: [
      "Separe por momentos com título próprio",
      "Galeria fullscreen no celular",
      "Visual de colagem com estilo scrapbook",
    ],
    preview: "/marketing/previews/memories.png",
    previewAlt: "Preview da galeria de memórias estilo scrapbook",
  },
  {
    id: "letter",
    icon: "💌",
    title: "A carta que você escreve",
    description:
      "Ele(a) toca no envelope, o selo quebra e a carta aparece, com as suas palavras, do jeito que você escreveu.",
    highlights: [
      "Envelope animado que abre ao toque",
      "Papel, selo de cera e assinatura personalizados",
      "Texto livre, escrito por você",
    ],
    preview: "/marketing/previews/letter.png",
    previewAlt: "Preview da carta de amor com envelope e buquê",
  },
];

export const FEATURE_SHOWCASE_SURPRISES: FeatureShowcaseItem[] = [
  {
    id: "museum",
    icon: "🏛️",
    title: "Museu de Nós",
    description:
      "Um museu só de vocês: quadros com as fotos do casal nas paredes, visitantes passeando e uma experiência que ele(a) nunca vai ter visto antes.",
    highlights: [
      "Salão interativo com cenas animadas",
      "Molduras com as fotos que você escolher",
      "Experiência imersiva no scroll",
    ],
    preview: "/marketing/previews/museum.png",
    previewAlt: "Preview do Museu de Nós com quadros e fotos",
    optional: true,
    badge: "Extra",
  },
  {
    id: "chocolate",
    icon: "🍫",
    title: "Caixa de Bombons",
    description:
      "Você monta a caixa, ele(a) abre a tampa e morde um a um.",
    highlights: [
      "Vários sabores pra montar do seu jeito",
      "Animação de mordida a cada toque",
      "Caixa montada por você no builder",
    ],
    preview: "/marketing/previews/chocolate.png",
    previewAlt: "Preview da caixa de chocolates interativa",
    optional: true,
    badge: "Extra",
  },
  {
    id: "bouquet",
    icon: "💐",
    title: "Buquê personalizado",
    description:
      "Você escolhe as flores, as cores e o laço. O buquê aparece junto com a carta como um detalhe só de vocês.",
    highlights: [
      "Flores e combinações à sua escolha",
      "Ilustração romântica personalizada",
      "Aparece integrado ao card da carta",
    ],
    preview: "/marketing/previews/bouquet.png",
    previewAlt: "Preview do buquê personalizado de flores",
    optional: true,
  },
];

export const HISTORIA_THEMES_MARKETING = ["Scrapbook romântico"] as const;
