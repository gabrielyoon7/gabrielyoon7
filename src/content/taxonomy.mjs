// 글 분류 기준. Astro 스키마, 로컬 에디터, 주머니 글쓰기, new-post 스크립트가 함께 씁니다.
// Node에서 바로 읽을 수 있도록 TypeScript가 아닌 .mjs로 둡니다.

/** 글 언어. 폴더 이름(src/content/blog/<lang>/)과 같습니다. 첫 번째가 기본 언어입니다. */
export const LANGS = /** @type {const} */ (['ko', 'en']);
export const DEFAULT_LANG = LANGS[0];

/** 글마다 하나씩 고르는 카테고리 키. 순서대로 화면에 보입니다. */
export const CATEGORY_KEYS = /** @type {const} */ (['dev', 'retrospective', 'life']);
export const DEFAULT_CATEGORY = CATEGORY_KEYS[0];

/** 카테고리 표시 이름 */
export const CATEGORY_LABELS = {
  dev: { ko: '개발', en: 'Dev' },
  retrospective: { ko: '회고', en: 'Retrospective' },
  life: { ko: '일상', en: 'Life' },
};
