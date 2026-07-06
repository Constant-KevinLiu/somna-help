import fs from "node:fs";

const i18nContent = fs.readFileSync("src/lib/i18n.tsx", "utf8");
const enMatch = i18nContent.match(/const en: Dict = \{([\s\S]*?)\n};/);
const ptMatch = i18nContent.match(/const pt: Dict = \{([\s\S]*?)\n};/);
const enKeys = [...enMatch[1].matchAll(/^  "([^"]+)":/gm)].map(m => m[1]);
const ptKeys = [...ptMatch[1].matchAll(/^  "([^"]+)":/gm)].map(m => m[1]);

const plContent = fs.readFileSync("src/lib/i18n-pl-dict.ts", "utf8");
const plKeys = [...plContent.matchAll(/^  "([^"]+)":/gm)].map(m => m[1]);

const missing = enKeys.filter(k => !plKeys.includes(k));
const extra = plKeys.filter(k => !enKeys.includes(k));

console.log("EN keys:", enKeys.length);
console.log("PT keys:", ptKeys.length);
console.log("PL keys:", plKeys.length);
console.log("Missing in PL:", missing);
console.log("Extra in PL:", extra);
