import { redirect } from "next/navigation";
import { isActiveProduct } from "@/lib/products";

export default async function CriarPage({ params }: { params: Promise<{ productId: string }> }) {
  const { productId } = await params;

  if (!isActiveProduct(productId)) {
    redirect("/criar/secoes");
  }

  redirect("/criar/secoes");
}
