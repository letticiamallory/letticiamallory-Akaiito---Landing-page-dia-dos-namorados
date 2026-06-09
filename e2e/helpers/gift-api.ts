import type { APIRequestContext } from "@playwright/test";
import type { ScrapbookPresentData } from "../../src/lib/builder/types";
import { E2E_PRESENT_DATA, MINIMAL_PRESENT_DATA } from "../fixtures/present-data";

export interface CreatedGift {
  id: string;
  checkoutUrl: string;
}

export interface PaidGift {
  id: string;
  slug: string;
  link: string;
}

function uniqueEmail(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@akaiito.test`;
}

export async function createGift(
  request: APIRequestContext,
  options?: {
    buyerEmail?: string;
    data?: ScrapbookPresentData;
    productId?: string;
  }
): Promise<CreatedGift> {
  const res = await request.post("/api/gifts", {
    data: {
      productId: options?.productId ?? "historia",
      buyerEmail: options?.buyerEmail ?? uniqueEmail("e2e"),
      data: options?.data ?? MINIMAL_PRESENT_DATA,
      timeout: 60_000,
      amountCents: 490,
    },
  });
  const body = await res.json();
  if (!res.ok()) {
    throw new Error(`createGift failed (${res.status()}): ${body.error ?? JSON.stringify(body)}`);
  }
  return body as CreatedGift;
}

export async function confirmGiftDemo(
  request: APIRequestContext,
  giftId: string
): Promise<PaidGift> {
  const res = await request.post(`/api/gifts/${giftId}`, {
    data: { demo: true },
  });
  const body = await res.json();
  if (!res.ok()) {
    throw new Error(`confirmGiftDemo failed (${res.status()}): ${body.error ?? JSON.stringify(body)}`);
  }
  return { id: giftId, slug: body.slug, link: body.link };
}

export async function getGift(request: APIRequestContext, giftId: string) {
  const res = await request.get(`/api/gifts/${giftId}`);
  return { status: res.status(), body: await res.json() };
}

export async function createAndPayGift(
  request: APIRequestContext,
  data?: ScrapbookPresentData
): Promise<PaidGift> {
  const created = await createGift(request, { data });
  return confirmGiftDemo(request, created.id);
}

export function slugFromLink(link: string): string {
  const match = link.match(/\/presente\/([^/?#]+)/);
  if (!match) throw new Error(`Slug não encontrado em: ${link}`);
  return match[1];
}
