/** Get the current Hijri date string using the Umm al-Qura calendar. */
export function getHijriDate(correction = 0): string {
  const date = new Date();
  date.setDate(date.getDate() + correction);

  const parts = new Intl.DateTimeFormat("en-u-ca-islamic-umalqura", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).formatToParts(date);

  const day = parts.find((p) => p.type === "day")?.value ?? "";
  const month = parts.find((p) => p.type === "month")?.value ?? "";
  const year =
    parts.find((p) => (p.type as string) === "relatedYear")?.value ??
    parts.find((p) => p.type === "year")?.value ??
    "";

  return `${day} ${month} ${year}`;
}
