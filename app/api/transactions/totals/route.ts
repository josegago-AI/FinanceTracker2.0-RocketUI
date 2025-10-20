import { NextRequest } from "next/server";
import { getUserId } from "@/lib/auth/getUserId";
import { getTotals } from "@/lib/transactions/dal";
import { TxQuerySchema } from "@/lib/transactions/validators";
import { ok, fail } from "@/lib/http/responses";

export async function GET(req: NextRequest) {
  try {
    const userId = await getUserId();
    const url = new URL(req.url);
    const params = Object.fromEntries(url.searchParams.entries());
    const parsed = TxQuerySchema.parse({
      ...params,
      limit: params.limit ? Number(params.limit) : undefined,
    });
    const data = await getTotals({ userId, ...parsed });
    return ok(data);
  } catch (e: any) {
    return fail(e.message ?? "Bad request", 400);
  }
}
