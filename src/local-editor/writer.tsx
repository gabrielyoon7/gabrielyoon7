import { useEffect, useRef, useState } from "react";
import {
  MDXEditor,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  linkPlugin,
  linkDialogPlugin,
  imagePlugin,
  tablePlugin,
  codeBlockPlugin,
  codeMirrorPlugin,
  toolbarPlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  BlockTypeSelect,
  ListsToggle,
  CreateLink,
  InsertImage,
  InsertTable,
  InsertCodeBlock,
  Separator,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import "./writer.css";

type Metadata = {
  title: string;
  description: string;
  pubDate: string;
  tags: string[];
  draft: boolean;
};
type Post = { id: string; metadata: Metadata; body: string; revision: string };
type Row = { id: string; title: string; draft?: boolean; error?: boolean };
const specialMDX = (body: string) =>
  /^(import|export)\s/m.test(body) ||
  /<[A-Za-z]|\{/.test(body.replace(/```[\s\S]*?```/g, ""));
const snapshot = (post: Post) => JSON.stringify([post.metadata, post.body]);

export default function Writer({ base }: { base: string }) {
  const api = `${base.replace(/\/$/, "")}/__local-editor/posts/`;
  const [rows, setRows] = useState<Row[]>([]);
  const [post, setPost] = useState<Post | null>(null);
  const current = useRef<Post | null>(null);
  const saved = useRef("");
  const saving = useRef<Promise<boolean> | null>(null);
  const [status, setStatus] = useState("글을 선택하거나 새 글을 만드세요.");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [title, setTitle] = useState("");
  const [source, setSource] = useState(false);
  const [editorKey, setEditorKey] = useState(0);
  const [autoSave, setAutoSave] = useState(true);
  async function request(path = "", method = "GET", data?: unknown) {
    const response = await fetch(`${api}${path}`, {
      method,
      headers: data ? { "Content-Type": "application/json" } : {},
      body: data ? JSON.stringify(data) : undefined,
    });
    if (!response.headers.get("content-type")?.includes("application/json")) {
      throw new Error("글 저장 API에 연결하지 못했습니다. 개발 서버를 재시작한 뒤 이 페이지를 새로고침해 주세요.");
    }
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "요청에 실패했습니다.");
    return result;
  }
  async function refresh() {
    setRows(await request());
  }
  useEffect(() => {
    refresh().catch((e) => setError(e.message));
  }, []);
  function change(next: Post) {
    current.current = next;
    setPost(next);
    setStatus("저장되지 않은 변경사항");
  }
  function metadata(key: keyof Metadata, value: unknown) {
    if (current.current)
      change({
        ...current.current,
        metadata: { ...current.current.metadata, [key]: value },
      });
  }
  async function save(): Promise<boolean> {
    if (saving.current) return saving.current;
    const work = (async () => {
      try {
        while (current.current && snapshot(current.current) !== saved.current) {
          const sent = current.current;
          const sentSnapshot = snapshot(sent);
          setStatus("저장 중…");
          setError("");
          const result = await request("", "PUT", sent);
          saved.current = sentSnapshot;
          if (current.current?.id === sent.id) {
            current.current = { ...current.current, revision: result.revision };
            setPost(current.current);
          }
        }
        setStatus(`저장됨 · ${new Date().toLocaleTimeString("ko-KR")}`);
        void refresh().catch(() => {});
        return true;
      } catch (e) {
        setError((e as Error).message);
        setStatus("저장 실패 · 변경사항이 브라우저에 남아 있습니다.");
        return false;
      }
    })();
    saving.current = work;
    try {
      return await work;
    } finally {
      saving.current = null;
    }
  }
  const saveRef = useRef(save);
  saveRef.current = save;
  useEffect(() => {
    if (!autoSave || !post || snapshot(post) === saved.current) return;
    const timer = setTimeout(() => {
      void saveRef.current();
    }, 1200);
    return () => clearTimeout(timer);
  }, [post, autoSave]);
  useEffect(() => {
    const unload = (event: BeforeUnloadEvent) => {
      if (current.current && snapshot(current.current) !== saved.current) {
        event.preventDefault();
        event.returnValue = "";
      }
    };
    const key = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        void saveRef.current();
      }
    };
    window.addEventListener("beforeunload", unload);
    window.addEventListener("keydown", key);
    return () => {
      window.removeEventListener("beforeunload", unload);
      window.removeEventListener("keydown", key);
    };
  }, []);
  async function open(id?: string) {
    setBusy(true);
    try {
      if (current.current && !(await save())) return;
      const next: Post = id
        ? await request(`?id=${encodeURIComponent(id)}`)
        : await request("", "POST", { title });
      current.current = next;
      saved.current = snapshot(next);
      setPost(next);
      setSource(specialMDX(next.body));
      setEditorKey((k) => k + 1);
      setError("");
      setStatus("저장됨");
      setTitle("");
      await refresh();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="writer">
      <header className="writer-header">
        <a href={base}>← 블로그</a>
        <strong>글 작성</strong>
        <span className="local-badge">LOCAL ONLY</span>
      </header>
      <div className="writer-grid">
        <aside>
          <h2>내 글</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void open();
            }}
          >
            <input
              aria-label="새 글 제목"
              placeholder="새 글 제목"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              maxLength={200}
            />
            <button disabled={busy || !title.trim()} type="submit">
              ＋ 새 글 만들기
            </button>
          </form>
          <nav aria-label="로컬 글 목록">
            {rows.map((row) => (
              <button
                key={row.id}
                disabled={busy}
                aria-current={post?.id === row.id ? "page" : undefined}
                onClick={() => void open(row.id)}
              >
                <span>{row.title}</span>
                <small>
                  {row.error ? "파일 확인 필요" : row.draft ? "초안" : "공개"} ·{" "}
                  {row.id}
                </small>
              </button>
            ))}
          </nav>
          <p className="hint">
            파일은 src/content/blog에 저장됩니다. 공개 여부를 바꿔도 배포는 Git
            push 후 진행됩니다.
          </p>
        </aside>
        <main>
          <div role="status" className="save-status">
            {status}
          </div>
          {error && (
            <div role="alert" className="error">
              {error}
            </div>
          )}
          {!post ? (
            <div className="empty">
              <h1>브라우저에서 바로 쓰세요.</h1>
              <p>왼쪽에서 새 글을 만들거나 작성 중인 글을 여세요.</p>
            </div>
          ) : (
            <>
              <div className="document-actions">
                <code>{post.id}</code>
                <label>
                  <input
                    type="checkbox"
                    checked={autoSave}
                    onChange={(e) => setAutoSave(e.target.checked)}
                  />{" "}
                  자동 저장
                </label>
                <button disabled={busy} onClick={() => void save()}>
                  저장 ⌘/Ctrl S
                </button>
                <a
                  href={`${base}blog/${encodeURIComponent(post.id.replace(/\.mdx?$/, ""))}/`}
                  target="_blank"
                  rel="noreferrer"
                  onClick={async (e) => {
                    e.preventDefault();
                    if (await save())
                      window.open(
                        `${base}blog/${encodeURIComponent(post.id.replace(/\.mdx?$/, ""))}/`,
                        "_blank",
                        "noopener",
                      );
                  }}
                >
                  미리보기 ↗
                </a>
              </div>
              <fieldset disabled={busy}>
                <legend>글 정보</legend>
                <label>
                  제목
                  <input
                    value={post.metadata.title}
                    onChange={(e) => metadata("title", e.target.value)}
                  />
                </label>
                <label>
                  설명
                  <input
                    value={post.metadata.description}
                    onChange={(e) => metadata("description", e.target.value)}
                  />
                </label>
                <div className="metadata-row">
                  <label>
                    작성일
                    <input
                      type="date"
                      value={String(post.metadata.pubDate).slice(0, 10)}
                      onChange={(e) => metadata("pubDate", e.target.value)}
                    />
                  </label>
                  <label>
                    태그 (쉼표로 구분)
                    <input
                      value={post.metadata.tags.join(",")}
                      onChange={(e) =>
                        metadata("tags", e.target.value.split(","))
                      }
                    />
                  </label>
                  <label className="draft">
                    <input
                      type="checkbox"
                      checked={post.metadata.draft !== false}
                      onChange={(e) => metadata("draft", e.target.checked)}
                    />{" "}
                    초안으로 보관
                  </label>
                </div>
              </fieldset>
              <div className="mode-bar">
                <strong>본문</strong>
                <button
                  onClick={() => {
                    if (!source || !specialMDX(post.body)) {
                      setSource(!source);
                      setEditorKey((k) => k + 1);
                    } else
                      setError(
                        "커스텀 MDX 문법이 있어 소스 모드로 편집해야 합니다.",
                      );
                  }}
                >
                  {source ? "WYSIWYG로 전환" : "소스 편집"}
                </button>
              </div>
              {source ? (
                <>
                  <p className="hint">
                    MDX 컴포넌트와 import가 포함된 글은 원문을 보존하며
                    편집합니다.
                  </p>
                  <textarea
                    className="source-editor"
                    aria-label="MDX 본문"
                    value={post.body}
                    onChange={(e) => change({ ...post, body: e.target.value })}
                    spellCheck={false}
                  />
                </>
              ) : (
                <MDXEditor
                  key={`${post.id}-${editorKey}`}
                  markdown={post.body}
                  contentEditableClassName="writing-area"
                  onChange={(body, initial) => {
                    if (!initial && current.current)
                      change({ ...current.current, body });
                  }}
                  onError={() => {
                    setSource(true);
                    setError(
                      "이 문법은 소스 편집으로 열었습니다. 원문은 유지됩니다.",
                    );
                  }}
                  plugins={[
                    headingsPlugin(),
                    listsPlugin(),
                    quotePlugin(),
                    thematicBreakPlugin(),
                    linkPlugin(),
                    linkDialogPlugin(),
                    imagePlugin(),
                    tablePlugin(),
                    codeBlockPlugin({ defaultCodeBlockLanguage: "text" }),
                    codeMirrorPlugin({
                      codeBlockLanguages: {
                        text: "Text",
                        js: "JavaScript",
                        ts: "TypeScript",
                        tsx: "TSX",
                        css: "CSS",
                        html: "HTML",
                        json: "JSON",
                        bash: "Bash",
                        python: "Python",
                      },
                    }),
                    toolbarPlugin({
                      toolbarContents: () => (
                        <>
                          <UndoRedo />
                          <Separator />
                          <BlockTypeSelect />
                          <BoldItalicUnderlineToggles />
                          <ListsToggle />
                          <Separator />
                          <CreateLink />
                          <InsertImage />
                          <InsertTable />
                          <InsertCodeBlock />
                        </>
                      ),
                    }),
                  ]}
                />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
