import { headers } from "next/headers";
import { ObrigadoClient } from "./ObrigadoClient";

export default async function ObrigadoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const h = await headers();
  const host = h.get("host") || "localhost:3000";
  const proto = h.get("x-forwarded-proto") || "http";
  const origin = process.env.NEXT_PUBLIC_BASE_URL || `${proto}://${host}`;

  return <ObrigadoClient slug={slug} origin={origin} />;
}
