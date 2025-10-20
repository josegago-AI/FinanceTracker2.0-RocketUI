import { NextRequest } from "next/server";
import { getUserId } from "@/lib/auth/getUserId";
import { updateTransaction, deleteTransaction } from "@/lib/transactions/dal";
import { TxUpdateSchema } from "@/lib/transactions/validators";
import { ok, fail } from "@/lib/http/responses";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = await getUserId();
    const body = await req.json();
    const patch = TxUpdateSchema.parse(body);
    const data = await updateTransaction(userId, params.id, patch as any);
    return ok(data);
  } catch (e: any) {
    return fail(e.message ?? "Bad request", 400);
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = await getUserId();
    await deleteTransaction(userId, params.id);
    return ok({ ok: true });
  } catch (e: any) {
    return fail(e.message ?? "Bad request", 400);
  }
}
