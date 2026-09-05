"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
          <span className="text-2xl">!</span>
        </div>

        <h2 className="mt-5 text-xl font-semibold text-slate-900">
          Terjadi Kesalahan
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Maaf, terjadi kesalahan saat memuat halaman dashboard.
        </p>

        <button
          onClick={() => reset()}
          className="mt-6 rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          Coba Lagi
        </button>
      </div>
    </div>
  );
}