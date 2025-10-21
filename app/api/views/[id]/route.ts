import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/supabase/server";
import { renameUserView, deleteUserView } from "@/lib/transactions/views.dal";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
const user = await getSessionUser();
if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
const { name } = await req.json();
if (!name || !String(name).trim()) return NextResponse.json({ error: "Name required" }, { status: 400 });
const view = await renameUserView(user.id, params.id, String(name).trim());
return NextResponse.json({ view });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
const user = await getSessionUser();
if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
await deleteUserView(user.id, params.id);
return NextResponse.json({ ok: true });
}