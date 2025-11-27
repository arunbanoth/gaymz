GAYMZ — Web Arcade Project

GAYMZ is a browser-based mini-arcade collection built using a React (Vite) frontend and a FastAPI backend.
Each game is lightweight, loads instantly in the browser, and is served as static files through Vercel.

The project is designed to be extendable: new games can be added simply by placing them in the public/games/ directory and updating the backend API.

Live Demo

Frontend:
https://gaymz.vercel.app/

Backend API:
https://gaymz-backend.onrender.com

Test endpoint:
https://gaymz-backend.onrender.com/games

Games Included

Snake

Comet Collector

Shadow Mirror

Tether Twins

Blaster Dash

All games run inside the browser using JavaScript and Canvas.

Features

Multiple standalone games inside a single launcher

Responsive grid layout

Clean card-based UI

Thumbnail support for each game

Light/Dark mode toggle

Modular structure for adding new games

FastAPI backend serving game metadata

Vercel and Render deployed

Fast loading with Vite build

Project Structure
gaymz/
│
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   ├── Dockerfile (optional)
│   └── ...
│
├── frontend/
│   ├── public/
│   │   └── games/
│   │       ├── snake/
│   │       │   ├── index.html
│   │       │   └── thumb.png
│   │       ├── comet-collector/
│   │       ├── tether-twins/
│   │       ├── shadow-mirror/
│   │       └── blaster-dash/
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── GameCard.jsx
│   │   │   └── ThemeToggle.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   └── About.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md

Backend (FastAPI)

The backend serves a simple API with the list of games.

Example response from /games:

[
  {
    "id": 1,
    "name": "Snake",
    "slug": "snake",
    "description": "Classic snake game",
    "thumbnail": "/games/snake/thumb.png"
  },
  ...
]


Local development:

cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

Frontend (React + Vite)

Local development:

cd frontend
npm install
npm run dev


Build:

npm run build


Vercel deploy uses:

Root Directory: frontend

Build Command: npm run build

Output Directory: dist

Deployment
Backend (Render)

Configuration:

Environment: Python

Root Directory: backend

Build Command:
pip install -r requirements.txt

Start Command:
uvicorn main:app --host 0.0.0.0 --port $PORT

Frontend (Vercel)

Configuration:

Root Directory: frontend

Build Command: npm run build

Output Directory: dist

Environment Variable:

VITE_BACKEND_URL = https://gaymz-backend.onrender.com

Adding a New Game

Create a new folder under frontend/public/games/<game-name>/.

Add index.html, game JavaScript files, and a thumb.png.

Update backend list inside backend/main.py:

{
  "id": 6,
  "name": "New Game",
  "slug": "new-game",
  "description": "Short description",
  "thumbnail": "/games/new-game/thumb.png"
}


Push to GitHub.
Render and Vercel will auto-deploy.

Future Work

High score system

Sound settings per game

User accounts

Cloud storage for game progress

More creative games

License

Open source for educational and portfolio purposes.
