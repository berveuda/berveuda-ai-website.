import { useEffect, useRef, useState } from "react";

interface Turnstile {
  render: (node: HTMLElement, options: Record<string, unknown>) => string;
  remove: (id: string) => void;
}
declare global {
  interface Window {
    turnstile?: Turnstile;
  }
}
let loading: Promise<Turnstile> | undefined;
function loadWidget() {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (!loading)
    loading = new Promise<Turnstile>((resolve, reject) => {
      const script = document.createElement("script");
      const fail = () => {
        window.clearTimeout(timeout);
        script.remove();
        loading = undefined;
        reject(new Error("verification unavailable"));
      };
      const timeout = window.setTimeout(fail, 15000);
      script.src =
        "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.onload = () => {
        if (!window.turnstile) {
          fail();
          return;
        }
        window.clearTimeout(timeout);
        resolve(window.turnstile);
      };
      script.onerror = fail;
      document.head.append(script);
    });
  return loading;
}
export function Verification({
  onToken,
  attempt,
}: {
  onToken: (value: string) => void;
  attempt: number;
}) {
  const sitekey = import.meta.env.VITE_TURNSTILE_SITE_KEY;
  const host = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "failed">(
    sitekey ? "loading" : "failed",
  );
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    if (!sitekey) return;
    let active = true;
    let id: string | undefined;
    onToken("");
    setStatus("loading");
    const failed = () => {
      if (active) {
        onToken("");
        setStatus("failed");
      }
    };
    loadWidget()
      .then((api) => {
        if (!active || !host.current) return;
        id = api.render(host.current, {
          sitekey,
          action: "assessment",
          size: "flexible",
          theme: "light",
          callback: (t: string) => {
            if (active) {
              onToken(t);
              setStatus("ready");
            }
          },
          "expired-callback": () => {
            if (active) {
              onToken("");
              setStatus("loading");
            }
          },
          "error-callback": failed,
          "timeout-callback": failed,
          "refresh-expired": "auto",
        });
      })
      .catch(failed);
    return () => {
      active = false;
      if (id !== undefined) window.turnstile?.remove(id);
    };
  }, [attempt, retry, sitekey, onToken]);
  return (
    <div className="verification">
      <div ref={host} />
      <div role="status">
        {status === "loading" && "Waiting for verification…"}
        {status === "failed" &&
          (sitekey ? (
            <span>
              Verification could not load.{" "}
              <button
                className="text-link"
                type="button"
                onClick={() => setRetry((i) => i + 1)}
              >
                Retry verification
              </button>
            </span>
          ) : (
            "The inquiry service is unavailable. Please try again later."
          ))}
      </div>
    </div>
  );
}
