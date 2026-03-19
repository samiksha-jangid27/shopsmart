# ShopSmart

ShopSmart is a premium, high-end e-commerce platform designed with an editorial, Dribbble-inspired UI aesthetic. It features a complete React frontend connected to a Node/Express backend.

## 1. Architecture

The system follows a classic Client-Server Architecture:
- **Client**: A robust Single Page Application (SPA) built with React and Vite. It heavily utilizes Tailwind CSS v4 for utility-first styling and component modularity.
- **Server**: A lightweight Node.js Express server providing RESTful APIs (e.g., `/api/health`, `/api/stats`).
- **Data Flow**: The frontend securely fetches dynamic statistical and promotional data from the backend via standard HTTP requests and binds it to state using hooks securely (demonstrating Integration patterns).

## 2. Project Workflow & CI/CD Pipeline

The development workflow adheres strictly to enterprise standards:
*   **Version Control**: Frequent, meaningful logical commits separate distinct features (UI, API, Testing, CI).
*   **Continuous Integration (CI)**: GitHub Actions automatically trigger on `push` and `pull_request` to the `main` branch. The pipeline:
    1. Installs dependencies.
    2. Runs advanced code Linting (ESLint globally configured for Jest and React).
    3. Executes all Unit and Integration tests to proactively catch regressions.
*   **Continuous Deployment (CD)**: An automated workflow connects GitHub Actions securely to AWS EC2 via SSH (`appleboy/ssh-action`), cloning the latest code and executing an **Idempotent Bash Script** (`scripts/deploy.sh`) that safely checks processes and restarts the PM2 production daemon.
*   **Dependency Management**: Dependabot is structurally configured (`.github/dependabot.yml`) to scan npm packages weekly avoiding stale or vulnerable libraries.

## 3. Design Decisions

*   **Pristine UI Overload Prevention**: We avoided heavy styling frameworks (like Material UI) in favor of raw TailwindCSS which allowed us to completely custom-craft our masonry "Bento-box" grid, precise pill-shaped search bars, and the distinctive sage green (`#e8f3ea`)/white layout to hit the strict visual requirement.
*   **Strict Monorepo Separation**: `client/` and `server/` are siloed to mimic scaling microservices but reside in the same physical repository to reduce developer friction.
*   **Testing Philosophy**: 
    - *Jest* + *Supertest* natively validates Node API functionality logically and at the protocol level (Integration).
    - *Vitest* + *React Testing Library* enforces that our DOM renders asynchronously and handles failure gracefully.
    - *Cypress* sits on top to mimic a human browsing paths unconditionally (E2E).

## 4. Challenges

*   **Tailwind Compatibility**: Upgrading to Tailwind v4 midway resulted in deprecated `@tailwind` tags failing. We immediately migrated our `index.css` to adopt the new `@import "tailwindcss"` standards.
*   **EADDRINUSE (Port Conflicts)**: During backend testing, port collisions occurred. We engineered the Node server to dynamically bind `process.env.PORT` gracefully over fallback mechanisms.
*   **ESLint Flat Config Friction**: Upgrading to the modern ESLint v10 required a complete rewrite of `.eslintrc.json` into a modern ESM `.mjs` flat configuration resolving node/jest globals.
