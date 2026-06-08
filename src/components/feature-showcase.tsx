"use client";

import type { FeatureShowcaseItem } from "@/lib/historia-modules-catalog";
import { FeatureMockupContent, FEATURE_MOCKUP_IDS } from "@/components/marketing/FeatureMockupContent";
import { MockupSection } from "@/components/marketing/MockupSection";
import { PhoneMockup } from "@/components/marketing/PhoneMockup";

function StaticPhonePreview({
  src,
  alt,
  priority = false,
}: {
  src: string;
  alt: string;
  priority?: boolean;
}) {
  return (
    <PhoneMockup scale={0.38} priority={priority}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="feature-phone__fallback-image"
        loading={priority ? "eager" : "lazy"}
        draggable={false}
        style={{ width: "393px", height: "852px", objectFit: "cover", objectPosition: "top center" }}
      />
    </PhoneMockup>
  );
}

function FeatureRow({
  feature,
  reversed = false,
  index,
}: {
  feature: FeatureShowcaseItem;
  reversed?: boolean;
  index: number;
}) {
  const delay = index % 4;
  const hasLiveMockup = FEATURE_MOCKUP_IDS.has(feature.id);

  return (
    <article
      className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center py-10 lg:py-14 border-b border-[var(--border)] last:border-b-0"
    >
      <div className={`fade-up d${delay} ${reversed ? "lg:order-2" : ""}`}>
        {hasLiveMockup ? (
          <MockupSection>
            {(active) => (
              <FeatureMockupContent
                featureId={feature.id}
                active={active}
                priority={index === 0}
              />
            )}
          </MockupSection>
        ) : (
          <StaticPhonePreview
            src={feature.preview}
            alt={feature.previewAlt}
            priority={index === 0}
          />
        )}
      </div>

      <div className={`fade-up d${(delay + 1) % 4} ${reversed ? "lg:order-1" : ""}`}>
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <span className="text-2xl" aria-hidden>
            {feature.icon}
          </span>
          {feature.badge && (
            <span className="text-[0.6rem] tracking-widest uppercase text-[var(--cream)] bg-[var(--rose)]/80 border border-[rgba(196,66,106,0.45)] px-2.5 py-1 rounded-full">
              {feature.badge}
            </span>
          )}
          {feature.optional && !feature.badge && (
            <span className="text-[0.6rem] tracking-widest uppercase text-[var(--text-dim)] border border-[var(--border2)] px-2.5 py-1 rounded-full">
              Opcional
            </span>
          )}
        </div>

        <h4 className="font-display font-semibold text-xl md:text-2xl tracking-tight mb-3">
          {feature.title}
        </h4>
        <p className="text-sm leading-relaxed text-[var(--text-muted)] mb-5 max-w-lg">
          {feature.description}
        </p>

        <ul className="space-y-2">
          {feature.highlights.map((item) => (
            <li
              key={item}
              className="flex items-start gap-2.5 text-sm text-[var(--text-muted)]"
            >
              <span
                className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--rose)] shrink-0"
                aria-hidden
              />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

export function FeatureShowcase({
  label,
  title,
  subtitle,
  features,
  startReversed = false,
}: {
  label: string;
  title: string;
  subtitle?: string;
  features: FeatureShowcaseItem[];
  startReversed?: boolean;
}) {
  return (
    <div className="mb-20 last:mb-0">
      <div className="mb-10 md:mb-12">
        <div className="fade-up text-[0.65rem] tracking-[0.2em] uppercase text-[var(--rose)] mb-4 flex items-center gap-3 before:content-[''] before:block before:w-6 before:h-px before:bg-current before:opacity-50">
          {label}
        </div>
        <h3 className="fade-up d1 font-display text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight">
          {title}
        </h3>
        {subtitle && (
          <p className="fade-up d2 text-sm leading-relaxed text-[var(--text-muted)] mt-3 max-w-2xl">
            {subtitle}
          </p>
        )}
      </div>

      <div>
        {features.map((feature, i) => (
          <FeatureRow
            key={feature.id}
            feature={feature}
            index={i}
            reversed={startReversed ? i % 2 === 0 : i % 2 === 1}
          />
        ))}
      </div>
    </div>
  );
}
