import { z } from "zod";

export const txSortFields = ["date", "amount", "created_at", "payee"] as const;
export type TxSortField = typeof txSortFields[number];

export const txQuerySchema = z.object({
  q: z.string().trim().max(200).optional(),
  dateFrom: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  dateTo: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  type: z.enum(["income", "expense", "transfer"]).optional(),
  category: z.string().optional(),
  accountId: z.string().optional(),
  min: z.coerce.number().optional(),
  max: z.coerce.number().optional(),
  tags: z.string().optional(),
  cleared: z.enum(["true", "false"]).optional(),
  sort: z.enum(txSortFields).default("date"),
  dir: z.enum(["asc", "desc"]).default("desc"),
  limit: z.coerce.number().int().min(10).max(100).default(50),
  cursor: z.string().optional(),
});

export type TxQueryInput = z.infer<typeof txQuerySchema>;

export function parseTxQuery(
  raw: Record<string, string | string[] | undefined>
): TxQueryInput {
  const flat: Record<string, string> = {};
  for (const [k, v] of Object.entries(raw)) {
    if (Array.isArray(v)) flat[k] = v[0] ?? "";
    else if (v != null) flat[k] = v;
  }
  const parsed = txQuerySchema.safeParse(flat);
  if (!parsed.success) return txQuerySchema.parse({});
  return parsed.data;
}

export function toQueryString(q: Partial<TxQueryInput>): string {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(q)) {
    if (v === undefined || v === null || v === "") continue;
    params.set(k, String(v));
  }
  return params.toString();
}
