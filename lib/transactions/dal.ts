import { supabaseAnon, supabaseService } from "@/lib/supabase/clients";
import { TxListParams, TxRow, Totals } from "./types";
import { applyFilters, applySort } from "./query";

export async function listTransactions(p: TxListParams) {
  const limit = Math.min(Math.max(p.limit ?? 50, 1), 200);
  let q = applyFilters(
    supabaseAnon().from("transactions").select("*"),
    p
  );

  if (p.cursor) q = q.lt("id", p.cursor); // id-based cursor
  q = applySort(q, p.sort, p.dir).limit(limit);

  const { data, error } = await q;
  if (error) throw error;

  const nextCursor = (data && data.length === limit) ? data[data.length - 1].id : null;
  return { data: (data ?? []) as TxRow[], nextCursor };
}

export async function getTotals(p: TxListParams): Promise<Totals> {
  const base = supabaseAnon().from("transactions").select("amount");
  const { data, error } = await applyFilters(base, p);
  if (error) throw error;

  let income = 0, expense = 0;
  for (const r of data as { amount: number }[]) {
    if (r.amount > 0) income += r.amount;
    if (r.amount < 0) expense += Math.abs(r.amount);
  }
  return { income, expense, net: income - expense };
}

export async function createTransaction(userId: string, input: Partial<TxRow>) {
  const payload = {
    user_id: userId,
    date: input.date,
    payee: input.payee,
    amount: input.amount,
    category_id: input.category_id ?? null,
    account_id: input.account_id ?? null,
    tags: input.tags ?? null,
    note: input.note ?? null,
    type: input.type ?? null,
    external_id: input.external_id ?? null,
  };
  const { data, error } = await supabaseAnon()
    .from("transactions").insert(payload).select().single();
  if (error) throw error;
  return data as TxRow;
}

export async function updateTransaction(userId: string, id: string, input: Partial<TxRow>) {
  const patch: any = {};
  if (input.date !== undefined) patch.date = input.date;
  if (input.payee !== undefined) patch.payee = input.payee;
  if (input.amount !== undefined) patch.amount = input.amount;
  if (input.category_id !== undefined) patch.category_id = input.category_id;
  if (input.account_id !== undefined) patch.account_id = input.account_id;
  if (input.tags !== undefined) patch.tags = input.tags;
  if (input.note !== undefined) patch.note = input.note;
  if (input.type !== undefined) patch.type = input.type;
  if (input.external_id !== undefined) patch.external_id = input.external_id;

  const { data, error } = await supabaseAnon()
    .from("transactions")
    .update(patch)
    .eq("user_id", userId)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as TxRow;
}

export async function deleteTransaction(userId: string, id: string) {
  const { error } = await supabaseAnon()
    .from("transactions")
    .delete()
    .eq("user_id", userId)
    .eq("id", id);

  if (error) throw error;
  return { ok: true };
}

// Bulk upsert for Import v2
export async function bulkUpsertTransactions(userId: string, rows: Omit<TxRow,"id"|"created_at"|"updated_at">[]) {
  const clean = rows.map(r => ({
    user_id: userId,
    date: r.date,
    payee: r.payee,
    amount: r.amount,
    category_id: r.category_id ?? null,
    account_id: r.account_id ?? null,
    tags: r.tags ?? null,
    note: r.note ?? null,
    type: r.type ?? null,
    external_id: r.external_id ?? null,
  }));

  const { error } = await supabaseService()
    .from("transactions")
    .upsert(clean, { onConflict: "user_id,external_id", ignoreDuplicates: false });

  if (error) throw error;
  return { ok: true, inserted: clean.length };
}
