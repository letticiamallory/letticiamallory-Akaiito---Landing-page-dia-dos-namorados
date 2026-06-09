import { request } from "@playwright/test";

export default async function globalSetup() {
  const baseURL =
    process.env.PLAYWRIGHT_BASE_URL ||
    process.env.NEXT_PUBLIC_BASE_URL ||
    "http://localhost:3000";

  const ctx = await request.newContext({ baseURL });
  try {
    const res = await ctx.post("/api/gifts", {
      data: {
        productId: "historia",
        buyerEmail: "e2e-probe@akaiito.test",
        data: { version: 2, pageConfig: { coupleNames: "E2E", theme: "scrapbook_red" }, sections: [] },
      },
    });
    process.env.E2E_DB_AVAILABLE = res.status() === 200 || res.status() === 400 ? "true" : "false";
    if (res.ok()) {
      const body = await res.json();
      process.env.E2E_DEMO_CHECKOUT =
        typeof body.checkoutUrl === "string" && body.checkoutUrl.includes("/pagamento/")
          ? "true"
          : "false";
    } else {
      process.env.E2E_DEMO_CHECKOUT = "false";
    }
  } catch {
    process.env.E2E_DB_AVAILABLE = "false";
    process.env.E2E_DEMO_CHECKOUT = "false";
  } finally {
    await ctx.dispose();
  }
}
