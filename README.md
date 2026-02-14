# BahmanSabz Dashboard

A comprehensive **Next.js 16** dashboard application built for the BahmanSabz Frontend Developer technical assessment. The project demonstrates proficiency in modern React/Next.js development, API integration, component architecture, and professional UI/UX design.

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| **Next.js** | 16.1.6 | App Router, SSR, file-based routing |
| **React** | 19.2.3 | UI library |
| **TypeScript** | 5.x | Type safety |
| **Chakra UI** | 3.33+ | Component library & theming |
| **Tailwind CSS** | 4.x | Utility-first styling (AdvancedSelect) |
| **React Query** | 5.x | Server state management, caching |
| **Headless UI** | 2.x | Accessible headless components |
| **@tanstack/react-virtual** | 3.x | List virtualization |

## Features

### Task 1: Dashboard (DummyJSON API + Chakra UI)
- **Login / Register** pages with DummyJSON authentication
- **Dashboard home** with stats cards (users, products, carts, revenue)
- **Users** list with search, pagination, and detailed user profiles
- **Products** list with category filtering, search, sort, grid/list view toggle
- **Product detail** with image gallery, reviews, specifications

### Task 2: Games (RAWG API)
- **Games list** with genre & platform sidebar filters, search, sort ordering
- **Game detail** with hero image, screenshot carousel, rating breakdown
- Responsive grid layout with cards showing metacritic scores

### Task 3: Advanced Dropdown Select Component
Built from scratch with professional features:
- **Headless UI (Listbox)** for full keyboard accessibility
- **Tailwind CSS** styling with dark mode support
- **Search/filter** items in real-time
- **Multi-select** with checkboxes
- **Grouped items** with sticky headers
- **Select All / Deselect All** functionality
- **Selection count** badge
- **Virtualization** via `@tanstack/react-virtual` for 10,000+ items

## Project Structure

```
├── app/
│   ├── (auth)/              # Auth group (login, register)
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── components/page.tsx  # AdvancedSelect showcase
│   ├── dashboard/           # Dashboard sub-routes (table views)
│   ├── games/               # RAWG games pages
│   │   ├── page.tsx         # Games list with filters
│   │   └── [id]/page.tsx    # Game detail
│   ├── products/            # DummyJSON products pages
│   │   ├── page.tsx         # Products list
│   │   └── [id]/page.tsx    # Product detail
│   ├── users/               # DummyJSON users pages
│   │   ├── page.tsx         # Users list
│   │   └── [id]/page.tsx    # User detail
│   ├── layout.tsx           # Root layout with providers
│   └── page.tsx             # Dashboard home
├── components/
│   ├── layout/              # DashboardLayout, Sidebar, Header
│   ├── provider/            # ChakraProvider
│   └── ui/
│       ├── AdvancedSelect/  # Custom dropdown component
│       ├── color-mode.tsx   # Dark/light mode toggle
│       ├── field.tsx        # Form field wrapper
│       └── provider.tsx     # Chakra system provider
├── lib/
│   ├── api/
│   │   ├── auth.ts          # Token & session management
│   │   ├── dummyjson.ts     # DummyJSON API client
│   │   └── rawg.ts          # RAWG API client
│   ├── hooks/               # React Query hooks
│   │   ├── useDashboard.ts  # Dashboard stats
│   │   ├── useGames.ts      # Games CRUD
│   │   ├── useProducts.ts   # Products CRUD
│   │   └── useUsers.ts      # Users CRUD
│   ├── types/
│   │   ├── dummyjson.ts     # DummyJSON type definitions
│   │   └── rawg.ts          # RAWG type definitions
│   ├── auth-context.tsx     # Auth context provider
│   └── query-provider.tsx   # React Query provider
└── theme/
    └── system.ts            # Chakra UI theme configuration
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/<your-username>/BahmanSabz.git
cd BahmanSabz

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
```

### Environment Variables

Create a `.env.local` file with:

```env
NEXT_PUBLIC_RAWG_API_KEY=your_rawg_api_key_here
```

Get your free RAWG API key at: https://rawg.io/apidocs

### Running the Project

```bash
# Development
npm run dev

# Production build
npm run build
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Test Credentials (DummyJSON)

| Field | Value |
|---|---|
| Username | `emilys` |
| Password | `emilyspass` |

## Architecture Decisions

### React Query for Data Fetching
All API calls use `@tanstack/react-query` with:
- **Centralized query keys** for cache management
- **`keepPreviousData`** for smooth pagination transitions
- **Configurable stale times** (5min for lists, 10min for details, 30min for static data)
- **Deduplication** - identical requests are automatically merged

### Authentication
- JWT-based auth via DummyJSON `/auth/login`
- Tokens stored in `localStorage` with `auth_token` key
- `AuthContext` provider wraps the entire app
- Protected routes redirect to `/login` when unauthenticated

### Component Architecture
- **DashboardLayout** wraps all authenticated pages (sidebar + header)
- **AdvancedSelect** is fully controlled (`value` + `onChange`) and supports both flat and grouped options
- All components are documented with JSDoc comments

## API Documentation

### DummyJSON (https://dummyjson.com/docs)
- `POST /auth/login` - Authentication
- `GET /users` - Users list with pagination
- `GET /users/search` - Search users
- `GET /products` - Products list with pagination
- `GET /products/categories` - Product categories
- `GET /carts` - Shopping carts

### RAWG (https://api.rawg.io/docs)
- `GET /games` - Games list with filters
- `GET /games/{id}` - Game details
- `GET /games/{id}/screenshots` - Game screenshots
- `GET /genres` - Available genres
- `GET /platforms` - Available platforms

## License

This project was created as part of a technical assessment for Bahman Sabz Cultural & Advertising Institute.
