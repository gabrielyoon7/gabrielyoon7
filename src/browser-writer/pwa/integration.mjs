import { readFile, readdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { createHash } from "node:crypto";

export async function buildWorker(directory, base) {
  const root = fileURLToPath(directory);
  const prefix = `${base.replace(/\/$/, "")}/`;
  const files = [
    "write/index.html",
    "write/manifest.webmanifest",
    "write/icon-180.png",
    "write/icon-192.png",
    "write/icon-512.png",
    "write/icon-maskable.png",
  ];
  // Include JS/CSS and fonts, including lazily loaded editor language modules.
  // Page documents and blog images are deliberately excluded.
  async function scan(dir) {
    for (const entry of await readdir(path.join(root, dir), {
      withFileTypes: true,
    })) {
      const file = `${dir}/${entry.name}`;
      if (entry.isDirectory()) await scan(file);
      else if (/\.(?:js|css|woff2?|ttf|wasm)$/.test(file)) files.push(file);
    }
  }
  await scan("_astro");
  files.sort();
  const template = await readFile(
    new URL("./worker-template.js", import.meta.url),
    "utf8",
  );
  const hash = createHash("sha256").update(template).update(prefix);
  for (const file of files)
    hash.update(file).update(await readFile(path.join(root, file)));
  const config = {
    prefix: `pocket-writer:${prefix}:`,
    version: hash.digest("hex").slice(0, 16),
    shell: `${prefix}write/`,
    assets: files.map(
      (file) => prefix + (file === "write/index.html" ? "write/" : file),
    ),
  };
  await writeFile(
    path.join(root, "write/sw.js"),
    template.replace("__POCKET_CONFIG__", JSON.stringify(config)),
  );
  return config;
}
export default function pocketPwa() {
  let base = "/";
  return {
    name: "pocket-writer-pwa",
    hooks: {
      "astro:config:done": ({ config }) => {
        base = config.base;
      },
      "astro:build:done": async ({ dir }) => {
        await buildWorker(dir, base);
      },
    },
  };
}
