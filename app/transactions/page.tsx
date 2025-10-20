// app/transactions/page.tsx
import Link from "next/link";
import { listTransactions } from "@/lib/transactions/dal";
import { getUserId } from "@/lib/auth/getUserId";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const revalidate = 0;

type TxRow = {
  id: string;
  date: string;
  payee: string;
  amount: number;
  category_id?: string | null;
  tags?: string[] | null;
};

function toMoney(n: number) {
  return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(n);
}

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  // Parse URL params
  const limit = Number(searchParams.limit ?? 50);
  const cursor = (searchParams.cursor as string) ?? null;

  // Auth (SSR)
  const userId = await getUserId();

  // Direct DAL call — no fetch
  const { data, nextCursor } = await listTransactions({
    userId,
    limit,
    cursor,
    // defaults for v1
    sort: "date",
    dir: "desc",
  });

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Transactions</h1>
        <div className="text-sm text-gray-500">{data.length} rows</div>
      </div>

      <div className="overflow-x-auto rounded-xl border">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Payee</th>
              <th className="px-4 py-3 font-medium text-right">Amount</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Tags</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {data.map((tx: TxRow) => (
              <tr key={tx.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 whitespace-nowrap">
                  {new Date(tx.date + "T00:00:00").toLocaleDateString()}
                </td>
                <td className="px-4 py-3">{tx.payee}</td>
                <td className="px-4 py-3 text-right font-medium">
                  <span className={tx.amount < 0 ? "text-red-600" : "text-emerald-600"}>
                    {toMoney(tx.amount)}
                  </span>
                </td>
                <td className="px-4 py-3">{tx.category_id ?? "—"}</td>
                <td className="px-4 py-3">
                  {(tx.tags ?? []).length ? (tx.tags as string[]).join(", ") : "—"}
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-gray-500">
                  No transactions yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        <Link
          href="#"
          onClick={(e) => {
            e.preventDefault();
            history.back();
          }}
          className="inline-flex items-center rounded-lg border px-3 py-2 text-sm hover:bg-gray-50"
        >
          ← Back
        </Link>

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
