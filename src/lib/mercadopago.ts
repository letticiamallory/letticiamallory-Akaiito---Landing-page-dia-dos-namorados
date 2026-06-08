import { MercadoPagoConfig, Preference, Payment } from "mercadopago";
import type { ProductId } from "./products";
import { getProduct } from "./products";

function getAccessToken(): string | undefined {
  const isProd = process.env.NODE_ENV === "production";
  const testToken = process.env.MERCADOPAGO_TEST_ACCESS_TOKEN?.trim();
  const liveToken = process.env.MERCADOPAGO_ACCESS_TOKEN?.trim();

  if (!isProd && testToken) return testToken;
  return liveToken || testToken || undefined;
}

/** Sandbox no localhost ou quando MERCADOPAGO_USE_SANDBOX=true (conta de teste do MP). */
export function shouldUseSandboxCheckout(baseUrl?: string): boolean {
  const flag = process.env.MERCADOPAGO_USE_SANDBOX?.trim().toLowerCase();
  if (flag === "true") return true;
  if (flag === "false") return false;

  const url = (baseUrl || process.env.NEXT_PUBLIC_BASE_URL || "").toLowerCase();
  return url.includes("localhost") || url.includes("127.0.0.1");
}

export function pickCheckoutUrl(
  preference: { initPoint: string; sandboxInitPoint: string },
  baseUrl?: string
): string {
  return shouldUseSandboxCheckout(baseUrl)
    ? preference.sandboxInitPoint
    : preference.initPoint;
}

function getClient() {
  const token = getAccessToken();
  if (!token) return null;
  return new MercadoPagoConfig({ accessToken: token });
}

export function isDemoMode(): boolean {
  return !getAccessToken();
}

export async function createPreference(params: {
  giftId: string;
  productId: ProductId;
  buyerEmail: string;
  baseUrl: string;
  amountCents?: number;
}) {
  const product = getProduct(params.productId);
  if (!product) throw new Error("Produto não encontrado");

  const unitPrice = (params.amountCents ?? product.priceCents) / 100;

  if (isDemoMode()) {
    return {
      preferenceId: `demo_${params.giftId}`,
      initPoint: `${params.baseUrl}/pagamento/${params.giftId}?demo=1`,
      sandboxInitPoint: `${params.baseUrl}/pagamento/${params.giftId}?demo=1`,
    };
  }

  const client = getClient()!;
  const preference = new Preference(client);

  const successUrl = `${params.baseUrl}/pagamento/${params.giftId}?status=success`;
  const failureUrl = `${params.baseUrl}/pagamento/${params.giftId}?status=failure`;
  const pendingUrl = `${params.baseUrl}/pagamento/${params.giftId}?status=pending`;

  const body: Parameters<Preference["create"]>[0]["body"] = {
    items: [
      {
        id: product.id,
        title: `Akaiito | ${product.name}`,
        description: product.description.slice(0, 200),
        quantity: 1,
        unit_price: unitPrice,
        currency_id: "BRL",
      },
    ],
    payer: { email: params.buyerEmail },
    payment_methods: {
      excluded_payment_types: [{ id: "credit_card" }, { id: "debit_card" }],
      installments: 1,
    },
    external_reference: params.giftId,
    notification_url: `${params.baseUrl}/api/webhooks/mercadopago`,
    back_urls: {
      success: successUrl,
      failure: failureUrl,
      pending: pendingUrl,
    },
  };

  // MP exige HTTPS para auto_return; localhost quebra a preferência.
  if (params.baseUrl.startsWith("https://")) {
    body.auto_return = "approved";
  }

  const result = await preference.create({ body });

  return {
    preferenceId: result.id!,
    initPoint: result.init_point!,
    sandboxInitPoint: result.sandbox_init_point!,
  };
}

export async function getPayment(paymentId: string) {
  if (isDemoMode()) return null;
  const client = getClient()!;
  const payment = new Payment(client);
  return payment.get({ id: paymentId });
}

export function isPaymentApproved(status: string | undefined): boolean {
  return status === "approved";
}

export async function findApprovedPaymentForGift(giftId: string): Promise<string | null> {
  if (isDemoMode()) return null;

  const token = getAccessToken();
  if (!token) return null;

  try {
    const url = new URL("https://api.mercadopago.com/v1/payments/search");
    url.searchParams.set("external_reference", giftId);
    url.searchParams.set("sort", "date_created");
    url.searchParams.set("criteria", "desc");

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) return null;

    const data = (await res.json()) as {
      results?: Array<{ id?: number | string; status?: string }>;
    };

    const approved = data.results?.find((payment) => isPaymentApproved(payment.status));
    return approved?.id != null ? String(approved.id) : null;
  } catch (error) {
    console.error("Mercado Pago payment search failed:", error);
    return null;
  }
}

export async function verifyGiftPayment(
  giftId: string,
  paymentId?: string
): Promise<string | null> {
  if (isDemoMode()) return null;

  const tryPaymentId = async (id: string) => {
    const payment = await getPayment(id);
    if (!payment || !isPaymentApproved(payment.status)) return null;
    if (payment.external_reference && payment.external_reference !== giftId) return null;
    return id;
  };

  if (paymentId) {
    try {
      return await tryPaymentId(paymentId);
    } catch (error) {
      console.error("Mercado Pago payment lookup failed:", error);
    }
  }

  const found = await findApprovedPaymentForGift(giftId);
  if (!found) return null;

  try {
    return await tryPaymentId(found);
  } catch {
    return found;
  }
}
