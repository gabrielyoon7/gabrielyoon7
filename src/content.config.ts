import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { CATEGORY_KEYS } from './content/taxonomy.mjs';

/**
 * 글은 src/content/blog/<lang>/<slug>.mdx 에 둡니다.
 * 언어별 폴더에 같은 파일명이 있으면 서로의 번역본으로 연결됩니다.
 */
const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z
    .object({
      title: z.string(),
      description: z.string(),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      category: z.enum(CATEGORY_KEYS),
      tags: z.array(z.string()),
      /** 시리즈 이름. 같은 언어에서 이름이 같은 글끼리 묶입니다. */
      series: z.string().trim().min(1).optional(),
      /** 시리즈 안 순서 (1부터) */
      seriesOrder: z.number().int().positive().optional(),
      /** 홈 상단에 고정 */
      pinned: z.boolean().default(false),
      draft: z.boolean().default(false),
      coverImage: z.string().optional(),
    })
    .refine((data) => (data.series === undefined) === (data.seriesOrder === undefined), {
      message: 'series와 seriesOrder는 함께 적거나 함께 비워 두세요.',
      path: ['seriesOrder'],
    }),
});

const cardSlide = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('cover'),
    eyebrow: z.string().optional(),
    title: z.string(),
    subtitle: z.string().optional(),
  }),
  z.object({
    type: z.literal('text'),
    heading: z.string(),
    body: z.string(),
  }),
  z.object({
    type: z.literal('bar-chart'),
    heading: z.string(),
    unit: z.string().default(''),
    data: z.array(z.object({ label: z.string(), value: z.number() })).min(1),
    caption: z.string().optional(),
  }),
]);

/** 카드뉴스·그래프 세트. 글에는 <CardSet set="..." />로 HTML 그대로 넣고, PNG는 dev /cards/ 페이지에서 내려받습니다. */
const cards = defineCollection({
  loader: glob({ pattern: '**/*.{yml,yaml}', base: './src/content/cards' }),
  schema: z.object({
    title: z.string(),
    format: z.enum(['portrait', 'square', 'og']).default('portrait'),
    /** 모든 장 하단에 들어가는 작은 표기 (예: 블로그 주소) */
    footer: z.string().optional(),
    slides: z.array(cardSlide).min(1),
  }),
});

export const collections = { blog, cards };
