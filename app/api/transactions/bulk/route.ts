// app/api/transactions/bulk/route.ts
import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/supabase/server";
import { supabaseService } from "@/lib/supabase/service";

/**
* POST body shape:
* { action: "delete" | "mark_cleared" | "mark_uncleared", ids: string[] }
*/
export async function POST(req: Request) {
const user = await getSessionUser();
if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

const { action, ids } = await req.json();
if (!Array.isArray(ids) || ids.length === 0) {
return NextResponse.json({ error: "No ids provided" }, { status: 400 });
}
if (!["delete", "mark_cleared", "mark_uncleared"].includes(action)) {
return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}

const svc = supabaseService();

// Guard: only touch rows that belong to the current user
const base = svc.from("transactions").select("id", { count: "exact" }).eq("user_id", user.id).in("id", ids);
const { data: owned, error: ownErr } = await base;
if (ownErr) return NextResponse.json({ error: ownErr.message }, { status: 500 });
const ownedIds = (owned ?? []).map((r: any) => r.id);
if (ownedIds.length === 0) return NextResponse.json({ error: "No owned rows" }, { status: 403 });

let error: any = null;
if (action === "delete") {
const { error: e } = await svc.from("transactions").delete().in("id", ownedIds).eq("user_id", user.id);
error = e;
}
if (action === "mark_cleared") {
const { error: e } = await svc.from("transactions").update({ cleared: true }).in("id", ownedIds).eq("user_id", user.id);
error = e;
}
if (action === "mark_uncleared") {
const { error: e } = await svc.from("transactions").update({ cleared: false }).in("id", ownedIds).eq("user_id", user.id);
error = e;
}

if (error) return NextResponse.json({ error: error.message }, { status: 500 });
return NextResponse.json({ ok: true, affected: ownedIds.length });
}