import { getCollection, type CollectionEntry } from 'astro:content';
import { SITE } from '../site.config';
import { CATEGORY_KEYS, CATEGORY_LABELS, DEFAULT_LANG, LANGS } from '../content/taxonomy.mjs';
import { localizePath } from '../i18n/ui';

export type Post = CollectionEntry<'blog'>;
export type Lang = (typeof LANGS)[number];
export type Category = Post['data']['category'];

export function isLang(value: string): value is Lang {
  return (LANGS as readonly string[]).includes(value);
}

/** 글 언어는 폴더 이름으로 정해집니다 (src/content/blog/<lang>/...). */
export function postLang(post: Post): Lang {
  const lang = post.id.split('/')[0];
  if (!isLang(lang) || !post.id.includes('/')) {
    throw new Error(
      `src/content/blog/${post.id}: 글은 ${LANGS.map((l) => `${l}/`).join(' 또는 ')} 폴더 안에 두세요.`,
    );
  }
  return lang;
}

/** 언어 폴더를 뺀 slug. 번역본끼리는 slug가 같습니다. */
export function postSlug(post: Post): string {
  return post.id.slice(post.id.indexOf('/') + 1).replace(/\.mdx?$/, '');
}

export function postUrl(post: Post): string {
  return localizePath(`blog/${postSlug(post)}/`, postLang(post));
}

type PostQuery = {
  /** 'all'이면 모든 언어 */
  lang?: Lang | 'all';
  includeDrafts?: boolean;
};

/**
 * 글 목록을 최신순으로 가져옵니다.
 * 개발 서버에서는 draft도 함께 보여 주고, 빌드에서는 항상 뺍니다.
 * RSS처럼 개발 중에도 draft를 빼야 하는 곳은 includeDrafts: false를 넘깁니다.
 */
export async function getPosts({
  lang = DEFAULT_LANG,
  includeDrafts = import.meta.env.DEV,
}: PostQuery = {}): Promise<Post[]> {
  const posts = await getCollection(
    'blog',
    (post) => (includeDrafts || !post.data.draft) && (lang === 'all' || postLang(post) === lang),
  );
  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

/** 고정 글을 먼저, 나머지는 최신순으로 */
export function pinnedFirst(posts: Post[]): Post[] {
  return [...posts.filter((p) => p.data.pinned), ...posts.filter((p) => !p.data.pinned)];
}

/** 같은 slug를 가진 다른 언어 글 */
export async function getTranslations(post: Post): Promise<Post[]> {
  const slug = postSlug(post);
  const lang = postLang(post);
  return (await getPosts({ lang: 'all' })).filter(
    (p) => postSlug(p) === slug && postLang(p) !== lang,
  );
}

/** 같은 언어, 같은 시리즈의 글을 순서대로. 시리즈가 아니면 빈 배열 */
export async function getSeriesPosts(post: Post): Promise<Post[]> {
  const { series } = post.data;
  if (!series) return [];
  return (await getPosts({ lang: postLang(post) }))
    .filter((p) => p.data.series === series)
    .sort((a, b) => (a.data.seriesOrder ?? 0) - (b.data.seriesOrder ?? 0));
}

export function categoryLabel(category: Category, lang: Lang = DEFAULT_LANG): string {
  return CATEGORY_LABELS[category][lang];
}

/** 태그 비교·URL용 키. "Astro"와 " astro"를 같은 태그로 봅니다. */
export function tagKey(tag: string): string {
  return tag.trim().toLowerCase();
}

export function tagUrl(tag: string, lang: Lang = DEFAULT_LANG): string {
  return localizePath(`tags/${encodeURIComponent(tagKey(tag))}/`, lang);
}

export function categoryUrl(category: Category, lang: Lang = DEFAULT_LANG): string {
  return localizePath(`categories/${category}/`, lang);
}

export type TagSummary = { key: string; label: string; count: number };

/**
 * 태그를 키 기준으로 묶습니다. 화면에 보일 이름(label)은
 * 가장 많이 쓰인 표기를 고르고, 같으면 먼저 나온 표기를 씁니다.
 */
export function summarizeTags(posts: Post[]): TagSummary[] {
  const groups = new Map<string, { count: number; spellings: Map<string, number> }>();

  for (const post of posts) {
    for (const raw of new Set(post.data.tags.map((t) => t.trim()).filter(Boolean))) {
      const key = tagKey(raw);
      const group = groups.get(key) ?? { count: 0, spellings: new Map() };
      group.count += 1;
      group.spellings.set(raw, (group.spellings.get(raw) ?? 0) + 1);
      groups.set(key, group);
    }
  }

  return [...groups.entries()]
    .map(([key, { count, spellings }]) => {
      let label = key;
      let best = 0;
      for (const [spelling, n] of spellings) {
        if (n > best) {
          label = spelling;
          best = n;
        }
      }
      return { key, label, count };
    })
    .sort((a, b) => a.key.localeCompare(b.key));
}

/** 글 카드·본문에서 태그를 통일된 표기로 보여 주기 위한 key → label 맵 */
export async function getTagLabels(lang: Lang = DEFAULT_LANG): Promise<Map<string, string>> {
  const tags = summarizeTags(await getPosts({ lang }));
  return new Map(tags.map((t) => [t.key, t.label]));
}

const DATE_LOCALES: Record<Lang, string> = { ko: 'ko-KR', en: 'en-US' };

/** 목록용 짧은 날짜. 한국어 "2026.11.01", 영어 "Nov 1, 2026" */
export function formatShortDate(date: Date, lang: Lang = DEFAULT_LANG): string {
  if (lang === 'ko') {
    const parts = new Intl.DateTimeFormat('en-CA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      timeZone: SITE.timeZone,
    }).format(date);
    return parts.replaceAll('-', '.');
  }
  return date.toLocaleDateString(DATE_LOCALES[lang], {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: SITE.timeZone,
  });
}

export function formatDate(date: Date, lang: Lang = DEFAULT_LANG): string {
  return date.toLocaleDateString(DATE_LOCALES[lang], {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: SITE.timeZone,
  });
}

/** 글 상세 페이지의 getStaticPaths. 이전/다음 글은 같은 언어 안에서 이어집니다. */
export async function postPaths(lang: Lang) {
  const posts = await getPosts({ lang });
  return posts.map((post, index) => ({
    params: { slug: postSlug(post) },
    props: {
      post,
      prevPost: posts[index + 1] as Post | undefined,
      nextPost: posts[index - 1] as Post | undefined,
    },
  }));
}

/** 태그 페이지의 getStaticPaths. 그 언어의 글에 쓰인 태그만 만듭니다. */
export async function tagPaths(lang: Lang) {
  const posts = await getPosts({ lang });
  return summarizeTags(posts).map(({ key, label }) => ({
    params: { tag: key },
    props: {
      lang,
      tag: key,
      label,
      posts: posts.filter((p) => p.data.tags.some((t) => tagKey(t) === key)),
    },
  }));
}

/** 카테고리 페이지의 getStaticPaths. 글이 없어도 모든 카테고리 주소를 만듭니다. */
export async function categoryPaths(lang: Lang) {
  const posts = await getPosts({ lang });
  return CATEGORY_KEYS.map((category) => ({
    params: { category },
    props: { lang, category, posts: posts.filter((p) => p.data.category === category) },
  }));
}

/** 다른 언어에도 같은 태그 페이지가 있으면 그 주소들 */
export async function tagAlternates(tag: string, lang: Lang) {
  const others = LANGS.filter((l) => l !== lang);
  const result: { lang: Lang; href: string }[] = [];
  for (const other of others) {
    const posts = await getPosts({ lang: other });
    if (posts.some((p) => p.data.tags.some((t) => tagKey(t) === tag))) {
      result.push({ lang: other, href: tagUrl(tag, other) });
    }
  }
  return result;
}
