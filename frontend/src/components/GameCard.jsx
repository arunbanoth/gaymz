import { useState, useMemo, useCallback } from "react";

const PLACEHOLDER_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='1000' height='400'>
     <rect width='100%' height='100%' fill='#ececec'/>
     <text x='50%' y='50%' font-size='24' text-anchor='middle' fill='#888' dy='.3em'>No thumbnail</text>
   </svg>`
)}`;

export default function GameCard({ game }) {
  const [imgError, setImgError] = useState(false);
  const [loadingThumb, setLoadingThumb] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);
  const BACKEND = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000";

  const slug = useMemo(() => {
    if (game?.slug) return game.slug;
    return (game?.name || "").toLowerCase().replace(/\s+/g, "-");
  }, [game]);

  // Simple thumbnail builder — prefer frontend public files (Vercel)
const thumb = useMemo(() => {
  if (!game?.thumbnail) return null;
  const t = String(game.thumbnail).trim();

  // If already absolute (http(s), data:, blob:) return as-is
  if (/^https?:\/\//i.test(t) || /^data:/i.test(t) || /^blob:/i.test(t)) {
    return t;
  }

  // If thumbnail looks like "/games/slug/thumb.png" or "games/slug/thumb.png"
  // use it as a frontend-relative path so Vercel serves it:
  if (t.startsWith("/")) return t;    // -> "/games/snake/thumb.png"
  return `/${t}`;                     // -> "games/snake/thumb.png" -> "/games/snake/thumb.png"
}, [game?.thumbnail]);

  const handleLaunch = useCallback(
    async (ev) => {
      ev?.preventDefault?.();
      if (isLaunching) return;
      // if static web game exists in public/games, open directly in new tab
      const staticGames = ["snake","comet-collector","shadow-mirror","tether-twins","blaster-dash"];
      if (staticGames.includes(slug)) {
        window.open(`/games/${slug}/index.html`, "_blank", "noopener");
        return;
      }

      // fallback: call backend /run/:id
      setIsLaunching(true);
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 7000);
      try {
        const resp = await fetch(`${BACKEND}/run/${encodeURIComponent(game.id)}`, { signal: controller.signal });
        clearTimeout(timeout);
        if (!resp.ok) throw new Error(`Backend ${resp.status}`);
        const json = await resp.json().catch(() => null);
        if (json && json.launch_url) window.open(json.launch_url, "_blank", "noopener");
        else alert(`started: ${game.name}`);
      } catch (err) {
        if (err.name === "AbortError") alert("Launch timed out. Is backend running?");
        else { console.error(err); alert("Error launching game. Check backend."); }
      } finally {
        clearTimeout(timeout);
        setIsLaunching(false);
      }
    },
    [BACKEND, game?.id, game?.name, isLaunching, slug]
  );

  const onThumbLoad = () => { setLoadingThumb(false); setImgError(false); };
  const onThumbStart = () => { setLoadingThumb(true); setImgError(false); };
  const onThumbError = () => { setLoadingThumb(false); setImgError(true); };

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
        {loadingThumb && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <svg className="w-8 h-8 animate-spin" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
          </div>
        )}

        {!imgError && thumb ? (
          <img
            src={thumb}
            alt={`${game?.name} thumbnail`}
            className="thumb-img w-full h-40 object-cover rounded-md"
            onLoad={onThumbLoad}
            onError={onThumbError}
            onMouseDown={onThumbStart}
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
          <div className={`rounded-full w-10 h-10 flex items-center justify-center text-white text-lg shadow ${isLaunching ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"}`}>
            {isLaunching ? "⏳" : "▶️"}
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
