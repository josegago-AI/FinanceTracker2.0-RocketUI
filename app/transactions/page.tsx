// app/transactions/page.tsx
import Link from "next/link";

type TxRow = {
  id: string;
  date: string;      // YYYY-MM-DD
  payee: string;
  amount: number;
  category_id?: string | null;
  tags?: string[] | null;
};

type ListResp = { data: TxRow[]; nextCursor: string | null };

function toMoney(n: number) {
  // Simple formatter. Replace "USD" with your currency if needed.
  return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(n);
}

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: { [k: string]: string | string[] | undefined };
}) {
  const limit = Number(searchParams.limit ?? 50);
  const cursor = (searchParams.cursor as string) ?? null;

  const query = new URLSearchParams();
  query.set("limit", String(limit));
  if (cursor) query.set("cursor", cursor);

  // Fetch from your API (no-store so it always reflects latest)
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/transactions?` + query.toString(), {
    cache: "no-store",
  });
  if (!res.ok) {
    // Simple error surface; you can polish later
    return (
      <div className="p-6">
        <h1 className="text-xl font-semibold">Transactions</h1>
        <p className="mt-4 text-red-600">Failed to load transactions: {res.status} {res.statusText}</p>
      </div>
    );
  }
  const { data, nextCursor } = (await res.json()) as ListResp;

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
            {data.map((tx) => (
              <tr key={tx.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 whitespace-nowrap">
                  {/* Display as M/D/YYYY */}
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

      {/* Simple pagination: next page via cursor; back button uses browser back for simplicity */}
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
