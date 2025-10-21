import { createReadOnlyClient } from "@/lib/supabase/server";
import { supabaseService } from "@/lib/supabase/service"; // your existing admin/service client
import type { SavedQuery, UserView } from "./views.types";

export async function getUserViews(userId: string): Promise<UserView[]> {
const sb = createReadOnlyClient();
const { data, error } = await sb
.from("user_views")
.select("id, user_id, name, query_json, created_at, updated_at")
.eq("user_id", userId)
.order("created_at", { ascending: false });
if (error) throw error;
return data ?? [];
}

export async function saveUserView(userId: string, name: string, query: SavedQuery): Promise<UserView> {
const svc = supabaseService();
const { data, error } = await svc
.from("user_views")
.insert({ user_id: userId, name, query_json: query })
.select("id, user_id, name, query_json, created_at, updated_at")
.single();
if (error) throw error;
return data as UserView;
}

export async function renameUserView(userId: string, id: string, name: string): Promise<UserView> {
const svc = supabaseService();
const { data, error } = await svc
.from("user_views")
.update({ name })
.eq("id", id)
.eq("user_id", userId)
.select("id, user_id, name, query_json, created_at, updated_at")
.single();
if (error) throw error;
return data as UserView;
}

export async function deleteUserView(userId: string, id: string): Promise<void> {
const svc = supabaseService();
const { error } = await svc
.from("user_views")
.delete()
.eq("id", id)
.eq("user_id", userId);
if (error) throw error;
}