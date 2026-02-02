# e-apps — Frontend Applications Monorepo

Frontend applications for the e-commerce platform (Admin Dashboard, Seller Portal, Shell App).

## Structure

```
e-apps/
├── apps/
│   ├── admin-app/       # Admin Dashboard
│   ├── seller-app/      # Seller Portal
│   └── shell-app/       # Shell/Host Application
└── package.json
```

## Quick Start

```bash
# Install dependencies
yarn install

# Development (all apps)
yarn dev

# Development (individual app)
yarn dev:admin
yarn dev:seller
yarn dev:shell

# Build
yarn build

# Test
yarn test

# Lint
yarn lint
yarn lint:fix
```

## Deployment

Configured for **Vercel** deployment. Each app deploys as a separate Vercel project.

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

### Vercel Configuration (per app)

Each app includes `vercel.json` with build and deployment settings. Adjust as needed:

```json
{
  "buildCommand": "yarn build:admin",
  "outputDirectory": "apps/admin-app/dist"
}
```

## CI/CD

Automated via GitHub Actions (`.github/workflows/ci-cd.yml`):

1. **Lint, Build, Test** — runs on all branches
2. **SonarQube Scan** — code quality analysis
3. **Deploy to Vercel** — on `main` branch push

## Testing & Coverage

```bash
# Run tests with coverage
yarn test:coverage

# View coverage report
# Coverage reports are uploaded to Codecov
```

## SonarQube Integration

Configure in your SonarQube instance or SonarCloud:

```properties
sonar.projectKey=e-apps
sonar.projectName=e-apps
sonar.sources=apps
sonar.coverage.exclusions=**/node_modules/**,**/*.spec.ts,**/*.test.ts
```

## Notes

- Uses Yarn workspaces for monorepo management
- Shared dependencies are managed at root
- Each app can have independent build & deployment
- Test framework: Jest (React Testing Library for UI)
