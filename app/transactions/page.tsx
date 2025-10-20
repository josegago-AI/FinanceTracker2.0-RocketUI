// app/transactions/page.tsx
import { headers } from "next/headers";
import Link from "next/link";
import BackLink from "./components/BackLink";
import TransactionView from "./TransactionView"; // Client component (no server functions passed)
import { listTransactions } from "@/lib/tx/dal";
import { getUserId } from "@/lib/auth/getUserId";
import { getSessionUser } from "@/lib/supabase/session"; // your SSR session helper
import { parseTxQuery } from "@/lib/tx/query";


export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const revalidate = 0;

export default async function Page({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
const user = await getSessionUser();
if (!user) {
// redirect to /login or render anon state
return null;
}

const params = parseTxQuery(searchParams);
const { data, nextCursor, totals } = await listTransactions({ ...params, userId: user.id });

return (
<TransactionView
initialQuery={params}
rows={data}
nextCursor={nextCursor}
totals={totals}
/>
);
}
