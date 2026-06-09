"use client";

type InlineSvgProps = {
  src: string;
  className?: string;
  draggable?: boolean;
  title?: string;
};

/**
 * Museum SVGs embed WebPs as data URIs. Use <img> — <object> fails inside
 * CSS-scaled canvases (frame overlays and spectators render blank or tiny).
 */
export function InlineSvg({ src, className, draggable = false, title }: InlineSvgProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={title ?? ""}
      className={className}
      draggable={draggable}
      decoding="async"
      style={{ display: "block", width: "100%", height: "100%" }}
    />
  );
}
