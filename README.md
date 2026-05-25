# 🌐 Multi-Environment Monorepo

Welcome to the **Multi-Environment Monorepo** project! This repository contains a production-ready, highly scalable full-stack application split into a **TypeScript Express backend** and a **Vue 3 + Vite frontend**. It is fully configured to support separate **Development, Staging, and Production** environments with Docker-compose, NGINX reverse-proxying, and automated CI pipelines.

---

## 🏗️ Project Architecture (Monorepo)

The repository uses a monorepo structure to keep the backend API and frontend single-page application unified under version control while keeping their build systems and execution contexts clean and decoupled.

```text
Multi-Environment-Server/
├── backend/                # 🚀 Node.js + Express REST API (TypeScript)
│   ├── src/                # Backend application source code
│   │   ├── config/         # Database, Logger, Swagger, & Env configs
│   │   ├── controllers/    # Express controllers (HTTP request handlers)
│   │   ├── middleware/     # Core middlewares (Auth, Validation, Error, Rate Limiting)
│   │   ├── models/         # Sequelize data models
│   │   ├── routes/         # Express router endpoints
│   │   ├── services/       # Core business & data access services
│   │   ├── utils/          # Winston logger & helper functions
│   │   └── server.ts       # Application entry point
│   ├── tests/              # Jest + Supertest integration suite
│   ├── Dockerfile          # Multi-stage Docker config for Node
│   ├── docker-compose.yml  # Docker infrastructure (PG, NGINX, Express)
│   └── ecosystem.config.js # PM2 clustering production config
└── frontend/               # 💻 Vue 3 + TypeScript + Vite Single Page App
    ├── src/                # Frontend application source code
    │   ├── components/     # Vue SFC reusable components
    │   ├── assets/         # Images, fonts, and global assets
    │   ├── App.vue         # Root component
    │   └── main.ts         # Frontend application entry point
    └── vite.config.ts      # Vite bundler & server configurations
```

---

## 🛠️ Technology Stack

Our stack is chosen for optimal performance, strict typing, security, and developer productivity:

| Layer | Technology | Key Features / Notes |
| :--- | :--- | :--- |
| **Frontend** | [Vue 3](https://vuejs.org/) | Vite-powered, Composition API (`<script setup>`), TypeScript |
| **Backend** | [Node.js](https://nodejs.org/) & [Express](https://expressjs.com/) | 100% Migrated to **TypeScript** with strict static typing |
| **Database** | [PostgreSQL](https://www.postgresql.org/) & [Sequelize](https://sequelize.org/) | ORM with database sync (`alter: true` in development) |
| **Testing** | [Jest](https://jestjs.io/) & [Supertest](https://github.com/ladjs/supertest) | Automatic testing for controllers, routers, and health checks |
| **Logging** | [Winston](https://github.com/winstonjs/winston) & [Morgan](https://github.com/expressjs/morgan) | Structured colorized local logs & production-ready JSON outputs |
| **Security** | [Helmet](https://helmetjs.github.io/) & [Express Rate Limit](https://github.com/express-rate-limit/express-rate-limit) | Strict HTTP headers, CSRF/XSS protection, and brute-force mitigation |
| **Documentation** | [Swagger UI](https://swagger.io/tools/swagger-ui/) | Fully interactive API documentation rendered directly at `/api/docs` |
| **Deployment** | [Docker](https://www.docker.com/) & [PM2](https://pm2.keymetrics.io/) | Production-ready container orchestration & cluster load-balancing |

---

## 🚀 Getting Started

To run this application locally or in containers, follow the steps below.

### 1. Prerequisites
Ensure you have the following installed:
* [Node.js](https://nodejs.org/) (v18.x or v20.x recommended)
* [Docker & Docker Compose](https://www.docker.com/products/docker-desktop/) (for containerized setup)
* [PostgreSQL](https://www.postgresql.org/) (if running database locally outside Docker)

---

### 2. Setting Up the Backend

1. Navigate to the backend directory and install dependencies:
   ```bash
   cd backend
   npm install
   ```

2. Configure environment files:
   Create the environment files in the `backend/` directory. For example, prepare a `.env.development` file:
   ```bash
   cp .env.development .env
   ```
   *Note: Ensure you have `.env.development`, `.env.staging`, `.env.production`, and `.env.test` populated with correct database credentials.*

3. Spin up the local development database and run the backend dev server:
   ```bash
   # Runs backend using ts-node & nodemon (with hot reloading)
   npm run dev
   ```
   *The server will boot up and automatically synchronize models with the database.*

4. Verify backend status:
   * **API Endpoint**: `http://localhost:3000/api/v1/health`
   * **Interactive Swagger Docs**: `http://localhost:3000/api/docs`

5. Run the test suite:
   ```bash
   # Executes automated integration tests using Jest
   npm test
   ```

---

### 3. Setting Up the Frontend

1. Navigate to the frontend directory and install dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Run the Vite development server:
   ```bash
   npm run dev
   ```
   *The client application will launch locally at `http://localhost:5173/`.*

3. Build the frontend for production:
   ```bash
   npm run build
   ```

---

## 🐳 Dockerized Multi-Environment Deployment

The monorepo contains a complete infrastructure setup ready for local testing, staging, and production environments using NGINX as a reverse-proxy and PostgreSQL as the primary database.

```bash
# Navigate to the backend directory where docker configs live
cd backend

# Build and spin up the complete services stack
docker-compose up -d --build
```

This starts:
1. **Express Server**: Running in a Node Docker container.
2. **PostgreSQL Database**: Persistent data store.
3. **NGINX Reverse Proxy**: Accessible at `http://localhost/` routing requests securely.

To stop the services:
```bash
docker-compose down
```

---

## 🔒 Security & Performance Features

* **Strict CORS & Helmet Headers**: Block unauthorised resource sharing and insecure HTTP exploits.
* **Rate Limiting**: Configured dynamically per environment to prevent brute-force API hammering.
* **Database Graceful Shutdowns**: Safely handles system signals (`SIGTERM`, `SIGINT`) to clean up database connection pools and avoid transactions corruption.
* **Gzip Payload Compression**: Accelerated transfers for REST responses.

---

## 🗺️ Next Steps & Roadmap

* **🔗 Frontend-Backend Integration**: Connect Vue 3 components to the Auth and User CRUD endpoints in the backend (using Axios or Fetch API).
* **🛤️ Vue Routing & State**: Implement Vue Router and Pinia store inside the `frontend/` to establish seamless UI views (e.g. Login, Profile Dashboard, Admin Panel).
* **📦 Database Migrations**: Transition from Sequelize `sync({ alter: true })` to production-safe database schema migrations using `sequelize-cli`.
* **🧪 Test Suite Expansion**: Author unit tests for backend service files (`auth.service.ts`, `user.service.ts`) and frontend UI component tests.

---

*Happy coding! 🛠️🎉*
