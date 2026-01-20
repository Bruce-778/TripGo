"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

export function LanguageSwitch({
  locale,
  labelLang,
  zhLabel,
  enLabel
}: {
  locale: "zh" | "en";
  labelLang: string;
  zhLabel: string;
  enLabel: string;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();

  async function setLocale(next: "zh" | "en") {
    await fetch("/api/locale", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ locale: next })
    });
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-slate-500">{labelLang}</span>
      <button
        disabled={pending}
        className={
          locale === "zh"
            ? "px-2 py-1 rounded-lg bg-brand-50 border border-brand-200 text-brand-800"
            : "px-2 py-1 rounded-lg border border-slate-200 hover:bg-slate-50"
        }
        onClick={() =>
          start(async () => {
            await setLocale("zh");
            router.refresh();
          })
        }
      >
        {zhLabel}
      </button>
      <button
        disabled={pending}
        className={
          locale === "en"
            ? "px-2 py-1 rounded-lg bg-brand-50 border border-brand-200 text-brand-800"
            : "px-2 py-1 rounded-lg border border-slate-200 hover:bg-slate-50"
        }
        onClick={() =>
          start(async () => {
            await setLocale("en");
            router.refresh();
          })
        }
      >
        {enLabel}
      </button>
    </div>
  );
}


