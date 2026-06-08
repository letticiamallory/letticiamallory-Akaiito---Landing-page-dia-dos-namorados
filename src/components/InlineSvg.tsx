"use client";

type InlineSvgProps = {
  src: string;
  className?: string;
  draggable?: boolean;
  title?: string;
};

/**
 * SVGs otimizados referenciam WebPs em *.assets/ — <img> não carrega isso.
 * <object> carrega o SVG como documento e resolve as imagens externas.
 */
export function InlineSvg({ src, className, draggable = false, title }: InlineSvgProps) {
  return (
    <object
      data={src}
      type="image/svg+xml"
      className={className}
      aria-label={title}
      draggable={draggable}
    />
  );
}
