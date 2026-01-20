import { AdminClient } from "@/components/AdminClient";
import { getT, getLocale } from "@/lib/i18n";

export default async function AdminPage() {
  const { t } = await getT();
  const locale = await getLocale();
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">{t("admin.title")}</h2>
        <div className="text-sm text-slate-600 mt-1">
          {t("admin.subtitle")}
        </div>
      </div>
      <div className="mt-6">
        <AdminClient
          locale={locale}
          labels={{
            loginTitle: t("admin.loginTitle"),
            loginSubtitle: t("admin.loginSubtitle"),
            enter: t("admin.enter"),
            loading: t("admin.loading"),
            orders: t("admin.orders"),
            edit: t("admin.edit"),
            editTitle: t("admin.editTitle"),
            status: t("admin.status"),
            manualAdjustment: t("admin.manualAdjustment"),
            note: t("admin.note"),
            save: t("admin.save"),
            saving: t("admin.saving")
          }}
        />
      </div>
    </div>
  );
}


