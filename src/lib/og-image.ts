import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { SITE } from '../site.config';
import { categoryLabel, formatDate, postLang, type Post } from './posts';

const require = createRequire(import.meta.url);

// 글별 공유 이미지(1200×630)를 빌드할 때 만듭니다. 색은 global.css 라이트 테마와 맞춥니다.
const COLORS = {
  background: '#fbfbfa',
  foreground: '#1c1c1e',
  muted: '#6e6e73',
  border: '#e6e6e3',
  accent: '#1f4fbf',
};

let fonts: Promise<{ name: string; data: Buffer; weight: 400 | 700 }[]> | undefined;
function loadFonts() {
  fonts ??= Promise.all(
    ([
      ['Regular', 400],
      ['Bold', 700],
    ] as const).map(async ([file, weight]) => ({
      name: 'Pretendard',
      weight,
      data: await readFile(require.resolve(`pretendard/dist/public/static/Pretendard-${file}.otf`)),
    })),
  );
  return fonts;
}

type Node = { type: string; props: Record<string, unknown> & { children?: unknown } };
const h = (type: string, style: Record<string, unknown>, children?: unknown): Node => ({
  type,
  props: { style, children },
});

export async function renderPostOgImage(post: Post): Promise<Buffer> {
  const lang = postLang(post);
  const { title, category, pubDate } = post.data;
  // 제목 길이에 따라 글자 크기를 줄여 세 줄 안에 들어가게 합니다.
  const titleSize = title.length > 40 ? 56 : title.length > 24 ? 66 : 76;

  const tree = h(
    'div',
    {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '72px 80px',
      background: COLORS.background,
      fontFamily: 'Pretendard',
      color: COLORS.foreground,
    },
    [
      h('div', { display: 'flex', flexDirection: 'column', gap: 28 }, [
        h('div', { display: 'flex', width: 64, height: 6, borderRadius: 3, background: COLORS.accent }),
        h(
          'div',
          { display: 'flex', fontSize: 30, fontWeight: 700, color: COLORS.accent },
          categoryLabel(category, lang),
        ),
        h(
          'div',
          {
            display: 'flex',
            fontSize: titleSize,
            fontWeight: 700,
            lineHeight: 1.25,
            letterSpacing: '-0.03em',
            wordBreak: 'keep-all',
          },
          title,
        ),
      ]),
      h(
        'div',
        {
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: 28,
          borderTop: `2px solid ${COLORS.border}`,
          fontSize: 28,
          color: COLORS.muted,
        },
        [
          h('div', { display: 'flex', fontWeight: 700, color: COLORS.foreground }, SITE.name),
          h('div', { display: 'flex' }, formatDate(pubDate, lang)),
        ],
      ),
    ],
  );

  // satori의 타입은 React 요소를 기대하지만 같은 모양의 객체를 받아 그립니다.
  const svg = await satori(tree as unknown as Parameters<typeof satori>[0], {
    width: 1200,
    height: 630,
    fonts: await loadFonts(),
  });
  return new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
}
