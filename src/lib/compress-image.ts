const MAX_SIDE = 1600;
const JPEG_QUALITY = 0.82;
const SKIP_BELOW_BYTES = 350_000;

export type CompressImageOptions = {
  maxSide?: number;
  quality?: number;
  skipBelowBytes?: number;
};

/** Redimensiona e comprime antes do upload — essencial no celular (fotos de 5–12 MB). */
export async function compressImageFile(file: File, options?: CompressImageOptions): Promise<File> {
  const maxSide = options?.maxSide ?? MAX_SIDE;
  const quality = options?.quality ?? JPEG_QUALITY;
  const skipBelow = options?.skipBelowBytes ?? SKIP_BELOW_BYTES;

  if (!file.type.startsWith("image/")) return file;
  if (file.size <= skipBelow && (file.type === "image/jpeg" || file.type === "image/webp")) {
    return file;
  }

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    return file;
  }

  const longest = Math.max(bitmap.width, bitmap.height);
  const scale = longest > maxSide ? maxSide / longest : 1;
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close();
    return file;
  }

  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, "image/jpeg", quality);
  });
  if (!blob) return file;

  const baseName = file.name.replace(/\.[^.]+$/, "") || "foto";
  return new File([blob], `${baseName}.jpg`, { type: "image/jpeg" });
}
