export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900">
          <span className="text-xl font-bold text-white">
            K
          </span>
        </div>

        <h1 className="text-xl font-semibold text-slate-900">
          Registrasi Pengguna
        </h1>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Halaman registrasi pengguna akan
          tersedia sesuai dengan hak akses yang
          ditentukan oleh sistem.
        </p>
      </div>
    </main>
  );
}