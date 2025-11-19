export function startOfDay(d: Date): Date {
  const dd = new Date(d);
  dd.setHours(0, 0, 0, 0);
  return dd;
}

export function addDays(d: Date, days: number): Date {
  const dd = new Date(d);
  dd.setDate(dd.getDate() + days);
  return dd;
}

export function formatISODate(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatDisplay(d: string | Date, locale = "en-IN"): string {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString(locale, { day: "2-digit", month: "short", year: "numeric" });
}
