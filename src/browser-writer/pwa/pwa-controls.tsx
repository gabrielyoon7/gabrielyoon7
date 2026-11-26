import { useEffect, useState } from "react";
import "./pwa.css";

type InstallPrompt = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};
export default function PwaControls({ base }: { base: string }) {
  const [install, setInstall] = useState<InstallPrompt | null>(null);
  const [installed, setInstalled] = useState(false);
  const [offline, setOffline] = useState(false);
  const [ready, setReady] = useState(false);
  const [update, setUpdate] = useState(false);
  const [message, setMessage] = useState("오프라인 사용 준비 중…");
  useEffect(() => {
    let alive = true;
    const standalone = window.matchMedia("(display-mode: standalone)");
    const checkInstalled = () =>
      setInstalled(
        standalone.matches ||
          Boolean(
            (navigator as Navigator & { standalone?: boolean }).standalone,
          ),
      );
    const network = () => setOffline(!navigator.onLine);
    const prompt = (event: Event) => {
      event.preventDefault();
      setInstall(event as InstallPrompt);
    };
    const didInstall = () => {
      setInstalled(true);
      setInstall(null);
    };
    checkInstalled();
    network();
    standalone.addEventListener("change", checkInstalled);
    window.addEventListener("online", network);
    window.addEventListener("offline", network);
    window.addEventListener("beforeinstallprompt", prompt);
    window.addEventListener("appinstalled", didInstall);
    if (!import.meta.env.PROD)
      setMessage("오프라인 실행은 배포된 페이지에서 준비할 수 있습니다.");
    else if (!("serviceWorker" in navigator) || !window.isSecureContext)
      setMessage(
        "이 브라우저에서는 오프라인 실행을 준비할 수 없습니다. HTTPS 주소에서 열어 주세요.",
      );
    else {
      const scope = `${base.replace(/\/$/, "")}/write/`;
      void navigator.serviceWorker
        .register(`${scope}sw.js`, { scope, updateViaCache: "none" })
        .then((registration) => {
          if (!alive) return;
          const showReady = () => {
            if (alive) {
              setReady(true);
              setMessage("오프라인 사용 준비 완료");
            }
          };
          const track = () => {
            const worker = registration.installing;
            if (!worker) return;
            worker.addEventListener("statechange", () => {
              if (!alive) return;
              if (worker.state === "installed") {
                if (registration.active) setUpdate(true);
                else showReady();
              }
              if (worker.state === "redundant" && !registration.active)
                setMessage(
                  "오프라인 준비에 실패했습니다. 인터넷 연결 후 다시 열어 주세요.",
                );
            });
          };
          if (registration.active) showReady();
          if (registration.waiting) setUpdate(true);
          track();
          registration.addEventListener("updatefound", track);
          // No skipWaiting: existing editing windows retain their version until closed.
          void registration.update().catch(() => {});
        })
        .catch(() => {
          if (alive)
            setMessage(
              "오프라인 준비에 실패했습니다. 인터넷 연결 후 다시 열어 주세요.",
            );
        });
    }
    return () => {
      alive = false;
      standalone.removeEventListener("change", checkInstalled);
      window.removeEventListener("online", network);
      window.removeEventListener("offline", network);
      window.removeEventListener("beforeinstallprompt", prompt);
      window.removeEventListener("appinstalled", didInstall);
    };
  }, [base]);
  async function installApp() {
    if (!install) return;
    try {
      await install.prompt();
      const result = await install.userChoice;
      setInstall(null);
      if (result.outcome === "accepted") setInstalled(true);
    } catch {
      setInstall(null);
    }
  }
  return (
    <section className="pocket-pwa" aria-label="앱 설치와 오프라인 사용">
      <div className="pocket-pwa-row">
        <span role="status">
          {offline
            ? ready
              ? "오프라인 · 작성과 기기 저장이 가능합니다."
              : "오프라인 · 다시 실행하려면 먼저 온라인에서 준비해 주세요."
            : message}
        </span>
        {install && !installed && (
          <button onClick={() => void installApp()}>앱 설치</button>
        )}
        {installed && <small>앱으로 실행</small>}
      </div>
      {update && (
        <p>
          새 버전이 준비되었습니다. 저장 상태를 확인하고 글쓰기 창을 모두 닫았다
          다시 열면 적용됩니다.
        </p>
      )}
      {!installed && (
        <details>
          <summary>홈 화면에 추가하기</summary>
          <p>
            iPhone·iPad: Safari의 공유 메뉴에서 ‘홈 화면에 추가’를 선택하세요.
            <br />
            Android: 브라우저 메뉴의 ‘앱 설치’ 또는 ‘홈 화면에 추가’를
            선택하세요.
          </p>
          <p>
            ‘오프라인 사용 준비 완료’ 표시를 확인한 후에는 인터넷 없이도 이 앱을
            다시 열 수 있습니다. 외부 이미지와 GitHub 접속은 인터넷 연결이
            필요합니다.
          </p>
        </details>
      )}
    </section>
  );
}
