import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Search,
  Sprout,
  CloudSun,
  ShieldCheck,
  Users,
  Landmark,
  ArrowRight,
  Sparkles,
  Droplets,
} from "lucide-react";
import { useI18n } from "@/site/i18n";
import IncomeSection from "@/site/IncomeSection";

const crops = [
  { key: "wheat", en: "Wheat", mr: "गहू", hi: "गेहूं" },
  { key: "sugarcane", en: "Sugarcane", mr: "ऊस", hi: "गन्ना" },
  { key: "cotton", en: "Cotton", mr: "कापूस", hi: "कपास" },
  { key: "soybean", en: "Soybean", mr: "सोयाबीन", hi: "सोयाबीन" },
  { key: "paddy", en: "Paddy", mr: "भात", hi: "धान" },
];

const heroStats = [
  { label: "Active farmers", value: "12k+" },
  { label: "Advisory accuracy", value: "97%" },
  { label: "District coverage", value: "34" },
];

const schemeCards = [
  {
    title: "MahaDBT – Agriculture Department Schemes",
    href: "https://mahadbt.maharashtra.gov.in",
    desc: "Official Maharashtra DBT portal for agriculture and horticulture subsidies.",
    image: "https://images.unsplash.com/photo-1519120126473-8be9c622f0c5?auto=format&fit=crop&w=1200&q=80",
    alt: "Group of Maharashtra farmers consulting officials at a government help desk",
  },
  {
    title: "Mahatma Jyotirao Phule Shetkari Karjmukti Yojana",
    href: "https://mjpsky.maharashtra.gov.in",
    desc: "State loan waiver programme details and services.",
    image: "https://images.unsplash.com/photo-1586772001954-439f611c2c59?auto=format&fit=crop&w=1200&q=80",
    alt: "Farmer couple meeting a banker to settle crop loan paperwork",
  },
  {
    title: "Mukhyamantri Saur Krishi Pump Yojana",
    href: "https://www.mahadiscom.in/solar/",
    desc: "Apply for solar agriculture pumps via Mahadiscom.",
    image: "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1200&q=80",
    alt: "Solar powered irrigation pump running beside sugarcane rows",
  },
  {
    title: "Department of Agriculture, Maharashtra",
    href: "https://krishi.maharashtra.gov.in",
    desc: "Official department site with schemes and advisories.",
    image: "https://images.unsplash.com/photo-1524901548305-08eeddc35080?auto=format&fit=crop&w=1200&q=80",
    alt: "Agriculture officer inspecting crops with a clipboard in the field",
  },
];

export default function Index() {
  const { t, locale } = useI18n();
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return [] as typeof crops;
    return crops.filter((c) => c[locale].toLowerCase().includes(q) || c.en.toLowerCase().includes(q));
  }, [query, locale]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-lime-50">
      <section className="relative overflow-hidden border-b border-emerald-100/40">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(38%_45%_at_20%_30%,rgba(16,185,129,0.25),transparent)]" />
          <div className="absolute inset-0 bg-[radial-gradient(32%_40%_at_80%_20%,rgba(132,204,22,0.2),transparent)]" />
          <div className="absolute bottom-[-40%] right-[-10%] h-[560px] w-[560px] rounded-full bg-gradient-to-br from-emerald-200/40 via-transparent to-transparent blur-3xl" />
        </div>

        <div className="container relative grid items-center gap-14 py-20 md:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
          <div className="space-y-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200/60 bg-white/80 px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-emerald-700 shadow-sm">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              Smarter farming everyday
            </span>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-emerald-900 md:text-6xl">
              <span className="block text-balance text-transparent bg-gradient-to-r from-emerald-600 via-emerald-500 to-lime-500 bg-clip-text">
                {t.brand}
              </span>
              {t.hero_sub}
            </h1>
            <p className="max-w-xl text-base text-muted-foreground md:text-lg">
              Build precise crop plans, monitor weather, discover schemes, and connect with experts through one clean, modern interface tailored for Maharashtra.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="lg" className="group">
                <span>{t.cta_get_started}</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
              </Button>
              <a
                href="#features"
                className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 transition-colors hover:text-emerald-900"
              >
                See everything we cover
                <Droplets className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>

            <div className="mt-8 rounded-3xl border border-emerald-100/80 bg-white/80 p-4 shadow-lg backdrop-blur">
              <div className="flex items-center gap-3 rounded-2xl border border-emerald-100/80 bg-emerald-50/80 px-4 py-3">
                <Search className="h-5 w-5 text-emerald-500" aria-hidden="true" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t.search_placeholder}
                  className="w-full bg-transparent text-sm outline-none"
                  aria-label="search-crop"
                />
              </div>
              {results.length > 0 && (
                <ul className="mt-3 max-h-52 divide-y divide-emerald-100/80 overflow-y-auto rounded-2xl border border-emerald-100/80 bg-white/90 text-sm">
                  {results.map((c) => (
                    <li key={c.key} className="flex items-center justify-between px-4 py-2 transition-colors hover:bg-emerald-50">
                      <span className="font-medium text-emerald-900">{c[locale]}</span>
                      <span className="text-xs text-muted-foreground">{c.en}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {heroStats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-emerald-100/80 bg-white/80 p-4 text-sm font-semibold text-emerald-900 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="text-2xl font-extrabold text-emerald-600">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative flex justify-center">
            <div className="absolute inset-0 -translate-y-6 scale-110 rounded-full bg-gradient-to-br from-emerald-200/40 via-lime-100/30 to-transparent blur-2xl" aria-hidden />
            <div className="relative w-full max-w-sm rounded-[2.5rem] border border-white/50 bg-white/80 p-4 shadow-2xl backdrop-blur">
              <div className="overflow-hidden rounded-[2rem]">
                <img
                  src="https://images.unsplash.com/photo-1523419409543-0c1df022bdd1?auto=format&fit=crop&w=900&q=80"
                  alt="Maharashtra farmer checking crop growth in a lush green field"
                  className="h-64 w-full object-cover animate-pulse-glow"
                  loading="lazy"
                />
              </div>
              <div className="mt-4 rounded-2xl border border-emerald-100/60 bg-gradient-to-r from-emerald-50 via-white to-lime-50 p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
                    <Sprout className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-emerald-500">Live season insight</p>
                    <p className="text-sm font-semibold text-emerald-900">Drip irrigation scheduled for 6pm</p>
                  </div>
                </div>
              </div>
              <div className="pointer-events-none absolute -top-6 right-4 hidden rounded-full border border-white/60 bg-white/70 px-4 py-2 text-xs font-semibold text-emerald-600 shadow animate-float-slow md:flex">
                Rain alert issued • +12 mm
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="relative border-b border-emerald-100/50 bg-white/70">
        <div className="absolute inset-x-0 -top-20 hidden h-40 bg-gradient-to-b from-emerald-100/40 to-transparent blur-3xl md:block" aria-hidden />
        <div className="container py-20">
          <h2 className="text-center text-3xl font-bold tracking-tight text-emerald-900 md:text-4xl">
            {t.features_title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-sm text-muted-foreground md:text-base">
            Intelligent insights designed with farmers in mind — blending hyperlocal data, expert guidance, and easy-to-follow actions.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Feature icon={Sprout} title={t.f1} desc="Stage-wise sowing, irrigation, nutrient and pest guidance for local varieties." />
            <Feature icon={Landmark} title={t.f2} desc="Central and state schemes with eligibility, documents and simple workflows." />
            <Feature icon={CloudSun} title={t.f3} desc="7-day weather snapshot with actionable alerts for irrigation and pest risk." />
            <Feature icon={Users} title={t.f4} desc="Call verified experts and connect with trusted distributors in your taluka." />
          </div>
        </div>
      </section>

      <section className="border-b border-emerald-100/40 bg-gradient-to-r from-white via-emerald-50/40 to-white">
        <div className="container py-20">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <h3 className="text-2xl font-bold text-emerald-900">{t.schemes_highlight}</h3>
            <p className="text-sm text-muted-foreground md:max-w-md">
              Curated programmes, subsidies and resources updated daily to keep you ahead of deadlines.
            </p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {schemeCards.map((s) => (
              <a
                key={s.title}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="group relative overflow-hidden rounded-3xl border border-emerald-100/80 bg-white/80 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="h-40 overflow-hidden">
                  <img
                    src={s.image}
                    alt={s.alt}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-emerald-600">
                    <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                    <span className="text-xs font-semibold uppercase tracking-wide">Government verified</span>
                  </div>
                  <h4 className="mt-3 text-lg font-semibold text-emerald-900 group-hover:text-emerald-700">{s.title}</h4>
                  <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <IncomeSection />
    </main>
  );
}

function Feature({ icon: Icon, title, desc }: { icon: any; title: string; desc: string }) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-emerald-100/70 bg-white/80 p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
      <div className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full bg-emerald-100/60 blur-3xl transition-opacity group-hover:opacity-90" />
      <div className="relative flex items-start gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 shadow-inner">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <h3 className="text-base font-semibold text-emerald-900">{title}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
        </div>
      </div>
    </div>
  );
}
