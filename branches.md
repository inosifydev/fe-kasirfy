# 🌿 Standar Branch Naming & Versioning — Integrasi BE ↔ FE (Repo Terpisah)

Karena backend dan frontend ada di repository berbeda tapi harus saling terintegrasi, kuncinya adalah **identifier yang sama** dipakai di kedua repo: nomor ticket/issue, dan version tag. Ini bikin tim gampang tahu "branch/versi BE ini pasangannya branch/versi FE yang mana".

---

## 🧭 Pola Nama Branch

```text
<tipe>/<ticket-id>-<deskripsi-singkat>
```

| Tipe | Kegunaan | Contoh |
|---|---|---|
| `feature/` | Fitur baru | `feature/ADM-102-payment-integration` |
| `fix/` | Perbaikan bug (non-urgent) | `fix/ADM-118-login-validation` |
| `hotfix/` | Perbaikan urgent langsung ke production | `hotfix/ADM-130-token-expired-bug` |
| `release/` | Persiapan rilis (freeze sebelum deploy) | `release/v1.4.0` |
| `chore/` | Maintenance, dependency update, config | `chore/ADM-050-upgrade-nextjs-15` |
| `refactor/` | Refactor tanpa ubah behavior | `refactor/ADM-077-service-layer` |

**Aturan kunci:** kalau satu fitur menyentuh BE **dan** FE, gunakan **ticket ID dan deskripsi yang identik** di kedua repo:

```text
Repo BE  → feature/ADM-102-payment-integration
Repo FE  → feature/ADM-102-payment-integration
```

Dengan begini, siapa pun bisa langsung tahu dua branch itu berpasangan tanpa harus tanya di grup chat.

> Kalau belum pakai tools ticketing (Jira/Linear/Trello), bisa diganti dengan ID manual yang disepakati tim, mis. `feature/INT-001-payment-integration` (INT = kode internal untuk fitur lintas repo).

---

## 🌳 Branch Utama (sama di kedua repo)

| Branch | Fungsi | Auto-deploy Vercel ke |
|---|---|---|
| `main` | Kode production, selalu stabil | Production |
| `develop` | Integrasi fitur sebelum rilis | Preview (staging) |
| `release/vX.Y.Z` | Freeze sebelum rilis, hanya bug fix | Preview (staging final) |

Samakan nama branch utama (`main`, `develop`) di kedua repo, supaya konfigurasi Vercel environment (Production/Preview) konsisten dan tim tidak bingung branch mana yang mewakili environment apa.

---

## 🔖 Versioning (Semantic Versioning + Sinkron Tag)

Gunakan **Semantic Versioning** (`vMAJOR.MINOR.PATCH`) di kedua repo:

- **MAJOR** — breaking change (mis. kontrak API BE berubah, FE wajib update)
- **MINOR** — fitur baru, backward-compatible
- **PATCH** — bug fix, tidak ada perubahan kontrak

**Aturan sinkronisasi:**
1. Kalau sebuah rilis melibatkan perubahan di BE **dan** FE secara bersamaan, tag **kedua repo dengan nomor versi yang sama**:
   ```text
   BE repo → git tag v1.4.0
   FE repo → git tag v1.4.0
   ```
2. Kalau BE naik versi API tapi FE belum ikut update, catat kompatibilitas di README masing-masing repo (lihat bagian bawah).
3. Tag hanya dibuat dari branch `main` setelah rilis benar-benar naik ke production.

---

## 📄 File Penanda Kompatibilitas (disarankan)

Tambahkan section kecil di `README.md` masing-masing repo untuk mencatat pasangan versi yang kompatibel:

**Di repo BE:**
```md
## Compatibility
| BE Version | Compatible FE Version | API Version |
|---|---|---|
| v1.4.0 | v1.4.0 | v1 |
| v1.3.0 | v1.3.0 – v1.3.2 | v1 |
```

**Di repo FE:**
```md
## Compatibility
| FE Version | Required BE Version | API Base URL |
|---|---|---|
| v1.4.0 | v1.4.0+ | /api/v1 |
```

Ini penting terutama kalau BE sudah pakai versioning endpoint (`/api/v1`, `/api/v2`) seperti di standar backend sebelumnya — jadi FE tahu persis endpoint versi berapa yang harus dipanggil.

---

## 🔀 Alur Kerja untuk Fitur Lintas Repo

1. Buat ticket/issue dengan ID yang sama, mis. `ADM-102 — Payment Integration`.
2. Buat branch dengan nama identik di kedua repo: `feature/ADM-102-payment-integration`.
3. Kembangkan paralel. **Urutan merge disarankan: BE dulu, baru FE** — supaya endpoint sudah tersedia saat FE integrasi & testing.
4. Deploy preview kedua repo ke Vercel (otomatis per branch/PR), lalu **integration test** di environment preview sebelum merge ke `develop`.
5. Di deskripsi PR, saling referensi:
   ```md
   Related FE branch: feature/ADM-102-payment-integration (repo: fe-project)
   ```
6. Merge ke `develop` → `release/vX.Y.Z` → `main`, lalu tag versi yang sama di kedua repo.

---

## 📝 Commit Message (tetap Conventional Commits)

Tambahkan ticket ID di commit message supaya mudah ditrace lintas repo:

```bash
git commit -m "feat(ADM-102): integrate payment gateway endpoint"
git commit -m "fix(ADM-118): resolve token expiration on refresh"
```

---

## ✅ Ringkasan Cepat

- Nama branch **identik** di BE & FE untuk fitur lintas repo → `feature/<ticket-id>-<deskripsi>`
- Branch utama (`main`, `develop`) **disamakan namanya** di kedua repo
- Tag versi **disamakan angkanya** saat rilis bersama (`v1.4.0` di BE = `v1.4.0` di FE)
- Catat tabel kompatibilitas versi di README masing-masing repo
- Urutan merge: **BE → FE** untuk fitur yang saling bergantung
