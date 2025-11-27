import React, { useEffect, useState } from "react";
import GameCard from "../components/GameCard";

// small helper to slugify names (if backend doesn't provide slug)
const slugify = (s) =>
  String(s || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export default function Dashboard() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(localStorage.getItem("g_theme") || "light");

  // backend base (Vite env)
  const BACKEND = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000";

  useEffect(() => {
    // apply theme on mount
    document.documentElement.classList.toggle("light", theme === "light");
    localStorage.setItem("g_theme", theme);
  }, [theme]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await fetch(`${BACKEND}/games`);
        if (!res.ok) throw new Error("Failed to fetch games");
        const json = await res.json();
        if (!mounted) return;
        // ensure each game has slug and thumbnail path if backend returns relative path
        const normalized = (json || []).map((g) => ({
          id: g.id,
          name: g.name,
          slug: g.slug || slugify(g.name),
          description: g.description || "",
          thumbnail: g.thumbnail || `/games/${(g.slug || slugify(g.name))}/thumb.png`,
        }));
        setGames(normalized);
      } catch (err) {
        console.error("games load error", err);
        // fallback: show a few builtin games if backend fails
        if (mounted) {
          setGames([
            { id: 1, name: "Snake", slug: "snake", description: "Classic snake game", thumbnail: "/games/snake/thumb.png" },
            { id: 2, name: "Comet Collector", slug: "comet-collector", description: "Catch falling stars", thumbnail: "/games/comet-collector/thumb.png" },
            { id: 3, name: "Shadow Mirror", slug: "shadow-mirror", description: "Control your mirrored shadow", thumbnail: "/games/shadow-mirror/thumb.png" },
            { id: 4, name: "Tether Twins", slug: "tether-twins", description: "Leader + swinging twin", thumbnail: "/games/tether-twins/thumb.png" },
            { id: 5, name: "Blaster Dash", slug: "blaster-dash", description: "Dash and blast drones", thumbnail: "/games/blaster-dash/thumb.png" },
          ]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [BACKEND]);

  const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  return (
    <main className="dashboard-root" style={{ padding: 28 }}>
      <header className="dash-header" style={{ textAlign: "center", marginBottom: 22 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16 }}>
          {/* centered GAYMZ with soft shadow */}
          <h1 className="site-title" style={{
            margin: 0,
            fontSize: 36,
            letterSpacing: 1,
            fontWeight: 800,
            background: "linear-gradient(90deg,#0f172a,#111827)",
            color: "transparent",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            textShadow: "0 6px 18px rgba(99,102,241,0.08)"
          }}>GAYMZ</h1>
        </div>

        <p style={{ marginTop: 8, marginBottom: 12, color: "var(--muted, #6b7280)" }}>
          A tiny launcher for creative mini-games
        </p>

        {/* small centered progress bar */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
          <div style={{ height: 6, width: 160, borderRadius: 999, background: "linear-gradient(90deg,#ec4899,#6366f1)", boxShadow: "0 6px 20px rgba(99,102,241,0.08)" }} />
        </div>

        {/* theme toggle (centered, floating) */}
        <div style={{ display: "flex", justifyContent: "center", marginTop: 8 }}>
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title="Toggle theme"
            style={{
              fontSize: 22,
              padding: 10,
              borderRadius: 999,
              border: "none",
              boxShadow: "0 6px 20px rgba(16,24,40,.06)",
              cursor: "pointer",
              background: "transparent"
            }}
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>
        </div>
      </header>

      <section>
        {loading ? (
          <div style={{ textAlign: "center", padding: 28, color: "var(--muted,#6b7280)" }}>Loading games...</div>
        ) : (
          <div className="games-grid">
            {games.map((g) => (
              <GameCard key={g.id} game={g} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
