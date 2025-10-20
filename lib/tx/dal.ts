import { createReadOnlyClient } from "@/lib/supabase/server";
import { TxQueryInput } from "./query";

export type TxListParams = TxQueryInput & { userId: string };

export async function listTransactions(params: TxListParams) {
const { userId, limit, cursor, sort, dir } = params;
const supabase = createReadOnlyClient();

let q = supabase
.from("transactions")
.select("id, date, amount, payee, category, account_id, cleared, tags, created_at", { count: "exact" })
.eq("user_id", userId)
.order(sort, { ascending: dir === "asc" })
.limit(limit);

// Cursor pagination (assume `created_at` or `id` is stable; you can switch to keyset per `sort` if needed)
if (cursor) {
// Example: use created_at < cursor for desc, > for asc
if (sort === "date" || sort === "created_at") {
const op = dir === "desc" ? "lt" : "gt";
q = q[op](sort, cursor);
} else {
// fallback: by id
const op = dir === "desc" ? "lt" : "gt";
q = q[op]("id", cursor);
}
}

// Filters
if (params.q) q = q.ilike("payee", `%${params.q}%`);
if (params.type) q = q.eq("type", params.type);
if (params.category) q = q.eq("category", params.category);
if (params.accountId) q = q.eq("account_id", params.accountId);
if (params.min != null) q = q.gte("amount", params.min);
if (params.max != null) q = q.lte("amount", params.max);
if (params.dateFrom) q = q.gte("date", params.dateFrom);
if (params.dateTo) q = q.lte("date", params.dateTo);
if (params.cleared) q = q.eq("cleared", params.cleared === "true");
if (params.tags) {
const arr = params.tags.split(",").map((t) => t.trim()).filter(Boolean);
if (arr.length) q = q.overlaps("tags", arr); // requires `tags` as text[] in DB
}

const { data, error } = await q;
if (error) throw error;

// Compute next cursor (simple: last row's sort key)
let nextCursor: string | null = null;
if (data && data.length === limit) {
const last = data[data.length - 1] as any;
nextCursor = String(last[sort] ?? last.id ?? "");
}

// Optional aggregates for summary cards
const totals = await computeTotals(supabase, userId, params);

return { data, nextCursor, totals };
}

async function computeTotals(supabase: any, userId: string, params: TxQueryInput) {
// Keep it lightweight; add filters consistently so cards reflect the same query window
let q = supabase.from("transactions").select("amount").eq("user_id", userId);
if (params.dateFrom) q = q.gte("date", params.dateFrom);
if (params.dateTo) q = q.lte("date", params.dateTo);
const { data } = await q;
const income = (data ?? []).filter((r: any) => r.amount > 0).reduce((s: number, r: any) => s + r.amount, 0);
const expense = (data ?? []).filter((r: any) => r.amount < 0).reduce((s: number, r: any) => s + r.amount, 0);
return { income, expense, net: income + expense };
}