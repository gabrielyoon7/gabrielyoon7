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

Mac과 Windows 모두 다음 명령으로 새 글 템플릿을 생성합니다.

```sh
pnpm new
pnpm new "React 상태 관리"
```

`src/content/blog/YYYY-MM-DD-new-post.mdx`에 오늘 날짜(실행하는 컴퓨터 기준)의 초안을 만듭니다. 제목을 지정하면 파일명에도 반영하며, 파일명이 겹치면 `-2`, `-3`을 붙여 기존 글을 보존합니다.

생성된 파일의 제목, 설명, 태그와 본문을 작성하고 공개할 때 `draft: false`로 바꾸세요.

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

예시 글 `first-post.mdx`와 `second-post.mdx`는 문법 참고용으로 보관하며, `draft: true`로 숨겨져 있습니다.
`draft: true`인 글은 홈, 글 목록, 태그, RSS, 개별 글 페이지에서 제외됩니다.
새 글을 공개하려면 frontmatter에 `draft: false`를 설정하세요. `published` 항목은 사용하지 않습니다.

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

## 브라우저에서 로컬 글 작성

`pnpm dev` 실행 후 상단 **글 작성** 메뉴 또는 `http://localhost:4321/gabrielyoon7/editor/`를 여세요.

- 제목을 입력하고 **새 글 만들기**를 누르면 `src/content/blog/날짜-제목.mdx` 초안이 즉시 생성됩니다.
- 본문은 WYSIWYG로 작성하며 제목, 설명, 날짜, 태그와 초안 여부를 별도로 편집합니다.
- 입력을 멈춘 뒤 1.2초 후 자동 저장합니다. 자동 저장을 끄거나 **저장**, `⌘S` / `Ctrl+S`로 직접 저장할 수도 있습니다.
- 목록에서 기존 글을 다시 열어 계속 작성할 수 있습니다. 글을 전환할 때 현재 변경사항을 먼저 저장합니다.
- **미리보기**는 저장 후 실제 블로그 페이지를 엽니다. 개발 서버에서는 초안도 개별 페이지로 볼 수 있습니다.
- `import`, JSX 컴포넌트 등 특수 MDX가 포함된 글은 원문 보존을 위해 소스 편집으로 열립니다. 이미지 삽입은 URL을 사용합니다.
- 다른 탭이나 외부 편집기가 파일을 변경하면 덮어쓰지 않고 충돌 메시지를 표시합니다. 저장하지 않은 내용을 복사한 뒤 페이지를 새로고침하고 파일을 다시 여세요.

작성 화면과 저장 API는 개발 서버에만 등록됩니다. 저장 API는 루프백 주소에서만 접근 가능하며 다른 출처의 요청을 거부합니다. `pnpm build`와 `pnpm preview`에는 작성 기능이 없습니다. 공개하려면 초안 체크를 해제하고 기존 Git 배포 절차를 진행하세요.

저장 로직 테스트: `node --test src/local-editor/store.test.mjs`

## 스마트폰에서 주머니 글쓰기

배포된 사이트의 `/gabrielyoon7/write/` 주소로 직접 접속합니다. 방문자용 상단 메뉴에는 표시하지 않으므로 스마트폰에 북마크하거나 홈 화면에 추가해 사용하세요. 이 페이지는 정적 빌드에 포함되어 PC 개발 서버 없이 사용할 수 있습니다. 기존 로컬 `/editor/`와 파일 저장 API는 그대로 유지됩니다.

1. **새 글**을 누르고 제목과 WYSIWYG 본문을 작성합니다.
2. 설명·날짜·태그·초안 여부는 접힌 글 정보 설정에서 입력합니다.
3. 입력 즉시 현재 브라우저의 localStorage에 저장됩니다. 여러 초안을 보관하고 **내 초안**에서 다시 열 수 있습니다.
4. **전체 MDX 복사**로 YAML 메타데이터와 본문을 함께 복사합니다. **파일명 복사**, **.mdx 다운로드**, **내보낼 내용 보기**도 제공합니다.
5. GitHub에서 `src/content/blog/` 아래 파일을 만들고 복사한 내용을 붙여넣어 커밋합니다. 공개할 글은 **초안으로 내보내기** 체크를 해제하세요.

복사 권한이 없으면 직접 선택해 복사할 수 있는 텍스트 상자가 열립니다. MDX 컴포넌트가 포함된 본문은 원문 편집을 사용합니다. 이미지는 URL로 삽입합니다.

초안은 서버로 전송하지 않습니다. 다른 기기·브라우저·주소(포트 포함)와 자동 동기화되지 않으며, 브라우저 데이터 삭제 시 사라질 수 있습니다. 저장 공간 부족 또는 다른 탭의 변경이 감지되면 오류를 표시하고 현재 작성 내용은 화면에 유지하므로 복사해 보관하세요. PWA 오프라인 준비를 마치면 인터넷 없이도 페이지를 다시 열 수 있습니다. 외부 이미지와 GitHub 접속에는 인터넷이 필요합니다.

저장·MDX 내보내기 테스트(Node.js 22.6 이상): `node --experimental-strip-types --test src/browser-writer/drafts.test.ts`


## 주머니 글쓰기 PWA 설치와 오프라인 사용

1. 배포된 HTTPS 사이트의 `/gabrielyoon7/write/`에 접속합니다.
2. **오프라인 사용 준비 완료** 표시가 나올 때까지 기다립니다. 편집기 실행 파일과 글쓰기 페이지가 모두 저장된 뒤 표시됩니다.
3. Android의 지원 브라우저에서는 **앱 설치** 버튼 또는 브라우저 메뉴를 이용합니다. iPhone·iPad에서는 Safari의 공유 메뉴 → **홈 화면에 추가**를 선택합니다.
4. 홈 화면에서 앱을 다시 열면 인터넷 없이도 새 글 작성, 초안 복원, 자동 저장, MDX 복사·다운로드를 사용할 수 있습니다.

PWA 범위는 `/write/`로 제한되며 블로그나 로컬 편집기를 제어하지 않습니다. 최초 실행은 인터넷이 필요합니다. 기기에서 사이트 데이터가 삭제되면 초안과 오프라인 파일도 사라질 수 있습니다. 설치한 앱과 일반 브라우저의 저장소 공유 여부는 환경에 따라 다르므로 사용할 앱에서 초안이 보이는지 확인하세요.

업데이트는 백그라운드에서 준비합니다. 작성 중 강제로 새로고침하지 않으며, **새 버전이 준비되었습니다** 안내가 나오면 저장 상태를 확인하고 모든 글쓰기 창을 닫았다가 다시 열어 적용합니다. 업데이트 때는 이 앱의 이전 실행 파일 캐시만 정리하고 localStorage 초안은 유지합니다.

개발 서버(`pnpm dev`)에는 서비스 워커를 등록하지 않습니다. `pnpm build`가 생성한 manifest·아이콘·서비스 워커를 `pnpm preview` 또는 배포 환경에서 확인하세요. 오프라인 검증은 준비 완료 후 서버를 중지하고 글쓰기 주소를 새로고침하는 방식으로도 가능합니다.

PWA 테스트: `node --test src/browser-writer/pwa/pwa.test.mjs`
초안은 서버로 전송하지 않습니다. 다른 기기·브라우저·주소(포트 포함)와 자동 동기화되지 않으며, 브라우저 데이터 삭제 시 사라질 수 있습니다. 저장 공간 부족 또는 다른 탭의 변경이 감지되면 오류를 표시하고 현재 작성 내용은 화면에 유지하므로 복사해 보관하세요. 오프라인에서 페이지를 새로 여는 기능은 포함하지 않습니다.

저장·MDX 내보내기 테스트(Node.js 22.6 이상): `node --experimental-strip-types --test src/browser-writer/drafts.test.ts`
