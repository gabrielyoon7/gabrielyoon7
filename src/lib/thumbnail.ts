import type { ImageMetadata } from 'astro';
import type { Post } from './posts';

/**
 * 글 목록 카드에 쓸 썸네일을 글 본문에서 자동으로 찾습니다.
 * - Markdown 이미지 `![...](상대경로)` 또는 MDX의 `import x from '상대경로.png'` 중 본문에서 먼저 나오는 것
 * - src/assets 아래의 이미지만 대상 (Astro가 빌드할 때 작은 썸네일로 다시 만듭니다)
 * - 움직이는 GIF·외부 URL·public/ 이미지는 건너뜁니다
 * 따로 저장되는 파일은 없습니다.
 */
const assetImages = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/**/*.{png,jpg,jpeg,webp,avif,svg}',
);

const IMAGE_REF =
  /!\[[^\]]*\]\(\s*<?([^)\s>]+)>?[^)]*\)|import\s+\w+\s+from\s+['"]([^'"]+\.(?:png|jpe?g|webp|avif|svg))['"]/gi;

function resolveFrom(fileDir: string, ref: string): string | undefined {
  if (/^[a-z]+:|^\/\//i.test(ref)) return undefined;
  const parts = ref.startsWith('/') ? [] : fileDir.split('/');
  for (const seg of ref.split('/')) {
    if (seg === '' || seg === '.') continue;
    if (seg === '..') parts.pop();
    else parts.push(seg);
  }
  return '/' + parts.join('/');
}

const cache = new Map<string, Promise<ImageMetadata | undefined>>();

export function postThumbnail(post: Post): Promise<ImageMetadata | undefined> {
  if (!cache.has(post.id)) cache.set(post.id, findThumbnail(post));
  return cache.get(post.id)!;
}

async function findThumbnail(post: Post): Promise<ImageMetadata | undefined> {
  if (!post.body || !post.filePath) return undefined;
  const fileDir = post.filePath.replace(/^\.?\/?/, '').split('/').slice(0, -1).join('/');
  for (const m of post.body.matchAll(IMAGE_REF)) {
    const key = resolveFrom(fileDir, decodeURI(m[1] ?? m[2]));
    const load = key && assetImages[key];
    if (load) return (await load()).default;
  }
  return undefined;
}
