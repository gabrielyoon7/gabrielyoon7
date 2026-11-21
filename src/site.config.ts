/**
 * 사이트 전체에서 쓰는 이름·설명·링크를 한곳에서 관리합니다.
 * <title>, Open Graph, RSS, footer가 모두 이 값을 사용합니다.
 */
export const SITE = {
  name: 'Ju Hyun, Yoon',
  description: '윤주현의 블로그',
  author: 'Ju Hyun, Yoon',
  lang: 'ko',
  locale: 'ko_KR',
  timeZone: 'Asia/Seoul',
  /** public/ 기준 경로. 1200×630 PNG */
  defaultOgImage: 'og-default.png',
  links: {
    github: 'https://github.com/gabrielyoon7',
  },
  goatcounter: 'gabrielyoon7',
} as const;
