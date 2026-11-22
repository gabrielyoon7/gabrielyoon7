import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, writeFile, symlink, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { createStore } from "./store.mjs";

test("create, repeated save, metadata preservation, conflict and path protection", async () => {
  const directory = await mkdtemp(path.join(tmpdir(), "blog-editor-"));
  try {
    const store = createStore(directory);
    const post = await store.create("테스트 글");
    assert.equal(post.metadata.draft, true);
    assert.equal(post.metadata.category, "dev");
    assert.match(post.id, /^ko\//);
    assert.notEqual((await store.create("테스트 글")).id, post.id);
    const filepath = path.join(directory, post.id);
    await writeFile(
      filepath,
      (await readFile(filepath, "utf8")).replace(
        "draft: true",
        "draft: true\ncoverImage: /cover.png\n# keep comment",
      ),
    );
    const loaded = await store.get(post.id);
    const first = await store.save(post.id, {
      ...loaded,
      body: "\n## Hello\n\n**굵게**\n",
    });
    const second = await store.save(post.id, {
      ...loaded,
      revision: first.revision,
      body: "\n## Revised\n",
    });
    assert.notEqual(first.revision, second.revision);
    assert.equal((await store.get(post.id)).body, "\n## Revised\n");
    assert.match(
      await readFile(filepath, "utf8"),
      /coverImage: \/cover.png\n+# keep comment/,
    );
    await assert.rejects(store.save(post.id, loaded), (e) => e.status === 409);
    const latest = await store.get(post.id);
    const results = await Promise.allSettled([
      store.save(post.id, { ...latest, body: "A" }),
      store.save(post.id, { ...latest, body: "B" }),
    ]);
    assert.equal(results.filter((r) => r.status === "fulfilled").length, 1);
    await assert.rejects(store.get("../outside.mdx"), (e) => e.status === 400);
    await assert.rejects(store.get("fr/x.mdx"), (e) => e.status === 400);
    await assert.rejects(store.get("ko/../x.mdx"), (e) => e.status === 400);
    await symlink(filepath, path.join(directory, "ko", "linked.mdx"));
    await assert.rejects(store.get("ko/linked.mdx"), (e) => e.status === 403);
    assert.equal((await store.list()).length, 2);
    await assert.rejects(store.remove('ko/linked.mdx', latest), (e) => e.status === 403);
    await assert.rejects(store.remove(post.id, latest), (e) => e.status === 409);
    const beforeDelete = await store.get(post.id);
    await store.remove(post.id, beforeDelete);
    await assert.rejects(store.get(post.id), (e) => e.code === 'ENOENT');
    await assert.rejects(store.save(post.id, beforeDelete), (e) => e.code === 'ENOENT');
    assert.equal((await store.list()).length, 1);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("languages, translations, category, series and pinned", async () => {
  const directory = await mkdtemp(path.join(tmpdir(), "blog-editor-"));
  try {
    const store = createStore(directory);
    await assert.rejects(store.create("x", { lang: "fr" }), (e) => e.status === 400);
    const en = await store.create("English post", { lang: "en" });
    assert.match(en.id, /^en\/.*english-post\.mdx$/);

    const ko = await store.create("시리즈 글");
    const saved = await store.save(ko.id, {
      ...ko,
      metadata: {
        ...ko.metadata,
        category: "retrospective",
        series: "  Astro 블로그  ",
        seriesOrder: 2,
        pinned: true,
        tags: ["Astro"],
      },
    });
    let text = await readFile(path.join(directory, ko.id), "utf8");
    assert.match(text, /category: retrospective/);
    assert.match(text, /series: Astro 블로그\nseriesOrder: 2/);
    assert.match(text, /pinned: true/);

    for (const bad of [
      { category: "unknown" },
      { series: "이름만", seriesOrder: null },
      { series: "", seriesOrder: 1 },
      { series: "a", seriesOrder: 0 },
      { pinned: "yes" },
    ]) {
      const current = await store.get(ko.id);
      await assert.rejects(
        store.save(ko.id, { ...current, metadata: { ...current.metadata, ...bad } }),
        (e) => e.status === 422,
        JSON.stringify(bad),
      );
    }

    // 비운 선택 항목은 frontmatter에서 지워집니다.
    const current = await store.get(ko.id);
    await store.save(ko.id, {
      ...current,
      revision: saved.revision,
      metadata: { ...current.metadata, series: "", seriesOrder: null, pinned: false },
    });
    text = await readFile(path.join(directory, ko.id), "utf8");
    assert.doesNotMatch(text, /series|pinned/);

    // 번역본은 같은 파일명으로 다른 언어 폴더에 만들어지고 분류를 이어받습니다.
    const translated = await store.create(undefined, { lang: "en", translationOf: ko.id });
    assert.equal(translated.id, ko.id.replace(/^ko\//, "en/"));
    assert.equal(translated.metadata.category, "retrospective");
    assert.deepEqual(translated.metadata.tags, ["Astro"]);
    assert.equal(translated.metadata.draft, true);
    await assert.rejects(
      store.create(undefined, { lang: "en", translationOf: ko.id }),
      (e) => e.status === 409,
    );
    await assert.rejects(
      store.create(undefined, { lang: "ko", translationOf: ko.id }),
      (e) => e.status === 400,
    );
    assert.deepEqual(
      (await store.list()).map((r) => r.id).sort(),
      [en.id, ko.id, translated.id].sort(),
    );
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
