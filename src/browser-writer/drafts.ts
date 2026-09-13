export type Draft = {
  id: string;
  title: string;
  description: string;
  pubDate: string;
  tags: string;
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
    tags: "",
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
  return d;
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
  // JSON strings/arrays are valid YAML and safely quote colons, newlines and quotes.
  return `---\ntitle: ${JSON.stringify(d.title)}\ndescription: ${JSON.stringify(d.description)}\npubDate: ${JSON.stringify(d.pubDate)}\ntags: ${JSON.stringify(tags)}\ndraft: ${d.draft}\n---\n\n${d.body}\n`;
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
