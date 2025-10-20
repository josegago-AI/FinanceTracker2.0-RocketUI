// app/api/transactions/[id]/route.ts
import { NextRequest } from "next/server";
import { getUserId } from "@/lib/auth/getUserId";
import { updateTransaction, deleteTransaction } from "@/lib/transactions/dal";
import { TxUpdateSchema } from "@/lib/transactions/validators";
import { ok, fail } from "@/lib/http/responses";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Still require the user to be authenticated (even if DAL uses service client)
    await getUserId();

    const body = await req.json();
    const patch = TxUpdateSchema.parse(body);

    // Do not allow user_id to be patched via API
    if ("user_id" in patch) {
      delete (patch as any).user_id;
    }

    const data = await updateTransaction(params.id, patch as any);
    return ok(data);
  } catch (e: any) {
    return fail(e?.message ?? "Bad request", 400);
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Require auth even though deletion uses service client behind the scenes
    await getUserId();

    await deleteTransaction(params.id);
    return ok({ ok: true });
  } catch (e: any) {
    return fail(e?.message ?? "Bad request", 400);
  }
}
