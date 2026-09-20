import test from "node:test";
import assert from "node:assert/strict";
import { readFile, writeFile, mkdir, mkdtemp, rm } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { tmpdir } from "node:os";
import path from "node:path";
import vm from "node:vm";
import { buildWorker } from "./integration.mjs";

test("manifest confines installation to the writing page", async () => {
  const manifest = JSON.parse(
    await readFile("public/write/manifest.webmanifest", "utf8"),
  );
  const url = "https://example.com/gabrielyoon7/write/manifest.webmanifest";
  assert.equal(new URL(manifest.scope, url).pathname, "/gabrielyoon7/write/");
  assert.equal(
    new URL(manifest.start_url, url).pathname,
    "/gabrielyoon7/write/",
  );
  assert.equal(manifest.display, "standalone");
  assert.ok(manifest.icons.some((icon) => icon.sizes === "192x192"));
  assert.ok(manifest.icons.some((icon) => icon.purpose === "maskable"));
});

test("build versions all editor resources and worker serves cached app without network", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "pocket-pwa-"));
  try {
    await mkdir(path.join(root, "write"));
    await mkdir(path.join(root, "_astro"));
    for (const file of [
      "write/index.html",
      "write/manifest.webmanifest",
      "write/icon-180.png",
      "write/icon-192.png",
      "write/icon-512.png",
      "write/icon-maskable.png",
      "_astro/editor.js",
      "_astro/language.js",
      "_astro/editor.css",
    ])
      await writeFile(path.join(root, file), file);
    await writeFile(path.join(root, "_astro/blog.png"), "not needed");
    const directory = pathToFileURL(root + "/");
    const config = await buildWorker(directory, "/gabrielyoon7");
    assert.ok(config.assets.includes("/gabrielyoon7/_astro/language.js"));
    assert.ok(!config.assets.some((asset) => asset.endsWith("blog.png")));
    assert.ok(!config.assets.includes("/gabrielyoon7/"));
    const same = await buildWorker(directory, "/gabrielyoon7");
    assert.equal(config.version, same.version);
    const listeners = {};
    const cache = new Map();
    const deleted = [];
    const cacheName = config.prefix + config.version;
    let claimed = false;
    const context = {
      URL,
      Set,
      self: {
        location: { origin: "https://example.com" },
        addEventListener: (type, listener) => {
          listeners[type] = listener;
        },
        clients: {
          claim: async () => {
            claimed = true;
          },
        },
      },
      caches: {
        open: async () => ({
          addAll: async (assets) => {
            for (const asset of assets) cache.set(asset, asset);
          },
          match: async (key) => cache.get(key),
        }),
        keys: async () => [cacheName, config.prefix + "old", "another-app"],
        delete: async (key) => {
          deleted.push(key);
        },
      },
      fetch: () => {
        throw new Error("network offline");
      },
    };
    vm.runInNewContext(
      await readFile(path.join(root, "write/sw.js"), "utf8"),
      context,
    );
    let work;
    listeners.install({
      waitUntil: (p) => {
        work = p;
      },
    });
    await work;
    listeners.activate({
      waitUntil: (p) => {
        work = p;
      },
    });
    await work;
    assert.equal(claimed, true);
    assert.deepEqual(deleted, [config.prefix + "old"]);
    async function get(url, method = "GET") {
      let response;
      listeners.fetch({
        request: { url, method },
        respondWith: (p) => {
          response = p;
        },
      });
      return response;
    }
    assert.equal(
      await get("https://example.com/gabrielyoon7/write/?source=homescreen"),
      config.shell,
    );
    assert.equal(
      await get("https://example.com/gabrielyoon7/write/index.html"),
      config.shell,
    );
    assert.equal(
      await get("https://example.com/gabrielyoon7/_astro/editor.js"),
      "/gabrielyoon7/_astro/editor.js",
    );
    assert.equal(await get("https://example.com/gabrielyoon7/"), undefined);
    assert.equal(
      await get("https://example.com/gabrielyoon7/__local-editor/posts/"),
      undefined,
    );
    assert.equal(
      await get("https://elsewhere.example/gabrielyoon7/write/"),
      undefined,
    );
    assert.equal(
      await get("https://example.com/gabrielyoon7/write/", "POST"),
      undefined,
    );
    assert.equal(listeners.message, undefined); // Never force an update while writing.
    await writeFile(path.join(root, "_astro/editor.js"), "changed");
    assert.notEqual(
      (await buildWorker(directory, "/gabrielyoon7")).version,
      config.version,
    );
    assert.equal((await buildWorker(directory, "/")).shell, "/write/");
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
