# E-Storefront Apps — Frontend Monorepo

A modern, scalable monorepo containing three interconnected e-commerce applications:

- **Admin App**: Dashboard for platform management (users, orders, products, analytics)
- **Seller App**: Portal for sellers to manage products, inventory, and earnings
- **Shell App**: Central launcher for navigating all applications

> 📚 **New here?** Start with [INDEX.md](./INDEX.md) for a complete documentation roadmap

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Structure](#structure)
- [Available Commands](#available-commands)
- [Technology Stack](#technology-stack)
- [CI/CD Pipeline](#cicd-pipeline)
- [Documentation](#documentation)
- [Contributing](#contributing)

## 🚀 Quick Start

```bash
# 1. Setup (choose one)
bash setup.sh              # Unix/macOS
setup.bat                  # Windows (PowerShell)
yarn install && yarn build # Manual

# 2. Start developing
yarn dev

# 3. Visit the apps
# Admin: http://localhost:3001
# Seller: http://localhost:3002
# Shell: http://localhost:3000
```

**Need help?** See [GETTING-STARTED.md](./GETTING-STARTED.md) or [QUICK-REFERENCE.md](./QUICK-REFERENCE.md)

## 🏗️ Structure

```
E-Storefront-Apps/
├── admin-app/                  # Admin Dashboard (Vite + React)
│   ├── src/
│   ├── tests/
│   ├── vite.config.ts
│   ├── jest.config.js
│   └── package.json
├── seller-app/                 # Seller Portal (Vite + React)
│   ├── src/
│   ├── tests/
│   ├── vite.config.ts
│   ├── jest.config.js
│   └── package.json
├── shell-app/                  # Shell App (Webpack + React)
│   ├── src/
│   ├── tests/
│   ├── webpack.config.ts
│   ├── jest.config.js
│   └── package.json
├── .github/
│   ├── workflows/
│   │   └── ci-cd.yml           # CI/CD Pipeline
│   ├── WORKFLOW-DOCUMENTATION.md
│   ├── CODEOWNERS
│   └── pull_request_template.md
├── package.json                # Root workspace config
├── sonar-project.properties    # SonarQube configuration
├── .eslintrc.json              # Root ESLint config
├── .prettierrc                 # Code formatting rules
├── Makefile                    # Make shortcuts
├── setup.sh / setup.bat        # Setup scripts
├── INDEX.md                    # Documentation roadmap
├── GETTING-STARTED.md          # Getting started guide
├── QUICK-REFERENCE.md          # Command reference
└── CI-CD-SETUP.md              # CI/CD setup guide
```

### Development

```bash
# Start all apps in development mode
yarn dev

# Start individual apps
yarn dev:admin      # Admin Dashboard (Vite)
yarn dev:seller     # Seller Portal (Vite)
yarn dev:shell      # Shell App (Webpack)
```

### Building

```bash
# Build all apps for production
yarn build

# Build individual apps
yarn build:admin
yarn build:seller
yarn build:shell
```

### Testing

```bash
# Run all tests with coverage
yarn test
yarn test:coverage

# Run tests for specific app
yarn test:admin
yarn test:seller
yarn test:shell

# Run tests in watch mode
yarn test --watch
```

### Linting & Formatting

```bash
# Check code style and quality
yarn lint

# Lint specific app
yarn lint:admin
yarn lint:seller
yarn lint:shell

# Fix linting issues automatically
yarn lint:fix
```

### Build Failures

```bash
# Clear cache and reinstall
rm -rf node_modules yarn.lock
yarn install
yarn build
```

### Port Already in Use

```bash
lsof -ti:3001 | xargs kill -9
```

### Repository Secrets Required

| Secret                     | Description                                |
| -------------------------- | ------------------------------------------ |
| `VERCEL_TOKEN`             | Vercel API token                           |
| `VERCEL_ORG_ID`            | Vercel organization ID                     |
| `VERCEL_PROJECT_ID_ADMIN`  | Vercel project ID for admin-app            |
| `VERCEL_PROJECT_ID_SELLER` | Vercel project ID for seller-app           |
| `VERCEL_PROJECT_ID_SHELL`  | Vercel project ID for shell-app            |
| `SONAR_TOKEN`              | SonarQube/SonarCloud token (optional)      |
| `SONAR_HOST_URL`           | SonarQube host URL (optional, self-hosted) |
| `SONAR_ORGANIZATION`       | SonarCloud organization key (optional)     |
