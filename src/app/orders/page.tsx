import { OrdersClient } from "@/components/OrdersClient";
import { getT, getLocale } from "@/lib/i18n";
import { TravelShowcase } from "@/components/TravelShowcase";

export default async function OrdersPage() {
  const { t } = await getT();
  const locale = await getLocale();
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">{t("orders.title")}</h2>
          <div className="text-sm text-slate-600 mt-1">{t("orders.subtitle")}</div>
        </div>
      </div>
      <TravelShowcase />
      <div className="mt-6">
        <OrdersClient
          locale={locale}
          labels={{
            queryTitle: t("orders.queryTitle"),
            querySubtitle: t("orders.querySubtitle"),
            email: t("orders.email"),
            search: t("orders.search"),
            searching: t("orders.searching"),
            list: t("orders.list"),
            none: t("orders.none"),
            cancel: t("orders.cancel"),
            cancelled: t("orders.cancelled"),
            cancelTitle: t("orders.cancelTitle"),
            cancelReason: t("orders.cancelReason"),
            cancelConfirm: t("orders.cancelConfirm"),
            close: t("orders.close"),
            processing: t("orders.processing"),
            urgentHint: t("vehicles.urgent")
          }}
        />
      </div>
    </div>
  );
}


