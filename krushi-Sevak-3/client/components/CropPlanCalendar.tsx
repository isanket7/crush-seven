import { formatDisplay } from "../utils/date";
import type { PlanResult, PlanTaskType } from "../data/cropPlans";
import { useI18n } from "@/site/i18n";

const typeColor: Record<PlanTaskType, string> = {
  activity: "bg-emerald-100 text-emerald-800 border-emerald-200",
  fertilizer: "bg-amber-100 text-amber-800 border-amber-200",
  pest: "bg-rose-100 text-rose-800 border-rose-200",
  irrigation: "bg-sky-100 text-sky-800 border-sky-200",
};

export default function CropPlanCalendar({ plan }: { plan: PlanResult }) {
  const { t, locale } = useI18n();
  const groups = groupByWeek(plan, locale);
  return (
    <div className="mt-4 border rounded-md">
      <header className="px-4 py-3 border-b bg-muted/30">
        <div className="text-sm text-muted-foreground">{t.plan_window}</div>
        <div className="text-sm font-medium">{formatDisplay(plan.start, mapLocale(locale))} → {formatDisplay(plan.end, mapLocale(locale))}</div>
      </header>

      <div className="p-4">
        <div className="mb-4">
          <h4 className="text-sm font-semibold mb-2">{t.growth_stages}</h4>
          <ol className="space-y-2">
            {plan.stages.map((s) => (
              <li key={s.name} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{s.name}</span>
                <span className="font-medium">{formatDisplay(s.start, mapLocale(locale))} – {formatDisplay(s.end, mapLocale(locale))}</span>
              </li>
            ))}
          </ol>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-2">{t.weekly_tasks}</h4>
          <div className="space-y-3">
            {groups.map((g) => (
              <div key={g.week} className="rounded-md border">
                <div className="flex items-center justify-between px-3 py-2 bg-accent/40">
                  <div className="text-xs text-muted-foreground">Week {g.week}</div>
                  <div className="text-xs font-medium">{formatDisplay(g.start, mapLocale(locale))} – {formatDisplay(g.end, mapLocale(locale))}</div>
                </div>
                <ul className="p-3 space-y-2">
                  {g.items.length === 0 && (
                    <li className="text-xs text-muted-foreground">{t.no_tasks}</li>
                  )}
                  {g.items.map((titem, idx) => (
                    <li key={`${titem.date}-${idx}`} className={`text-xs rounded border px-2 py-1 flex items-start gap-2 ${typeColor[titem.type]}`}>
                      <span className="shrink-0 font-semibold">{formatDisplay(titem.date, mapLocale(locale))}</span>
                      <div>
                        <div className="font-medium">{titem.title}</div>
                        <div className="opacity-80">{titem.description}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function mapLocale(l: "en" | "mr" | "hi"): string {
  switch (l) {
    case "mr":
      return "mr-IN";
    case "hi":
      return "hi-IN";
    default:
      return "en-IN";
  }
}

function groupByWeek(plan: PlanResult) {
  const start = new Date(plan.start);
  const end = new Date(plan.end);
  const weeks: { week: number; start: string; end: string; items: PlanResult["tasks"] }[] = [];
  let w = 1;
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 7)) {
    const wkStart = new Date(d);
    const wkEnd = new Date(d);
    wkEnd.setDate(wkEnd.getDate() + 6);
    const items = plan.tasks.filter((t) => {
      const td = new Date(t.date);
      return td >= wkStart && td <= wkEnd;
    });
    weeks.push({ week: w, start: wkStart.toISOString().slice(0, 10), end: wkEnd.toISOString().slice(0, 10), items });
    w += 1;
  }
  return weeks;
}
