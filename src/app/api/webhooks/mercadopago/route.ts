import { NextRequest, NextResponse } from "next/server";
import { confirmGiftPayment } from "@/lib/gifts";
import { getPayment, isPaymentApproved, isDemoMode } from "@/lib/mercadopago";

export async function POST(req: NextRequest) {
  if (isDemoMode()) {
    return NextResponse.json({ ok: true });
  }

  try {
    const body = await req.json();
    const { type, data } = body as {
      type?: string;
      data?: { id?: string };
    };

    if (type === "payment" && data?.id) {
      const payment = await getPayment(String(data.id));
      if (payment && isPaymentApproved(payment.status)) {
        const giftId = payment.external_reference;
        if (giftId) {
          await confirmGiftPayment(giftId, String(data.id));
        }
      }
    }

    const searchParams = req.nextUrl.searchParams;
    const topic = searchParams.get("topic");
    const id = searchParams.get("id");

    if (topic === "payment" && id) {
      const payment = await getPayment(id);
      if (payment && isPaymentApproved(payment.status)) {
        const giftId = payment.external_reference;
        if (giftId) {
          await confirmGiftPayment(giftId, id);
        }
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ ok: true });
  }
}

export async function GET(req: NextRequest) {
  const topic = req.nextUrl.searchParams.get("topic");
  const id = req.nextUrl.searchParams.get("id");

  if (topic === "payment" && id) {
    try {
      const payment = await getPayment(id);
      if (payment && isPaymentApproved(payment.status)) {
        const giftId = payment.external_reference;
        if (giftId) {
          await confirmGiftPayment(giftId, id);
        }
      }
    } catch (err) {
      console.error("Webhook GET error:", err);
    }
  }

  return NextResponse.json({ ok: true });
}
