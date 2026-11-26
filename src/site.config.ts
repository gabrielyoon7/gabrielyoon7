/**
 * 사이트 전체에서 쓰는 이름·설명·링크를 한곳에서 관리합니다.
 * <title>, Open Graph, RSS, footer가 모두 이 값을 사용합니다.
 * 언어마다 다른 문구(사이트 설명 등)는 src/i18n/ui.ts에 있습니다.
 */
export const SITE = {
  name: 'Ju Hyun, Yoon',
  author: 'Ju Hyun, Yoon',
  timeZone: 'Asia/Seoul',
  /** public/ 기준 경로. 1200×630 PNG */
  defaultOgImage: 'og-default.png',
  links: {
    github: 'https://github.com/gabrielyoon7',
  },
  goatcounter: 'gabrielyoon7',
  /**
   * 댓글(giscus). repoId와 categoryId를 채우면 글 아래에 댓글이 보입니다.
   * 1) GitHub 저장소 Settings → Features → Discussions 켜기
   * 2) https://github.com/apps/giscus 앱을 이 저장소에 설치
   * 3) https://giscus.app 에서 저장소·카테고리를 고르면 나오는 data-repo-id, data-category-id 붙여넣기
   */
  giscus: {
    repo: 'gabrielyoon7/gabrielyoon7',
    repoId: '',
    category: 'Comments',
    categoryId: '',
  },
} as const;
