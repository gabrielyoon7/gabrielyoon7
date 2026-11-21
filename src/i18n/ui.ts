import { DEFAULT_LANG, LANGS } from '../content/taxonomy.mjs';
import type { Lang } from '../lib/posts';

/** 언어 이름. 언어 전환 링크에 쓰입니다(각 언어의 자기 표기). */
export const LANG_NAMES: Record<Lang, string> = { ko: '한국어', en: 'English' };

/**
 * 화면 문구. 키를 추가하면 모든 언어에 값을 채워야 타입 검사를 통과합니다.
 * {n}처럼 중괄호로 감싼 자리는 getText()가 채웁니다.
 * n이 1일 때는 "<키>.one"이 있으면 그 문구를 씁니다 (영어 단수형).
 */
const UI = {
  ko: {
    'site.description': '윤주현의 블로그',
    'site.tagline': '한 번 사는 인생',
    'site.taglineSub': '재미를 찾아서',
    'nav.blog': 'Blog',
    'nav.tags': 'Tags',
    'nav.about': 'About',
    'nav.main': '주요 메뉴',
    'nav.langSwitch': '언어 바꾸기',
    'nav.search': '검색',
    'search.title': '검색',
    'search.description': '블로그 글 검색',
    'search.unavailable': '검색 색인이 아직 없어요. 공개된 글이 있으면 빌드할 때 만들어지며, 개발 중에는 pnpm build 후 pnpm preview로 확인할 수 있어요.',
    'home.pinned': '고정 글',
    'home.latest': '최신 글',
    'home.categories': '카테고리',
    'home.allPosts': '모든 글 보기 →',
    'blog.title': 'Blog',
    'blog.description': '모든 블로그 글 목록',
    'blog.all': '전체',
    'blog.count': '{n}개의 글',
    'blog.count.one': '{n}개의 글',
    'blog.empty': '아직 글이 없어요.',
    'blog.emptyOther': '다른 언어로 쓴 글을 읽어 보세요',
    'category.description': '{name} 카테고리의 글 목록',
    'tags.title': 'Tags',
    'tags.description': '블로그 글 태그 목록',
    'tags.count': '{n}개의 태그',
    'tags.count.one': '{n}개의 태그',
    'tag.title': '태그: {name}',
    'tag.description': '{name} 태그의 글 목록',
    'post.draft': '초안 · 배포되지 않는 글입니다',
    'post.draftShort': '초안',
    'post.pinned': '고정',
    'post.published': '작성',
    'post.updated': '수정',
    'post.series': '시리즈',
    'post.previous': '이전 글',
    'post.next': '다음 글',
    'post.navigation': '이전·다음 글',
    'post.tags': '태그',
    'post.readingTime': '{n}분',
    'post.related': '함께 읽을 글',
    'toc.title': '목차',
    'footer.views': '사이트 조회 수 · 집계 반영까지 시간이 걸릴 수 있습니다',
    'footer.today': '오늘',
    'footer.total': '전체',
    'notFound.message': '요청하신 페이지를 찾을 수 없습니다.',
    'notFound.home': '홈으로',
    'about.title': 'About',
    'about.description': '블로그 작성자 소개',
  },
  en: {
    'site.description': "Ju Hyun Yoon's blog",
    'site.tagline': 'You only live once',
    'site.taglineSub': 'In search of fun',
    'nav.blog': 'Blog',
    'nav.tags': 'Tags',
    'nav.about': 'About',
    'nav.main': 'Main navigation',
    'nav.langSwitch': 'Change language',
    'nav.search': 'Search',
    'search.title': 'Search',
    'search.description': 'Search blog posts',
    'search.unavailable': 'The search index is not available yet. It is built with the site once posts are published; during development, run pnpm build, then pnpm preview.',
    'home.pinned': 'Pinned',
    'home.latest': 'Latest posts',
    'home.categories': 'Categories',
    'home.allPosts': 'All posts →',
    'blog.title': 'Blog',
    'blog.description': 'All blog posts',
    'blog.all': 'All',
    'blog.count': '{n} posts',
    'blog.count.one': '{n} post',
    'blog.empty': 'No posts yet.',
    'blog.emptyOther': 'Read posts in another language',
    'category.description': 'Posts in {name}',
    'tags.title': 'Tags',
    'tags.description': 'All tags',
    'tags.count': '{n} tags',
    'tags.count.one': '{n} tag',
    'tag.title': 'Tag: {name}',
    'tag.description': 'Posts tagged {name}',
    'post.draft': 'Draft · not published',
    'post.draftShort': 'Draft',
    'post.pinned': 'Pinned',
    'post.published': 'Published',
    'post.updated': 'Updated',
    'post.series': 'Series',
    'post.previous': 'Previous',
    'post.next': 'Next',
    'post.navigation': 'Post navigation',
    'post.tags': 'Tags',
    'post.readingTime': '{n} min read',
    'post.related': 'Related posts',
    'toc.title': 'On this page',
    'footer.views': 'Site views · counts may take a while to update',
    'footer.today': 'Today',
    'footer.total': 'Total',
    'notFound.message': 'The page you requested could not be found.',
    'notFound.home': 'Go home',
    'about.title': 'About',
    'about.description': 'About the author',
  },
} as const satisfies Record<Lang, Record<string, string>>;

export type UiKey = keyof (typeof UI)[typeof DEFAULT_LANG];

// 모든 언어가 같은 키를 갖는지 컴파일 시점에 확인합니다.
const _sameKeys: Record<Lang, Record<UiKey, string>> = UI;
void _sameKeys;

/** const t = getText(lang); t('nav.blog'); t('blog.count', { n: 3 }) */
export function getText(lang: Lang) {
  const strings: Record<string, string> = UI[lang];
  return (key: UiKey, values: Record<string, string | number> = {}) => {
    const template = (values.n === 1 && strings[`${key}.one`]) || strings[key];
    return template.replace(/\{(\w+)\}/g, (_, name: string) => String(values[name] ?? `{${name}}`));
  };
}

const base = import.meta.env.BASE_URL;

/**
 * 언어 접두사를 뺀 경로("blog/", "tags/astro/")를 해당 언어의 주소로 바꿉니다.
 * 기본 언어는 접두사 없이, 그 외 언어는 /<lang>/ 아래에 둡니다.
 */
export function localizePath(path: string, lang: Lang): string {
  const clean = path.replace(/^\//, '');
  return `${base}${lang === DEFAULT_LANG ? '' : `${lang}/`}${clean}`;
}

/**
 * 현재 주소(Astro.url.pathname)에서 언어와 언어 접두사를 뺀 경로를 구합니다.
 * 예: "/gabrielyoon7/en/tags/" → { lang: "en", path: "tags/" }
 */
export function splitPath(pathname: string): { lang: Lang; path: string } {
  const rest = pathname.startsWith(base) ? pathname.slice(base.length) : pathname.replace(/^\//, '');
  const [first, ...others] = rest.split('/');
  if ((LANGS as readonly string[]).includes(first) && first !== DEFAULT_LANG) {
    return { lang: first as Lang, path: others.join('/') };
  }
  return { lang: DEFAULT_LANG, path: rest };
}
