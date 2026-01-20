import { getT } from "@/lib/i18n";
import { DevUnlockClient } from "@/components/DevUnlockClient";

export default async function DevPage() {
  const { t } = await getT();
  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <div className="p-6 rounded-2xl bg-white border border-slate-200">
        <div className="text-sm text-slate-500">Developer</div>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight">Unlock Admin</h2>
        <div className="mt-2 text-sm text-slate-600">
          {t("dev.unlock")}
        </div>
        <div className="mt-5">
          <DevUnlockClient
            labels={{
              token: "ADMIN_TOKEN",
              unlock: "Unlock",
              unlocking: "Unlocking...",
              success: "Unlocked. Go to /admin",
              failed: t("admin.loginSubtitle")
            }}
          />
        </div>
      </div>
    </div>
  );
}


