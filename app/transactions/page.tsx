// app/transactions/page.tsx
import Link from "next/link";
import BackLink from "./components/BackLink";
import TransactionView from "@/app/transactions/components/TransactionView";

import { listTransactions } from "@/lib/transactions/dal";
import { parseTxQuery } from "@/lib/transactions/urlQuery";
import { getUserId } from "@/lib/auth/getUserId";

import { GlobalLoading } from '@/components/ui/global-loading';
import { GlobalEmpty } from '@/components/ui/global-empty';


export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const revalidate = 0;

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  // ✅ 1. Get the authenticated user (RLS-aware)
  const userId = await getUserId();
  if (!userId) {
    // Redirect or render nothing if unauthenticated
    return null;
  }
  const params = parseTxQuery(searchParams);
  // ✅ 2. Parse and validate URL filters/sorting
  const dalParams = {
    userId,
    q: params.q,
    start: params.dateFrom,
    end: params.dateTo,
    categoryId: params.category,
    tag: params.tags, // if you later support multiple tags, split here
    sort: params.sort as "date" | "amount" | "payee",
    dir: params.dir,
    limit: params.limit,
    cursor: params.cursor ?? null,
  };

  
  // ✅ 3. Fetch filtered, sorted data from DAL (with RLS)
  const { data, nextCursor, totals } = await listTransactions({
    ...params,
    userId,
  });

if (!data) {
  return <GlobalLoading />
}
  
  // ✅ Always render the main layout and AddTransactionModal, even if empty
return (
  <div className="max-w-7xl mx-auto px-6 py-8">
    {data && data.length > 0 ? (
      <TransactionView data={data} />
    ) : (
      <div className="mt-8">
        <GlobalEmpty
          title="No transactions yet"
          description="Start by adding your first transaction below."
        />
      </div>
    )}
    
    {/* Keep the AddTransactionModal always accessible */}
    <AddTransactionModal />
  </div>
)

  
  // ✅ 4. Basic stats for top summary cards
  const stats = {
    totalIncome: totals?.income ?? 0,
    totalExpense: Math.abs(totals?.expense ?? 0),
    netSavings: totals?.net ?? 0,
    txCount: data.length,
  };

  // ✅ 5. Render Rocket-style view
  return (
    <div className="min-h-screen">
      <TransactionView
        initialQuery={params}     // gives client UI the current filters/sort
        txs={data}                // main transaction list
        stats={stats}             // summary cards
        nextCursor={nextCursor}   // pagination
      />

      <div className="mx-auto max-w-7xl px-6 pb-10 flex items-center justify-between">
        <BackLink className="inline-flex items-center rounded-lg border px-3 py-2 text-sm hover:bg-gray-50" />

        {nextCursor ? (
          <Link
            href={`/transactions?${new URLSearchParams({
              ...Object.fromEntries(
                Object.entries(params).filter(
                  ([k, v]) => v !== undefined && v !== null && v !== ""
                )
              ),
              cursor: encodeURIComponent(nextCursor),
            }).toString()}`}
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
