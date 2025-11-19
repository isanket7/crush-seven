import { ShieldCheck } from "lucide-react";

const maharashtraSchemes = [
  {
    title: "MahaDBT – Agriculture Department Schemes",
    href: "https://mahadbt.maharashtra.gov.in",
    desc: "Official Direct Benefit Transfer portal listing agriculture and horticulture subsidies in Maharashtra.",
  },
  {
    title: "Mahatma Jyotirao Phule Shetkari Karjmukti Yojana",
    href: "https://mjpsky.maharashtra.gov.in",
    desc: "State loan waiver programme information and beneficiary services.",
  },
  {
    title: "Mukhyamantri Saur Krishi Pump Yojana",
    href: "https://www.mahadiscom.in/solar/",
    desc: "Apply for solar agricultural pumps under Maharashtra’s solar scheme (Mahadiscom).",
  },
  {
    title: "Department of Agriculture, Maharashtra",
    href: "https://krishi.maharashtra.gov.in",
    desc: "Official department site with state agriculture policies, advisories and scheme details.",
  },
];

export default function Schemes() {
  return (
    <main className="container py-16">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Maharashtra Schemes</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {maharashtraSchemes.map((s) => (
          <a key={s.title} href={s.href} target="_blank" rel="noreferrer" className="group rounded-xl border bg-card p-6 shadow-sm transition hover:shadow-md">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-emerald-600" />
              <h2 className="font-semibold group-hover:underline">{s.title}</h2>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
          </a>
        ))}
      </div>
      <p className="mt-6 text-xs text-muted-foreground">Links open official Maharashtra government portals only.</p>
    </main>
  );
}
