import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()),
    draft: z.boolean().default(false),
    coverImage: z.string().optional(),
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

/** 카드뉴스·그래프 이미지 세트. pnpm cards로 PNG를 뽑습니다. */
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
