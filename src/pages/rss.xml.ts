import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const base = import.meta.env.BASE_URL;
  const posts = (await getCollection('blog', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  );

  return rss({
    title: 'Ju Hyun, Yoon',
    description: '윤주현의 블로그',
    site: context.site!,
    items: posts.map((post) => {
      const slug = post.id.replace(/\.mdx?$/, '');
      return {
        title: post.data.title,
        description: post.data.description,
        pubDate: post.data.pubDate,
        link: `${base}blog/${slug}/`,
      };
    }),
    customData: `<language>ko-kr</language>`,
  });
}
