import { pgTable, text, integer, index } from "drizzle-orm/pg-core";

export const gifts = pgTable(
  "gifts",
  {
    id: text("id").primaryKey(),
    slug: text("slug").unique(),
    productId: text("product_id").notNull(),
    data: text("data").notNull(),
    status: text("status").notNull().default("pending"),
    amountCents: integer("amount_cents").notNull(),
    mpPreferenceId: text("mp_preference_id"),
    mpPaymentId: text("mp_payment_id"),
    buyerEmail: text("buyer_email").notNull(),
    createdAt: integer("created_at").notNull(),
    paidAt: integer("paid_at"),
  },
  (table) => [
    index("idx_gifts_slug").on(table.slug),
    index("idx_gifts_status").on(table.status),
  ]
);

export type Gift = typeof gifts.$inferSelect;
export type NewGift = typeof gifts.$inferInsert;
