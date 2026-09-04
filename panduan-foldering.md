# 📁 Standar Foldering — Next.js (App Router) di Vercel

Standar ini dibuat untuk project frontend Next.js yang di-deploy ke Vercel, menggunakan **App Router**, **TypeScript**, dan **Tailwind CSS**. Tujuannya: struktur konsisten, mudah di-scale, dan enak dipelihara oleh tim.

---

## 🗂️ Struktur Folder

```text
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
```

---

## 🧭 Pola Penamaan (Naming Convention)

| Jenis | Konvensi | Contoh |
|---|---|---|
| Folder | kebab-case | `user-profile/` |
| Component file | PascalCase | `UserCard.tsx` |
| Hook | camelCase, prefix `use` | `useAuth.ts` |
| Util/helper | camelCase | `formatCurrency.ts` |
| Type/interface | PascalCase | `type UserProfile` |
| Route folder (App Router) | kebab-case | `app/order-history/page.tsx` |
| Constant | UPPER_SNAKE_CASE | `MAX_UPLOAD_SIZE` |

---

## 🧩 Kapan Pakai `features/` vs `components/`

- **`components/`** → komponen generik yang bisa dipakai di banyak fitur (Button, Modal, Table).
- **`features/`** → komponen + hook + service yang spesifik untuk satu domain bisnis (mis. `features/order/`, `features/user/`). Cocok untuk project menengah–besar agar tidak semua numpuk di `components/`.
- Project kecil–menengah: cukup `components/` + `app/` tanpa `features/`.
- Project besar (banyak modul, banyak developer): pakai pendekatan **feature-based** agar tiap tim bisa kerja di folder masing-masing tanpa saling tabrakan.

---

## 🔌 API & Service Layer

- Semua pemanggilan API dikumpulkan di `services/`, bukan langsung `fetch` di komponen.
- Buat 1 instance HTTP client (axios/fetch wrapper) di `lib/http.ts`, dipakai ulang oleh semua service.
- Contoh:
```text
src/services/
├── http.ts          # axios instance + interceptor
├── auth.service.ts
├── user.service.ts
└── order.service.ts
```
- Kalau butuh backend ringan di sisi Next.js sendiri (proxy, webhook, form handler), gunakan **Route Handlers** di `app/api/`.

---

## ⚙️ Environment Variables & Vercel

- `.env.local` untuk development, **jangan** di-commit.
- `.env.example` berisi daftar key tanpa value, jadi dokumentasi untuk developer lain.
- Variabel yang perlu diakses di browser wajib diawali `NEXT_PUBLIC_`.
- Untuk production/staging, set env var lewat **Vercel Dashboard → Settings → Environment Variables**, dipisah per environment (`Production`, `Preview`, `Development`).
- Jangan simpan secret (API key, DB credential) di `NEXT_PUBLIC_*` karena akan ter-bundle ke client.

---

## 🚀 Konvensi Deployment di Vercel

- Branch `main` → auto-deploy ke **Production**.
- Branch/PR lain → auto-deploy ke **Preview** (URL unik per PR), bagus untuk review sebelum merge.
- Gunakan `next/image` untuk semua gambar agar otomatis dioptimasi oleh Vercel Image Optimization.
- Gunakan Route Handler / Server Component untuk data fetching di server sebisa mungkin, kurangi fetch di client agar TTFB lebih cepat.
- Untuk revalidasi data (ISR), tentukan strategi eksplisit per halaman: `export const revalidate = 60` atau `cache: 'no-store'` sesuai kebutuhan.

---

## ✅ Aturan Tambahan

1. **Barrel export** (`index.ts`) opsional per folder komponen besar untuk import lebih ringkas — jangan dipaksakan di semua folder, bisa memperlambat build kalau berlebihan.
2. Komponen server (`Server Component`) adalah default di App Router — hanya tambahkan `'use client'` kalau memang butuh interaktivitas (state, event, browser API).
3. Setiap folder route yang butuh loading state / error boundary, sertakan `loading.tsx` dan `error.tsx`.
4. Test file (kalau ada) diletakkan bersebelahan dengan file yang diuji: `UserCard.tsx` + `UserCard.test.tsx`.
5. Ikuti **Conventional Commits** (`feat:`, `fix:`, `refactor:`, dst) agar changelog & versi konsisten dengan project backend kamu.

---

## 🧱 Contoh Minimal (Project Kecil–Menengah)

```text
src/
├── app/
│   ├── (main)/
│   │   ├── dashboard/page.tsx
│   │   └── layout.tsx
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/
│   └── layout/
├── hooks/
├── lib/
├── services/
├── types/
└── middleware.ts
```

Struktur ini bisa berkembang ke pendekatan `features/` begitu jumlah modul bisnis mulai banyak (>5-6 domain berbeda).
