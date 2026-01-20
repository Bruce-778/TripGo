import Image from "next/image";
import { getT } from "@/lib/i18n";

export async function TravelShowcase() {
  const { t } = await getT();
  const cards = [
    {
      title: t("showcase.tokyo.title"),
      desc: t("showcase.tokyo.desc"),
      src: "/travel/tokyo.svg"
    },
    {
      title: t("showcase.kyoto.title"),
      desc: t("showcase.kyoto.desc"),
      src: "/travel/kyoto.svg"
    },
    {
      title: t("showcase.osaka.title"),
      desc: t("showcase.osaka.desc"),
      src: "/travel/osaka.svg"
    }
  ];

  return (
    <section className="mt-6">
      <div className="p-6 rounded-2xl bg-white border border-slate-200">
        <div className="text-sm text-slate-500">{t("brand.name")}</div>
        <h3 className="mt-1 text-xl font-semibold tracking-tight">
          {t("showcase.title")}
        </h3>
        <div className="mt-2 text-sm text-slate-600">
          {t("showcase.subtitle")}
        </div>

        <div className="mt-5 grid md:grid-cols-3 gap-4">
          {cards.map((c) => (
            <div key={c.title} className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50">
              <div className="relative h-40">
                <Image src={c.src} alt={c.title} fill className="object-cover" />
              </div>
              <div className="p-4">
                <div className="font-semibold">{c.title}</div>
                <div className="text-sm text-slate-600 mt-1">{c.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


