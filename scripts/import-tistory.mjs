#!/usr/bin/env node
/**
 * 티스토리 백업(HTML) → Astro 콘텐츠(.md + 최적화 이미지) 변환 스크립트
 *
 * 사용법:
 *   node scripts/import-tistory.mjs <백업폴더> [--only 73,84] [--force] [--reimage]
 *   --force: 이미 변환된 글도 다시 생성 / --reimage: 이미지도 다시 변환
 *
 * 결과:
 *   src/content/blog/<YYYY-MM-DD>-tistory-<번호>.md
 *   src/assets/blog/<YYYY-MM-DD>-tistory-<번호>/img-01.webp ...
 */
import { readdir, readFile, writeFile, mkdir, rm, copyFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as cheerio from 'cheerio';
import TurndownService from 'turndown';
import sharp from 'sharp';
import YAML from 'yaml';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CONTENT_DIR = path.join(ROOT, 'src/content/blog/ko');
const ASSET_DIR = path.join(ROOT, 'src/assets/blog');
const PUBLIC_IMG_DIR = path.join(ROOT, 'public/images/tistory');

const TISTORY_HOST = 'leirbag.tistory.com';
const MAX_WIDTH = 1600;
const WEBP_QUALITY = 80;

/** 티스토리 카테고리 → 블로그 태그 */
const CATEGORY_TAGS = {
  'Study/일상·회고': [],
  'Frontend/JavaScript': ['Frontend', 'JavaScript'],
  'Frontend/React·React Native': ['Frontend', 'React'],
  'Frontend/HTML5': ['Frontend', 'HTML'],
  'Backend/WAS with JavaEE': ['Backend', 'JavaEE'],
  'Backend/Ubuntu for Raspberry Pi': ['Backend', 'Raspberry Pi'],
  'Backend/Database': ['Backend', 'Database'],
  'Study/Java': ['Java'],
  'Study/Tools': ['Tools'],
  'Study/Computer Science': ['CS'],
  'Study/Python3': ['Python'],
  'Study/Computer Security': ['Security'],
  'Study/Android': ['Android'],
  'Life/사진': [],
  'Study/임시': [],
};
const DRAFT_CATEGORIES = new Set(['Study/임시']);

/** 티스토리 카테고리 → 블로그 카테고리(src/content/taxonomy.mjs). 없으면 dev */
const CATEGORY_MAP = {
  'Study/일상·회고': 'retrospective',
  'Life/사진': 'life',
};

/** 첨부파일(fileblock) → 외부 링크 대체 */
const FILE_LINKS = {
  'c3p0-0.9.1.1.jar': 'https://mvnrepository.com/artifact/c3p0/c3p0/0.9.1.1',
  'commons-dbutils-1.5.jar': 'https://mvnrepository.com/artifact/commons-dbutils/commons-dbutils/1.5',
  'gson-2.8.6.jar': 'https://mvnrepository.com/artifact/com.google.code.gson/gson/2.8.6',
  'mariadb-java-client-2.6.0.jar': 'https://mvnrepository.com/artifact/org.mariadb.jdbc/mariadb-java-client/2.6.0',
};

const LANG_ALIASES = {
  plaintext: 'text', plain: 'text', 'html': 'html', xml: 'xml', js: 'javascript',
  ts: 'typescript', shell: 'bash', sh: 'bash', cpp: 'cpp', csharp: 'csharp',
};

// ---------- args ----------
const args = process.argv.slice(2);
const backupDir = args.find((a) => !a.startsWith('--'));
const onlyIdx = args.indexOf('--only');
const only = onlyIdx >= 0 ? new Set(args[onlyIdx + 1].split(',')) : null;
const force = args.includes('--force');
const reimage = args.includes('--reimage');

if (!backupDir) {
  console.error('usage: node scripts/import-tistory.mjs <backupDir> [--only 1,2] [--force]');
  process.exit(1);
}

// ---------- helpers ----------
const clean = (s) => s.replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();

function slugFor(post) {
  return `${post.date}-tistory-${post.id}`;
}

async function loadPosts() {
  const dirs = (await readdir(backupDir, { withFileTypes: true }))
    .filter((d) => d.isDirectory() && /^\d+$/.test(d.name))
    .map((d) => d.name);
  const posts = [];
  for (const id of dirs) {
    const dir = path.join(backupDir, id);
    const html = (await readdir(dir)).find((f) => f.endsWith('.html'));
    if (!html) {
      console.warn(`[skip] ${id}: HTML 없음`);
      continue;
    }
    const raw = await readFile(path.join(dir, html), 'utf8');
    const $ = cheerio.load(raw);
    const dateText = clean($('p.date').first().text());
    posts.push({
      id,
      dir,
      $,
      title: clean($('h2.title-article').first().text()),
      category: clean($('p.category').first().text()),
      date: dateText.slice(0, 10),
      datetime: dateText,
    });
  }
  return posts;
}

/**
 * 정적 이미지는 webp로 리사이즈해 src/assets에 저장(Astro가 다시 최적화)하고,
 * 움직이는 GIF는 원본 그대로 public/에 복사한다(애니메이션 webp는 더 크고 느림).
 * @returns {{ animated: boolean, file: string }}
 */
async function convertImage(src, slug, name, { toPublic = false } = {}) {
  const meta = await sharp(src, { animated: true, limitInputPixels: false }).metadata();
  if ((meta.pages ?? 1) > 1) {
    const dir = path.join(PUBLIC_IMG_DIR, slug);
    await mkdir(dir, { recursive: true });
    const file = `${name}.gif`;
    if (!existsSync(path.join(dir, file))) await copyFile(src, path.join(dir, file));
    return { animated: true, file };
  }
  const dir = path.join(toPublic ? PUBLIC_IMG_DIR : ASSET_DIR, slug);
  await mkdir(dir, { recursive: true });
  const file = `${name}.webp`;
  const dest = path.join(dir, file);
  if (existsSync(dest)) return { animated: false, public: toPublic, file };
  await sharp(src, { limitInputPixels: false })
    .rotate()
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: WEBP_QUALITY, effort: 4 })
    .toFile(dest);
  return { animated: false, public: toPublic, file };
}

const imgMds = [];

function makeTurndown() {
  const td = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
    bulletListMarker: '-',
    emDelimiter: '*',
  });

  td.addRule('codeblock', {
    filter: (node) => node.nodeName === 'PRE',
    replacement: (_c, node) => {
      const lang = (node.getAttribute('data-ke-language') || node.getAttribute('class') || '')
        .split(/\s+/)[0]
        .toLowerCase();
      const code = node.textContent.replace(/\n+$/, '');
      const fence = code.includes('```') ? '````' : '```';
      const l = LANG_ALIASES[lang] ?? lang;
      return `\n\n${fence}${l}\n${code}\n${fence}\n\n`;
    },
  });

  td.addRule('ximg', {
    filter: (node) => node.nodeName === 'X-IMG',
    replacement: (_c, node) => `\n\n${imgMds[Number(node.getAttribute('data-key'))]}\n\n`,
  });

  td.addRule('strike', {
    filter: ['s', 'del', 'strike'],
    replacement: (c) => (c.trim() ? `~~${c}~~` : c),
  });

  // 본문 텍스트의 '<'는 HTML로 해석되지 않도록 이스케이프 (코드블록·인라인 코드는 영향 없음)
  const baseEscape = td.escape.bind(td);
  td.escape = (str) => baseEscape(str).replace(/</g, '&lt;');

  // 표·iframe 등은 HTML 그대로 유지
  td.keep(['table', 'iframe']);
  return td;
}

// ---------- main ----------
const posts = await loadPosts();
const byId = new Map(posts.map((p) => [p.id, p]));
const td = makeTurndown();
await mkdir(CONTENT_DIR, { recursive: true });

const report = { converted: 0, skipped: 0, images: 0, warnings: [] };

for (const post of posts) {
  if (only && !only.has(post.id)) continue;
  const slug = slugFor(post);
  const outFile = path.join(CONTENT_DIR, `${slug}.md`);
  if (existsSync(outFile) && !force) {
    report.skipped++;
    continue;
  }

  const { $ } = post;
  const body = $('div.contents_style').first();
  const assetDir = path.join(ASSET_DIR, slug);
  if (reimage) {
    await rm(assetDir, { recursive: true, force: true });
    await rm(path.join(PUBLIC_IMG_DIR, slug), { recursive: true, force: true });
  }

  // 1) 이미지 블록: 이미지 최적화 + 마크다운 이미지로 치환
  let imgN = 0;
  imgMds.length = 0;
  const imgEls = body.find('img').toArray();
  for (const el of imgEls) {
    const $img = $(el);
    const src = $img.attr('src') || '';
    const $figure = $img.closest('figure');
    const caption = clean($figure.find('figcaption').text() || '');
    const alt = clean($img.attr('alt') || '') || caption;

    let md;
    if (/^https?:/.test(src)) {
      md = `![${alt}](${src})`;
    } else {
      const local = path.join(post.dir, decodeURIComponent(src.replace(/^\.\//, '')));
      if (!existsSync(local)) {
        report.warnings.push(`${post.id}: 이미지 없음 ${src}`);
        $img.remove();
        continue;
      }
      imgN++;
      const name = `img-${String(imgN).padStart(2, '0')}`;
      let result;
      try {
        // 표 안의 이미지는 HTML 그대로 남으므로 public/에 둔다
        const inTable = $img.closest('table').length > 0;
        result = await convertImage(local, slug, name, { toPublic: inTable });
      } catch (e) {
        report.warnings.push(`${post.id}: 이미지 변환 실패 ${src} (${e.message})`);
        ($figure.length ? $figure : $img).remove();
        continue;
      }
      report.images++;
      const safeAlt = alt.replace(/[[\]"<>]/g, '');
      if (result.animated || result.public) {
        // 글 주소(/blog/<slug>/) 기준 상대경로 → public/images/tistory/<slug>/
        md = `<img src="../../images/tistory/${slug}/${result.file}" alt="${safeAlt}" loading="lazy" />`;
      } else {
        // src/content/blog/ko/<글>.md 기준 상대경로
        const rel = `../../../assets/blog/${slug}/${result.file}`;
        md = `![${safeAlt}](${rel})`;
      }
    }
    if (caption) md += `\n\n*${caption}*`;
    const key = String(imgMds.push(md) - 1);
    const target = $figure.length ? $figure : $img;
    if (target.closest('table').length) target.replaceWith(md);
    else target.replaceWith(`<x-img data-key="${key}">image</x-img>`);
  }

  // 2) 링크 카드(opengraph) → 인용 링크
  body.find('figure[data-ke-type="opengraph"]').each((_, el) => {
    const $el = $(el);
    const url = $el.attr('data-og-url') || $el.attr('data-og-source-url');
    const title = clean($el.attr('data-og-title') || url);
    const desc = clean($el.attr('data-og-description') || '');
    const quote = `<blockquote><p><a href="${url}"><strong>${title}</strong></a>${
      desc ? `<br>${desc}` : ''
    }</p></blockquote>`;
    $el.replaceWith(quote);
  });

  // 3) 영상 → 반응형 iframe
  body.find('figure[data-ke-type="video"]').each((_, el) => {
    const $el = $(el);
    const src = $el.find('iframe').attr('src');
    if (!src) return void $el.remove();
    $el.replaceWith(
      `<iframe src="${src}" title="video" style="width:100%;aspect-ratio:16/9;border:0" loading="lazy" allowfullscreen></iframe>`
    );
  });
  body.find('iframe').each((_, el) => {
    const $el = $(el);
    for (const a of ['width', 'height', 'frameborder']) $el.removeAttr(a);
    if (!$el.attr('style')) $el.attr('style', 'width:100%;aspect-ratio:16/9;border:0');
  });

  // 4) 첨부파일 → 외부 링크
  body.find('figure.fileblock').each((_, el) => {
    const $el = $(el);
    const name = clean($el.find('.name').text());
    const link = FILE_LINKS[name];
    $el.replaceWith(link ? `<p><a href="${link}">${name}</a></p>` : `<p>${name}</p>`);
    if (!link) report.warnings.push(`${post.id}: 첨부파일 링크 없음 ${name}`);
  });

  // 5) 표 정리: 인라인 스타일/데이터 속성 제거
  body.find('table').find('*').addBack().each((_, el) => {
    for (const a of Object.keys(el.attribs || {})) {
      if (!['colspan', 'rowspan', 'href', 'src', 'alt'].includes(a)) $(el).removeAttr(a);
    }
  });

  // 6) 내부 링크 → 새 글 주소
  body.find('a[href]').each((_, el) => {
    const href = $(el).attr('href');
    const m = href.match(new RegExp(`^https?://${TISTORY_HOST.replace('.', '\\.')}/(\\d+)/?(?:\\?.*)?$`));
    if (m && byId.has(m[1])) {
      const target = byId.get(m[1]);
      $(el).attr('href', `../${slugFor(target)}/`);
      if (/^https?:\/\//.test(clean($(el).text()))) $(el).text(target.title);
    }
  });

  // 7) 제목 태그: 본문 h1 → h2
  body.find('h1').each((_, el) => (el.tagName = 'h2'));
  body.find('h1, h2, h3, h4, h5, h6').find('b, strong').each((_, el) => {
    $(el).replaceWith($(el).html());
  });

  // 8) 변환
  let md = td.turndown(body.html() || '');
  md = md
    .replace(/\u00a0/g, ' ')
    .replace(/[ \t]+$/gm, (s) => (s.length >= 2 ? '  ' : ''))
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  // 9) frontmatter
  const plain = cheerio
    .load(body.html() || '')('p')
    .toArray()
    .map((p) => clean(cheerio.load(p).text()))
    .filter(Boolean);
  let description = plain.join(' ').slice(0, 140);
  if (plain.join(' ').length > 140) description = description.replace(/\s+\S*$/, '') + '…';

  const tags = CATEGORY_TAGS[post.category];
  if (!tags && post.category) report.warnings.push(`${post.id}: 매핑 없는 카테고리 "${post.category}"`);

  const fm = {
    title: post.title,
    description,
    pubDate: post.date,
    category: CATEGORY_MAP[post.category] ?? 'dev',
    tags: tags ?? [],
    draft: DRAFT_CATEGORIES.has(post.category) || md.length < 50,
  };

  const content = `---\n${YAML.stringify(fm)}---\n\n> 이 글은 ${post.datetime.slice(0, 10)}에 티스토리 블로그(${TISTORY_HOST}/${post.id})에 처음 작성한 글을 옮겨온 것입니다.\n\n${md}\n`;
  await writeFile(outFile, content);
  report.converted++;
  console.log(`[ok] ${post.id} → ${slug}.md (${imgN} images)`);
}

console.log(
  `\n변환 ${report.converted}개, 건너뜀 ${report.skipped}개, 이미지 ${report.images}개`
);
if (report.warnings.length) console.log('경고:\n- ' + report.warnings.join('\n- '));
