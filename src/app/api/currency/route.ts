import { NextResponse } from "next/server";
import { CURRENCY_COOKIE, normalizeCurrency } from "@/lib/currency";

export async function POST(req: Request) {
  const { currency } = await req.json().catch(() => ({}));
  const normalized = normalizeCurrency(currency);
  const res = NextResponse.json({ ok: true, currency: normalized });
  res.cookies.set(CURRENCY_COOKIE, normalized, {
    path: "/",
    sameSite: "lax",
    httpOnly: false,
    maxAge: 60 * 60 * 24 * 365
  });
  return res;
}


