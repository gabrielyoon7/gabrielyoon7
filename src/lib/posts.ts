import { getCollection, type CollectionEntry } from 'astro:content';
import { SITE } from '../site.config';

export type Post = CollectionEntry<'blog'>;

const base = import.meta.env.BASE_URL;

/**
 * 글 목록을 최신순으로 가져옵니다.
 * 개발 서버에서는 draft도 함께 보여 주고, 빌드에서는 항상 뺍니다.
 * RSS처럼 개발 중에도 draft를 빼야 하는 곳은 includeDrafts: false를 넘깁니다.
 */
export async function getPosts({ includeDrafts = import.meta.env.DEV } = {}): Promise<Post[]> {
  const posts = await getCollection('blog', ({ data }) => includeDrafts || !data.draft);
  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export function postSlug(post: Post): string {
  return post.id.replace(/\.mdx?$/, '');
}

export function postUrl(post: Post): string {
  return `${base}blog/${postSlug(post)}/`;
}

/** 태그 비교·URL용 키. "Astro"와 " astro"를 같은 태그로 봅니다. */
export function tagKey(tag: string): string {
  return tag.trim().toLowerCase();
}

export function tagUrl(tag: string): string {
  return `${base}tags/${encodeURIComponent(tagKey(tag))}/`;
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
export async function getTagLabels(): Promise<Map<string, string>> {
  const tags = summarizeTags(await getPosts());
  return new Map(tags.map((t) => [t.key, t.label]));
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: SITE.timeZone,
  });
}
