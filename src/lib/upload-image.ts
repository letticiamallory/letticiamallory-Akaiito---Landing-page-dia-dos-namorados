import { compressImageFile } from "@/lib/compress-image";

export type UploadImageOptions = {
  /** Fotos do card Memórias — mais leves para caber no rascunho do builder */
  profile?: "default" | "collage";
};

export async function uploadImageFile(file: File, options?: UploadImageOptions): Promise<string> {
  const compressed = await compressImageFile(
    file,
    options?.profile === "collage"
      ? { maxSide: 1080, quality: 0.76, skipBelowBytes: 180_000 }
      : undefined
  );
  const formData = new FormData();
  formData.append("file", compressed);
  const res = await fetch("/api/upload", { method: "POST", body: formData });
  const data = (await res.json()) as { url?: string; error?: string };
  if (!res.ok || !data.url) {
    throw new Error(data.error || "Não foi possível enviar a foto.");
  }
  return data.url;
}
