/**
 * 카드 한 장을 원본 픽셀 크기 PNG로 바꿉니다. 브라우저에서만 돌며, 파일은 사용자가 내려받을 때만 생깁니다.
 *
 * 화면에 보이는 카드를 화면 밖에 원본 폭으로 복제해 두고(그러면 --u = 1px),
 * html-to-image로 그 DOM을 그대로 래스터화합니다.
 */
import { toPng } from 'html-to-image';

export type ExportScheme = 'light' | 'dark';

/* ---- 웹폰트 임베드 ----
 * Pretendard dynamic subset은 @font-face가 90개 넘게 unicode-range로 쪼개져 있어서,
 * html-to-image 기본값(그 글꼴의 모든 조각 임베드) 대신 카드에 실제로 쓰인 글자가
 * 들어 있는 조각만 골라 base64로 넣습니다.
 */
function parseUnicodeRange(value: string): [number, number][] {
  if (!value) return [[0, 0x10ffff]];
  return value.split(',').map((part) => {
    const token = part.trim().replace(/^u\+/i, '');
    if (token.includes('?')) {
      return [parseInt(token.replace(/\?/g, '0'), 16), parseInt(token.replace(/\?/g, 'F'), 16)];
    }
    const [start, end = start] = token.split('-');
    return [parseInt(start, 16), parseInt(end, 16)];
  });
}

function fontFaceRules(): CSSFontFaceRule[] {
  const rules: CSSFontFaceRule[] = [];
  const walk = (list: CSSRuleList) => {
    for (const rule of Array.from(list)) {
      if (rule instanceof CSSFontFaceRule) rules.push(rule);
      else if ('cssRules' in rule && (rule as CSSGroupingRule).cssRules) {
        walk((rule as CSSGroupingRule).cssRules);
      }
    }
  };
  for (const sheet of Array.from(document.styleSheets)) {
    try {
      walk(sheet.cssRules);
    } catch {
      // 다른 출처 스타일시트는 읽을 수 없습니다.
    }
  }
  return rules;
}

const dataUrlCache = new Map<string, Promise<string>>();
function toDataUrl(url: string): Promise<string> {
  let cached = dataUrlCache.get(url);
  if (!cached) {
    cached = fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`${res.status} ${url}`);
        return res.blob();
      })
      .then(
        (blob) =>
          new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = () => reject(reader.error);
            reader.readAsDataURL(blob);
          }),
      );
    dataUrlCache.set(url, cached);
  }
  return cached;
}

/** node 안의 글자를 그리는 데 필요한 @font-face만 data URL로 바꾼 CSS */
export async function buildFontEmbedCSS(node: HTMLElement): Promise<string> {
  const families = new Set<string>();
  for (const el of [node, ...Array.from(node.querySelectorAll<HTMLElement>('*'))]) {
    getComputedStyle(el)
      .fontFamily.split(',')
      .forEach((f) => families.add(f.trim().replace(/["']/g, '')));
  }
  const codePoints = new Set<number>();
  for (const ch of node.textContent ?? '') codePoints.add(ch.codePointAt(0)!);

  const css = await Promise.all(
    fontFaceRules()
      .filter((rule) => families.has(rule.style.getPropertyValue('font-family').trim().replace(/["']/g, '')))
      .filter((rule) => {
        const ranges = parseUnicodeRange(rule.style.getPropertyValue('unicode-range'));
        for (const cp of codePoints) {
          if (ranges.some(([a, b]) => cp >= a && cp <= b)) return true;
        }
        return false;
      })
      .map(async (rule) => {
        const base = rule.parentStyleSheet?.href ?? location.href;
        const src = rule.style.getPropertyValue('src');
        // woff2 하나만 남겨 가볍게 합니다.
        const match = src.match(/url\((['"]?)([^'")]+)\1\)\s*format\((['"]?)woff2\3\)/) ?? src.match(/url\((['"]?)([^'")]+)\1\)/);
        if (!match) return '';
        const dataUrl = await toDataUrl(new URL(match[2], base).href);
        const descriptors = Array.from(rule.style)
          .filter((prop) => prop !== 'src')
          .map((prop) => `${prop}: ${rule.style.getPropertyValue(prop)};`)
          .join(' ');
        return `@font-face { ${descriptors} src: url(${dataUrl}) format('woff2'); }`;
      }),
  );
  return css.join('\n');
}

/**
 * html-to-image는 <svg>를 통째로 복제해서 그 안의 요소에는 계산된 스타일을 옮기지 않습니다.
 * 클래스로 준 fill·글꼴 등이 사라지지 않도록 미리 인라인으로 박아 둡니다.
 */
const SVG_STYLE_PROPS = [
  'fill',
  'stroke',
  'stroke-width',
  'opacity',
  'font-family',
  'font-size',
  'font-weight',
  'letter-spacing',
] as const;
function inlineSvgStyles(root: HTMLElement) {
  for (const el of Array.from(root.querySelectorAll<SVGElement>('svg *'))) {
    const computed = getComputedStyle(el);
    for (const prop of SVG_STYLE_PROPS) {
      el.style.setProperty(prop, computed.getPropertyValue(prop));
    }
  }
}

/** 카드 프레임(.card-frame) 하나를 width×height PNG data URL로 */
export async function exportCardPng(
  frame: HTMLElement,
  { width, height, scheme }: { width: number; height: number; scheme: ExportScheme },
): Promise<string> {
  const host = document.createElement('div');
  host.className = 'card-export';
  host.setAttribute('aria-hidden', 'true');
  host.style.cssText = [
    'position:fixed',
    'left:-100000px',
    'top:0',
    `width:${width}px`,
    `color-scheme:${scheme}`,
    `--card-w:${width}`,
    `--card-h:${height}`,
  ].join(';');
  host.append(frame.cloneNode(true));
  document.body.append(host);
  try {
    const card = host.querySelector<HTMLElement>('.card')!;
    inlineSvgStyles(card);
    await document.fonts.ready;
    return await toPng(card, {
      width,
      height,
      canvasWidth: width,
      canvasHeight: height,
      pixelRatio: 1,
      fontEmbedCSS: await buildFontEmbedCSS(card),
    });
  } finally {
    host.remove();
  }
}

export function downloadDataUrl(dataUrl: string, filename: string) {
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  a.click();
}
