import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { SITE } from '../site.config';
import { getText } from '../i18n/ui';
import { getPosts, postUrl, type Lang } from './posts';

const RSS_LANGUAGES: Record<Lang, string> = { ko: 'ko-kr', en: 'en-us' };

/** 언어별 RSS. draft는 개발 서버에서도 넣지 않습니다. */
export async function rssFeed(context: APIContext, lang: Lang) {
  const posts = await getPosts({ lang, includeDrafts: false });
  return rss({
    title: SITE.name,
    description: getText(lang)('site.description'),
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: postUrl(post),
      categories: post.data.tags,
    })),
    customData: `<language>${RSS_LANGUAGES[lang]}</language>`,
  });
}
