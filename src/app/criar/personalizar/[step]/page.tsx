import { CustomizeSectionStep } from "@/builder/steps/CustomizeSection";

export default async function CriarPersonalizarPage({
  params,
}: {
  params: Promise<{ step: string }>;
}) {
  const { step } = await params;
  const index = parseInt(step, 10);
  if (Number.isNaN(index) || index < 0) {
    return null;
  }
  return <CustomizeSectionStep stepIndex={index} />;
}
