import { getEmailFrom, getResendClient, isEmailConfigured } from "./client";
import { buildGiftLinkEmail } from "./templates/gift-link";

function getCoupleNamesFromGiftData(data: string): string | undefined {
  try {
    const parsed = JSON.parse(data) as { pageConfig?: { coupleNames?: string } };
    const names = parsed.pageConfig?.coupleNames?.trim();
    return names || undefined;
  } catch {
    return undefined;
  }
}

export async function sendGiftLinkEmail(params: {
  to: string;
  slug: string;
  giftData: string;
  baseUrl?: string;
}) {
  if (!isEmailConfigured()) {
    console.warn("[email] RESEND_API_KEY não configurada — link não enviado por e-mail.");
    return { sent: false as const, reason: "not_configured" };
  }

  const resend = getResendClient();
  if (!resend) {
    return { sent: false as const, reason: "not_configured" };
  }

  const baseUrl = (params.baseUrl || process.env.NEXT_PUBLIC_BASE_URL || "").replace(/\/$/, "");
  const giftLink = `${baseUrl}/presente/${params.slug}`;
  const coupleNames = getCoupleNamesFromGiftData(params.giftData);
  const content = buildGiftLinkEmail({ giftLink, coupleNames });

  const { data, error } = await resend.emails.send({
    from: getEmailFrom(),
    to: params.to,
    subject: content.subject,
    html: content.html,
    text: content.text,
  });

  if (error) {
    throw new Error(error.message);
  }

  return { sent: true as const, id: data?.id };
}
