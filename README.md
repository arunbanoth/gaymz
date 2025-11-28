# GAYMZ — Web Arcade Project

GAYMZ is a browser-based arcade collection built with a React (Vite) frontend and a FastAPI backend.  
Each game runs fully in the browser using JavaScript and Canvas. The project is designed to be easily extendable so new games can be added with minimal effort.

---

## Live Demo

Frontend:  
https://gaymz.vercel.app/

Backend API:  
https://gaymz-backend.onrender.com

Test endpoint:  
https://gaymz-backend.onrender.com/games

---

## Overview

The GAYMZ project contains multiple standalone web games displayed inside a modern launcher UI.  
Each game includes its own assets, HTML file, and thumbnail, stored inside the `public/games/` folder.

Games Included:
- Snake  
- Comet Collector  
- Shadow Mirror  
- Tether Twins  
- Blaster Dash  

---

## Features

- Multiple independent browser games  
- React + Vite based frontend  
- FastAPI backend returning game metadata  
- Thumbnail system for each game  
- Clean and structured UI layout  
- Fully deployed on Vercel (frontend) and Render (backend)  
- Easy to add new games  
- Responsive design  

---

## Project Structure

```
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
│   │       ├── comet-collector/
│   │       ├── shadow-mirror/
│   │       ├── tether-twins/
│   │       └── blaster-dash/
│   │
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## Backend Development (FastAPI)

Start backend locally:

```
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Backend will run at:

```
http://127.0.0.1:8000
```

---

## Frontend Development (React + Vite)

Start frontend locally:

```
cd frontend
npm install
npm run dev
```

Application will run at:

```
http://localhost:5173
```

Build for production:

```
npm run build
```

---

## Deployment

### Backend (Render)
- Environment: Python  
- Root Directory: backend  
- Build Command:  
  `pip install -r requirements.txt`  
- Start Command:  
  `uvicorn main:app --host 0.0.0.0 --port $PORT`  

### Frontend (Vercel)
- Root Directory: frontend  
- Build Command: `npm run build`  
- Output Directory: `dist`  

Add environment variable:

```
VITE_BACKEND_URL = https://gaymz-backend.onrender.com
```

---

## Adding a New Game

1. Create a folder under:

```
frontend/public/games/<game-name>/
```

2. Add:
- index.html
- JavaScript game logic
- thumb.png (thumbnail image)

3. Update backend list in:

```
backend/main.py
```

Example:

```
{
  "id": 6,
  "name": "New Game",
  "slug": "new-game",
  "description": "Description here",
  "thumbnail": "/games/new-game/thumb.png"
}
and
Update the /run/{game_id} mapping so the backend can return the correct launch URL (used as a fallback by the frontend):

@app.get("/run/{game_id}")
def run_game(game_id: int):
    game_slugs = {
        1: "snake",
        2: "comet-collector",
        3: "shadow-mirror",
        4: "tether-twins",
        5: "blaster-dash",
        6: ""  # new game
    }

```

4. Commit and push to GitHub.  
Render and Vercel will auto redeploy.

---

## Future Improvements

- Add high score system  
- Add authentication support  
- Save progress per game  
- Add sound and settings options  
- Add developer tools for creating games faster  

---

## License

This project is open for learning and personal portfolio use.

