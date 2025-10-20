// lib/transactions/dal.ts
import { createReadOnlyClient } from '@/lib/supabase/server';
import { supabaseService } from '@/lib/supabase/clients';
import { applyFilters, applySort } from './query';
import type { TxListParams, TxRow, Totals } from './types';

/**
 * List transactions with cursor pagination.
 * - Reads use SSR client (carries auth cookies) → respects RLS.
 * - Cursor pagination via `id` (descending or ascending depending on sort).
 */
export async function listTransactions(p: TxListParams): Promise<{
  data: TxRow[];
  nextCursor: string | null;
  totals: Totals;
}> {
  const limit = Math.min(Math.max(p.limit ?? 50, 1), 200);
  const sb = createReadOnlyClient();

  // Base query
  let q = sb.from('transactions').select('*', { count: 'exact' });

  // Apply URL-driven filters (q, categoryId, tag, start, end, type, accountId, etc.)
  q = applyFilters(q, p);

  // Cursor-based pagination
  // Convention used previously in repo: use `cursor` as "fetch items with id < cursor" (for desc order)
  if (p.cursor) {
    // If sorting by date/amount you might prefer a composite cursor.
    // Keeping id-based cursor to match existing code.
    q = q.lt('id', p.cursor);
  }

  // Sorting
  q = applySort(q, p.sort, p.dir).limit(limit);

  const { data, error } = await q;
  if (error) throw error;

  const rows = (data ?? []) as TxRow[];
  const nextCursor = rows.length === limit ? rows[rows.length - 1]!.id : null;

  // Totals for the current filter set
  const totals = await getTotals(p);

  return { data: rows, nextCursor, totals };
}

/**
 * Compute totals for the current filter set.
 * Uses SSR client (auth-aware) so RLS applies.
 */
export async function getTotals(p: TxListParams): Promise<Totals> {
  const sb = createReadOnlyClient();

  // Reuse the same filters; select only `amount` to minimize payload
  let q = sb.from('transactions').select('amount');
  q = applyFilters(q, p);

  const { data, error } = await q;
  if (error) throw error;

  const amounts = (data ?? []) as { amount: number }[];

  let income = 0;
  let expense = 0;
  for (const r of amounts) {
    const a = Number(r.amount) || 0;
    if (a >= 0) income += a;
    else expense += a; // negative
  }
  const net = income + expense;

  return {
    income,
    expense, // negative total (kept as-is to preserve sign semantics)
    net,
  };
}

/**
 * Create a single transaction.
 * - Uses service client for inserts (bypasses RLS by design).
 * - Ensure you pass a valid userId from the caller so rows are correctly owned.
 */
export async function createTransaction(input: {
  userId: string;
  date: string;          // ISO yyyy-mm-dd
  amount: number;
  payee: string;
  type?: 'income' | 'expense' | 'transfer';
  account_id?: string | null;
  category_id?: string | null;
  memo?: string | null;
  external_id?: string | null;
}): Promise<TxRow> {
  const sb = supabaseService();

  const payload = {
    user_id: input.userId,
    date: input.date,
    amount: input.amount,
    payee: input.payee,
    type: input.type ?? (input.amount >= 0 ? 'income' : 'expense'),
    account_id: input.account_id ?? null,
    category_id: input.category_id ?? null,
    memo: input.memo ?? null,
    external_id: input.external_id ?? null,
  };

  const { data, error } = await sb
    .from('transactions')
    .insert(payload)
    .select()
    .single();

  if (error) throw error;
  return data as TxRow;
}

/**
 * Update a transaction (service client).
 */
export async function updateTransaction(
  id: string,
  patch: Partial<{
    date: string;
    amount: number;
    payee: string;
    type: 'income' | 'expense' | 'transfer';
    account_id: string | null;
    category_id: string | null;
    memo: string | null;
    external_id: string | null;
  }>
): Promise<TxRow> {
  const sb = supabaseService();

  const { data, error } = await sb
    .from('transactions')
    .update(patch)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as TxRow;
}

/**
 * Delete a transaction (service client).
 */
export async function deleteTransaction(id: string): Promise<void> {
  const sb = supabaseService();
  const { error } = await sb.from('transactions').delete().eq('id', id);
  if (error) throw error;
}
