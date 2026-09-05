"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  LogIn,
  Store,
  User,
} from "lucide-react";

import { login } from "@/services/auth.service";
import {
  getSession,
  saveSession,
} from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [focusedField, setFocusedField] =
    useState<"username" | "password" | null>(null);

  const [demoFilled, setDemoFilled] =
    useState(false);

  useEffect(() => {
    const session = getSession();

    if (session) {
      router.replace("/dashboard");
    }
  }, [router]);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setDemoFilled(false);

    if (!username.trim()) {
      setError("Username wajib diisi.");
      return;
    }

    if (!password) {
      setError("Password wajib diisi.");
      return;
    }

    setLoading(true);

    try {
      const response = await login({
        username: username.trim(),
        password,
      });

      if (!response.success || !response.user) {
        setError(
          response.message ||
            "Username atau password salah."
        );
        return;
      }

      saveSession(response.user);

      router.replace("/dashboard");
    } catch {
      setError(
        "Terjadi kesalahan. Silakan coba lagi."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setUsername("admin");
    setPassword("admin123");
    setError("");
    setDemoFilled(true);
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="flex min-h-screen items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">

          {/* Logo */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 shadow-sm transition duration-300 hover:scale-105">
              <Store
                size={27}
                className="text-white"
              />
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Kasirfy
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Point of Sale
            </p>
          </div>

          {/* Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-slate-900">
                Masuk
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Masuk ke akun Kasirfy Anda.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                <AlertCircle
                  size={18}
                  className="mt-0.5 shrink-0"
                />

                <p>{error}</p>
              </div>
            )}

            {/* Demo Filled */}
            {demoFilled && !error && (
              <div className="mb-5 flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                <CheckCircle2
                  size={18}
                  className="shrink-0"
                />

                <p>
                  Akun demo berhasil diisi.
                </p>
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {/* Username */}
              <div>
                <label
                  htmlFor="username"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Username
                </label>

                <div className="relative">
                  <User
                    size={18}
                    className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${
                      focusedField === "username"
                        ? "text-slate-700"
                        : "text-slate-400"
                    }`}
                  />

                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(event) => {
                      setUsername(
                        event.target.value
                      );
                      setError("");
                      setDemoFilled(false);
                    }}
                    onFocus={() =>
                      setFocusedField("username")
                    }
                    onBlur={() =>
                      setFocusedField(null)
                    }
                    placeholder="Masukkan username"
                    autoComplete="username"
                    disabled={loading}
                    className={`w-full rounded-xl border bg-white py-3 pl-10 pr-4 text-sm text-slate-800 outline-none transition ${
                      focusedField === "username"
                        ? "border-slate-400 ring-2 ring-slate-100"
                        : "border-slate-200"
                    } placeholder:text-slate-400 disabled:cursor-not-allowed disabled:bg-slate-50`}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Password
                </label>

                <div className="relative">
                  <Lock
                    size={18}
                    className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${
                      focusedField === "password"
                        ? "text-slate-700"
                        : "text-slate-400"
                    }`}
                  />

                  <input
                    id="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={password}
                    onChange={(event) => {
                      setPassword(
                        event.target.value
                      );
                      setError("");
                      setDemoFilled(false);
                    }}
                    onFocus={() =>
                      setFocusedField("password")
                    }
                    onBlur={() =>
                      setFocusedField(null)
                    }
                    placeholder="Masukkan password"
                    autoComplete="current-password"
                    disabled={loading}
                    className={`w-full rounded-xl border bg-white py-3 pl-10 pr-11 text-sm text-slate-800 outline-none transition ${
                      focusedField === "password"
                        ? "border-slate-400 ring-2 ring-slate-100"
                        : "border-slate-200"
                    } placeholder:text-slate-400 disabled:cursor-not-allowed disabled:bg-slate-50`}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (value) => !value
                      )
                    }
                    disabled={loading}
                    aria-label={
                      showPassword
                        ? "Sembunyikan password"
                        : "Tampilkan password"
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition duration-200 hover:bg-slate-800 hover:shadow-sm active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Memproses...
                  </>
                ) : (
                  <>
                    <LogIn size={18} />
                    Masuk
                  </>
                )}
              </button>
            </form>

            {/* Demo Account */}
            <div className="mt-6 rounded-xl border border-slate-100 bg-slate-50 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold text-slate-700">
                    Akun Demo
                  </p>

                  <div className="mt-2 space-y-1 text-xs text-slate-500">
                    <p>
                      Username:{" "}
                      <span className="font-medium text-slate-700">
                        admin
                      </span>
                    </p>

                    <p>
                      Password:{" "}
                      <span className="font-medium text-slate-700">
                        admin123
                      </span>
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleDemoLogin}
                  disabled={loading}
                  className="shrink-0 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Gunakan
                </button>
              </div>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-slate-400">
            © 2026 Kasirfy. All rights reserved.
          </p>
        </div>
      </div>
    </main>
  );
}