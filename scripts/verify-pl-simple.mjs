import fs from "node:fs";

const paths = [
  "/pl/",
  "/pl/learn",
  "/pl/learn/what-is-cbti",
  "/pl/calculator",
  "/pl/assessment",
  "/pl/diary",
  "/pl/relax",
  "/pl/program",
  "/pl/dashboard",
];

const base = "http://localhost:8083";
const out = [];

for (const path of paths) {
  try {
    const res = await fetch(`${base}${path}`);
    const text = await res.text();
    const head = text.match(/<head[^>]*>([\s\S]*?)<\/head>/)?.[1] ?? "";
    const title = head.match(/<title>([^<]*)<\/title>/)?.[1] ?? "(no title)";
    const hreflangs = [...head.matchAll(/hrefLang="([^"]+)"/)].map((m) => m[1]);
    const english = ["Sleep Better", "Starting Tonight"].filter((m) => text.includes(m));
    out.push(`${path}\t${res.status}\t${title}\threflangs=${hreflangs.join(",")}${english.length ? "\tEN=" + english.join(",") : ""}`);
  } catch (e) {
    out.push(`${path}\tERROR\t${e.message}`);
  }
}

fs.writeFileSync("verify-simple.log", out.join("\n"), "utf8");
console.log(out.join("\n"));
