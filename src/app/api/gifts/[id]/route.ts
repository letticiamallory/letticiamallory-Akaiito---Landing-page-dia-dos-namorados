import { NextRequest, NextResponse } from "next/server";
import {
  confirmGiftFromMercadoPago,
  confirmGiftPayment,
  getGiftById,
} from "@/lib/gifts";
import { isDemoMode } from "@/lib/mercadopago";

function giftLink(req: NextRequest, slug: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || req.nextUrl.origin;
  return `${baseUrl}/presente/${slug}`;
}

function isLocalRequest(req: NextRequest): boolean {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || req.nextUrl.origin;
  return /localhost|127\.0\.0\.1/i.test(baseUrl) || /localhost|127\.0\.0\.1/i.test(req.nextUrl.origin);
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const gift = await getGiftById(id);

  if (!gift) {
    return NextResponse.json({ error: "Presente não encontrado" }, { status: 404 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || _req.nextUrl.origin;

  let presentData: unknown = undefined;
  if (gift.status === "pending") {
    try {
      presentData = JSON.parse(gift.data);
    } catch {
      presentData = undefined;
    }
  }

  return NextResponse.json({
    id: gift.id,
    status: gift.status,
    slug: gift.slug,
    productId: gift.productId,
    link: gift.slug ? `${baseUrl}/presente/${gift.slug}` : null,
    presentData,
    demoMode: isDemoMode(),
    allowDevConfirm: isLocalRequest(_req) && process.env.NODE_ENV !== "production",
  });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const gift = await getGiftById(id);

  if (!gift) {
    return NextResponse.json({ error: "Presente não encontrado" }, { status: 404 });
  }

  if (gift.status === "paid" && gift.slug) {
    return NextResponse.json({ slug: gift.slug, link: giftLink(req, gift.slug) });
  }

  const body = await req.json().catch(() => ({}));
  const demo = body.demo === true || isDemoMode();
  const paymentId =
    typeof body.paymentId === "string" && body.paymentId.trim()
      ? body.paymentId.trim()
      : undefined;

  if (paymentId || body.verify === true) {
    const slug = await confirmGiftFromMercadoPago(id, paymentId);
    if (slug) {
      return NextResponse.json({ slug, link: giftLink(req, slug) });
    }
  }

  if (demo || (body.devConfirm === true && isLocalRequest(req))) {
    const slug = await confirmGiftPayment(id, "demo_payment");
    if (!slug) {
      return NextResponse.json({ error: "Não foi possível gerar o presente" }, { status: 500 });
    }
    return NextResponse.json({ slug, link: giftLink(req, slug) });
  }

  return NextResponse.json({ error: "Pagamento ainda não confirmado" }, { status: 402 });
}
