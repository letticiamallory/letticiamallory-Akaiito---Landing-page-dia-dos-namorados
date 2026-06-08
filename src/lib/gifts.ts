import { and, eq } from "drizzle-orm";
import { db, ensureSchema } from "@/lib/db";
import { gifts } from "@/lib/db/schema";
import { sendGiftLinkEmail } from "@/lib/email/send-gift-link";
import { generateSlug } from "@/lib/slug";
import { getProduct, type ProductId } from "@/lib/products";
import {
  createPreference,
  isPaymentApproved,
  getPayment,
  verifyGiftPayment,
  pickCheckoutUrl,
  shouldUseSandboxCheckout,
} from "@/lib/mercadopago";

export async function createGift(params: {
  productId: ProductId;
  data: object;
  buyerEmail: string;
  baseUrl: string;
  amountCents?: number;
}) {
  await ensureSchema();
  const product = getProduct(params.productId);
  if (!product) throw new Error("Produto inválido");

  const amountCents = params.amountCents ?? product.priceCents;
  const id = crypto.randomUUID();
  const now = Math.floor(Date.now() / 1000);

  const preference = await createPreference({
    giftId: id,
    productId: params.productId,
    buyerEmail: params.buyerEmail,
    baseUrl: params.baseUrl,
    amountCents,
  });

  await db.insert(gifts).values({
    id,
    productId: params.productId,
    data: JSON.stringify(params.data),
    status: "pending",
    amountCents,
    mpPreferenceId: preference.preferenceId,
    buyerEmail: params.buyerEmail,
    createdAt: now,
  });

  return {
    id,
    checkoutUrl: pickCheckoutUrl(preference, params.baseUrl),
    sandboxCheckoutUrl: preference.sandboxInitPoint,
    liveCheckoutUrl: preference.initPoint,
    useSandboxCheckout: shouldUseSandboxCheckout(params.baseUrl),
  };
}

export async function markGiftPaid(giftId: string, mpPaymentId?: string) {
  await ensureSchema();
  const slug = generateSlug();
  const now = Math.floor(Date.now() / 1000);

  const [gift] = await db
    .update(gifts)
    .set({
      status: "paid",
      slug,
      mpPaymentId: mpPaymentId ?? null,
      paidAt: now,
    })
    .where(and(eq(gifts.id, giftId), eq(gifts.status, "pending")))
    .returning();

  if (!gift) {
    const [existing] = await db.select().from(gifts).where(eq(gifts.id, giftId)).limit(1);
    return existing?.slug ?? null;
  }

  void sendGiftLinkEmail({
    to: gift.buyerEmail,
    slug,
    giftData: gift.data,
  }).catch((err) => {
    console.error("[email] Falha ao enviar link do presente:", err);
  });

  return slug;
}

export async function confirmGiftPayment(giftId: string, mpPaymentId?: string) {
  await ensureSchema();
  const [gift] = await db.select().from(gifts).where(eq(gifts.id, giftId)).limit(1);
  if (!gift) return null;
  if (gift.status === "paid" && gift.slug) return gift.slug;

  if (mpPaymentId && mpPaymentId !== "demo_payment") {
    const payment = await getPayment(mpPaymentId);
    if (!payment || !isPaymentApproved(payment.status)) return null;
    if (payment.external_reference && payment.external_reference !== giftId) return null;
  }

  return markGiftPaid(giftId, mpPaymentId);
}

export async function confirmGiftFromMercadoPago(giftId: string, paymentId?: string) {
  const verifiedPaymentId = await verifyGiftPayment(giftId, paymentId);
  if (!verifiedPaymentId) return null;
  return confirmGiftPayment(giftId, verifiedPaymentId);
}

export async function getGiftById(id: string) {
  await ensureSchema();
  const [gift] = await db.select().from(gifts).where(eq(gifts.id, id)).limit(1);
  return gift ?? null;
}

export async function getGiftBySlug(slug: string) {
  await ensureSchema();
  const [gift] = await db
    .select()
    .from(gifts)
    .where(eq(gifts.slug, slug))
    .limit(1);
  return gift ?? null;
}
