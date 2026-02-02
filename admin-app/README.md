# Admin App

[![React](https://img.shields.io/badge/React-18.2-blue?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-purple?logo=vite)](https://vitejs.dev/)
[![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2.0-purple?logo=redux)](https://redux-toolkit.js.org/)

Admin dashboard for managing the e-commerce platform built with **React 18**, **Vite**, and **Redux Toolkit**.

## � Documentation

| Document                                                  | Description                          |
| --------------------------------------------------------- | ------------------------------------ |
| [Architecture](../../docs/apps/admin-app/ARCHITECTURE.md) | Application architecture & structure |
| [API Integration](../../docs/apps/admin-app/API.md)       | API integration guide                |
| [Testing Guide](../../docs/apps/admin-app/TESTING.md)     | Testing strategies & examples        |

## �🛠️ Tech Stack

| Category          | Technology                   |
| ----------------- | ---------------------------- |
| **Framework**     | React 18.2                   |
| **Language**      | TypeScript 5.0+              |
| **Bundler**       | Vite 5.0                     |
| **State**         | Redux Toolkit 2.0, RTK Query |
| **Data Fetching** | TanStack React Query 5       |
| **Styling**       | Tailwind CSS 3.0, DaisyUI    |
| **HTTP**          | Axios                        |
| **Media**         | Cloudinary (image uploads)   |
| **Forms**         | React Hook Form              |
| **Tables**        | TanStack Table               |
| **Testing**       | Jest, React Testing Library  |

## ✨ Features

- Product management (CRUD)
- Category management
- Order management
- User management
- Coupon management
- Analytics dashboard
- Image uploads (Cloudinary)

## 🚀 Getting Started

```bash
# From monorepo root
yarn install
yarn dev:admin

# Or from this directory
yarn dev
```

## 📁 Project Structure

```
apps/admin-app/
├── src/
│   ├── components/      # UI components
│   ├── pages/           # Page components
│   ├── store/           # Redux store
│   ├── features/        # Feature slices
│   ├── hooks/           # Custom hooks
│   ├── services/        # API services
│   └── main.tsx         # Entry point
├── public/              # Static assets
├── vite.config.ts       # Vite config
└── package.json
```

## 🌐 Port

- **Development**: `http://localhost:3001`

## 📦 Shared Packages

- `@3asoftwares/types` - Type definitions
- `@3asoftwares/utils` - Utility functions
- `@3asoftwares/ui-library` - UI components

## 💻 Scripts

| Command        | Description                  |
| -------------- | ---------------------------- |
| `yarn dev`     | Start dev server (port 3001) |
| `yarn build`   | Build for production         |
| `yarn preview` | Preview production build     |
| `yarn test`    | Run tests                    |
| `yarn lint`    | Run ESLint                   |

## ✅ Pre-PR Checklist

```bash
yarn lint:fix && yarn typecheck && yarn test && echo "✅ Ready"
```

---

Part of the [E-Storefront Monorepo](../../README.md)
