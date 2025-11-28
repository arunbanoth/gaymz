import { useState, useMemo, useCallback, useEffect } from "react";

const PLACEHOLDER_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='1000' height='400'>
     <rect width='100%' height='100%' fill='#ececec'/>
     <text x='50%' y='50%' font-size='24' text-anchor='middle' fill='#888' dy='.3em'>No thumbnail</text>
   </svg>`
)}`;

export default function GameCard({ game }) {
  const [imgError, setImgError] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);
  const BACKEND = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000";

  const slug = useMemo(() => {
    if (game?.slug) return game.slug;
    return (game?.name || "").toLowerCase().replace(/\s+/g, "-");
  }, [game]);

  // prefer frontend-relative thumbnails (served from public/)
  const thumb = useMemo(() => {
    if (!game?.thumbnail) return null;
    const t = String(game.thumbnail).trim();

    if (/^https?:\/\//i.test(t) || /^data:/i.test(t) || /^blob:/i.test(t)) {
      return t;
    }

    if (t.startsWith("/")) return t;
    return `/${t}`;
  }, [game?.thumbnail]);

  // reset error state whenever thumbnail changes so placeholder logic works
  useEffect(() => {
    setImgError(false);
  }, [thumb]);

  const handleLaunch = useCallback(
    async (ev) => {
      ev?.preventDefault?.();
      if (isLaunching) return;

      const staticGames = [
        "snake",
        "comet-collector",
        "shadow-mirror",
        "tether-twins",
        "blaster-dash",
      ];
      if (staticGames.includes(slug)) {
        // open static game bundled in frontend/public/games/<slug>/index.html
        window.open(`/games/${slug}/index.html`, "_blank", "noopener");
        return;
      }

      setIsLaunching(true);
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 7000);
      try {
        const resp = await fetch(
          `${BACKEND}/run/${encodeURIComponent(game.id)}`,
          { signal: controller.signal }
        );
        clearTimeout(timeout);
        if (!resp.ok) throw new Error(`Backend ${resp.status}`);
        const json = await resp.json().catch(() => null);
        if (json && json.launch_url) {
          window.open(json.launch_url, "_blank", "noopener");
        } else {
          // fallback user feedback
          window.open(`/games/${slug}/index.html`, "_blank", "noopener");
        }
      } catch (err) {
        if (err.name === "AbortError") {
          alert("Launch timed out. Is backend running?");
        } else {
          console.error(err);
          alert("Error launching game. Check backend.");
        }
      } finally {
        clearTimeout(timeout);
        setIsLaunching(false);
      }
    },
    [BACKEND, game?.id, game?.name, isLaunching, slug]
  );

  const onThumbLoad = () => {
    setImgError(false);
  };
  const onThumbError = () => {
    setImgError(true);
  };

  return (
    <button
      type="button"
      onClick={handleLaunch}
      disabled={isLaunching}
      className="game-card group text-left rounded-xl shadow-md p-6 w-[380px] bg-[var(--card-bg)] border border-[var(--card-border)] transition-transform hover:scale-[1.01] focus:outline-none"
      aria-label={`Launch ${game?.name}`}
    >
      <div className="game-card-head mb-3">
        <h3 className="game-title text-lg font-semibold">{game?.name}</h3>
      </div>

      <div className="thumb-wrap mb-4 relative">
        {!imgError && thumb ? (
          <img
            src={thumb}
            alt={`${game?.name} thumbnail`}
            className="thumb-img w-full h-40 object-cover rounded-md"
            onLoad={onThumbLoad}
            onError={onThumbError}
            loading="lazy"
          />
        ) : (
          <img
            src={PLACEHOLDER_SVG}
            alt="placeholder"
            className="thumb-img w-full h-40 object-cover rounded-md"
          />
        )}

        <div className="absolute right-3 bottom-3">
          <div className="rounded-full w-10 h-10 flex items-center justify-center text-white text-lg shadow bg-indigo-600 hover:bg-indigo-700">
            ▶
          </div>
        </div>
      </div>

      <div className="game-desc mb-4 text-sm opacity-90">
        <p>{game?.description}</p>
      </div>

      <div className="game-footer text-xs opacity-70">
        <small>{isLaunching ? "Launching..." : "Click to launch"}</small>
      </div>
    </button>
  );
}
