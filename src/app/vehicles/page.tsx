import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { SearchSchema } from "@/lib/validators";
import { computeNightFee, isUrgentOrder } from "@/lib/bookingRules";
import { formatDateTimeJST } from "@/lib/timeFormat";
import { formatMoneyFromJpy, getCurrency } from "@/lib/currency";
import { getT, getLocale } from "@/lib/i18n";

export default async function VehiclesPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const { t } = await getT();
  const locale = await getLocale();
  const currency = await getCurrency();
  const parsed = SearchSchema.safeParse({
    tripType: params.tripType,
    fromArea: params.fromArea,
    toArea: params.toArea,
    pickupTime: params.pickupTime,
    passengers: params.passengers,
    luggageSmall: params.luggageSmall ?? 0,
    luggageMedium: params.luggageMedium ?? 0,
    luggageLarge: params.luggageLarge ?? 0
  });

  if (!parsed.success) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="p-5 bg-white border border-slate-200 rounded-2xl">
          <div className="font-semibold">{t("vehicles.paramsError")}</div>
          <div className="text-sm text-slate-600 mt-2">
            请从首页搜索进入该页面。
          </div>
          <div className="mt-4">
            <Link className="text-brand-700 underline" href="/">
              {t("vehicles.goHome")}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const q = parsed.data;
  const pickupTime = new Date(q.pickupTime);
  const now = new Date();
  const isUrgent = isUrgentOrder(now, pickupTime);
  const isNight = computeNightFee(pickupTime);

  const vehicleTypes = await prisma.vehicleType.findMany({
    orderBy: [{ isBus: "asc" }, { isLuxury: "asc" }, { seats: "asc" }]
  });

  const rules = await prisma.pricingRule.findMany({
    where: { fromArea: q.fromArea, toArea: q.toArea, tripType: q.tripType },
    include: { vehicleType: true }
  });

  const ruleByVehicle = new Map(rules.map((r) => [r.vehicleTypeId, r]));

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">{t("vehicles.title")}</h2>
          <div className="text-sm text-slate-600 mt-1">
            {q.fromArea} → {q.toArea} · {formatDateTimeJST(pickupTime, locale)} · {q.passengers} {t("common.passengers")} · {t("common.luggage")}{" "}
            {q.luggageSmall}/{q.luggageMedium}/{q.luggageLarge}
          </div>
        </div>
        <div className="text-sm">
          {isUrgent ? (
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
              {t("vehicles.urgent")}
            </span>
          ) : (
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              {t("vehicles.nonUrgent")}
            </span>
          )}
          {isNight ? (
            <span className="ml-2 inline-flex items-center px-3 py-1 rounded-full bg-slate-50 text-slate-700 border border-slate-200">
              {t("vehicles.night")}
            </span>
          ) : null}
        </div>
      </div>

      <div className="mt-6 grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {vehicleTypes.map((v) => {
            const rule = ruleByVehicle.get(v.id);
            const base = rule?.basePriceJpy ?? 0;
            const night = isNight ? rule?.nightFeeJpy ?? 0 : 0;
            const urgent = isUrgent ? rule?.urgentFeeJpy ?? 0 : 0;
            const total = base + night + urgent;
            const disabled = !rule;

            const params = new URLSearchParams({
              ...q,
              vehicleTypeId: v.id
            } as any);

            return (
              <div
                key={v.id}
                className="group card p-6 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                        {v.seats}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-lg text-slate-900">{v.name}</h3>
                          {v.isLuxury ? (
                            <span className="badge bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700 border-amber-200">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              豪华
                            </span>
                          ) : null}
                          {v.isBus ? (
                            <span className="badge bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border-indigo-200">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                                <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                              </svg>
                              大巴
                            </span>
                          ) : null}
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-sm text-slate-600">
                          <span className="flex items-center gap-1.5">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            {v.seats} 座
                          </span>
                          <span className="flex items-center gap-1.5">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                            行李: {v.luggageSmall}/{v.luggageMedium}/{v.luggageLarge}
                          </span>
                        </div>
                        {v.description ? (
                          <p className="text-sm text-slate-500 mt-2">{v.description}</p>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <div className="md:text-right md:min-w-[180px]">
                    {disabled ? (
                      <div className="text-sm text-slate-400 font-medium">{t("vehicles.noPrice")}</div>
                    ) : (
                      <>
                        <div className="text-2xl font-bold text-slate-900 mb-1">
                          {formatMoneyFromJpy(total, currency, locale)}
                        </div>
                        <div className="text-xs text-slate-500 space-y-0.5">
                          <div>基础 {formatMoneyFromJpy(base, currency, locale)}</div>
                          {night ? <div>夜间 +{formatMoneyFromJpy(night, currency, locale)}</div> : null}
                          {urgent ? <div>急单 +{formatMoneyFromJpy(urgent, currency, locale)}</div> : null}
                        </div>
                      </>
                    )}
                    <div className="mt-4">
                      <Link
                        aria-disabled={disabled}
                        className={
                          disabled
                            ? "inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-100 text-slate-400 cursor-not-allowed font-medium"
                            : "btn-primary inline-flex items-center justify-center gap-2"
                        }
                        href={disabled ? "#" : `/checkout?${params.toString()}`}
                      >
                        {t("vehicles.choose")}
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <aside className="lg:col-span-1">
          <div className="card p-6 sticky top-24">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg text-slate-900">{t("vehicles.tips")}</h3>
            </div>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-slate-600">
                <svg className="w-5 h-5 text-brand-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>{t("vehicles.tip1")}</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-600">
                <svg className="w-5 h-5 text-brand-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>{t("vehicles.tip2")}</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-600">
                <svg className="w-5 h-5 text-brand-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>{t("vehicles.tip3")}</span>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}


