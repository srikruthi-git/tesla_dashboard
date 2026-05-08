# Tesla Energy Dashboard

Tesla Energy Dashboard is a production-grade Angular + Flask application that models an enterprise operations control center. The frontend is built with standalone Angular components, signal-driven state, and a scalable UI system. The backend provides a REST API with SQLite persistence for jobs management.

## Highlights

- Modern SaaS-style UI with dark enterprise theming and responsive layout
- Standalone Angular routing with lazy-loaded pages
- Jobs management module with search, filters, sorting, pagination, and CRUD
- Flask REST API with SQLite schema + seed data
- Clean service architecture with typed API models and mapping

## Tech Stack

- Angular 21 (standalone components, signals, OnPush)
- RxJS and HttpClient
- Flask 3 + Flask-CORS
- SQLite

## Architecture

- `src/app/core`: API services and UI utilities
- `src/app/layout`: shell layout, navbar, and sidebar
- `src/app/pages`: route-level feature screens
- `src/app/shared/ui`: reusable UI primitives (cards, table, toasts)
- `backend/app`: Flask app factory, blueprints, DB helpers, schema

## API Endpoints

- `GET /jobs`
- `POST /jobs`
- `PUT /jobs/<id>`
- `DELETE /jobs/<id>`

## Getting Started

### Frontend

```bash
npm install
npm start
```

Open http://localhost:4200

### Backend

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r backend/requirements.txt
python backend/run.py
```

API runs on http://localhost:5000

---

# 📊 Pages

* Dashboard
* Jobs Management
* Analytics
* Settings

---

# 🎨 Design System

The application follows a Tesla-inspired enterprise design language featuring:

* Dark gradient backgrounds
* Glassmorphism UI cards
* Responsive layouts
* Enterprise dashboard patterns
* Minimal modern styling

---

# 🔒 Authentication

Authentication scaffolding was initially implemented for future JWT integration. The current version operates as a frontend-only public dashboard for demonstration and development purposes.

---

# 📈 Future Improvements

* JWT Authentication
* Real-time WebSocket updates
* Charts integration
* Role-based access control
* PostgreSQL database
* Docker deployment
* CI/CD pipelines
* Advanced analytics
* User management system

---

# 🧑‍💻 Development

Run Angular development server:

```bash id="9ojmkh"
ng serve
```

Build production frontend:

```bash id="f0g7u3"
ng build
```

---

# 📄 License

This project is intended for educational, portfolio, and enterprise dashboard development purposes.
=======
Open `http://localhost:4200`.

### Backend

```bash
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r backend/requirements.txt
python backend/run.py
```

The API runs at `http://localhost:5000`.

## API Endpoints

- `GET /jobs`
- `POST /jobs`
- `PUT /jobs/<id>`
- `DELETE /jobs/<id>`

## Scripts

- `npm start` — run the Angular dev server
- `npm test` — run unit tests
- `npm run build` — create production build

## Notes

- The Jobs page reads from the Flask API by default. Ensure the backend is running.
- Auth is a frontend-only scaffold designed for easy JWT integration.
>>>>>>> b5ade62 (Initial commit)
