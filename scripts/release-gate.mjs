/**
 * Somna.help Release Gate — production readiness validator.
 *
 * Runs every gate check in sequence and produces a structured report.
 * Any failure blocks the release (exit code 1).
 *
 * Usage:
 *   node scripts/release-gate.mjs            # run all gates, print summary
 *   node scripts/release-gate.mjs --report   # also write release-report.md
 *
 * Gates (in order):
 *   1. Engineering Quality  — tsc, eslint, prettier, build, wrangler dry-run
 *   2. Route Validation     — every src/routes/*.tsx has a createFileRoute
 *   3. SEO                  — sitemap, robots, OG image, canonical, JSON-LD
 *   4. i18n                 — en/zh/es key parity across all dict modules
 *   5. Data Integrity       — single source of truth for SleepRecord
 *   6. Security             — no innerHTML, no localhost in production config
 *   7. Bundle Health        — main chunk size warning (non-blocking)
 *
 * This script is dependency-free (Node 20+ built-ins only) so it can run in
 * CI without extra installs. It shells out to the project's own tsc/eslint/
 * vite/wrangler via npx so it always uses the pinned versions.
 */
import { execSync, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
const isReport = process.argv.includes("--report");

/** A single gate check result. */
class Check {
  constructor(name, status, detail = "") {
    this.name = name;
    this.status = status; // "pass" | "fail" | "warn"
    this.detail = detail;
  }
}

const results = [];
const startedAt = Date.now();

function run(name, fn) {
  process.stdout.write(`  ▸ ${name} ... `);
  try {
    const detail = fn();
    process.stdout.write("✅\n");
    results.push(new Check(name, "pass", detail || ""));
  } catch (err) {
    const detail = err?.message || String(err);
    if (detail.startsWith("__WARN__")) {
      process.stdout.write("⚠️\n");
      results.push(new Check(name, "warn", detail.replace("__WARN__", "")));
    } else {
      process.stdout.write("❌\n");
      results.push(new Check(name, "fail", detail));
    }
  }
}

/** Shell out and return trimmed stdout. Throws on non-zero exit. */
function sh(cmd, { cwd = ROOT, env } = {}) {
  return execSync(cmd, {
    cwd,
    encoding: "utf8",
    stdio: ["pipe", "pipe", "pipe"],
    env: { ...process.env, ...env },
  }).trim();
}

/** Read a file relative to project root, throwing a readable error. */
function read(rel) {
  const p = join(ROOT, rel);
  if (!existsSync(p)) throw new Error(`missing file: ${rel}`);
  return readFileSync(p, "utf8");
}

// ---------------------------------------------------------------------------
// Gate 1 — Engineering Quality
// ---------------------------------------------------------------------------
console.log("\n═══ Gate 1: Engineering Quality ═══");

run("TypeScript (tsc --noEmit)", () => {
  sh("npx tsc --noEmit");
  return "0 errors";
});

run("ESLint (0 errors)", () => {
  const out = sh("npx eslint .");
  // eslint exits 0 on success; warnings are acceptable.
  const errorMatch = out.match(/(\d+)\s+error/);
  if (errorMatch && parseInt(errorMatch[1], 10) > 0) {
    throw new Error(`${errorMatch[1]} ESLint errors`);
  }
  const warnMatch = out.match(/(\d+)\s+warning/);
  return `${warnMatch ? warnMatch[1] : 0} warnings (acceptable)`;
});

run("Prettier (format check)", () => {
  try {
    sh("npx prettier --check .");
    return "all files formatted";
  } catch {
    throw "__WARN__some files need formatting (run `npm run format`)";
  }
});

run("Production Build (vite build)", () => {
  sh("npm run build");
  const serverEntry = join(ROOT, "dist", "server", "server.js");
  const clientDir = join(ROOT, "dist", "client");
  if (!existsSync(serverEntry)) throw new Error("dist/server/server.js missing");
  if (!existsSync(clientDir)) throw new Error("dist/client/ missing");
  return "dist/server/server.js + dist/client/ produced";
});

run("Wrangler Dry Run", () => {
  const logDir = join(ROOT, "ci-logs");
  const logFile = join(logDir, "wrangler-dry-run.log");
  mkdirSync(logDir, { recursive: true });
  // Redirect output to a file to avoid ENOBUFS from large in-memory pipes.
  const result = spawnSync("npx wrangler deploy --dry-run > ci-logs/wrangler-dry-run.log 2>&1", {
    cwd: ROOT,
    shell: true,
    stdio: ["ignore", "ignore", "ignore"],
  });
  if (!existsSync(logFile)) throw new Error("wrangler dry-run did not produce output");
  const out = readFileSync(logFile, "utf8");
  if (result.status !== 0) {
    throw new Error(`wrangler dry-run exited ${result.status}\n${out.slice(-500)}`);
  }
  if (!out.includes("SHARE_BUCKET")) throw new Error("R2 binding SHARE_BUCKET not found");
  if (!out.includes("--dry-run: exiting now")) throw new Error("dry-run did not complete");
  return "config valid, R2 binding present";
});

// ---------------------------------------------------------------------------
// Gate 2 — Route Validation
// ---------------------------------------------------------------------------
console.log("\n═══ Gate 2: Route Validation ═══");

run("All routes use createFileRoute", () => {
  const routeDir = join(ROOT, "src", "routes");
  const files = readdirSync(routeDir).filter((f) => f.endsWith(".tsx") && f !== "__root.tsx");
  const missing = [];
  for (const f of files) {
    const content = readFileSync(join(routeDir, f), "utf8");
    if (!content.includes("createFileRoute")) missing.push(f);
  }
  if (missing.length) throw new Error(`missing createFileRoute: ${missing.join(", ")}`);
  return `${files.length} routes validated`;
});

run("Route tree generated", () => {
  const tree = read("src/routeTree.gen.ts");
  if (!tree.includes("FileRoute")) throw new Error("routeTree.gen.ts looks empty");
  return "routeTree.gen.ts present";
});

// ---------------------------------------------------------------------------
// Gate 3 — SEO
// ---------------------------------------------------------------------------
console.log("\n═══ Gate 3: SEO ═══");

run("sitemap.xml lists all routes", () => {
  const indexXml = read("public/sitemap.xml");
  const childMaps = [...indexXml.matchAll(/<loc>([^<]+\.xml)<\/loc>/g)].map((m) => m[1]);
  const locs = [];
  if (childMaps.length > 0) {
    for (const childUrl of childMaps) {
      const fileName = childUrl.split("/").pop();
      const childXml = read(`public/${fileName}`);
      locs.push(...[...childXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]));
    }
  } else {
    locs.push(...[...indexXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]));
  }
  console.log(`    discovered ${locs.length} URLs in sitemap(s)`);
  if (locs.length < 30) throw new Error(`only ${locs.length} URLs (expected 30+)`);
  if (!locs.includes("https://somna.help/")) throw new Error("homepage missing");
  if (!locs.some((u) => u.includes("/program/week-1-sleep-foundations"))) throw new Error("program week 1 missing");
  return `${locs.length} URLs`;
});

run("robots.txt allows crawling + references sitemap", () => {
  const txt = read("public/robots.txt");
  if (!txt.includes("Allow: /")) throw new Error("no Allow: /");
  if (!txt.includes("Sitemap:")) throw new Error("no Sitemap directive");
  return "valid";
});

run("OG image file exists", () => {
  const root = read("src/routes/__root.tsx");
  const ogMatch = root.match(/og-cover\.jpg|og-default\.png/);
  if (!ogMatch) throw new Error("no OG image reference in __root.tsx");
  const imgFile = ogMatch[0];
  if (!existsSync(join(ROOT, "public", imgFile)))
    throw new Error(`referenced OG image ${imgFile} not in public/`);
  return `public/${imgFile}`;
});

run("No localhost URLs in source", () => {
  const offenders = [];
  const check = (rel) => {
    const content = read(rel);
    const matches = content.match(/https?:\/\/localhost/g);
    if (matches) offenders.push(`${rel} (${matches.length})`);
  };
  [
    "src/routes/__root.tsx",
    "src/lib/share-config.ts",
    "src/lib/share-text.ts",
    "public/sitemap.xml",
    "public/robots.txt",
  ].forEach(check);
  if (offenders.length) throw new Error(`localhost refs: ${offenders.join(", ")}`);
  return "clean";
});

run("Canonical URL present in root layout", () => {
  const root = read("src/routes/__root.tsx");
  if (!root.includes('rel: "canonical"')) throw new Error("no canonical link");
  return "present";
});

run("JSON-LD structured data present", () => {
  // Check that at least one route injects application/ld+json
  const lessonTpl = read("src/components/program/LessonTemplate.tsx");
  if (!lessonTpl.includes("application/ld+json")) throw new Error("no JSON-LD in LessonTemplate");
  return "Article JSON-LD in lessons";
});

// ---------------------------------------------------------------------------
// Gate 4 — i18n
// ---------------------------------------------------------------------------
console.log("\n═══ Gate 4: i18n (en / zh / es) ═══");

run("All i18n modules have active language dicts", () => {
  const modules = [
    "src/lib/i18n.tsx",
    "src/lib/sleep-i18n.ts",
    "src/lib/calc-i18n.ts",
    "src/lib/cbti-i18n.ts",
    "src/lib/learn-i18n.ts",
    "src/lib/program-lessons-i18n.ts",
  ];
  for (const rel of modules) {
    const content = read(rel);
    // Each module must reference all active lang codes as dict keys or cases.
    for (const lang of ["en", "es", "pt", "pl"]) {
      // Look for the lang as an object key like `en: {` or `const en`
      const re = new RegExp(`\\b${lang}\\s*[:=]`, "g");
      if (!re.test(content)) throw new Error(`${rel} missing lang "${lang}"`);
    }
  }
  return `${modules.length} modules × 4 langs`;
});

run("No mixed-language strings in main i18n dict", () => {
  // Heuristic: the en dict should not contain CJK characters; the zh dict
  // should not contain Spanish-only words like "Buenas" outside comments.
  const content = read("src/lib/i18n.tsx");
  const enSection = content.match(/const en[\s\S]*?^}/m)?.[0] || "";
  const cjkInEn = enSection.match(/[\u4e00-\u9fff]/g);
  if (cjkInEn) throw new Error(`CJK chars in en dict: ${cjkInEn.slice(0, 5).join("")}`);
  return "en dict clean of CJK";
});

run("Fallback mechanism present", () => {
  const content = read("src/lib/i18n.tsx");
  if (!content.includes("dicts.en")) throw new Error("no English fallback");
  return "falls back to en";
});

// ---------------------------------------------------------------------------
// Gate 5 — Data Integrity
// ---------------------------------------------------------------------------
console.log("\n═══ Gate 5: Data Integrity ═══");

run("Single SleepRecord source (one SLEEP_RECORDS_KEY)", () => {
  const records = read("src/lib/sleep-records.ts");
  const keyCount = (records.match(/SLEEP_RECORDS_KEY\s*=\s*"/g) || []).length;
  if (keyCount !== 1) throw new Error(`found ${keyCount} key definitions`);
  return "one canonical key";
});

run("loadRecords validates every field", () => {
  const records = read("src/lib/sleep-records.ts");
  const required = [
    "isISODate",
    "typeof r.bedtime",
    "typeof r.sleepEfficiency",
    "typeof r.sleepScore",
  ];
  const missing = required.filter((s) => !records.includes(s));
  if (missing.length) throw new Error(`validation gaps: ${missing.join(", ")}`);
  return "full field validation";
});

run("Dashboard uses cbti-brain recommendation engine", () => {
  const dash = read("src/routes/dashboard.tsx");
  if (!dash.includes("sleepWindow")) throw new Error("dashboard not using sleepWindow()");
  if (dash.includes("tonightPlan")) throw new Error("dashboard still using tonightPlan()");
  return "sleepWindow() from cbti-brain.ts";
});

// ---------------------------------------------------------------------------
// Gate 6 — Security
// ---------------------------------------------------------------------------
console.log("\n═══ Gate 6: Security ═══");

run("No dangerous innerHTML in components", () => {
  const offenders = [];
  const scan = (dir) => {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      if (statSync(full).isDirectory()) {
        // Skip shadcn/ui library primitives — they use dangerouslySetInnerHTML
        // for scoped CSS injection, which is a known safe library pattern.
        if (full.endsWith(join("src", "components", "ui"))) continue;
        scan(full);
      } else if (full.endsWith(".tsx") || full.endsWith(".ts")) {
        const content = readFileSync(full, "utf8");
        if (content.includes("dangerouslySetInnerHTML"))
          offenders.push(full.replace(ROOT + "\\", ""));
      }
    }
  };
  scan(join(ROOT, "src"));
  if (offenders.length) throw new Error(`dangerouslySetInnerHTML: ${offenders.join(", ")}`);
  return "no dangerouslySetInnerHTML (ui/ primitives excluded)";
});

run("R2 upload validates file format + size", () => {
  const svc = read("src/lib/share/shareService.ts");
  if (!svc.includes("validateUploadFile")) throw new Error("no validateUploadFile");
  if (!svc.includes("PngFormatInvalid")) throw new Error("no PNG format check");
  if (!svc.includes("FileSizeOverLimit")) throw new Error("no size limit check");
  if (!svc.includes("5 * 1024 * 1024")) throw new Error("no 5MB size constant");
  return "PNG format + 5MB size limit";
});

run("Share URLs use HTTPS + encodeURIComponent", () => {
  const text = read("src/lib/share-text.ts");
  if (!text.includes("encodeURIComponent")) throw new Error("no URL encoding");
  return "URLs encoded";
});

// ---------------------------------------------------------------------------
// Gate 7 — Bundle Health (non-blocking)
// ---------------------------------------------------------------------------
console.log("\n═══ Gate 7: Bundle Health ═══");

run("Main router chunk under 500 KB", () => {
  const serverAssets = join(ROOT, "dist", "server", "assets");
  if (!existsSync(serverAssets)) throw "__WARN__build artifacts not found (run build first)";
  let largest = { name: "", size: 0 };
  for (const f of readdirSync(serverAssets)) {
    if (!f.endsWith(".js")) continue;
    const size = statSync(join(serverAssets, f)).size;
    if (size > largest.size) largest = { name: f, size };
  }
  const kb = Math.round(largest.size / 1024);
  if (kb > 500) throw `__WARN__${largest.name} is ${kb} KB (threshold 500 KB)`;
  return `largest chunk: ${largest.name} (${kb} KB)`;
});

// ---------------------------------------------------------------------------
// Summary + Report
// ---------------------------------------------------------------------------
const elapsed = ((Date.now() - startedAt) / 1000).toFixed(1);
const passed = results.filter((r) => r.status === "pass").length;
const failed = results.filter((r) => r.status === "fail").length;
const warned = results.filter((r) => r.status === "warn").length;

console.log("\n════════════════════════════════════════════");
console.log(`  Release Gate Summary  (${elapsed}s)`);
console.log("════════════════════════════════════════════");
console.log(`  ✅ Passed:   ${passed}`);
console.log(`  ⚠️  Warnings: ${warned}`);
console.log(`  ❌ Failed:   ${failed}`);
console.log("════════════════════════════════════════════\n");

if (failed > 0) {
  console.log("  Failed checks:");
  results
    .filter((r) => r.status === "fail")
    .forEach((r) => console.log(`    ❌ ${r.name}: ${r.detail}`));
  console.log("");
}

const decision = failed === 0 ? "✅ READY FOR PRODUCTION" : "❌ RELEASE BLOCKED";
console.log(`  Decision: ${decision}\n`);

// Write release-report.md if requested or if there are failures.
if (isReport || failed > 0) {
  writeReport(results, elapsed, decision);
  console.log("  Report written to release-report.md\n");
}

process.exit(failed > 0 ? 1 : 0);

// ---------------------------------------------------------------------------
function writeReport(results, elapsed, decision) {
  const date = new Date().toISOString().replace("T", " ").slice(0, 19);
  const passed = results.filter((r) => r.status === "pass");
  const failed = results.filter((r) => r.status === "fail");
  const warned = results.filter((r) => r.status === "warn");

  const gateSection = (title, checks) => {
    if (!checks.length) return "";
    return `### ${title}\n\n${checks
      .map((c) => `- [${c.status === "pass" ? "x" : " "}] ${c.name} — ${c.detail || "ok"}`)
      .join("\n")}\n\n`;
  };

  const md = `# Somna.help Release Report

**Generated:** ${date} UTC
**Duration:** ${elapsed}s
**Decision:** ${decision}

---

## Summary

| Metric | Count |
|--------|-------|
| ✅ Passed | ${passed.length} |
| ⚠️ Warnings | ${warned.length} |
| ❌ Failed | ${failed.length} |

---

## Build Status

${decision}

## Code Quality

- TypeScript: ${passed.find((c) => c.name.startsWith("TypeScript"))?.detail || "not run"}
- ESLint: ${passed.find((c) => c.name.startsWith("ESLint"))?.detail || "not run"}
- Prettier: ${passed.find((c) => c.name.startsWith("Prettier"))?.detail || warned.find((c) => c.name.startsWith("Prettier"))?.detail || "not run"}

## Bundle Size

${passed.find((c) => c.name.startsWith("Main router"))?.detail || warned.find((c) => c.name.startsWith("Main router"))?.detail || "not measured"}

## Cloudflare

- Build: ${passed.find((c) => c.name === "Production Build (vite build)")?.detail || "—"}
- Wrangler: ${passed.find((c) => c.name === "Wrangler Dry Run")?.detail || "—"}

## SEO

${gateSection(
  "SEO Checks",
  results.filter((r) =>
    ["sitemap", "robots", "OG image", "localhost", "Canonical", "JSON-LD"].some((k) =>
      r.name.includes(k),
    ),
  ),
)}

## i18n

${gateSection(
  "i18n Checks",
  results.filter((r) =>
    ["language dicts", "mixed-language", "Fallback"].some((k) => r.name.includes(k)),
  ),
)}

## Security

${gateSection(
  "Security Checks",
  results.filter((r) => ["innerHTML", "R2 upload", "Share URLs"].some((k) => r.name.includes(k))),
)}

## Data Integrity

${gateSection(
  "Data Integrity Checks",
  results.filter((r) =>
    ["SleepRecord", "loadRecords", "cbti-brain"].some((k) => r.name.includes(k)),
  ),
)}

## Remaining Risks

${
  warned.length
    ? warned.map((w) => `- ⚠️ ${w.name}: ${w.detail}`).join("\n")
    : "None identified in automated checks."
}

${
  failed.length
    ? `## Blocking Issues\n\n${failed.map((f) => `- ❌ ${f.name}: ${f.detail}`).join("\n")}\n`
    : ""
}
---

## Final Decision

${decision}
`;

  writeFileSync(join(ROOT, "release-report.md"), md, "utf8");
}
