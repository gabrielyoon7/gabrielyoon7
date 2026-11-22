import { fileURLToPath } from 'node:url';

/**
 * 카드 스튜디오: 카드뉴스·그래프 이미지를 그리는 dev 전용 페이지.
 * 빌드 결과물에는 포함되지 않습니다. PNG는 scripts/capture-cards.mjs로 뽑습니다.
 */
export default function cardStudio() {
  return {
    name: 'card-studio',
    hooks: {
      'astro:config:setup': ({ command, injectRoute }) => {
        if (command !== 'dev') return;
        injectRoute({
          pattern: '/cards/',
          entrypoint: fileURLToPath(new URL('./index-page.astro', import.meta.url)),
        });
        injectRoute({
          pattern: '/cards/[set]/',
          entrypoint: fileURLToPath(new URL('./set-page.astro', import.meta.url)),
        });
      },
    },
  };
}
