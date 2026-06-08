export type ProductId =
  | "historia"
  | "joguinho"
  | "carta"
  | "museu"
  | "polaroid"
  | "slot"
  | "chocolates"
  | "kit";

export interface Product {
  id: ProductId;
  name: string;
  description: string;
  priceCents: number;
  originalPriceCents?: number;
  icon: string;
  badge?: string;
  wide?: boolean;
  featured?: boolean;
}

/** Único produto ativo na loja */
export const PRODUCTS: Product[] = [
  {
    id: "historia",
    name: "Memórias de Nós",
    description:
      "Escolha o que vai ter na página: música, carta, fotos, contador de dias juntos e muito mais. Em minutos você tem um link único pra mandar no WhatsApp.",
    priceCents: 490,
    icon: "📔",
    badge: "Entrega imediata",
    wide: true,
    featured: true,
  },
];

export function getProduct(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function isActiveProduct(id: string): boolean {
  return id === "historia";
}

export function formatPrice(cents: number): string {
  return `R$ ${(cents / 100).toFixed(cents % 100 === 0 ? 0 : 2).replace(".", ",")}`;
}
