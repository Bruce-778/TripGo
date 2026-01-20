import { NextResponse } from "next/server";
import { DEV_COOKIE } from "@/lib/devMode";

export async function POST(req: Request) {
  const { token } = await req.json().catch(() => ({}));
  const adminToken = process.env.ADMIN_TOKEN;
  if (!adminToken) return NextResponse.json({ error: "Missing ADMIN_TOKEN on server" }, { status: 500 });

  if (!token || token !== adminToken) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(DEV_COOKIE, "1", {
    path: "/",
    sameSite: "lax",
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30
  });
  return res;
}


