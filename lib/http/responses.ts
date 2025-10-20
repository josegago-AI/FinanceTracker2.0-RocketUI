import { NextResponse } from "next/server";
export const ok = <T>(data: T) => NextResponse.json({ data });
export const okList = <T>(data: T[], nextCursor?: string | null) =>
  NextResponse.json({ data, nextCursor: nextCursor ?? null });
export const fail = (message: string, code = 400) =>
  NextResponse.json({ error: message }, { status: code });
