#!/usr/bin/env node
// 카드 세트를 PNG로 캡처합니다.
//   pnpm cards              모든 세트
//   pnpm cards example      src/content/cards/example.yaml 만
//   pnpm cards example --out ./somewhere
// 결과: cards-out/<세트>/01.png, 02.png ...
import { mkdir, readdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { dev } from 'astro';
import { chromium } from 'playwright';

const root = fileURLToPath(new URL('..', import.meta.url));
const cardsDir = path.join(root, 'src/content/cards');

const args = process.argv.slice(2);
let outDir = path.join(root, 'cards-out');
const requested = [];
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--out') {
    if (!args[i + 1]) throw new Error('--out 뒤에 폴더를 적어 주세요.');
    outDir = path.resolve(process.cwd(), args[++i]);
  } else {
    requested.push(args[i]);
  }
}

const available = (await readdir(cardsDir))
  .filter((f) => /\.ya?ml$/.test(f))
  .map((f) => f.replace(/\.ya?ml$/, ''))
  .sort();
const sets = requested.length ? requested : available;
const unknown = sets.filter((s) => !available.includes(s));
if (unknown.length) {
  console.error(`알 수 없는 세트: ${unknown.join(', ')}\n사용 가능: ${available.join(', ') || '(없음)'}`);
  process.exit(1);
}

const { default: config } = await import(path.join(root, 'astro.config.mjs'));
const base = (config.base ?? '/').replace(/\/?$/, '/');

const server = await dev({
  root,
  logLevel: 'warn',
  server: { port: 0 },
  // 개발 툴바가 화면 아래에 떠서 카드에 찍히지 않도록 끕니다.
  devToolbar: { enabled: false },
});
const browser = await chromium.launch();
let failed = false;

try {
  const origin = `http://localhost:${server.address.port}`;
  const page = await browser.newPage({ viewport: { width: 1400, height: 1400 }, deviceScaleFactor: 1 });

  for (const set of sets) {
    const url = `${origin}${base}cards/${encodeURIComponent(set)}/?capture`;
    const response = await page.goto(url, { waitUntil: 'networkidle' });
    if (!response?.ok()) {
      console.error(`✗ ${set}: ${url} 응답 ${response?.status()}`);
      failed = true;
      continue;
    }
    await page.evaluate(() => document.fonts.ready);

    const cards = page.locator('[data-card]');
    const count = await cards.count();
    const dir = path.join(outDir, set);
    await rm(dir, { recursive: true, force: true });
    await mkdir(dir, { recursive: true });

    for (let i = 0; i < count; i++) {
      const card = cards.nth(i);
      const name = await card.getAttribute('data-card');
      await card.screenshot({ path: path.join(dir, `${name}.png`), animations: 'disabled' });
    }
    console.log(`✓ ${set}: ${count}장 → ${path.relative(root, dir)}/`);
  }
} finally {
  await browser.close();
  await server.stop();
}

process.exit(failed ? 1 : 0);
