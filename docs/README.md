# Dev Blog

React/TypeScript 프론트엔드 개발자를 위한 Astro + React + MDX 기술 블로그입니다.

정적 Markdown 글과 TSX 코드, 실제 동작하는 React Interactive Demo를 함께 작성할 수 있습니다.

## 기술 스택

- [Astro](https://astro.build/) — 페이지, 라우팅, 정적 렌더링, SEO
- [React](https://react.dev/) — Interactive Demo (필요한 곳에만 hydration)
- [TypeScript](https://www.typescriptlang.org/)
- [MDX](https://mdxjs.com/)
- [pnpm](https://pnpm.io/)
- CSS (외부 UI framework 없음)
- GitHub Actions + GitHub Pages

## Node.js 버전

**권장: Node.js 22 LTS** (`>=22.0.0`)

로컬과 GitHub Actions에서 동일한 major 버전을 사용하는 것을 권장합니다.

## pnpm 설치

```bash
corepack enable
corepack prepare pnpm@10.28.2 --activate
```

## 프로젝트 설치

```bash
pnpm install
```

## 로컬 개발

```bash
pnpm dev
```

브라우저에서 `http://localhost:4321/gabrielyoon7/` 접속 (Project Site base path 포함)

## Build

```bash
pnpm build
```

## Preview

```bash
pnpm preview
```

## Typecheck

```bash
pnpm typecheck
```

## 프로젝트 구조

```
src/
├── assets/blog/          # 글별 이미지
├── components/
│   ├── astro/            # Astro 컴포넌트
│   └── react/            # React Interactive Demo
├── content/blog/         # MDX 블로그 글
├── layouts/              # 페이지 레이아웃
├── pages/                # 라우트
└── styles/global.css     # 전역 CSS
```

## 파일명 규칙

모든 파일명과 디렉터리명은 **kebab-case**를 사용합니다.

| 대상 | 규칙 | 예시 |
|------|------|------|
| 파일명 | kebab-case | `interactive-demo.tsx` |
| 디렉터리명 | kebab-case | `blog-post/` |
| React 컴포넌트명 | PascalCase | `InteractiveDemo` |
| 변수/함수명 | camelCase | `getPosts` |
| CSS class | kebab-case | `post-list-item` |

Astro 동적 라우트(`[...slug]`, `[tag]`)는 예외입니다.

## 새 블로그 글 작성

`src/content/blog/`에 MDX 파일을 추가합니다.

```bash
src/content/blog/my-new-post.mdx
```

## frontmatter 작성

```yaml
---
title: "글 제목"
description: "글 설명 (SEO, RSS, OG에 사용)"
pubDate: 2026-08-18
updatedDate: 2026-08-19  # 선택
tags:
  - React
  - TypeScript
draft: false              # true면 빌드에서 제외
---
```

## 이미지 추가

글별 폴더에 이미지를 저장합니다.

```
src/assets/blog/my-post/
├── screenshot.png
└── diagram.svg
```

MDX에서 import 후 사용:

```mdx
import Figure from '../../components/astro/figure.astro';
import screenshot from '../../assets/blog/my-post/screenshot.png';

<Figure src={screenshot} alt="스크린샷 설명" caption="캡션 (선택)" />
```

지원 형식: PNG, JPG, JPEG, WebP, SVG, GIF

## 코드 블록 작성

MDX에서 fenced code block을 사용합니다.

````mdx
```typescript
const message: string = 'Hello';
```
````

지원 언어: TypeScript, TSX, JavaScript, JSX, CSS, HTML, JSON, Bash, Markdown, YAML

코드 블록에는 syntax highlighting, 언어 표시, 복사 버튼이 자동 적용됩니다.

## MDX 사용법

MDX 파일 상단에서 컴포넌트를 import합니다.

```mdx
import Callout from '../../components/astro/callout.astro';

<Callout type="info">
  설명입니다.
</Callout>
```

## Astro component 사용법

```mdx
import Callout from '../../components/astro/callout.astro';
import Figure from '../../components/astro/figure.astro';

<Callout type="warn" title="주의">
  경고 내용
</Callout>
```

## React component 사용법

```mdx
import InteractiveDemo from '../../components/react/interactive-demo.tsx';

<InteractiveDemo client:visible />
```

React 컴포넌트는 `src/components/react/`에 kebab-case 파일명으로 추가합니다.

## client:load / client:idle / client:visible

| Directive | 설명 |
|-----------|------|
| `client:visible` | 뷰포트에 보일 때 hydration (권장) |
| `client:idle` | 브라우저 idle 시 hydration |
| `client:load` | 페이지 로드 직후 hydration (꼭 필요할 때만) |

## GitHub Repository 생성

1. GitHub에서 새 repository 생성 (예: `gabrielyoon7`)
2. 로컬에서 push:

```bash
git init
git add .
git commit -m "Initial commit: Astro dev blog"
git branch -M main
git remote add origin git@github.com:USERNAME/REPO.git
git push -u origin main
```

## GitHub Pages 설정

Repository → **Settings** → **Pages**:

- **Source**: GitHub Actions

`main` 브랜치에 push하면 `.github/workflows/deploy.yml`이 자동 배포합니다.

## GitHub Actions 배포

워크플로우: pnpm install → build → GitHub Pages deploy

수동 실행: Actions 탭 → "Deploy to GitHub Pages" → Run workflow

## User Site / Project Site 차이

`astro.config.mjs` 상단 설정을 수정합니다.

### User Site (`username.github.io`)

```js
const IS_USER_SITE = true;
// base = '/'
// site = 'https://username.github.io'
```

Repository 이름은 **`username.github.io`** 여야 합니다.

### Project Site (`username.github.io/repo-name`) — 현재 기본값

```js
const IS_USER_SITE = false;
const REPO_NAME = 'gabrielyoon7';
// base = '/gabrielyoon7'
// site = 'https://username.github.io/gabrielyoon7'
```

`REPO_NAME`과 `GITHUB_USERNAME`만 수정하면 됩니다.

## Custom Domain 설정

1. GitHub Pages Settings → Custom domain에 도메인 입력
2. DNS에 CNAME 또는 A 레코드 설정
3. `astro.config.mjs`의 `site`를 커스텀 도메인으로 변경:

```js
site: 'https://yourdomain.com',
base: '/',
```

4. GitHub에서 HTTPS Enforce 활성화

## Interactive React Demo 추가 방법

1. `src/components/react/my-demo.tsx` 생성 (kebab-case)
2. PascalCase 컴포넌트 export
3. MDX에서 import + hydration directive 사용

```tsx
// src/components/react/counter-demo.tsx
export default function CounterDemo() {
  // ...
}
```

```mdx
import CounterDemo from '../../components/react/counter-demo.tsx';

<CounterDemo client:visible />
```

## 향후 검색 기능 추가 방법

1차 버전에는 검색을 포함하지 않습니다. 추후 추가 시:

- [Pagefind](https://pagefind.app/) — 빌드 후 정적 인덱스 생성
- [Fuse.js](https://fusejs.io/) — 클라이언트 사이드 fuzzy search
- Astro Content Collections에서 JSON 인덱스 생성 후 client-side 검색

무거운 서버/DB 없이 정적 호스팅을 유지할 수 있습니다.

## License

MIT
