export type SavedQuery = {
q?: string;
dateFrom?: string; // yyyy-mm-dd
dateTo?: string; // yyyy-mm-dd
type?: "income" | "expense" | "transfer";
category?: string;
accountId?: string;
tags?: string; // comma-separated
cleared?: "true" | "false";
sort?: "date" | "amount" | "payee";
dir?: "asc" | "desc";
limit?: number;
};

export type UserView = {
id: string;
user_id: string;
name: string;
query_json: SavedQuery;
created_at: string;
updated_at: string;
};

export function normalizeForSave(q: Record<string, any>): SavedQuery {
const out: SavedQuery = {};
const keep = ["q","dateFrom","dateTo","type","category","accountId","tags","cleared","sort","dir","limit"] as const;
for (const k of keep) {
const v = (q as any)[k];
if (v === undefined || v === null || v === "") continue;
(out as any)[k] = k === "limit" ? Number(v) : v;
}
return out;
}