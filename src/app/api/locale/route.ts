import { NextResponse } from "next/server";
import { LOCALE_COOKIE, normalizeLocale } from "@/lib/i18n";

export async function POST(req: Request) {
  const { locale } = await req.json().catch(() => ({}));
  const normalized = normalizeLocale(locale);
  const res = NextResponse.json({ ok: true, locale: normalized });
  res.cookies.set(LOCALE_COOKIE, normalized, {
    path: "/",
    sameSite: "lax",
    httpOnly: false,
    maxAge: 60 * 60 * 24 * 365
  });
  return res;
}


