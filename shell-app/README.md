# Shell App (Consumer Frontend)

[![React](https://img.shields.io/badge/React-18.2-blue?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Webpack](https://img.shields.io/badge/Webpack-5.88-blue?logo=webpack)](https://webpack.js.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-blue?logo=tailwindcss)](https://tailwindcss.com/)

Main consumer-facing e-commerce application built with **React 18**, **TypeScript**, and **Webpack Module Federation**.

## � Documentation

| Document                                                  | Description                          |
| --------------------------------------------------------- | ------------------------------------ |
| [Architecture](../../docs/apps/shell-app/ARCHITECTURE.md) | Application architecture & structure |
| [Testing Guide](../../docs/apps/shell-app/TESTING.md)     | Testing strategies & examples        |

## �🛠️ Tech Stack

| Category      | Technology                  |
| ------------- | --------------------------- |
| **Framework** | React 18.2                  |
| **Language**  | TypeScript 5.0+             |
| **Bundler**   | Webpack 5.88                |
| **Styling**   | Tailwind CSS 3.0, DaisyUI   |
| **State**     | Zustand                     |
| **Routing**   | React Router DOM 6          |
| **HTTP**      | Axios                       |
| **Testing**   | Jest, React Testing Library |

## 🚀 Getting Started

```bash
# From monorepo root
yarn install
yarn dev:shell

# Or from this directory
yarn dev
```

## 📁 Project Structure

```
apps/shell-app/
├── src/
│   ├── components/      # UI components
│   ├── pages/           # Page components
│   ├── store/           # Zustand stores
│   ├── hooks/           # Custom hooks
│   ├── utils/           # Utilities
│   └── index.tsx        # Entry point
├── public/              # Static assets
├── webpack.config.js    # Webpack config
└── package.json
```

## 🌐 Port

- **Development**: `http://localhost:3000`

## 📦 Shared Packages

- `@3asoftwares/types` - Type definitions
- `@3asoftwares/utils` - Utility functions
- `@3asoftwares/ui-library` - UI components

## 💻 Scripts

| Command      | Description                  |
| ------------ | ---------------------------- |
| `yarn dev`   | Start dev server (port 3000) |
| `yarn build` | Build for production         |
| `yarn test`  | Run tests                    |
| `yarn lint`  | Run ESLint                   |

## ✅ Pre-PR Checklist

```bash
yarn lint:fix && yarn typecheck && yarn test && echo "✅ Ready"
```

---

Part of the [E-Storefront Monorepo](../../README.md)
