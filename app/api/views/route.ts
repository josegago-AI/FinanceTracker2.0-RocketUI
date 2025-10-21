import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/supabase/server";
import { getUserViews, saveUserView } from "@/lib/transactions/views.dal";

export async function GET() {
const user = await getSessionUser();
if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
const views = await getUserViews(user.id);
return NextResponse.json({ views });
}

export async function POST(req: Request) {
const user = await getSessionUser();
if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
const body = await req.json();
const name = String(body?.name || "").trim();
const query = body?.query;
if (!name) return NextResponse.json({ error: "Name required" }, { status: 400 });
if (!query || typeof query !== "object") return NextResponse.json({ error: "Query required" }, { status: 400 });

const view = await saveUserView(user.id, name, query);
return NextResponse.json({ view }, { status: 201 });
}