import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import CropPlanCalendar from "../components/CropPlanCalendar";
import { generatePlan, type CategoryKey as PlanCategoryKey } from "../data/cropPlans";
import { useI18n } from "@/site/i18n";
import { useAuth } from "@/lib/auth";

type CropEntry = {
  id: string;
  category: CategoryKey;
  crop: string;
  season: string;
  irrigation: string;
  areaAcre: number;
  sowingDate?: string;
  notes?: string;
  createdAt: string;
};

const STORAGE_KEY = "mahaCrops";

type CategoryKey = "Cereal" | "Pulses" | "Oilseed" | "Fruit" | "Vegetable";

type Irrigations = "Rainfed" | "Drip" | "Sprinkler" | "Flood";

const catalog: Record<CategoryKey, { value: string; label: { en: string; mr: string; hi: string } }[]> = {
  Cereal: [
    { value: "Rice", label: { en: "Rice", mr: "तांदूळ", hi: "धान" } },
    { value: "Jowar (Sorghum)", label: { en: "Jowar (Sorghum)", mr: "ज्वारी", hi: "ज्वार" } },
    { value: "Bajra (Pearl Millet)", label: { en: "Bajra (Pearl Millet)", mr: "बाजरी", hi: "बाजरा" } },
    { value: "Wheat", label: { en: "Wheat", mr: "गहू", hi: "गेहूं" } },
    { value: "Maize", label: { en: "Maize", mr: "मका", hi: "मकई" } },
  ],
  Pulses: [
    { value: "Tur (Pigeon Pea)", label: { en: "Tur (Pigeon Pea)", mr: "तूर", hi: "अरहर/तूर" } },
    { value: "Chana (Gram)", label: { en: "Chana (Gram)", mr: "हरभरा", hi: "चना" } },
    { value: "Moong (Green Gram)", label: { en: "Moong (Green Gram)", mr: "मुग", hi: "मूँग" } },
    { value: "Urad (Black Gram)", label: { en: "Urad (Black Gram)", mr: "उडीद", hi: "उड़द" } },
  ],
  Oilseed: [
    { value: "Soybean", label: { en: "Soybean", mr: "सोयाबीन", hi: "सोयाबीन" } },
    { value: "Groundnut", label: { en: "Groundnut", mr: "भुईमूग", hi: "मूंगफली" } },
    { value: "Sunflower", label: { en: "Sunflower", mr: "सूर्यमुखी", hi: "सूरजमुखी" } },
    { value: "Sesame (Til)", label: { en: "Sesame (Til)", mr: "तिळ", hi: "तिल" } },
  ],
  Fruit: [
    { value: "Mango", label: { en: "Mango", mr: "आंबा", hi: "आम" } },
    { value: "Banana", label: { en: "Banana", mr: "केळी", hi: "केला" } },
    { value: "Pomegranate", label: { en: "Pomegranate", mr: "डाळिंब", hi: "अनार" } },
    { value: "Grapes", label: { en: "Grapes", mr: "द्राक्ष", hi: "अंगूर" } },
    { value: "Orange", label: { en: "Orange", mr: "संत्रे", hi: "संतरा" } },
  ],
  Vegetable: [
    { value: "Onion", label: { en: "Onion", mr: "कांदा", hi: "प्याज़" } },
    { value: "Tomato", label: { en: "Tomato", mr: "टोमॅटो", hi: "टमाटर" } },
    { value: "Brinjal (Eggplant)", label: { en: "Brinjal (Eggplant)", mr: "वांगी", hi: "बैंगन" } },
    { value: "Okra (Bhendi)", label: { en: "Okra (Bhendi)", mr: "भेंडी", hi: "भिंडी" } },
    { value: "Cauliflower", label: { en: "Cauliflower", mr: "फुलकोबी", hi: "फूलगोभी" } },
  ],
};

const seasons = ["Kharif", "Rabi", "Summer", "Annual"] as const;
const irrigations: Irrigations[] = ["Rainfed", "Drip", "Sprinkler", "Flood"];

export default function Crops() {
  const { t, locale } = useI18n();
  const { canAccessCrops } = useAuth();
  const [entries, setEntries] = useState<CropEntry[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as CropEntry[]) : [];
    } catch {
      return [];
    }
  });

  const [category, setCategory] = useState<CategoryKey>("Cereal");
  const [crop, setCrop] = useState("");
  const [season, setSeason] = useState<string>("Kharif");
  const [irrigation, setIrrigation] = useState<Irrigations>("Rainfed");
  const [areaAcre, setAreaAcre] = useState<string>("");
  const [sowingDate, setSowingDate] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  const options = useMemo(() => catalog[category], [category]);
  useEffect(() => {
    setCrop("");
  }, [category]);

  const invalid = !category || !crop || !Number(areaAcre) || Number(areaAcre) <= 0;

  async function addEntry() {
    if (invalid) return;
    const entry: CropEntry = {
      id: crypto.randomUUID(),
      category,
      crop,
      season,
      irrigation,
      areaAcre: Number(areaAcre),
      sowingDate: sowingDate || undefined,
      notes: notes.trim() || undefined,
      createdAt: new Date().toISOString(),
    };
    setEntries((prev) => [entry, ...prev]);
    try {
      const { toast } = await import("@/components/ui/use-toast");
      toast({ title: "Crop saved", description: entry.sowingDate ? "Calendar plan generated under View Plan." : "Add a sowing date to generate the calendar." });
    } catch {}
    setCrop("");
    setAreaAcre("");
    setSowingDate("");
    setNotes("");
  }

  function remove(id: string) {
    setEntries((prev) => prev.filter((e) => e.id !== id));
    setExpanded((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  }

  function renderPlan(e: CropEntry) {
    if (!e.sowingDate) {
      return <div className="text-xs text-muted-foreground">{t.add_sowing_hint}</div>;
    }
    const plan = generatePlan({
      category: e.category as PlanCategoryKey,
      crop: e.crop,
      irrigation: e.irrigation as any,
      areaAcre: e.areaAcre,
      sowingISO: e.sowingDate,
      locale,
    });
    return <CropPlanCalendar plan={plan} />;
  }

  if (!canAccessCrops()) {
    return (
      <main className="container py-16">
        <h1 className="text-3xl font-bold tracking-tight mb-6">{t.crops_title}</h1>
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          {t.access_denied || "You need to be logged in to access this section."}
        </div>
      </main>
    );
  }

  return (
    <main className="container py-16">
      <h1 className="text-3xl font-bold tracking-tight mb-6">{t.crops_title}</h1>
      <p className="text-sm text-muted-foreground mb-8">{t.crops_intro}</p>

      <section className="grid gap-4 sm:max-w-2xl">
        <div className="grid gap-1">
          <label className="text-sm">{t.crops_category}</label>
          <select value={category} onChange={(e) => setCategory(e.target.value as CategoryKey)} className="mt-1 w-full rounded-md border p-2 text-sm">
            {(Object.keys(catalog) as CategoryKey[]).map((k) => (
              <option key={k} value={k}>{k}</option>
            ))}
          </select>
        </div>

        <div className="grid gap-1">
          <label className="text-sm">{t.crops_crop}</label>
          <select value={crop} onChange={(e) => setCrop(e.target.value)} className="mt-1 w-full rounded-md border p-2 text-sm">
            <option value="">{t.search_placeholder}</option>
            {options.map((c) => (
              <option key={c.value} value={c.value}>{c.label[locale]}</option>
            ))}
          </select>
        </div>

        <div className="grid gap-1 sm:grid-cols-2 sm:items-end sm:gap-3">
          <div>
            <label className="text-sm">{t.crops_season}</label>
            <select value={season} onChange={(e) => setSeason(e.target.value)} className="mt-1 w-full rounded-md border p-2 text-sm">
              <option value="Kharif">{t.season_kharif}</option>
              <option value="Rabi">{t.season_rabi}</option>
              <option value="Summer">{t.season_summer}</option>
              <option value="Annual">{t.season_annual}</option>
            </select>
          </div>
          <div>
            <label className="text-sm">{t.crops_irrigation}</label>
            <select value={irrigation} onChange={(e) => setIrrigation(e.target.value as Irrigations)} className="mt-1 w-full rounded-md border p-2 text-sm">
              <option value="Rainfed">{t.irr_rainfed}</option>
              <option value="Drip">{t.irr_drip}</option>
              <option value="Sprinkler">{t.irr_sprinkler}</option>
              <option value="Flood">{t.irr_flood}</option>
            </select>
          </div>
        </div>

        <div className="grid gap-1 sm:grid-cols-2 sm:gap-3">
          <div>
            <label className="text-sm">{t.crops_area}</label>
            <input type="number" value={areaAcre} onChange={(e) => setAreaAcre(e.target.value)} className="mt-1 w-full rounded-md border p-2 text-sm" />
          </div>
          <div>
            <label className="text-sm">{t.crops_sowing}</label>
            <input type="date" value={sowingDate} onChange={(e) => setSowingDate(e.target.value)} className="mt-1 w-full rounded-md border p-2 text-sm" />
          </div>
        </div>

        <div className="grid gap-1">
          <label className="text-sm">{t.crops_notes}</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="mt-1 w-full rounded-md border p-2 text-sm" />
        </div>

        <Button onClick={addEntry} disabled={invalid}>{t.save_crop}</Button>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold mb-3">{t.your_crops}</h2>
        {entries.length === 0 && (
          <div className="text-sm text-muted-foreground">{t.no_crops}</div>
        )}
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {entries.map((e) => (
            <article key={e.id} className="rounded-lg border bg-card p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{e.crop}</h3>
                <button onClick={() => remove(e.id)} className="text-xs text-red-600 hover:underline">Remove</button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{e.category} • {e.season} • {e.irrigation}</p>
              <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
                <div>
                  <dt className="text-muted-foreground">{t.crops_area}</dt>
                  <dd>{e.areaAcre} acre</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">{t.crops_sowing}</dt>
                  <dd>{e.sowingDate || "—"}</dd>
                </div>
              </dl>
              {e.notes && <p className="mt-2 text-sm">{e.notes}</p>}

              <div className="mt-3">
                <button
                  className="text-xs text-primary hover:underline"
                  onClick={() => setExpanded((prev) => ({ ...prev, [e.id]: !prev[e.id] }))}
                >
                  {expanded[e.id] ? t.hide_plan : t.view_plan}
                </button>
                {expanded[e.id] && (
                  <div className="mt-2">
                    {renderPlan(e)}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
