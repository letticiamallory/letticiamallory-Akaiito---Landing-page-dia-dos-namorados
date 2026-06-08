import type { WaxSealId } from "@/lib/letter-catalog";
import { WAX_SEALS } from "@/lib/letter-catalog";

export function WaxSealImage({
  sealId,
  fitWidth = 56,
  className = "",
}: {
  sealId: WaxSealId;
  fitWidth?: number;
  className?: string;
}) {
  const seal = WAX_SEALS[sealId];

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={seal.src}
      alt={seal.name}
      width={fitWidth}
      height={fitWidth}
      className={`block object-contain bg-transparent ${className}`}
      style={{ width: fitWidth, height: fitWidth }}
      draggable={false}
    />
  );
}
