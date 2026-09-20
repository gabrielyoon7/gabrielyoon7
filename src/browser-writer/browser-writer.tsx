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
} from "@mdxeditor/editor";
import {
  PREFIX,
  newDraft,
  readDraft,
  listDrafts,
  saveDraft,
  exportMdx,
  filename,
  needsSource,
  type Draft,
} from "./drafts";
import "@mdxeditor/editor/style.css";
import "./browser-writer.css";
import PwaControls from "./pwa/pwa-controls";

export default function BrowserWriter({ base }: { base: string }) {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [active, setActive] = useState<Draft | null>(null);
  const [ready, setReady] = useState(false);
  const [status, setStatus] = useState("기기에 저장된 글을 불러오는 중…");
  const [error, setError] = useState("");
  const [source, setSource] = useState(false);
  const [version, setVersion] = useState(0);
  const [transfer, setTransfer] = useState<{
    label: string;
    text: string;
  } | null>(null);
  const current = useRef<Draft | null>(null);
  const baseline = useRef<string | null>(null);
  const dirty = useRef(false);
  const storage = useRef<Storage | null>(null);
  function refresh() {
    if (!storage.current) return;
    const result = listDrafts(storage.current);
    setDrafts(result.drafts);
    if (result.damaged)
      setError(
        `읽을 수 없는 초안 ${result.damaged}개가 있습니다. 해당 데이터는 그대로 보관됩니다.`,
      );
  }
  useEffect(() => {
    try {
      storage.current = window.localStorage;
      refresh();
      setStatus("새 글을 만들거나 초안을 선택하세요.");
    } catch {
      setError(
        "브라우저 저장소를 사용할 수 없습니다. 작성한 내용은 복사 또는 다운로드로 보관하세요.",
      );
    }
    setReady(true);
    const unload = (event: BeforeUnloadEvent) => {
      if (dirty.current) event.preventDefault();
    };
    const externalChange = (event: StorageEvent) => {
      if (event.key === null || event.key.startsWith(PREFIX)) {
        refresh();
        if (
          current.current &&
          (event.key === null || event.key === PREFIX + current.current.id)
        ) {
          setError(
            "다른 탭에서 현재 초안이 변경되었습니다. 작성 내용을 복사해 보관한 뒤 새로고침하세요.",
          );
        }
      }
    };
    window.addEventListener("beforeunload", unload);
    window.addEventListener("storage", externalChange);
    return () => {
      window.removeEventListener("beforeunload", unload);
      window.removeEventListener("storage", externalChange);
    };
  }, []);
  function persist(next: Draft): boolean {
    try {
      if (!storage.current)
        throw new Error(
          "브라우저 저장소를 사용할 수 없습니다. 전체 MDX를 복사해 보관하세요.",
        );
      baseline.current = saveDraft(storage.current, next, baseline.current);
      dirty.current = false;
      setError("");
      setStatus(`이 기기에 저장됨 · ${new Date().toLocaleTimeString("ko-KR")}`);
      refresh();
      return true;
    } catch (e) {
      dirty.current = true;
      setError((e as Error).message);
      setStatus("저장되지 않음");
      return false;
    }
  }
  function change(patch: Partial<Draft>) {
    if (!current.current) return;
    const next = {
      ...current.current,
      ...patch,
      modified: new Date().toISOString(),
    };
    current.current = next;
    setActive(next);
    dirty.current = true;
    // Save immediately: mobile browsers may suspend without beforeunload/pagehide.
    persist(next);
  }
  function open(id?: string) {
    if (dirty.current && current.current && !persist(current.current)) return;
    try {
      const raw = id ? storage.current?.getItem(PREFIX + id) : null;
      if (id && !raw)
        throw new Error("초안을 찾을 수 없습니다. 페이지를 새로고침하세요.");
      const next = raw ? readDraft(raw) : newDraft();
      baseline.current = raw || null;
      current.current = next;
      setActive(next);
      setSource(needsSource(next.body));
      setVersion((v) => v + 1);
      setTransfer(null);
      if (!id) persist(next);
      else {
        setError("");
        setStatus("저장된 초안을 열었습니다.");
      }
    } catch (e) {
      setError((e as Error).message);
    }
  }
  async function copy(label: string, text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setStatus(`${label} 복사됨`);
      setTransfer(null);
    } catch {
      setTransfer({ label, text });
      setStatus("아래 텍스트를 길게 눌러 전체 선택 후 복사하세요.");
    }
  }
  function download() {
    if (!active) return;
    const url = URL.createObjectURL(
      new Blob([exportMdx(active)], { type: "text/plain;charset=utf-8" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = filename(active);
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 30_000);
  }
  return (
    <div className="pocket">
      <header className="pocket-header">
        <a href={base}>← 블로그</a>
        <span>POCKET NOTES</span>
        <span className="pocket-badge">이 기기에 보관</span>
      </header>
      <main className="pocket-main">
        <div className="pocket-intro">
          <p className="pocket-eyebrow">떠오른 생각을, 어디서든.</p>
          <h1>주머니 글쓰기</h1>
          <p>스마트폰에서 쓰고, 완성되면 GitHub로 옮기세요.</p>
        </div>
        <PwaControls base={base} />
        <section className="pocket-library" aria-label="내 초안">
          <label>
            내 초안{" "}
            <select
              disabled={!ready}
              value={active?.id || ""}
              onChange={(e) => {
                if (e.target.value) open(e.target.value);
              }}
            >
              <option value="" disabled>
                저장된 글 선택 ({drafts.length})
              </option>
              {drafts.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.title || "제목 없는 글"} · {d.pubDate}
                </option>
              ))}
            </select>
          </label>
          <button
            className="pocket-primary"
            disabled={!ready}
            onClick={() => open()}
          >
            ＋ 새 글
          </button>
        </section>
        <div className="pocket-status" role="status" aria-live="polite">
          {status}
        </div>
        {error && (
          <div className="pocket-error" role="alert">
            {error}
          </div>
        )}
        {active ? (
          <>
            <section
              className="pocket-card pocket-metadata"
              aria-label="글 정보"
            >
              <label>
                제목
                <input
                  value={active.title}
                  placeholder="어떤 이야기를 들려주고 싶나요?"
                  onChange={(e) => change({ title: e.target.value })}
                  maxLength={200}
                />
              </label>
              <details>
                <summary>설명 · 날짜 · 태그 · 공개 설정</summary>
                <div className="pocket-fields">
                  <label>
                    설명
                    <textarea
                      rows={2}
                      value={active.description}
                      onChange={(e) => change({ description: e.target.value })}
                    />
                  </label>
                  <label>
                    작성일
                    <input
                      type="date"
                      value={active.pubDate}
                      onChange={(e) => change({ pubDate: e.target.value })}
                    />
                  </label>
                  <label>
                    태그
                    <input
                      placeholder="React, 일상"
                      value={active.tags}
                      onChange={(e) => change({ tags: e.target.value })}
                    />
                  </label>
                  <label className="pocket-check">
                    <input
                      type="checkbox"
                      checked={active.draft}
                      onChange={(e) => change({ draft: e.target.checked })}
                    />{" "}
                    초안으로 내보내기 (draft: true)
                  </label>
                  <p className="pocket-help">
                    공개할 글은 체크를 해제하세요. 이 설정만으로 게시되지는
                    않습니다.
                  </p>
                </div>
              </details>
            </section>
            <section className="pocket-card pocket-body" aria-label="글 본문">
              <div className="pocket-body-heading">
                <h2>본문</h2>
                <button
                  onClick={() => {
                    if (source && needsSource(active.body)) {
                      setError(
                        "MDX 컴포넌트가 포함된 본문은 원문 편집을 이용하세요.",
                      );
                      return;
                    }
                    setSource(!source);
                    setVersion((v) => v + 1);
                  }}
                >
                  {source ? "서식 편집" : "원문 편집"}
                </button>
              </div>
              {source ? (
                <textarea
                  className="pocket-source"
                  aria-label="MDX 본문"
                  value={active.body}
                  onChange={(e) => change({ body: e.target.value })}
                  spellCheck={false}
                />
              ) : (
                <MDXEditor
                  key={`${active.id}-${version}`}
                  markdown={active.body}
                  contentEditableClassName="pocket-prose"
                  onChange={(body, initial) => {
                    if (!initial) change({ body });
                  }}
                  onError={() => {
                    setSource(true);
                    setError(
                      "이 문법은 원문 편집으로 열었습니다. 작성한 내용은 유지됩니다.",
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
                        json: "JSON",
                        bash: "Bash",
                        python: "Python",
                      },
                    }),
                    toolbarPlugin({
                      toolbarContents: () => (
                        <>
                          <UndoRedo />
                          <BlockTypeSelect />
                          <BoldItalicUnderlineToggles />
                          <ListsToggle />
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
            </section>
            <section
              className="pocket-card pocket-export"
              aria-label="GitHub로 옮기기"
            >
              <h2>완성한 글 옮기기</h2>
              <p>
                GitHub에서 <code>src/content/blog/</code> 아래 파일을 만들고,
                전체 MDX를 붙여넣으세요.
              </p>
              <code className="pocket-filename">{filename(active)}</code>
              {(!active.title.trim() || !active.pubDate) && (
                <p className="pocket-help">
                  게시하기 전 제목과 작성일을 입력하세요.
                </p>
              )}
              <div className="pocket-export-buttons">
                <button onClick={() => void copy("파일명", filename(active))}>
                  파일명 복사
                </button>
                <button onClick={download}>.mdx 다운로드</button>
                <button
                  onClick={() =>
                    setTransfer({ label: "전체 MDX", text: exportMdx(active) })
                  }
                >
                  내보낼 내용 보기
                </button>
              </div>
              {transfer && (
                <label className="pocket-transfer">
                  {transfer.label}
                  <textarea
                    readOnly
                    value={transfer.text}
                    onFocus={(e) => e.target.select()}
                    rows={10}
                  />
                  <small>
                    복사 버튼을 사용할 수 없다면 여기서 직접 선택해 복사하세요.
                  </small>
                </label>
              )}
            </section>
            <div className="pocket-bottom">
              <span>메타데이터 + 본문</span>
              <button
                className="pocket-primary"
                onClick={() => void copy("전체 MDX", exportMdx(active))}
              >
                전체 MDX 복사
              </button>
            </div>
          </>
        ) : (
          <section className="pocket-card pocket-empty">
            <h2>지금 떠오른 이야기가 있나요?</h2>
            <p>새 글을 누르면 이 브라우저에 초안이 만들어집니다.</p>
          </section>
        )}
        <footer className="pocket-help">
          글은 이 기기의 이 브라우저에만 저장됩니다. 브라우저 데이터를 지우면
          사라질 수 있으니, 중요한 글은 복사하거나 다운로드해 보관하세요. 기기
          간 자동 동기화는 지원하지 않습니다. 오프라인 준비를 마치면 인터넷
          없이도 글을 작성할 수 있습니다.
        </footer>
      </main>
    </div>
  );
}
