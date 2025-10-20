import { PostgrestFilterBuilder } from "@supabase/postgrest-js";
import { TxListParams } from "./types";

export function applyFilters<T>(q: PostgrestFilterBuilder<T, any, any>, p: TxListParams) {
  q.eq("user_id", p.userId);
  if (p.start) q.gte("date", p.start);
  if (p.end)   q.lte("date", p.end);
  if (p.categoryId) q.eq("category_id", p.categoryId);
  if (p.tag)        q.contains("tags", [p.tag]); // tags is text[]
  if (p.q)          q.ilike("payee", `%${p.q}%`);
  return q;
}

export function applySort<T>(q: PostgrestFilterBuilder<T, any, any>, sort?: string, dir?: string) {
  const s = (sort ?? "date") as "date"|"amount"|"payee";
  const d = (dir ?? "desc") as "asc"|"desc";
  return q.order(s, { ascending: d === "asc", nullsFirst: false });
}
