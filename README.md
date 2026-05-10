# Multi-Environment Server 🚀

![GitHub CI](https://github.com/yourusername/multi-environment-server/actions/workflows/github_actions.yml/badge.svg)

A **Node.js/Express** server that supports multiple environments (development, staging, production) with Docker, Docker‑Compose, **NGINX** reverse‑proxy and a GitHub Actions CI pipeline.

---

## Table of Contents
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Quick Start (Docker)](#quick-start-docker)
- [Running Locally (Node)](#running-locally-node)
- [Environment Variables](#environment-variables)
- [GitHub Actions](#github-actions)
- [Project Structure](#project-structure)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [License](#license)

---

### Features
- **Multi‑environment configuration** – `.env.development`, `.env.staging`, `.env.production`.
- **Dockerised** – `Dockerfile`, `docker-compose.yml` with **PostgreSQL** and **NGINX**.
- **Continuous Integration** – GitHub Actions workflow (`github_actions.yml`) runs on every push/PR and executes `npm ci` + `npm test` across Node 18 & 20.
- **PM2 ecosystem** – `ecosystem.config.js` for production process management.
- **Rate limiting, security headers, JWT auth** – ready‑to‑use middleware.

---

## Prerequisites
- Docker & Docker‑Compose (>= 2.0)
- Node.js (if running locally) – see `.nvmrc` or `package.json` scripts
- PostgreSQL client (optional for DB inspection)
- Git (obviously) – for CI and version control

---

## Quick Start (Docker)
```bash
# Clone the repository (if not already)
git clone https://github.com/yourusername/multi-environment-server.git
cd multi-environment-server

# Build and start containers in detached mode
docker-compose up -d --build
```

The application will be reachable at **http://localhost** (NGINX proxies to the Node app on port `3000`).

### Stop the stack
```bash
docker-compose down
```

---

## Running Locally (Node)
```bash
# Install dependencies
npm ci

# Choose environment (development is default)
cp .env.development .env   # or .env.staging, .env.production

# Run the server (with nodemon for hot‑reload)
npm run dev
```

The API will listen on the port defined in the `.env` file (default `3000`).

---

## Environment Variables
All variables are stored in the `.env.*` files. The most important ones are:
```
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=myapp_dev
DB_USER=postgres
DB_PASS=devpassword
JWT_SECRET=dev_jwt_secret_change_me
```
> **⚠️ Security note:** Never commit actual production secrets. Add `.env*` to `.gitignore` (already done).

---

## GitHub Actions
The CI workflow is defined in `.github/workflows/github_actions.yml`. It:
1. Triggers on `push` and `pull_request` to `main`/`master`.
2. Tests against Node 18.x and 20.x.
3. Caches `npm` modules for faster builds.
4. Executes `npm ci` and `npm test`.

You can view the badge at the top of this README.

---

## Project Structure
```
Multi-Environment-Server/
│   README.md               # <‑‑ you are here
│   Dockerfile
│   docker-compose.yml
│   .dockerignore
│   package.json
│   ecosystem.config.js
│
├───src
│   ├───controllers        # Route handlers
│   ├───services            # Business logic
│   ├───middleware          # Auth, rate‑limit, etc.
│   ├───validators          # Joi schemas
│   └───routes              # Express router
│
├───nginx
│   └───nginx.conf          # Reverse‑proxy config
│
└───.github
    └───workflows
        └───github_actions.yml
```

---

## Development
- **Linting & formatting** – add your favourite ESLint/Prettier config.
- **Adding new endpoints** – create a service, validator and controller, then register it in `src/routes/index.js`.
- **Database migrations** – use Sequelize CLI (`npx sequelize-cli`).

---

## Testing
Currently the `test` script is a placeholder. Add your test framework (Jest, Mocha, etc.) and replace the script in `package.json`:
```json
"scripts": {
  "test": "jest"
}
```
The CI pipeline will automatically run the tests on every PR.

---

## Deployment
The production flow typically looks like:
1. Build the Docker image (`docker build -t yourrepo/multi-env-server .`).
2. Push to a container registry (Docker Hub, GitHub Packages, etc.).
3. Deploy the stack using Docker‑Compose on a remote host or via a CI/CD platform.
4. PM2 can be used for zero‑downtime restarts (`pm2 start ecosystem.config.js`).

---

## License
This project is licensed under the **MIT License** – see the `LICENSE` file for details.

---

*Happy coding! 🎉*
