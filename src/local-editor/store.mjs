import {
  mkdir,
  readdir,
  readFile,
  writeFile,
  rename,
  lstat,
  realpath,
  unlink,
} from "node:fs/promises";
import path from "node:path";
import { createHash, randomUUID } from "node:crypto";
import { parseDocument } from "yaml";
import {
  LANGS,
  DEFAULT_LANG,
  CATEGORY_KEYS,
  DEFAULT_CATEGORY,
} from "../content/taxonomy.mjs";

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
const today = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
};
const slugify = (title) =>
  Array.from(
    title
      .normalize("NFC")
      .toLowerCase()
      .replace(/[^\p{L}\p{N}]+/gu, "-")
      .replace(/^-+|-+$/g, "") || "new-post",
  )
    .slice(0, 60)
    .join("");

/** 글 파일은 <directory>/<lang>/<파일명>.mdx 에 있고, id는 "<lang>/<파일명>.mdx" 입니다. */
export function createStore(directory) {
  // Serialize mutations so two tabs cannot both pass the revision check.
  let pending = Promise.resolve();
  const serialize = (work) => {
    const result = pending.then(work);
    pending = result.catch(() => {});
    return result;
  };
  async function target(id) {
    const match =
      typeof id === "string" && id.match(/^([a-z]+)\/([^/\\\x00]+\.mdx?)$/);
    if (!match || !LANGS.includes(match[1]) || match[2].startsWith("."))
      throw new EditorError(400, "잘못된 파일명입니다.");
    const folder = path.join(directory, match[1]);
    const file = path.join(folder, match[2]);
    if (
      (await lstat(file)).isSymbolicLink() ||
      path.dirname(await realpath(file)) !== (await realpath(folder))
    )
      throw new EditorError(403, "이 파일은 편집할 수 없습니다.");
    return file;
  }
  async function write(lang, filename, text) {
    await mkdir(path.join(directory, lang), { recursive: true });
    await writeFile(path.join(directory, lang, filename), text, { flag: "wx" });
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
      const rows = [];
      for (const lang of LANGS) {
        const folder = path.join(directory, lang);
        await mkdir(folder, { recursive: true });
        const entries = await readdir(folder, { withFileTypes: true });
        rows.push(
          ...(await Promise.all(
            entries
              .filter(
                (e) =>
                  e.isFile() && /\.mdx?$/.test(e.name) && !e.name.startsWith("."),
              )
              .map(async (e) => {
                const id = `${lang}/${e.name}`;
                try {
                  const post = await get(id);
                  return {
                    id,
                    lang,
                    title: post.metadata.title,
                    draft: post.metadata.draft !== false,
                  };
                } catch {
                  return { id, lang, title: e.name, error: true };
                }
              }),
          )),
        );
      }
      return rows;
    },
    /**
     * 새 글을 만듭니다. translationOf에 다른 언어 글 id를 주면
     * 같은 파일명으로 lang 폴더에 번역본을 만들고 분류 정보를 복사합니다.
     */
    create(title, { lang = DEFAULT_LANG, translationOf } = {}) {
      return serialize(async () => {
        if (!LANGS.includes(lang))
          throw new EditorError(400, "지원하지 않는 언어입니다.");
        if (translationOf !== undefined) {
          const source = await get(translationOf);
          const [sourceLang, filename] = source.id.split("/");
          if (sourceLang === lang)
            throw new EditorError(400, "다른 언어를 골라 주세요.");
          const document = parseDocument("");
          const m = source.metadata;
          document.set("title", m.title ?? "");
          document.set("description", "");
          document.set("pubDate", today());
          document.set("category", m.category ?? DEFAULT_CATEGORY);
          document.set("tags", Array.isArray(m.tags) ? m.tags : []);
          if (m.series !== undefined) document.set("series", m.series);
          if (m.seriesOrder !== undefined)
            document.set("seriesOrder", m.seriesOrder);
          document.set("draft", true);
          try {
            await write(lang, filename, `---\n${document.toString()}---\n\n`);
          } catch (e) {
            if (e.code === "EEXIST")
              throw new EditorError(409, "이 언어의 번역본이 이미 있습니다.");
            throw e;
          }
          return get(`${lang}/${filename}`);
        }
        if (typeof title !== "string" || !title.trim() || title.length > 200)
          throw new EditorError(400, "제목을 1~200자로 입력하세요.");
        const date = today();
        const slug = slugify(title);
        const text = `---\ntitle: ${JSON.stringify(title.trim())}\ndescription: ""\npubDate: ${date}\ncategory: ${DEFAULT_CATEGORY}\ntags: []\ndraft: true\n---\n\n`;
        for (let n = 1; ; n++) {
          const filename = `${date}-${slug}${n === 1 ? "" : `-${n}`}.mdx`;
          try {
            await write(lang, filename, text);
            return get(`${lang}/${filename}`);
          } catch (e) {
            if (e.code !== "EEXIST") throw e;
          }
        }
      });
    },
    remove(id, input) {
      return serialize(async () => {
        const file = await target(id);
        const current = decode(await readFile(file, "utf8"));
        if (current.revision !== input.revision)
          throw new EditorError(409, "파일이 다른 곳에서 변경되었습니다. 글을 다시 연 뒤 삭제해 주세요.");
        await unlink(file);
        return { id };
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
        if (!CATEGORY_KEYS.includes(m.category))
          throw new EditorError(422, "카테고리를 골라 주세요.");
        const series = typeof m.series === "string" ? m.series.trim() : "";
        const order = m.seriesOrder ?? null;
        if (
          (order !== null && !(Number.isInteger(order) && order > 0)) ||
          Boolean(series) !== (order !== null)
        )
          throw new EditorError(
            422,
            "시리즈 이름과 순서(1 이상)는 함께 적거나 함께 비워 두세요.",
          );
        if (m.pinned !== undefined && typeof m.pinned !== "boolean")
          throw new EditorError(422, "고정 여부를 확인하세요.");
        for (const key of ["title", "description", "pubDate", "category", "tags", "draft"])
          current.document.set(key, m[key]);
        // 선택 항목은 비어 있으면 frontmatter에서 지워 파일을 간결하게 둡니다.
        if (series) {
          current.document.set("series", series);
          current.document.set("seriesOrder", order);
        } else {
          current.document.delete("series");
          current.document.delete("seriesOrder");
        }
        if (m.pinned) current.document.set("pinned", true);
        else current.document.delete("pinned");
        const text = `---\n${current.document.toString()}---\n${input.body}`;
        const temporary = path.join(directory, `.${randomUUID()}.tmp`);
        await writeFile(temporary, text, { flag: "wx" });
        await rename(temporary, file);
        return { revision: revision(text) };
      });
    },
  };
}
