import { NextRequest } from "next/server";
import { getUserId } from "@/lib/auth/getUserId";
import { listTransactions, createTransaction } from "@/lib/transactions/dal";
import { TxQuerySchema, TxCreateSchema } from "@/lib/transactions/validators";
import { okList, ok, fail } from "@/lib/http/responses";

export async function GET(req: NextRequest) {
  try {
    const userId = await getUserId();
    const url = new URL(req.url);
    const params = Object.fromEntries(url.searchParams.entries());
    const parsed = TxQuerySchema.parse({
      ...params,
      limit: params.limit ? Number(params.limit) : undefined,
    });
    const { data, nextCursor } = await listTransactions({ userId, ...parsed });
    return okList(data, nextCursor);
  } catch (e: any) {
    return fail(e.message ?? "Bad request", 400);
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getUserId();
    const body = await req.json();
    const input = TxCreateSchema.parse(body);
    const data = await createTransaction(userId, input as any);
    return ok(data);
  } catch (e: any) {
    return fail(e.message ?? "Bad request", 400);
  }
}

