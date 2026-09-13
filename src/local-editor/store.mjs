import {
  mkdir,
  readdir,
  readFile,
  writeFile,
  rename,
  lstat,
  realpath,
} from "node:fs/promises";
import path from "node:path";
import { createHash, randomUUID } from "node:crypto";
import { parseDocument } from "yaml";

export class EditorError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}
const revision = (text) => createHash("sha256").update(text).digest("hex");
export function decode(text) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match)
    throw new EditorError(422, "글의 YAML 메타데이터를 찾을 수 없습니다.");
  const document = parseDocument(match[1]);
  if (document.errors.length)
    throw new EditorError(422, "YAML 메타데이터를 확인하세요.");
  return {
    document,
    metadata: document.toJS(),
    body: text.slice(match[0].length),
    revision: revision(text),
  };
}
export function createStore(directory) {
  // Serialize saves so two tabs cannot both pass the revision check.
  let pending = Promise.resolve();
  const serialize = (work) => {
    const result = pending.then(work);
    pending = result.catch(() => {});
    return result;
  };
  async function target(id) {
    if (
      typeof id !== "string" ||
      !/^[^/\\\x00]+\.mdx?$/.test(id) ||
      id.startsWith(".")
    )
      throw new EditorError(400, "잘못된 파일명입니다.");
    const file = path.join(directory, id);
    if (
      (await lstat(file)).isSymbolicLink() ||
      path.dirname(await realpath(file)) !== (await realpath(directory))
    )
      throw new EditorError(403, "이 파일은 편집할 수 없습니다.");
    return file;
  }
  async function get(id) {
    const { metadata, body, revision } = decode(
      await readFile(await target(id), "utf8"),
    );
    return { id, metadata, body, revision };
  }
  return {
    get,
    async list() {
      await mkdir(directory, { recursive: true });
      const entries = await readdir(directory, { withFileTypes: true });
      return Promise.all(
        entries
          .filter(
            (e) =>
              e.isFile() && /\.mdx?$/.test(e.name) && !e.name.startsWith("."),
          )
          .map(async (e) => {
            try {
              const post = await get(e.name);
              return {
                id: post.id,
                title: post.metadata.title,
                draft: post.metadata.draft !== false,
              };
            } catch {
              return { id: e.name, title: e.name, error: true };
            }
          }),
      );
    },
    create(title) {
      return serialize(async () => {
        if (typeof title !== "string" || !title.trim() || title.length > 200)
          throw new EditorError(400, "제목을 1~200자로 입력하세요.");
        await mkdir(directory, { recursive: true });
        const now = new Date();
        const date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
        const slug = Array.from(
          title
            .normalize("NFC")
            .toLowerCase()
            .replace(/[^\p{L}\p{N}]+/gu, "-")
            .replace(/^-+|-+$/g, "") || "new-post",
        )
          .slice(0, 60)
          .join("");
        const text = `---\ntitle: ${JSON.stringify(title.trim())}\ndescription: ""\npubDate: ${date}\ntags: []\ndraft: true\n---\n\n`;
        for (let n = 1; ; n++) {
          const id = `${date}-${slug}${n === 1 ? "" : `-${n}`}.mdx`;
          try {
            await writeFile(path.join(directory, id), text, { flag: "wx" });
            return get(id);
          } catch (e) {
            if (e.code !== "EEXIST") throw e;
          }
        }
      });
    },
    save(id, input) {
      return serialize(async () => {
        const file = await target(id);
        const current = decode(await readFile(file, "utf8"));
        if (current.revision !== input.revision)
          throw new EditorError(
            409,
            "파일이 다른 곳에서 변경되었습니다. 내용을 복사해 보관한 뒤 글을 다시 열어 주세요.",
          );
        const m = input.metadata;
        if (
          !m ||
          typeof m.title !== "string" ||
          !m.title.trim() ||
          typeof m.description !== "string" ||
          !Array.isArray(m.tags) ||
          !m.tags.every((t) => typeof t === "string") ||
          typeof m.draft !== "boolean" ||
          typeof m.pubDate !== "string" ||
          !/^\d{4}-\d{2}-\d{2}$/.test(m.pubDate) ||
          !Number.isFinite(Date.parse(m.pubDate)) ||
          typeof input.body !== "string"
        )
          throw new EditorError(422, "제목, 날짜, 태그와 본문을 확인하세요.");
        for (const key of ["title", "description", "pubDate", "tags", "draft"])
          current.document.set(key, m[key]);
        const text = `---\n${current.document.toString()}---\n${input.body}`;
        const temporary = path.join(directory, `.${randomUUID()}.tmp`);
        await writeFile(temporary, text, { flag: "wx" });
        await rename(temporary, file);
        return { revision: revision(text) };
      });
    },
  };
}
