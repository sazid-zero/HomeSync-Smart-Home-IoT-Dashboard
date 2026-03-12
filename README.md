<div align="center">

# 🏠 HomeSync — Smart Home IoT Dashboard

**A full-stack "Digital Twin" for your smart home — monitor, control, and analyze every device in real time.**

[![React 19](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js_20-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL_16-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socketdotio&logoColor=white)](https://socket.io/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite_7-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

</div>

---

## 💡 What is HomeSync?

Ever wished you could manage every light, thermostat, and sensor in your home from one beautiful dashboard — and watch it all update in real time? That's HomeSync.

HomeSync is a **full-stack IoT dashboard** that acts as a digital twin of a smart home. It doesn't need real hardware — a built-in **simulation engine** generates realistic device behavior, power consumption, and environmental data (temperature, humidity, CO₂, air quality) so you can experience the full system as if you were managing a real smart home.

Under the hood, it's a production-grade system: a **React 19** frontend talks to a **Node.js/Express** REST API, with **PostgreSQL** for persistence and **Socket.io** for instant bi-directional updates across every connected client. The whole thing runs in **Docker** with one command.

> [!NOTE]
> No physical IoT hardware required. The built-in simulator generates realistic smart home data so you can explore every feature right away.

---

## 📸 Preview

<div align="center">

![HomeSync Dashboard](./client/screenshots/dashboard.png)

</div>

---

## ✨ Features at a Glance

| Feature | What It Does |
|---|---|
| **Real-Time Device Control** | Toggle lights, adjust thermostats and sliders — changes reflect instantly across all connected tabs/clients via WebSockets |
| **IoT Hardware Simulator** | Generates realistic power consumption, temperature swings, CO₂ levels, and air quality data without any physical sensors |
| **Energy Analytics** | Track power consumption trends over 7, 14, or 30 days with interactive Recharts graphs showing total, average, and peak usage |
| **Environmental Monitoring** | Live indoor conditions (temperature, humidity, CO₂, pollutants) with automatic alerts when thresholds are breached |
| **Room Management** | Create rooms, assign devices, and control everything from a spatial layout that mirrors your actual home |
| **Smart Notifications** | Real-time alerts pushed via Socket.io when temperature spikes or air quality drops — no polling, no refresh |
| **Auth & User Profiles** | Secure JWT-based login/register, persistent sessions, avatar uploads, theme preferences, and password management |
| **Dark / Light Mode** | Full theme system with glassmorphism effects and smooth transitions |
| **Animated Landing Page** | Scroll-triggered Framer Motion animations with buttery-smooth Lenis scrolling |
| **Responsive Design** | Mobile-first layout with a collapsible sidebar and dedicated mobile navigation |

---

## 🏗️ System Architecture

Here's a bird's-eye view of how all the pieces fit together:

```mermaid
graph TB
    subgraph Client["🖥️ Frontend — React 19 + Vite 7"]
        UI["UI Components<br/>(Tailwind + Framer Motion)"]
        Router["React Router v7<br/>Protected Routes"]
        AuthCtx["AuthContext<br/>(JWT in localStorage)"]
        ThemeCtx["ThemeContext<br/>(Dark / Light)"]
        Hooks["Custom Hooks<br/>(useDevices, useRooms, useSocket)"]
        AxiosAPI["Axios API Client<br/>(JWT Interceptor)"]
        SocketClient["Socket.io Client"]
    end

    subgraph Server["⚙️ Backend — Node.js + Express"]
        API["REST API<br/>(Express Routes)"]
        AuthMW["Auth Middleware<br/>(JWT Verify)"]
        ValidMW["Validation<br/>(Zod Schemas)"]
        Controllers["Controllers"]
        Models["Models<br/>(Raw SQL Queries)"]
        SocketServer["Socket.io Server<br/>(User Rooms)"]
        Simulator["IoT Simulator<br/>(15-30s interval)"]
    end

    subgraph DB["🗄️ PostgreSQL 16"]
        Users[(users)]
        Rooms[(rooms)]
        Devices[(devices)]
        Sensors[(sensor_readings)]
        Notifs[(notifications)]
    end

    UI --> Router --> Hooks
    Hooks --> AxiosAPI
    Hooks --> SocketClient
    AxiosAPI -- "HTTP + JWT" --> API
    SocketClient -- "WebSocket" --> SocketServer
    API --> AuthMW --> ValidMW --> Controllers --> Models
    Models --> DB
    Simulator -- "generates data" --> Models
    Simulator -- "broadcasts" --> SocketServer
    SocketServer -- "real-time events" --> SocketClient
```

---

## 🔄 How Real-Time Updates Work

This is the heart of HomeSync — the flow that makes everything feel _alive_:

```mermaid
sequenceDiagram
    participant User as 👤 User (Browser)
    participant Client as React Frontend
    participant API as Express API
    participant DB as PostgreSQL
    participant Sim as IoT Simulator
    participant WS as Socket.io Server
    participant Others as 👥 Other Clients

    Note over Sim: Runs every 15-30 seconds

    rect rgb(40, 40, 60)
        Note right of Sim: Simulated Sensor Cycle
        Sim->>DB: Write power readings per device
        Sim->>DB: Write environment data (temp, humidity, CO₂)
        Sim->>DB: Create alert notifications (if thresholds breached)
        Sim->>WS: Emit "power_update" + "environment:update"
        WS->>Client: Push to user's private room
        WS->>Others: Push to other connected tabs
        Client->>User: Dashboard updates in real time
    end

    rect rgb(30, 60, 40)
        Note right of User: Manual Device Control
        User->>Client: Toggle light switch ON
        Client->>API: PATCH /devices/:id/toggle
        API->>DB: Update device state
        API->>WS: Broadcast "device:toggle"
        WS->>Client: Confirm state change
        WS->>Others: Sync across all tabs
    end
```

---

## 🔐 Authentication Flow

Every request is secured end-to-end:

```mermaid
flowchart LR
    A["📝 Register / Login"] -->|POST /auth/*| B["Express API"]
    B -->|Validate with Zod| C{Credentials OK?}
    C -->|No| D["❌ 401 Error"]
    C -->|Yes| E["Hash password (bcryptjs)<br/>or compare hash"]
    E --> F["Generate JWT<br/>(7-day expiry)"]
    F --> G["Return token + user"]
    G --> H["Store in localStorage"]
    H --> I["Axios interceptor attaches<br/>token to every request"]
    I --> J["Auth middleware verifies<br/>JWT on protected routes"]
    J -->|Invalid/Expired| K["🔒 401 → Logout & redirect"]
    J -->|Valid| L["✅ Access granted"]

    style A fill:#4a90d9,color:#fff
    style L fill:#2d8a4e,color:#fff
    style D fill:#c0392b,color:#fff
    style K fill:#c0392b,color:#fff
```

---

## 🗄️ Database Schema

```mermaid
erDiagram
    USERS {
        int id PK
        varchar name
        varchar email UK
        varchar password_hash
        varchar avatar_url
        varchar theme_preference
        timestamp created_at
    }

    ROOMS {
        int id PK
        int user_id FK
        varchar name
        varchar icon
        timestamp created_at
    }

    DEVICES {
        int id PK
        int room_id FK
        varchar name
        varchar type
        varchar control_type "toggle | slider"
        boolean is_on
        int value "0-100 for sliders"
        float power_consumption
        varchar icon_name
        timestamp created_at
    }

    SENSOR_READINGS {
        int id PK
        int device_id FK
        varchar reading_type "power | temp | humidity | co2 | pollutant"
        float value
        varchar unit
        timestamp recorded_at
    }

    NOTIFICATIONS {
        int id PK
        int user_id FK
        varchar title
        text message
        varchar type "info | warning | critical"
        boolean is_read
        timestamp created_at
    }

    USERS ||--o{ ROOMS : "owns"
    USERS ||--o{ NOTIFICATIONS : "receives"
    ROOMS ||--o{ DEVICES : "contains"
    DEVICES ||--o{ SENSOR_READINGS : "generates"
```

---

## 🛠️ Tech Stack

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| React | 19.1 | Component-driven UI |
| TypeScript | 5.8 | Type safety across the codebase |
| Vite | 7.0 | Lightning-fast dev server + bundler |
| Tailwind CSS | 4.1 | Utility-first styling + dark mode |
| React Router | 7.13 | Client-side routing + protected routes |
| Socket.io Client | 4.8 | Real-time WebSocket communication |
| Framer Motion | 12.35 | Scroll-triggered animations |
| Recharts | 3.0 | Interactive energy analytics charts |
| Axios | 1.13 | HTTP client with JWT interceptor |
| Headless UI | 2.2 | Accessible dropdown menus + modals |
| Lenis | 1.3 | Smooth scroll behavior on landing page |
| date-fns | 4.1 | Lightweight date formatting |

### Backend

| Technology | Version | Purpose |
|---|---|---|
| Node.js | 20 (Alpine) | JavaScript runtime |
| Express | 4.21 | REST API framework |
| PostgreSQL | 16 | Relational database |
| Socket.io | 4.8 | WebSocket server for real-time events |
| Zod | 3.24 | Request validation schemas |
| bcryptjs | 2.4 | Password hashing (10 salt rounds) |
| JSON Web Token | 9.0 | Stateless authentication |
| pg | 8.13 | PostgreSQL client (raw SQL) |

### DevOps

| Technology | Purpose |
|---|---|
| Docker + Docker Compose | One-command containerized deployment |
| Nginx | Production-grade static file serving with SPA fallback |
| Netlify | Frontend hosting (pre-configured) |
| Render | Backend hosting (pre-configured with `render.yaml`) |

---

## ⚡ IoT Simulator — How It Works

Since HomeSync doesn't need physical sensors, a **Simulation Engine** runs on the server and produces data that closely mimics real IoT devices:

```mermaid
flowchart TD
    Start["⏱️ Simulator Tick<br/>(every 15-30 seconds)"] --> FetchUsers["Fetch all users"]
    FetchUsers --> ForEach["For each user..."]

    ForEach --> EnvData["Generate environment data"]
    EnvData --> Temp["🌡️ Temperature: 20-26°C"]
    EnvData --> Humid["💧 Humidity: 40-60%"]
    EnvData --> CO2["🫁 CO₂: 400-1000 ppm"]
    EnvData --> AQ["🌬️ Air Quality: 10-80 AQN"]

    ForEach --> DeviceData["For each ON device..."]
    DeviceData --> Power{"Device Type?"}
    Power -->|AC / Heater| P1["⚡ 2.0-2.5 kW"]
    Power -->|Light| P2["💡 0.06 kW × brightness%"]
    Power -->|TV| P3["📺 0.15 kW"]
    Power -->|Other| P4["🔌 0.5 kW"]

    P1 & P2 & P3 & P4 --> Noise["Add ±10% random noise"]
    Noise --> WriteSensor["Write to sensor_readings table"]
    Temp & Humid & CO2 & AQ --> WriteSensor

    WriteSensor --> CheckThresholds{"Thresholds breached?"}
    CheckThresholds -->|Temp > 25.5°C| AlertTemp["🔴 High Temperature Alert"]
    CheckThresholds -->|CO₂ > 900 ppm| AlertCO2["🔴 Poor Air Quality Alert"]
    CheckThresholds -->|All OK| NoAlert["✅ No alerts"]

    AlertTemp & AlertCO2 --> WriteNotif["Write to notifications table"]
    WriteNotif --> Broadcast["📡 Broadcast via Socket.io"]
    NoAlert --> Broadcast
    Broadcast --> Done["✅ Cycle complete — wait for next tick"]
```

**Power consumption by device type:**

| Device | Base Consumption | Notes |
|---|---|---|
| AC / Heater | 2.0 – 2.5 kW | Highest draw |
| Television | 0.15 kW | Fixed consumption |
| Light / Lamp | 0.06 kW | Scales with brightness slider (0-100%) |
| Other Devices | 0.5 kW | Default fallback |

Each reading gets ±10% random variation to simulate real-world fluctuation.

---

## 📡 API Reference

All API routes are prefixed with `/api`. Protected routes require a `Bearer` token in the `Authorization` header.

### Authentication (Public)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/auth/register` | Create account + auto-seed default rooms & devices |
| `POST` | `/auth/login` | Authenticate and receive JWT |
| `GET` | `/auth/me` | Validate token & get current user 🔒 |

### Devices 🔒

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/devices` | Get all devices for current user |
| `GET` | `/devices/room/:roomId` | Get devices in a specific room |
| `GET` | `/devices/:id` | Get single device details |
| `POST` | `/devices` | Create a new device |
| `PATCH` | `/devices/:id/toggle` | Toggle device on/off |
| `PATCH` | `/devices/:id/value` | Update slider value (0-100) |
| `DELETE` | `/devices/:id` | Remove a device |

### Rooms 🔒

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/rooms` | List all rooms |
| `POST` | `/rooms` | Create a new room |
| `DELETE` | `/rooms/:id` | Delete room and its devices |

### Sensors & Analytics 🔒

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/sensors/readings` | Historical sensor data |
| `GET` | `/sensors/analytics` | Energy trends (7/14/30 days) — total, avg, peak |
| `GET` | `/sensors/air-quality` | Latest air quality readings |

### Notifications 🔒

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/notifications` | All notifications for user |
| `PATCH` | `/notifications/:id/read` | Mark one as read |
| `PATCH` | `/notifications/read-all` | Mark all as read |
| `DELETE` | `/notifications` | Clear all notifications |

### User Profile 🔒

| Method | Endpoint | Description |
|---|---|---|
| `PATCH` | `/users/profile` | Update name / avatar |
| `PATCH` | `/users/password` | Change password |

---

## 🚀 Getting Started

### Option 1 — Docker (Recommended)

Spin up the full stack (frontend + backend + database) in one command:

```bash
git clone https://github.com/your-username/homesync.git
cd homesync
docker-compose up --build
```

That's it. Open **http://localhost:5173** and register an account — demo rooms and devices will be created automatically.

### Option 2 — Manual Setup

**Prerequisites:** Node.js 20+, PostgreSQL 16+

**1. Set up the database**

Create a PostgreSQL database called `homesync`, then configure connection details.

**2. Start the backend**

```bash
cd server
npm install

# Create .env from .env.example and fill in your DATABASE_URL, JWT_SECRET, etc.

npm run migrate    # Create tables
npm run seed       # Populate demo data (optional)
npm run dev        # Start on http://localhost:5000
```

**3. Start the frontend**

```bash
cd client
npm install
npm run dev        # Start on http://localhost:5173
```

---

## ⚙️ Environment Variables

### Server (`server/.env`)

| Variable | Required | Description | Example |
|---|---|---|---|
| `DATABASE_URL` | Yes | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/homesync` |
| `JWT_SECRET` | Yes | Secret key for signing tokens | `your-long-random-string` |
| `JWT_EXPIRES_IN` | No | Token lifetime (default: `7d`) | `7d` |
| `CLIENT_URL` | Yes | Frontend URL for CORS | `http://localhost:5173` |
| `PORT` | No | Server port (default: `5000`) | `5000` |
| `SIMULATOR_INTERVAL_MS` | No | Simulator tick rate in ms | `15000` |

### Client

| Variable | Required | Description | Example |
|---|---|---|---|
| `VITE_API_URL` | Yes | Backend API base URL | `http://localhost:5000/api` |

---

## 📁 Project Structure

```
HomeSync/
├── client/                         # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/               # Login & register forms
│   │   │   ├── charts/             # Chart components (Recharts)
│   │   │   ├── dashboard/          # Dashboard widgets & cards
│   │   │   ├── devices/            # Device control components
│   │   │   ├── landing/            # Marketing landing page sections
│   │   │   ├── layout/             # Sidebar, mobile nav, main layout
│   │   │   └── ui/                 # Shared UI (modals, protected route)
│   │   ├── contexts/               # AuthContext, ThemeContext
│   │   ├── hooks/                  # useDevices, useRooms, useSocket
│   │   ├── pages/                  # Route-level page components
│   │   ├── services/               # Axios API client
│   │   └── types/                  # Shared TypeScript interfaces
│   ├── Dockerfile                  # Multi-stage build → Nginx
│   └── package.json
│
├── server/                         # Node.js backend
│   ├── src/
│   │   ├── config/                 # Database pool + env config
│   │   ├── controllers/            # Request handlers
│   │   ├── db/                     # Migrations + seed scripts
│   │   ├── middleware/             # Auth, validation, error handling
│   │   ├── models/                 # Raw SQL data access layer
│   │   ├── routes/                 # Express route definitions
│   │   ├── services/               # Simulator + Socket.io setup
│   │   └── utils/                  # JWT + password hashing helpers
│   ├── Dockerfile                  # Node 20 Alpine
│   └── package.json
│
├── docker-compose.yml              # Full stack orchestration
├── render.yaml                     # Render deployment config
└── README.md
```

---

## 🌐 Deployment Guide

HomeSync uses a **split-deployment** model — static frontend on a CDN, backend as a web service.

### Frontend → Netlify

| Setting | Value |
|---|---|
| Base Directory | `client` |
| Build Command | `npm run build` |
| Publish Directory | `dist` |
| Environment Variable | `VITE_API_URL` = `https://your-backend.onrender.com/api` |

### Backend → Render

| Setting | Value |
|---|---|
| Root Directory | `server` |
| Build Command | `npm install && npm run build` |
| Start Command | `npm start` |
| Environment Variables | `DATABASE_URL`, `JWT_SECRET`, `CLIENT_URL`, `PORT` |

> **Tip:** Use [Neon.tech](https://neon.tech) for a free serverless PostgreSQL database that pairs perfectly with Render.

### Full-Stack → Docker

```bash
docker-compose up --build
# Frontend: http://localhost:5173
# Backend:  http://localhost:5000
# Postgres: localhost:5432
```

---

## 🧩 Key Design Decisions

| Decision | Why |
|---|---|
| **Raw SQL over ORM** | High-frequency sensor writes demand fine-grained query control — no ORM overhead |
| **Socket.io user rooms** | Each user joins a private room keyed by their user ID, ensuring events never leak across accounts |
| **Zod validation** | Runtime schema validation on every incoming request — catches bad data before it hits the database |
| **Optimistic UI updates** | The frontend updates instantly on user action, then reverts if the server rejects the change |
| **Built-in simulator** | Proves the system works end-to-end without requiring physical IoT hardware |
| **Demo mode fallback** | If the backend is unreachable, the frontend gracefully degrades instead of crashing |

---

## 👨‍💻 Author

**Sharif Mahmud Sazid**
Full-Stack Developer — specializing in real-time systems, modern web architecture, and IoT software.

---