import test from "node:test";
import assert from "node:assert/strict";
import { parse } from "yaml";
import {
  newDraft,
  exportMdx,
  filename,
  saveDraft,
  listDrafts,
  PREFIX,
} from "./drafts.ts";

function memoryStorage(): Storage {
  const data = new Map<string, string>();
  return {
    get length() {
      return data.size;
    },
    key: (i) => [...data.keys()][i] ?? null,
    getItem: (k) => data.get(k) ?? null,
    setItem: (k, v) => {
      data.set(k, v);
    },
    removeItem: (k) => {
      data.delete(k);
    },
    clear: () => data.clear(),
  };
}
test("MDX export preserves quoted metadata and body in blog format", () => {
  const draft = {
    ...newDraft(new Date(2026, 8, 14, 10)),
    title: '한글: "제목"\n다음 줄',
    description: "---\n설명",
    tags: " React, , TypeScript ",
    body: "## 본문\n\n**굵게**\n\n```tsx\nconst a = {};\n```",
    draft: false,
  };
  const mdx = exportMdx(draft);
  const [, yaml, body] = mdx.split("---\n");
  // Embedded separators are escaped within YAML strings.
  const metadata = parse(yaml);
  assert.equal(metadata.title, draft.title);
  assert.equal(metadata.description, draft.description);
  assert.equal(metadata.pubDate, "2026-09-14");
  assert.deepEqual(metadata.tags, ["React", "TypeScript"]);
  assert.equal(metadata.draft, false);
  assert.equal(body, "\n" + draft.body + "\n");
  assert.match(filename(draft), /^2026-09-14-한글-제목-다음-줄\.mdx$/);
});
test("multiple drafts survive reopening; conflict and damaged data stay intact", () => {
  const storage = memoryStorage();
  const a = newDraft(),
    b = newDraft();
  const original = saveDraft(storage, a, null);
  saveDraft(storage, b, null);
  assert.equal(listDrafts(storage).drafts.length, 2);
  saveDraft(storage, { ...a, body: "이어서 작성" }, original);
  assert.equal(
    listDrafts(storage).drafts.find((d) => d.id === a.id)?.body,
    "이어서 작성",
  );
  assert.throws(
    () => saveDraft(storage, { ...a, body: "다른 탭" }, original),
    /다른 탭/,
  );
  storage.setItem(PREFIX + "broken", "{");
  assert.equal(listDrafts(storage).damaged, 1);
  assert.equal(storage.getItem(PREFIX + "broken"), "{");
});
test("storage failures never report successful persistence", () => {
  const storage = memoryStorage();
  storage.setItem = () => {
    throw new Error("quota");
  };
  assert.throws(
    () => saveDraft(storage, newDraft(), null),
    /저장하지 못했습니다/,
  );
  assert.equal(storage.length, 0);
});
