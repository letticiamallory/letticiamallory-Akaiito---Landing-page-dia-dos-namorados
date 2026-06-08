import type { BouquetConfig } from "@/lib/bouquet-catalog";
import {
  getBouquetImageUrl,
  MAIN_FLOWERS,
  SUPPORT_FLOWERS,
} from "@/lib/bouquet-catalog";
import "./bouquet-preview.css";

/**
 * Preview igual ao repositório wrotecode/BUILD-A-BOUQUET:
 * uma imagem composta (flores + papel + laço já montados).
 */
export function BouquetPreview({
  config,
  className = "",
  showLabel = true,
}: {
  config: BouquetConfig;
  className?: string;
  showLabel?: boolean;
}) {
  const main = MAIN_FLOWERS[config.mainFlowerId];
  const support = SUPPORT_FLOWERS[config.supportFlowerId];

  return (
    <div className={`bouquet-preview-wrap ${className}`}>
      <div className="bouquet-card" id="bouquetCard">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={getBouquetImageUrl(config)}
          alt={`Buquê ${main.name} e ${support.name}`}
          className="bouquet-card-img"
          draggable={false}
        />
        {showLabel && (
          <h3 className="bouquet-card-title">
            {main.name} + {support.name}
          </h3>
        )}
      </div>
    </div>
  );
}
