import { z } from "zod";

export const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD");
export const amountNumber = z.number().finite();

export const SortField = z.enum(["date","amount","payee"]);
export const SortDir = z.enum(["asc","desc"]);

export const TxCreateSchema = z.object({
  date: isoDate,
  payee: z.string().min(1).max(200),
  amount: amountNumber,
  category_id: z.string().uuid().nullable().optional(),
  account_id: z.string().uuid().nullable().optional(),
  tags: z.array(z.string().min(1).max(50)).max(10).optional(),
  note: z.string().max(2000).optional(),
  type: z.string().max(50).optional(),
  external_id: z.string().max(200).optional(),
});

export const TxUpdateSchema = TxCreateSchema.partial();

export const TxQuerySchema = z.object({
  q: z.string().max(100).optional(),
  categoryId: z.string().uuid().optional(),
  tag: z.string().optional(),
  start: isoDate.optional(),
  end: isoDate.optional(),
  sort: SortField.default("date"),
  dir: SortDir.default("desc"),
  limit: z.coerce.number().min(1).max(200).default(50),
  cursor: z.string().nullish(),
});
