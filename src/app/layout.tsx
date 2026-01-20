import "./globals.css";
import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getT } from "@/lib/i18n";
import { cookies } from "next/headers";
import { DEV_COOKIE } from "@/lib/devMode";
import { getCurrency } from "@/lib/currency";

export const metadata: Metadata = {
  title: "JapanGo - 日本机场接送机预订",
  description: "JapanGo：日本机场接送机预订平台，支持多车型、急单规则、后台改价。"
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { locale, t } = await getT();
  const c = await cookies();
  const isDev = c.get(DEV_COOKIE)?.value === "1";
  const currency = await getCurrency();
  return (
    <html lang={locale === "en" ? "en" : "zh-CN"}>
      <body>
        <div className="min-h-screen flex flex-col">
          <Navbar
            locale={locale}
            labels={{
              contact: t("nav.contact"),
              orders: t("nav.orders"),
              admin: t("nav.admin"),
              lang: t("nav.lang"),
              currency: t("nav.currency"),
              zh: t("lang.zh"),
              en: t("lang.en"),
              jpy: t("currency.jpy"),
              cny: t("currency.cny"),
              usd: t("currency.usd"),
              brandName: t("brand.name"),
              brandTagline: t("brand.tagline")
            }}
            showAdmin={isDev}
            currency={currency}
          />
          <main className="flex-1">{children}</main>
          <Footer
            labels={{
              brand: t("footer.brand"),
              desc: t("footer.desc"),
              contact: t("footer.contact"),
              rules: t("footer.rules"),
              ruleText: t("footer.ruleText"),
              note: t("footer.note")
            }}
          />
        </div>
      </body>
    </html>
  );
}


