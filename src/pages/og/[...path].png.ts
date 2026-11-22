import type { APIRoute, GetStaticPaths } from 'astro';
import { getPosts, postLang, postSlug, type Post } from '../../lib/posts';
import { renderPostOgImage } from '../../lib/og-image';

// /og/<lang>/<slug>.png — 글마다 하나씩, 빌드할 때 만들어집니다.
export const getStaticPaths = (async () => {
  const posts = await getPosts({ lang: 'all' });
  return posts.map((post) => ({
    params: { path: `${postLang(post)}/${postSlug(post)}` },
    props: { post },
  }));
}) satisfies GetStaticPaths;

export const GET: APIRoute<{ post: Post }> = async ({ props }) =>
  new Response(new Uint8Array(await renderPostOgImage(props.post)), {
    headers: { 'Content-Type': 'image/png' },
  });
