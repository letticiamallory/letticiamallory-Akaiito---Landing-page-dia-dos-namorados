"use client";

type PresentPageScreenshotProps = {
  src: string;
  alt: string;
};

export function PresentPageScreenshot({ src, alt }: PresentPageScreenshotProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className="feature-phone__fallback-image"
      loading="eager"
      decoding="async"
      draggable={false}
      style={{
        width: "393px",
        height: "852px",
        objectFit: "cover",
        objectPosition: "top center",
        display: "block",
      }}
    />
  );
}
