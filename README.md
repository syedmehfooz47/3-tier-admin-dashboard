# 3-Tier Admin Dashboard

A full-stack, containerized **3-Tier Admin Dashboard** application built with React, Node.js, Express, and MongoDB. It demonstrates modern web development practices, including Role-Based Access Control (RBAC), HttpOnly cookie authentication, and robust Docker container orchestration.

---

## 🔗 Links & Contact
*   **Live Demo:** [https://3-tier-admin-dashboard.projects.syedmehfooz.com](https://3-tier-admin-dashboard.projects.syedmehfooz.com/)
*   **GitHub Repository:** [github.com/syedmehfooz47/3-tier-admin-dashboard](https://github.com/syedmehfooz47/3-tier-admin-dashboard)
*   **Author Email:** [hello@syedmehfooz.com](mailto:hello@syedmehfooz.com)

---

## 🌟 Key Features

*   **Role-Based Access Control (RBAC):** Three distinct user roles (`superadmin`, `admin`, `user`) with fine-grained access permissions. Only Super Admins can assign or change roles.
*   **Secure Authentication:** Uses JSON Web Tokens (JWT) delivered securely via backend `HttpOnly` cookies, preventing client-side storage vulnerabilities and bypassing strict browser privacy blocking (like disabled `localStorage`).
*   **Modern Frontend:** Built with React, Vite (for blazing fast builds), and styled with responsive, glassmorphism-inspired modern CSS.
*   **Containerized Architecture:** Fully dockerized environment with multi-stage builds for minimal container sizes and optimal performance.

---

## 🏗️ 4-Container 3-Tier Architecture

This application decouples the frontend, backend, database, and ingress proxy into 4 specialized containers running on an isolated virtual bridge network.

```text
                      ┌──────────────────────┐
                      │    Client Browser    │
                      └──────────┬───────────┘
                                 │ HTTP (Port 80)
                                 ▼
                      ┌──────────────────────┐
                      │ Nginx Reverse Proxy  │
                      │     (nginx_cont)     │
                      └──────────┬───────────┘
                                 │
             ┌───────────────────┴───────────────────┐
             │ (Serves UI static assets)             │ (Proxies API requests)
             ▼                                       ▼
┌─────────────────────────┐             ┌─────────────────────────┐
│ React + Vite Frontend   │             │   Node.js / Express     │
│  Tier 1 (client_cont)   │             │  Logic Tier 2 (server)  │
└─────────────────────────┘             └────────────┬────────────┘
                                                     │ (Port 27017)
                                                     ▼
                                        ┌─────────────────────────┐
                                        │    MongoDB Database     │
                                        │   Data Tier 3 (mongo)   │
                                        └─────────────────────────┘
```

*   **Nginx Gateway Proxy (`nginx_cont`):** The ingress router on port `80`. It acts as a reverse proxy, dispatching `/api/*` to the backend and all other requests to the React frontend container.
*   **Presentation Tier (`client_cont`):** A lightweight internal Nginx engine that serves the highly-optimized static assets built by Vite on port `3000`.
*   **Application Tier (`server_cont`):** Express REST API handling authentication, role verification, and business logic on port `9000`.
*   **Data Tier (`mongodb_cont`):** MongoDB 6.0 engine isolated inside the Docker network.

---

## ⚡ Quick Start

### Prerequisites
Make sure you have **Docker** and **Docker Compose** installed on your system.

### Build and Launch
To build all images and run the application, execute:

```bash
docker-compose up --build -d
```

Navigate to **[http://localhost](http://localhost)** to access the running system.

### Default Credentials
On the first startup, the backend will automatically seed a default Super Admin account into the database:
*   **Username:** `superadmin`
*   **Password:** `superadmin123`

---

## 🛠️ DevOps & Architectural Design Optimizations

### 1. Multi-Stage Build Optimizations
To minimize container footprints and speed up deployment, both the frontend and backend Dockerfiles utilize multi-stage builds:
*   **Frontend (`client/Dockerfile`):** Uses Node to run `vite build`, then copies only the static `/dist` files into a lightweight `nginx:alpine` container.
*   **Backend (`server/Dockerfile`):** Copies only essential files and production dependencies, bypassing development overhead.

### 2. Network Isolation & Zero-CORS
*   **Docker Network Topology:** A custom Docker bridge network (`admin-dashboard-network`) interconnects all containers. The database and backend API are completely shielded from the outside host.
*   **Zero-CORS Architecture:** Because Nginx routes both the frontend UI and backend API requests from the exact same domain and port (`80`), the browser views them as coming from the same origin, completely bypassing complex CORS issues and preflight requests.

### 3. Graceful Container Lifecycle
*   **Healthchecks & Dependencies:** `docker-compose.yml` uses strict `depends_on: service_healthy` hooks. The backend waits for MongoDB to be fully ready before starting, and the client waits for the backend.

### 4. Resilient Storage
*   **Docker Volumes:** MongoDB data is persisted using the `mongodb_data` named volume, ensuring data durability across container restarts and rebuilds.
