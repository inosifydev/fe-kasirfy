#Foldering
project-name/
├── .vscode/                     # Setting editor tim (opsional)
│   └── settings.json
├── public/                      # Static assets (diserve langsung oleh Vercel CDN)
│   ├── images/
│   ├── icons/
│   └── fonts/
├── src/
│   ├── app/                     # Routing (App Router)
│   │   ├── (auth)/              # Route group: auth (login, register) - tidak muncul di URL
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── register/
│   │   │       └── page.tsx
│   │   ├── (main)/              # Route group: halaman utama setelah login
│   │   │   ├── dashboard/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── loading.tsx
│   │   │   │   └── error.tsx
│   │   │   └── layout.tsx
│   │   ├── api/                 # Route Handlers (BE ringan / BFF)
│   │   │   └── users/
│   │   │       └── route.ts
│   │   ├── layout.tsx           # Root layout
│   │   ├── page.tsx             # Landing page ("/")
│   │   ├── not-found.tsx
│   │   ├── globals.css
│   │   └── favicon.ico
│   │
│   ├── components/
│   │   ├── ui/                  # Primitive/reusable component (Button, Input, Modal)
│   │   ├── layout/               # Navbar, Sidebar, Footer
│   │   └── common/               # Komponen shared lintas fitur (EmptyState, LoadingSpinner)
│   │
│   ├── features/                # Feature-based module (opsional, untuk project besar)
│   │   └── user/
│   │       ├── components/
│   │       ├── hooks/
│   │       ├── services/
│   │       └── types.ts
│   │
│   ├── hooks/                   # Custom hooks lintas fitur (useDebounce, useAuth)
│   ├── lib/                     # Helper/util murni (formatDate, cn, fetcher)
│   ├── services/                # API client (axios instance, service per resource)
│   ├── store/                   # State management global (Zustand/Redux/Jotai)
│   ├── types/                   # TypeScript types/interfaces global
│   ├── constants/                # Konstanta (routes, roles, enum)
│   ├── config/                   # Konfigurasi app (site config, env parsing)
│   └── middleware.ts             # Next.js middleware (auth guard, redirect)
│
├── .env.example
├── .env.local                    # Jangan di-commit
├── .eslintrc.json
├── .prettierrc
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
├── vercel.json                   # Konfigurasi khusus Vercel (opsional)
├── package.json
└── README.md
