// app/transactions/page.tsx
import Link from "next/link";
import BackLink from "./components/BackLink";
import TransactionView from "@/app/transactions/components/TransactionView";
import { listTransactions } from "@/lib/transactions/dal";
import { getUserId } from "@/lib/auth/getUserId";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const revalidate = 0;

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  // Parse URL params
  const limit = Number(searchParams.limit ?? 50);
  const cursor = (searchParams.cursor as string) ?? null;

  // Auth (SSR)
  await getUserId();

  // Server-side data fetch (RLS-aware)
  const { data, nextCursor, totals } = await listTransactions({
    limit,
    cursor,
    sort: "date",
    dir: "desc",
  });

  // Map DAL totals to the Rocket UI stats keys expected by TransactionView
  const stats = {
    totalIncome: totals?.income ?? 0,
    totalExpense: Math.abs(totals?.expense ?? 0), // show as positive for the card
    netSavings: totals?.net ?? 0,
    txCount: data.length, // current page count; replace with total if you add it later
  };

  return (
    <div className="min-h-screen">
      {/* Full Rocket-like experience lives in the client component below */}
      <TransactionView stats={stats} txs={data} />

      {/* Keep simple server-side pagination + back, without passing function props */}
      <div className="mx-auto max-w-7xl px-6 pb-10 flex items-center justify-between">
        <BackLink className="inline-flex items-center rounded-lg border px-3 py-2 text-sm hover:bg-gray-50" />
        {nextCursor ? (
          <Link
            href={`/transactions?limit=${limit}&cursor=${encodeURIComponent(nextCursor)}`}
            className="inline-flex items-center rounded-lg border px-3 py-2 text-sm hover:bg-gray-50"
          >
            Next →
          </Link>
        ) : (
          <span className="inline-flex items-center rounded-lg border px-3 py-2 text-sm text-gray-400">
            Next →
          </span>
        )}
      </div>
    </div>
  );
}
