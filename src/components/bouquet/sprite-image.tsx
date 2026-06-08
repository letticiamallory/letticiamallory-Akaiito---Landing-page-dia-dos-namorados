type Crop = { x: number; y: number; w: number; h: number };

export function SpriteImage({
  sheetSrc,
  sheetW,
  sheetH,
  crop,
  displayWidth,
  className = "",
}: {
  sheetSrc: string;
  sheetW: number;
  sheetH: number;
  crop: Crop;
  displayWidth: number;
  className?: string;
}) {
  const scale = displayWidth / crop.w;
  const height = crop.h * scale;

  return (
    <div
      className={className}
      style={{
        width: displayWidth,
        height,
        backgroundImage: `url(${sheetSrc})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: `${sheetW * scale}px ${sheetH * scale}px`,
        backgroundPosition: `${-crop.x * scale}px ${-crop.y * scale}px`,
      }}
      role="img"
    />
  );
}
