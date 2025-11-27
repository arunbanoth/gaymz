from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path

app = FastAPI(title="GAYMZ Backend")

# Update this to your frontend URL after deployment
FRONTEND_URLS = [
    "https://gaymz.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URLS, "http://localhost:5173"],  # loosen during dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# simple games list endpoint
@app.get("/games")
def list_games():
    # later you can read meta.json from backend/games or GitHub
    return [
        {
            "id": 1,
            "name": "Snake",
            "slug": "snake",
            "description": "Classic snake game",
            "thumbnail": "public/games/snake/thumb.png",
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
    ]
