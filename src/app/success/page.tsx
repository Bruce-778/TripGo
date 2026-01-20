import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getT, getLocale } from "@/lib/i18n";
import { formatDateTimeJST } from "@/lib/timeFormat";

export default async function SuccessPage({
  searchParams
}: {
  searchParams: any;
}) {
  const sp = typeof searchParams?.then === "function" ? await searchParams : searchParams;
  const { t } = await getT();
  const locale = await getLocale();
  const bookingId = sp.bookingId;
  if (!bookingId) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="p-5 rounded-2xl bg-white border border-slate-200">
          <div className="font-semibold">{t("vehicles.paramsError")}</div>
          <div className="mt-3">
            <Link className="text-brand-700 underline" href="/">
              {t("vehicles.goHome")}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { vehicleType: true }
  });

  if (!booking) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="p-5 rounded-2xl bg-white border border-slate-200">
          <div className="font-semibold">{t("orders.none")}</div>
          <div className="mt-3">
            <Link className="text-brand-700 underline" href="/">
              {t("vehicles.goHome")}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex items-center justify-center py-12 px-4">
      <div className="max-w-2xl w-full">
        <div className="card-elevated p-8 sm:p-10 text-center">
          {/* Success Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 mb-6 shadow-lg animate-scale-in">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 border border-emerald-200 text-sm font-medium mb-4">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            下单成功（MVP：未接支付）
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-2">
            订单已创建
          </h1>
          <p className="text-slate-600 mb-8">您的订单已成功提交，我们会尽快与您联系确认</p>

          {/* Order Details */}
          <div className="bg-slate-50 rounded-xl p-6 mb-8 text-left">
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-slate-200">
                <span className="text-slate-500 font-medium">订单号</span>
                <span className="font-mono font-semibold text-slate-900">{booking.id}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-200">
                <span className="text-slate-500 font-medium">车型</span>
                <span className="font-semibold text-slate-900">{booking.vehicleType.name}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-200">
                <span className="text-slate-500 font-medium">{t("success.pickupTime")}</span>
                <span className="font-semibold text-slate-900">{formatDateTimeJST(booking.pickupTime, locale)}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-slate-500 font-medium">状态</span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="font-semibold text-slate-900">{booking.status}</span>
                  {booking.isUrgent ? (
                    <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-xs font-medium">
                      急单
                    </span>
                  ) : null}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              className="btn-primary inline-flex items-center justify-center gap-2"
              href="/orders"
            >
              去「我的订单」查看/取消
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link 
              className="btn-secondary inline-flex items-center justify-center gap-2" 
              href="/"
            >
              {t("vehicles.goHome")}
            </Link>
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <p className="text-xs text-blue-700">
              <strong>MVP 提醒：</strong>你可以在后台对该订单调价与改状态：进入 /admin 并输入 ADMIN_TOKEN。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


