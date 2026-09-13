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
    await symlink(filepath, path.join(directory, "linked.mdx"));
    await assert.rejects(store.get("linked.mdx"), (e) => e.status === 403);
    assert.equal((await store.list()).length, 2);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
