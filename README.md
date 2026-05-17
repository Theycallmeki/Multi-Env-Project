# Multi-Environment Project Documentation 🚀

This documentation outlines the architecture, features, and setup instructions for the newly restructured **Multi-Environment Monorepo** project.

---

## 🏗️ Project Architecture (Monorepo)
The project has recently been refactored into a scalable monorepo structure, separating the client-side code from the server-side code while keeping them in the same repository.

```text
Multi-Environment-Server/
├── .git/                   # Root git repository
├── backend/                # The Express/Node.js API (TypeScript)
└── frontend/               # (Pending) Vue/React Single Page Application
```

---

## ⚙️ The Backend (`/backend`)
The backend is a highly scalable, production-ready REST API built with **Node.js, Express, and Sequelize**.

### 🌟 Recent Major Upgrades
1. **100% TypeScript Migration**: The entire backend has been migrated from CommonJS JavaScript to modern TypeScript (`import/export`).
2. **Automated Testing**: Integrated **Jest** and **Supertest**. Tests are located in the `tests/` directory and can be run via `npm test`.
3. **Structured Logging**: Replaced standard `console.log` with **Winston**. All HTTP requests via Morgan are now streamed directly through Winston, outputting beautiful colorized logs in development and structured JSON in production.

### 🗂️ Backend File Structure
```text
backend/
├── src/
│   ├── config/             # Environment, DB, Logger & Swagger configurations
│   ├── controllers/        # HTTP route handlers
│   ├── middleware/         # Express middlewares (Auth, Error, Rate Limiting)
│   ├── models/             # Sequelize Data Models
│   ├── routes/             # Express Router definitions
│   ├── services/           # Business logic (separated from controllers)
│   ├── utils/              # Shared utilities (e.g., asyncHandler, Winston logger)
│   ├── validators/         # Joi validation schemas
│   └── server.ts           # Application entry point
├── tests/                  # Jest integration & unit tests
├── .env.*                  # Environment specific variables
├── ecosystem.config.js     # PM2 Configuration
├── Dockerfile              # Docker container configuration
└── tsconfig.json           # TypeScript compiler options
```

### 🚀 Getting Started (Backend)

**1. Install Dependencies**
```bash
cd backend
npm install
```

**2. Configure Environment**
Copy the development environment file:
```bash
cp .env.development .env
```

**3. Run the Development Server**
This uses `ts-node` and `nodemon` for hot-reloading:
```bash
npm run dev
```

**4. Run Automated Tests**
This uses `ts-jest` to run tests against the endpoints:
```bash
npm test
```

**5. Build for Production**
Compiles the TypeScript code into the `dist/` folder:
```bash
npm run build
npm run start
```

---

## 🐳 Docker Deployment
The backend includes a `Dockerfile` and `docker-compose.yml` for seamless deployment alongside a PostgreSQL database and an NGINX reverse-proxy.

```bash
cd backend
docker-compose up -d --build
```
The API will be exposed on port `80` via NGINX.

---

## 🔒 Security & Performance
- **Helmet**: Secures Express apps by setting various HTTP headers.
- **Express Rate Limit**: Protects against brute-force attacks.
- **CORS**: Configured to restrict cross-origin resource sharing.
- **Compression**: Gzip compression for faster response payloads.
- **Winston**: Standardized, trackable logs for Datadog/ELK integration.

---

## 🗺️ Roadmap / Next Steps
* **Fix TypeScript Implicit Types**: Resolve the remaining `any` types and extend the Express `Request` object to fully support the new `.ts` migration.
* **Database Migrations**: Implement `sequelize-cli` to handle database schema changes instead of `sync()`.
* **Frontend Scaffolding**: Run `npm create vite@latest` in the `frontend/` directory to connect the UI!
