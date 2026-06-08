/** URL pública do site — ignora env vazia e remove barra final. */
export function resolveBaseUrl(fallback?: string): string {
  const fromEnv = process.env.NEXT_PUBLIC_BASE_URL?.trim();
  const base = fromEnv || fallback?.trim() || "";
  if (!base) {
    throw new Error("NEXT_PUBLIC_BASE_URL não configurada");
  }
  return base.replace(/\/$/, "");
}
