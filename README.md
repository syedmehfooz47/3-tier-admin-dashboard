# Containerized 3-Tier Admin Dashboard (DevOps Showcase)

A production-grade, containerized **3-Tier Admin Dashboard** application built and optimized to demonstrate key DevOps practices including **multi-stage build optimizations**, **reverse-proxy routing**, **automated static asset management**, and **Docker container lifecycle orchestrations**.

---

## 🔗 Project Links
*   **Live Demo:** [https://3-tier-admin-dashboard.projects.syedmehfooz.com](https://3-tier-admin-dashboard.projects.syedmehfooz.com)
*   **GitHub Repository:** [github.com/syedmehfooz47/3-tier-admin-dashboard](https://github.com/syedmehfooz47/3-tier-admin-dashboard)

## 👤 Author Contact
*   **Name:** Syed Mehfooz C S
*   **Email:** [hello@syedmehfooz.com](mailto:hello@syedmehfooz.com)
*   **GitHub:** [@syedmehfooz47](https://github.com/syedmehfooz47)

---

## 🏗️ 4-Container 3-Tier Architecture Diagram

This application decouples the frontend, backend, database, and ingress proxy into 4 specialized containers running on an isolated virtual bridge network.

```
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
│     React Frontend      │             │   Node.js / Express     │
│   Tier 1 (client_cont)  │             │   Logic Tier 2 (server)  │
└─────────────────────────┘             └────────────┬────────────┘
                                                     │ (Port 27017)
                                                     ▼
                                        ┌─────────────────────────┐
                                        │    MongoDB Database     │
                                        │   Data Tier 3 (mongo)   │
                                        └─────────────────────────┘
```

*   **Nginx Gateway Proxy (`nginx_cont`):** The ingress router on port `80` (mapped to host `80:80`). It acts as a reverse proxy, dispatching `/api/*` to the backend and all other requests to the React frontend container.
*   **Presentation Tier (`client_cont`):** Holds the built React + Redux application. Rather than running a heavy Node server, a lightweight internal Nginx engine serves the compiled assets on port `3000`.
*   **Application Tier (`server_cont`):** Express REST API hosting all business routes on port `9000`.
*   **Data Tier (`mongodb_cont`):** MongoDB 6.0 engine isolated inside the Docker network.

---

## ⚡ Quick Start

### Prerequisites
Make sure you have **Docker** and **Docker Compose** installed on your system.

### Build and Launch
To build all images and run the application, execute:

```bash
docker-compose up --build
```

Navigate to **[http://localhost](http://localhost)** to access the running system.

---

## 🛠️ DevOps & Architectural Design Optimizations

### 1. Multi-Stage Build Optimizations
To minimize container footprints, secure dependencies, and speed up CI/CD pipeline building, both the frontend and backend Dockerfiles utilize advanced multi-stage layer caching:

#### **Frontend (`client/Dockerfile`):**
*   **Build Stage:** Pulls `node:18-alpine` to install dependencies via `npm ci` and compiles the React source code.
*   **Runtime Stage:** Pulls `nginx:1.25-alpine` (~30MB footprint) and copies only the compiled build files.
*   **Impact:** By discarding Node.js runtimes and dev tools (like `react-scripts`), the final frontend container size is reduced by **90%** (from ~350MB down to ~35MB).

#### **Backend (`server/Dockerfile`):**
*   **Build Stage:** Installs production dependencies (`npm ci --only=production`) in a builder container.
*   **Runtime Stage:** Pulls a fresh `node:18-alpine` and copies only the production dependencies and necessary runtime directories (`controllers/`, `data/`, `database/`, `models/`, `routers/`, `index.js`).
*   **Execution:** Bypasses npm entirely and starts Node directly (`node index.js`) to avoid spawning redundant child processes and handling signals gracefully.

---

### 2. Network Isolation & CORS Elimination
*   **Docker Network Topology:** We created and configured a custom Docker bridge network named `admin-dashboard-network` to interconnect all containers. The database (`mongodb_cont`) and the backend API (`server_cont`) have no public ports exposed directly to the outside host, protecting them from external scan or intrusion.
*   **Zero-CORS Architecture:** Because Nginx routes both the frontend UI and backend API requests from the same port `80`, the browser views them as coming from the same origin, completely removing the need for complex CORS configurations in Express production environments.

---

### 3. Graceful Container Lifecycle (Healthchecking)
Startup timing is critical in multi-tier applications. To prevent backend crashes when MongoDB is starting up:
1.  **Database Healthcheck:** MongoDB is configured to run health evaluations (`mongosh --eval "db.adminCommand('ping')"`).
2.  **Server Dependency Hook:** The backend container contains a `depends_on` rule waiting for the database to report `service_healthy`.
3.  **Application Healthcheck:** The backend service runs local checks (`wget --spider`) to report its health status.
4.  **Frontend/Proxy Hook:** Nginx and frontend containers launch only after the API server and database are fully operational.

---

### 4. Self-Seeding Database Lifecycle
To make the codebase a turn-key clone-and-run solution, the backend features an auto-seeding handler. On initial container initialization:
*   The backend verifies if the MongoDB collection has entries.
*   If empty, it automatically triggers a database seed using the mock datasets in `server/data/index.js` (populating users, products, sales, and transactions in seconds).

---

### 5. Persistent Data Layer (Docker Volumes)
*   A dedicated Docker named volume `mongodb_data` is mounted to `/data/db` on the MongoDB container.
*   **Data Durability:** Using named volumes ensures that all database records and seeded files remain safe and persist even if the running containers are harmed, stopped, destroyed, or rebuilt.
