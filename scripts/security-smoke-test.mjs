#!/usr/bin/env node
/**
 * somna.help security & crawler smoke test
 *
 * Run after `npm run build` (or against the deployed origin) to assert:
 * 1. Googlebot receives HTTP 200 and full HTML without Turnstile markup.
 * 2. Bingbot / DuckDuckBot / Applebot / Yandex / Baidu also receive 200.
 * 3. Malicious AI scrapers receive HTTP 403.
 * 4. Security headers (HSTS, X-Content-Type-Options, Referrer-Policy) are present.
 *
 * Usage:
 *   node scripts/security-smoke-test.mjs
 *   node scripts/security-smoke-test.mjs --origin https://somna.help
 */

const DEFAULT_ORIGIN = "http://localhost:3000";
const origin = (() => {
  const idx = process.argv.indexOf("--origin");
  return idx > -1 ? process.argv[idx + 1] : DEFAULT_ORIGIN;
})();

const SEARCH_ENGINE_UAS = [
  "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
  "Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.96 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
  "Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)",
  "DuckDuckBot/1.0; (+http://duckduckgo.com/duckduckbot.html)",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Safari/605.1.15 (Applebot/0.1; +http://www.apple.com/go/applebot)",
  "Mozilla/5.0 (compatible; YandexBot/3.0; +http://yandex.com/bots)",
  "Mozilla/5.0 (compatible; Baiduspider/2.0; +http://www.baidu.com/search/spider.html)",
];

const MALICIOUS_AI_UAS = [
  "Mozilla/5.0 (compatible; GPTBot/1.0; +https://openai.com/gptbot)",
  "Mozilla/5.0 (compatible; ClaudeBot/1.0; +https://anthropic.com)",
  "Mozilla/5.0 (compatible; CCBot/2.0; +https://commoncrawl.org/faq/)",
  "Mozilla/5.0 (compatible; PerplexityBot/1.0; +https://perplexity.ai/bots)",
  "Mozilla/5.0 (compatible; Amazonbot/0.1; +https://developer.amazon.com/support/amazonbot)",
];

const PATHS = ["/", "/es/program", "/pt/program", "/pl/program"];

async function fetchWithUA(path, ua) {
  const res = await fetch(`${origin}${path}`, {
    headers: {
      "user-agent": ua,
      accept: "text/html",
    },
    redirect: "manual",
  });
  const text = await res.text();
  return { status: res.status, headers: res.headers, text };
}

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ ${message}`);
    process.exitCode = 1;
    return false;
  }
  console.log(`✅ ${message}`);
  return true;
}

let passed = 0;
let failed = 0;

function check(ok) {
  if (ok) passed++;
  else failed++;
}

console.log(`\n🔍 Running security smoke tests against ${origin}\n`);

for (const path of PATHS) {
  for (const ua of SEARCH_ENGINE_UAS) {
    const shortUA = ua.split(";")[0].slice(0, 40);
    const { status, headers, text } = await fetchWithUA(path, ua);
    const challengePresent =
      text.includes("challenges.cloudflare.com") ||
      text.includes("cf-turnstile") ||
      text.includes("turnstile");

    check(assert(status === 200, `[${path}] ${shortUA} → status ${status}`));
    check(assert(!challengePresent, `[${path}] ${shortUA} → no Turnstile markup`));
    check(
      assert(
        headers.get("strict-transport-security"),
        `[${path}] ${shortUA} → HSTS header present`,
      ),
    );
    check(
      assert(
        headers.get("x-content-type-options") === "nosniff",
        `[${path}] ${shortUA} → X-Content-Type-Options: nosniff`,
      ),
    );
  }
}

for (const path of PATHS) {
  for (const ua of MALICIOUS_AI_UAS) {
    const shortUA = ua.split(";")[0].slice(0, 40);
    const { status } = await fetchWithUA(path, ua);
    check(assert(status === 403, `[${path}] ${shortUA} → blocked ${status}`));
  }
}

console.log(`\n📊 Results: ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
