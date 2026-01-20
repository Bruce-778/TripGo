import Image from "next/image";

export function TravelShowcase() {
  const cards = [
    {
      title: "Tokyo",
      desc: "Shibuya · Asakusa · Skytree",
      src: "/travel/tokyo.svg"
    },
    {
      title: "Kyoto",
      desc: "Fushimi Inari · Gion · Kiyomizu-dera",
      src: "/travel/kyoto.svg"
    },
    {
      title: "Osaka",
      desc: "Dotonbori · Castle · Food tour",
      src: "/travel/osaka.svg"
    }
  ];

  return (
    <section className="mt-6">
      <div className="p-6 rounded-2xl bg-white border border-slate-200">
        <div className="text-sm text-slate-500">JapanGo</div>
        <h3 className="mt-1 text-xl font-semibold tracking-tight">
          Airport transfer · Fixed price · 24/7 support
        </h3>
        <div className="mt-2 text-sm text-slate-600">
          Reliable airport pickups & drop-offs across Japan. Choose your vehicle, share flight details, and
          book in minutes.
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


