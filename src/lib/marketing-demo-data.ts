import { DEMO_PRESENT } from "@/data/demo-present";
import type { ChocolateBoxData, LoveLetterData, MuseumOfUsData } from "@/lib/builder/types";
import type { ChocolatesData, MuseuData } from "@/lib/gift-types";

const DEMO_SENDER = "João";
const DEMO_RECEIVER = "Letticia";

function sectionData<T>(sectionId: string): T {
  const section = DEMO_PRESENT.sections.find((s) => s.sectionId === sectionId);
  if (!section) throw new Error(`Demo section missing: ${sectionId}`);
  return section.data as T;
}

export const DEMO_LETTER_MESSAGE =
  "Você é a pessoa mais incrível que já conheci. Cada dia ao seu lado é um presente.";

export function getDemoMuseumData(): MuseuData {
  const data = sectionData<MuseumOfUsData>("museum_of_us");
  return {
    senderName: DEMO_SENDER,
    receiverName: DEMO_RECEIVER,
    coupleName: `${data.person1Name} & ${data.person2Name}`,
    museumTitle: data.museumTitle,
    museumDate: data.museumDate,
    elements: data.elements,
  };
}

export function getDemoChocolateData(): ChocolatesData {
  const data = sectionData<ChocolateBoxData>("chocolate_box");
  return {
    senderName: DEMO_SENDER,
    receiverName: DEMO_RECEIVER,
    boxTitle: data.boxTitle,
    message: data.message,
    placements: (data.placements ?? []).map((placement) => ({
      ...placement,
      biteStage:
        placement.slotIndex === 2
          ? 1
          : placement.slotIndex === 8
            ? 2
            : placement.biteStage ?? 0,
    })),
  };
}

export function getDemoLetterData(): LoveLetterData {
  return sectionData<LoveLetterData>("love_letter");
}
