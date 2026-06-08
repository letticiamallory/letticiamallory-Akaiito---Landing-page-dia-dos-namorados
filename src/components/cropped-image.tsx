export function CroppedImage({
  src,
  sheetW,
  sheetH,
  crop,
  width,
  height,
  className,
}: {
  src: string;
  sheetW: number;
  sheetH: number;
  crop: { x: number; y: number; w: number; h: number };
  width: number | string;
  height: number | string;
  className?: string;
}) {
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${crop.w} ${crop.h}`}
      overflow="hidden"
      className={className}
    >
      <image
        href={src}
        x={-crop.x}
        y={-crop.y}
        width={sheetW}
        height={sheetH}
        preserveAspectRatio="none"
      />
    </svg>
  );
}
