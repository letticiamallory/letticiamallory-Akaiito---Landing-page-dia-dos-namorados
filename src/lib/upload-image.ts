export async function uploadImageFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch("/api/upload", { method: "POST", body: formData });
  const data = await res.json();
  if (!res.ok || !data.url) {
    throw new Error(data.error || "Não foi possível enviar a foto.");
  }
  return data.url;
}
