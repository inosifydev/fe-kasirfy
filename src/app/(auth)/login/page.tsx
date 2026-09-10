'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, CheckCircle2, Eye, EyeOff, Lock, LogIn, Store, User } from 'lucide-react';
import { login } from '@/services/auth.service';
import { getSession, saveSession } from '@/lib/auth';
export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [demoFilled, setDemoFilled] = useState(false);
  useEffect(() => {
    const session = getSession();
    if (session) {
      router.replace('/dashboard');
    }
  }, [router]);
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    if (!identifier.trim()) {
      setError('Email atau username wajib diisi.');
      return;
    }
    if (!password) {
      setError('Password wajib diisi.');
      return;
    }
    setLoading(true);
    try {
      const response = await login({
        identifier: identifier.trim(),
        password,
      });
      if (!response.success || !response.user) {
        setError(response.message || 'Email/username atau password salah.');
        return;
      }
      saveSession(response.user);
      router.replace('/dashboard');
    } catch (error) {
      console.error(error);
      setError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };
  const handleDemoAccount = () => {
    setIdentifier('owner01');
    setPassword('owner123');
    setDemoFilled(true);
    setError('');
    setTimeout(() => {
      setDemoFilled(false);
    }, 2000);
  };
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="flex min-h-screen">
        {/* LEFT SIDE */}
        <div className="hidden lg:flex lg:w-1/2 bg-slate-900">
          <div className="flex w-full flex-col justify-between p-12 xl:p-16">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600">
                  <Store size={22} className="text-white" />
                </div>

                <span className="text-xl font-semibold text-white">Kasirfy</span>
              </div>
            </div>

            <div className="max-w-lg">
              <p className="mb-4 text-sm font-medium uppercase tracking-wider text-indigo-400">Point of Sales</p>

              <h1 className="text-4xl font-bold leading-tight text-white xl:text-5xl">
                Kelola bisnis Anda
                <br />
                dengan lebih mudah.
              </h1>

              <p className="mt-6 max-w-md text-base leading-7 text-slate-400">Kelola transaksi, barang, stok, laporan, dan pengguna dalam satu sistem kasir yang sederhana.</p>
            </div>

            <p className="text-sm text-slate-500">© 2026 Kasirfy. All rights reserved.</p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex w-full items-center justify-center px-6 py-10 lg:w-1/2 lg:px-12">
          <div className="w-full max-w-md">
            {/* MOBILE LOGO */}
            <div className="mb-8 flex items-center justify-center gap-3 lg:hidden">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600">
                <Store size={22} className="text-white" />
              </div>

              <span className="text-xl font-semibold text-slate-900">Kasirfy</span>
            </div>

            {/* HEADER */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900">Selamat datang kembali</h2>

              <p className="mt-2 text-sm text-slate-500">Masuk ke akun Anda untuk melanjutkan.</p>
            </div>

            {/* ERROR */}
            {error && (
              <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-500" />

                <p className="text-sm leading-6 text-red-700">{error}</p>
              </div>
            )}

            {/* SUCCESS DEMO */}
            {demoFilled && (
              <div className="mb-5 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                <CheckCircle2 size={18} className="text-emerald-500" />

                <p className="text-sm text-emerald-700">Akun demo berhasil diisi.</p>
              </div>
            )}

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* IDENTIFIER */}
              <div>
                <label htmlFor="identifier" className="mb-2 block text-sm font-medium text-slate-700">
                  Email atau Username
                </label>

                <div className={`flex h-12 items-center rounded-xl border bg-white transition ${focusedField === 'identifier' ? 'border-indigo-500 ring-4 ring-indigo-500/10' : 'border-slate-200'}`}>
                  <div className="flex w-12 items-center justify-center">
                    <User size={19} className={focusedField === 'identifier' ? 'text-indigo-600' : 'text-slate-400'} />
                  </div>

                  <input
                    id="identifier"
                    type="text"
                    value={identifier}
                    onChange={(event) => setIdentifier(event.target.value)}
                    onFocus={() => setFocusedField('identifier')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Masukkan email atau username"
                    autoComplete="username"
                    disabled={loading}
                    className="h-full flex-1 bg-transparent pr-4 text-sm text-slate-900 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-700">
                  Password
                </label>

                <div className={`flex h-12 items-center rounded-xl border bg-white transition ${focusedField === 'password' ? 'border-indigo-500 ring-4 ring-indigo-500/10' : 'border-slate-200'}`}>
                  <div className="flex w-12 items-center justify-center">
                    <Lock size={19} className={focusedField === 'password' ? 'text-indigo-600' : 'text-slate-400'} />
                  </div>

                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Masukkan password"
                    autoComplete="current-password"
                    disabled={loading}
                    className="h-full flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed disabled:opacity-60"
                  />

                  <button type="button" onClick={() => setShowPassword((current) => !current)} disabled={loading} className="flex h-full w-12 items-center justify-center text-slate-400 transition hover:text-slate-600 disabled:cursor-not-allowed" aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}>
                    {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </div>
              </div>

              {/* FORGOT PASSWORD */}
              <div className="flex justify-end">
                <button type="button" className="text-sm font-medium text-indigo-600 transition hover:text-indigo-700">
                  Lupa password?
                </button>
              </div>

              {/* LOGIN BUTTON */}
              <button type="submit" disabled={loading} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60">
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                    <span>Memproses...</span>
                  </>
                ) : (
                  <>
                    <LogIn size={18} />

                    <span>Masuk</span>
                  </>
                )}
              </button>
            </form>

            {/* DEMO ACCOUNT */}
            <div className="mt-8 rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-slate-800">Akun Demo</p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">Gunakan akun berikut untuk mencoba aplikasi.</p>

                  <div className="mt-3 space-y-1 text-xs text-slate-500">
                    <p>
                      Username: <span className="font-medium text-slate-700">owner01</span>
                    </p>

                    <p>
                      Password: <span className="font-medium text-slate-700">owner123</span>
                    </p>
                  </div>
                </div>

                <button type="button" onClick={handleDemoAccount} disabled={loading} className="shrink-0 rounded-lg bg-slate-100 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60">
                  Isi Demo
                </button>
              </div>
            </div>

            {/* REGISTER */}
            <p className="mt-8 text-center text-sm text-slate-500">
              Belum memiliki akun?{' '}
              <button type="button" onClick={() => router.push('/register')} className="font-medium text-indigo-600 hover:text-indigo-700">
                Daftar sekarang
              </button>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}