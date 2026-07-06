const paths = [
  "/pl/",
  "/pl/learn",
  "/pl/learn/what-is-cbti",
  "/pl/calculator",
  "/pl/assessment",
  "/pl/diary",
  "/pl/relax",
  "/pl/program",
  "/pl/program/week-1/what-is-insomnia",
  "/pl/dashboard",
];

const base = "http://localhost:8083";

for (const path of paths) {
  try {
    const res = await fetch(`${base}${path}`);
    const text = await res.text();
    const head = text.match(/<head[^>]*>([\s\S]*?)<\/head>/)?.[1] ?? "";
    const title = head.match(/<title>([^<]*)<\/title>/)?.[1] ?? "(no title)";
    const hreflangs = [...head.matchAll(/<link[^>]*rel="alternate"[^>]*>/g)].map(
      (m) => m[0].replace(/\s+/g, " ").trim(),
    );
    const canonical = head.match(/<link[^>]*rel="canonical"[^>]*>/)?.[0]?.replace(/\s+/g, " ").trim() ?? "";
    console.log(`\n${path} -> ${res.status} ${title}`);
    console.log("  canonical:", canonical);
    console.log("  hreflangs:", hreflangs.length ? "" : "none");
    hreflangs.forEach((h) => console.log("   ", h));
    const englishMarkers = [
      "Sleep Better",
      "Starting Tonight",
      "Learn",
      "Dashboard",
      "Diary",
      "Calculator",
      "Assessment",
      "Relax",
      "CBT-I Program",
      "Quick Lessons",
    ];
    const found = englishMarkers.filter((m) => text.includes(m));
    if (found.length) console.log("  EN markers:", found.join(", "));
  } catch (e) {
    console.error(`\n${path} -> ERROR: ${e.message}`);
  }
}
