import {
  LANGS,
  DEFAULT_LANG,
  CATEGORY_KEYS,
  DEFAULT_CATEGORY,
} from "../content/taxonomy.mjs";

export type Lang = (typeof LANGS)[number];
export type Category = (typeof CATEGORY_KEYS)[number];
export type Draft = {
  id: string;
  title: string;
  description: string;
  pubDate: string;
  lang: Lang;
  category: Category;
  tags: string;
  /** 비어 있으면 시리즈 아님 */
  series: string;
  /** 입력칸 값 그대로 (숫자 문자열) */
  seriesOrder: string;
  pinned: boolean;
  draft: boolean;
  body: string;
  modified: string;
};
export const PREFIX = "dev-blog:browser-draft:v1:";
export function newDraft(now = new Date()): Draft {
  return {
    id: crypto.randomUUID(),
    title: "",
    description: "",
    pubDate: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`,
    lang: DEFAULT_LANG,
    category: DEFAULT_CATEGORY,
    tags: "",
    series: "",
    seriesOrder: "",
    pinned: false,
    draft: true,
    body: "",
    modified: now.toISOString(),
  };
}
export function readDraft(raw: string): Draft {
  const d = JSON.parse(raw);
  if (
    !d ||
    ![
      "id",
      "title",
      "description",
      "pubDate",
      "tags",
      "body",
      "modified",
    ].every((k) => typeof d[k] === "string") ||
    typeof d.draft !== "boolean"
  ) {
    throw new Error(
      "저장된 초안을 읽을 수 없습니다. 브라우저 데이터를 지우지 말고 다른 초안을 이용해 주세요.",
    );
  }
  // 언어·카테고리·시리즈가 생기기 전에 저장한 초안도 그대로 열 수 있게 기본값을 채웁니다.
  return {
    ...d,
    lang: LANGS.includes(d.lang) ? d.lang : DEFAULT_LANG,
    category: CATEGORY_KEYS.includes(d.category) ? d.category : DEFAULT_CATEGORY,
    series: typeof d.series === "string" ? d.series : "",
    seriesOrder: typeof d.seriesOrder === "string" ? d.seriesOrder : "",
    pinned: d.pinned === true,
  };
}
export function listDrafts(storage: Storage): {
  drafts: Draft[];
  damaged: number;
} {
  const drafts: Draft[] = [];
  let damaged = 0;
  for (let i = 0; i < storage.length; i++) {
    const key = storage.key(i);
    if (!key?.startsWith(PREFIX)) continue;
    try {
      const draft = readDraft(storage.getItem(key)!);
      if (key !== PREFIX + draft.id) throw new Error();
      drafts.push(draft);
    } catch {
      damaged++;
    }
  }
  return {
    drafts: drafts.sort((a, b) => b.modified.localeCompare(a.modified)),
    damaged,
  };
}
export function saveDraft(
  storage: Storage,
  draft: Draft,
  expected: string | null,
): string {
  if (storage.getItem(PREFIX + draft.id) !== expected) {
    throw new Error(
      "다른 탭에서 이 초안을 변경했습니다. 전체 MDX를 복사해 보관한 뒤 페이지를 새로고침하세요.",
    );
  }
  const raw = JSON.stringify(draft);
  try {
    storage.setItem(PREFIX + draft.id, raw);
  } catch {
    throw new Error(
      "기기에 저장하지 못했습니다. 저장 공간 또는 브라우저 설정을 확인하고 전체 MDX를 복사해 보관하세요.",
    );
  }
  return raw;
}
export function exportMdx(d: Draft): string {
  const tags = d.tags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  const series = d.series.trim();
  // JSON strings/arrays are valid YAML and safely quote colons, newlines and quotes.
  const lines = [
    `title: ${JSON.stringify(d.title)}`,
    `description: ${JSON.stringify(d.description)}`,
    `pubDate: ${JSON.stringify(d.pubDate)}`,
    `category: ${d.category}`,
    `tags: ${JSON.stringify(tags)}`,
    ...(series
      ? [`series: ${JSON.stringify(series)}`, `seriesOrder: ${seriesOrder(d) ?? 1}`]
      : []),
    ...(d.pinned ? ["pinned: true"] : []),
    `draft: ${d.draft}`,
  ];
  return `---\n${lines.join("\n")}\n---\n\n${d.body}\n`;
}
/** 시리즈 순서 입력값. 1 이상의 정수가 아니면 null */
export function seriesOrder(d: Draft): number | null {
  const n = Number(d.seriesOrder);
  return d.seriesOrder.trim() && Number.isInteger(n) && n > 0 ? n : null;
}
/** GitHub에서 파일을 만들 폴더 */
export function folder(d: Draft): string {
  return `src/content/blog/${d.lang}/`;
}
export function filename(d: Draft): string {
  const slug = Array.from(
    d.title
      .normalize("NFC")
      .toLowerCase()
      .replace(/[^\p{L}\p{N}]+/gu, "-")
      .replace(/^-+|-+$/g, "") || "new-post",
  )
    .slice(0, 60)
    .join("");
  return `${d.pubDate || "undated"}-${slug}.mdx`;
}
export function needsSource(body: string): boolean {
  return (
    /^(import|export)\s/m.test(body) ||
    /<[A-Za-z]|\{/.test(body.replace(/```[\s\S]*?```/g, ""))
  );
}
