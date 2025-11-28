from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path

app = FastAPI(title="GAYMZ Backend")

# ----------------------------------------------------------------------
# CORS — allow your frontend + localhost
# ----------------------------------------------------------------------
FRONTEND_URLS = [
    "https://gaymz.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=[*FRONTEND_URLS, "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------------------------------------------------------------
# Games list (STATIC for now)
# ----------------------------------------------------------------------
@app.get("/games")
def list_games():
    return [
        {
            "id": 1,
            "name": "Snake",
            "slug": "snake",
            "description": "Classic snake game",
            "thumbnail": "/games/snake/thumb.png",
        },
        {
            "id": 2,
            "name": "Comet Collector",
            "slug": "comet-collector",
            "description": "Catch falling stars, avoid comets.",
            "thumbnail": "/games/comet-collector/thumb.png",
        },
        {
            "id": 3,
            "name": "Shadow Mirror",
            "slug": "shadow-mirror",
            "description": "Control yourself and your shadow.",
            "thumbnail": "/games/shadow-mirror/thumb.png",
        },
        {
            "id": 4,
            "name": "Tether Twins",
            "slug": "tether-twins",
            "description": "Control the leader; twin swings on tether.",
            "thumbnail": "/games/tether-twins/thumb.png",
        },
        {
            "id": 5,
            "name": "Blaster Dash",
            "slug": "blaster-dash",
            "description": "Quick blaster mini-game.",
            "thumbnail": "/games/blaster-dash/thumb.png",
        },
        {
            "id": 6,
            "name": "Orbit Guard",
            "slug": "orbit-guard",
            "description": "Orbit, collect, survive.",
            "thumbnail": "/games/orbit-guard/thumb.png",
        },
        {
            "id": 7,
            "name": "River Reel",
            "slug": "river-reel",
            "description": "Cast, catch, avoid junk.",
            "thumbnail": "/games/river-reel/thumb.png",
        },
    ]

# ----------------------------------------------------------------------
# NEW — Required by frontend (fixes: "Error launching game")
# This returns a static URL for the game inside /public/games/
# ----------------------------------------------------------------------
@app.get("/run/{game_id}")
def run_game(game_id: int):
    game_slugs = {
        1: "snake",
        2: "comet-collector",
        3: "shadow-mirror",
        4: "tether-twins",
        5: "blaster-dash",
        6: "orbit-guard",
        7: "river-reel", 
    }

    if game_id not in game_slugs:
        return {"error": "Invalid game ID"}

    slug = game_slugs[game_id]
    return {"launch_url": f"/games/{slug}/index.html"}
