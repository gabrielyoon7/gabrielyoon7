/** 카드 크기(px). 캡처 스크립트도 이 값을 그대로 씁니다. */
export const CARD_FORMATS = {
  /** 인스타그램 피드 세로형 4:5 */
  portrait: { width: 1080, height: 1350 },
  /** 인스타그램 정사각형 1:1 */
  square: { width: 1080, height: 1080 },
  /** Open Graph 미리보기 */
  og: { width: 1200, height: 630 },
} as const;

export type CardFormat = keyof typeof CARD_FORMATS;
