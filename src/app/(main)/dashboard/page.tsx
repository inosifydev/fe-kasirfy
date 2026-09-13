"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Package,
  ShoppingCart,
  Users,
  Wallet,
} from "lucide-react";

import { getSession } from "@/lib/auth";
import type { AuthSession } from "@/features/user/types";
import {
  getDashboardData,
  type DashboardData,
  type DashboardSalesData,
} from "@/services/dashboard.service";

/* =========================
   MAIN COMPONENT
========================= */

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] =
    useState<AuthSession | null>(null);

  const [dashboard, setDashboard] =
    useState<DashboardData | null>(null);

  const [period, setPeriod] =
    useState<"7" | "30">("7");

  const [activeStat, setActiveStat] =
    useState<string | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  /* =========================
     SESSION + DASHBOARD DATA
  ========================= */

  useEffect(() => {
    let mounted = true;

    async function loadDashboard() {
      const session = getSession();

      if (!session) {
        router.replace("/login");
        return;
      }

      if (!mounted) return;

      setUser(session);
      setLoading(true);
      setError(null);

      try {
        const data =
          await getDashboardData();

        if (!mounted) return;

        setDashboard(data);
      } catch (err) {
        console.error(
          "Dashboard error:",
          err
        );

        if (!mounted) return;

        setError(
          err instanceof Error
            ? err.message
            : "Gagal memuat data dashboard."
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      mounted = false;
    };
  }, [router]);

  /* =========================
     INITIAL LOADING
  ========================= */

  if (!user || loading) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-7 w-7 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-600" />

          <p className="text-sm text-slate-400">
            Memuat dashboard...
          </p>
        </div>
      </div>
    );
  }

  /* =========================
     ERROR
  ========================= */

  if (error || !dashboard) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-slate-50 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto flex min-h-[400px] max-w-[1600px] items-center justify-center">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-red-50">
              <AlertTriangle
                size={22}
                className="text-red-500"
              />
            </div>

            <h2 className="mt-4 text-base font-semibold text-slate-900">
              Gagal memuat dashboard
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              {error ??
                "Data dashboard tidak dapat dimuat."}
            </p>

            <button
              type="button"
              onClick={() =>
                window.location.reload()
              }
              className="mt-5 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              Coba lagi
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* =========================
     HELPERS
  ========================= */

  const formatRupiah = (
    value: number
  ) => {
    return new Intl.NumberFormat(
      "id-ID",
      {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
      }
    ).format(value);
  };

  const formatDate = (
    dateString: string
  ) => {
    const date =
      new Date(dateString);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return "-";
    }

    const now = new Date();

    const dateKey =
      `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}-${String(
        date.getDate()
      ).padStart(2, "0")}`;

    const todayKey =
      `${now.getFullYear()}-${String(
        now.getMonth() + 1
      ).padStart(2, "0")}-${String(
        now.getDate()
      ).padStart(2, "0")}`;

    const yesterday =
      new Date(now);

    yesterday.setDate(
      yesterday.getDate() - 1
    );

    const yesterdayKey =
      `${yesterday.getFullYear()}-${String(
        yesterday.getMonth() + 1
      ).padStart(2, "0")}-${String(
        yesterday.getDate()
      ).padStart(2, "0")}`;

    const time =
      new Intl.DateTimeFormat(
        "id-ID",
        {
          hour: "2-digit",
          minute: "2-digit",
        }
      ).format(date);

    if (dateKey === todayKey) {
      return `Hari ini, ${time}`;
    }

    if (
      dateKey === yesterdayKey
    ) {
      return `Kemarin, ${time}`;
    }

    return new Intl.DateTimeFormat(
      "id-ID",
      {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }
    ).format(date);
  };

  const formatStatus = (
    status: string
  ) => {
    if (!status) {
      return "-";
    }

    return (
      status.charAt(0).toUpperCase() +
      status.slice(1)
    );
  };

  const currentDate =
    new Intl.DateTimeFormat(
      "id-ID",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    ).format(new Date());

  /* =========================
     STATISTICS
  ========================= */

  const {
    totalPenjualanHariIni,
    totalTransaksiHariIni,
    totalBarang,
    totalPenggunaAktif,
  } = dashboard.statistics;

  /* =========================
     SALES
  ========================= */

  const salesData =
    period === "7"
      ? dashboard.sales7Days
      : dashboard.sales30Days;

  const totalSales =
    salesData.reduce(
      (total, item) =>
        total + item.nilai,
      0
    );

  /* =========================
     DATA
  ========================= */

  const recentTransactions =
    dashboard.recentTransactions;

  const lowStockProducts =
    dashboard.lowStockProducts;

  /* =========================
     STAT CLICK
  ========================= */

  const handleStatClick = (
    title: string
  ) => {
    setActiveStat(title);

    if (title === "Barang") {
      router.push("/barang");
      return;
    }

    if (title === "Transaksi") {
      router.push("/transaksi");
      return;
    }

    if (title === "Pengguna") {
      router.push("/pengguna");
      return;
    }
  };

  return (
    <div className="min-h-full bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1600px]">
        {/* =====================================
            HEADER
        ===================================== */}

        <section className="mb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Selamat datang kembali
              </p>

              <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
                {user.nama_lengkap}
              </h1>

              <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
                <span className="font-medium text-indigo-600">
                  {user.role.nama_role}
                </span>

                <span className="text-slate-300">
                  •
                </span>

                <span className="text-slate-400">
                  @{user.username}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-500">
              <CalendarDays
                size={17}
                className="text-indigo-500"
              />

              <span>{currentDate}</span>
            </div>
          </div>
        </section>

        {/* =====================================
            STATISTICS
        ===================================== */}

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <DashboardCard
            title="Penjualan"
            value={formatRupiah(
              totalPenjualanHariIni
            )}
            description="Hari ini"
            icon={Wallet}
            iconClass="bg-emerald-50 text-emerald-600"
            hoverClass="hover:border-emerald-200"
            onClick={() =>
              handleStatClick(
                "Penjualan"
              )
            }
            active={
              activeStat ===
              "Penjualan"
            }
          />

          <DashboardCard
            title="Transaksi"
            value={String(
              totalTransaksiHariIni
            )}
            description="Hari ini"
            icon={ShoppingCart}
            iconClass="bg-blue-50 text-blue-600"
            hoverClass="hover:border-blue-200"
            onClick={() =>
              handleStatClick(
                "Transaksi"
              )
            }
            active={
              activeStat ===
              "Transaksi"
            }
          />

          <DashboardCard
            title="Barang"
            value={String(
              totalBarang
            )}
            description="Terdaftar"
            icon={Package}
            iconClass="bg-orange-50 text-orange-600"
            hoverClass="hover:border-orange-200"
            onClick={() =>
              handleStatClick(
                "Barang"
              )
            }
            active={
              activeStat ===
              "Barang"
            }
          />

          <DashboardCard
            title="Pengguna"
            value={String(
              totalPenggunaAktif
            )}
            description="Aktif"
            icon={Users}
            iconClass="bg-violet-50 text-violet-600"
            hoverClass="hover:border-violet-200"
            onClick={() =>
              handleStatClick(
                "Pengguna"
              )
            }
            active={
              activeStat ===
              "Pengguna"
            }
          />
        </section>

        {/* =====================================
            SALES + LOW STOCK
        ===================================== */}

        <section className="mt-6 grid gap-6 xl:grid-cols-[1.6fr_1fr]">
          {/* =====================================
              SALES SUMMARY
          ===================================== */}

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            {/* HEADER */}

            <div className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50">
                    <Wallet
                      size={15}
                      className="text-indigo-600"
                    />
                  </div>

                  <h2 className="text-sm font-semibold text-slate-900">
                    Ringkasan Penjualan
                  </h2>
                </div>

                <p className="mt-2 text-xs text-slate-400">
                  Performa penjualan berdasarkan periode
                </p>
              </div>

              {/* PERIOD */}

              <div className="flex w-fit items-center rounded-lg bg-slate-100 p-1">
                <button
                  type="button"
                  onClick={() =>
                    setPeriod("7")
                  }
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                    period === "7"
                      ? "bg-white text-indigo-600 shadow-sm"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  7 Hari
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setPeriod("30")
                  }
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                    period === "30"
                      ? "bg-white text-indigo-600 shadow-sm"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  30 Hari
                </button>
              </div>
            </div>

            {/* TOTAL */}

            <div className="px-5 pb-2 sm:px-6">
              <p className="text-2xl font-bold tracking-tight text-indigo-600">
                {formatRupiah(
                  totalSales
                )}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Total periode terpilih
              </p>
            </div>

            {/* CHART */}

            <div className="px-5 pb-5 sm:px-6">
              <SalesChart
                key={period}
                data={salesData}
                formatRupiah={
                  formatRupiah
                }
              />
            </div>
          </div>

          {/* =====================================
              LOW STOCK
          ===================================== */}

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            {/* HEADER */}

            <div className="flex items-center justify-between px-5 py-4 sm:px-6">
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50">
                    <AlertTriangle
                      size={15}
                      className="text-amber-600"
                    />
                  </div>

                  <h2 className="text-sm font-semibold text-slate-900">
                    Stok Menipis
                  </h2>
                </div>

                <p className="mt-2 text-xs text-slate-400">
                  Barang yang perlu diperhatikan
                </p>
              </div>

              <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50">
                <AlertTriangle
                  size={17}
                  className="text-amber-600"
                />

                {lowStockProducts.length >
                  0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500 px-1 text-[9px] font-semibold text-white">
                    {
                      lowStockProducts.length
                    }
                  </span>
                )}
              </div>
            </div>

            {/* PRODUCTS */}

            {lowStockProducts.length >
            0 ? (
              <div className="divide-y divide-slate-100">
                {lowStockProducts.map(
                  (product) => (
                    <button
                      key={
                        product.id_barang
                      }
                      type="button"
                      onClick={() =>
                        router.push(
                          "/barang"
                        )
                      }
                      className="group flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-amber-50/40 sm:px-6"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-50 transition group-hover:bg-orange-100">
                          <Package
                            size={16}
                            className="text-orange-500"
                          />
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-slate-800">
                            {
                              product.nama_barang
                            }
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            Stok tersisa
                          </p>
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-3">
                        <div className="text-right">
                          <p className="text-sm font-semibold text-orange-600">
                            {
                              product.stok
                            }
                          </p>

                          <p className="text-[11px] text-slate-400">
                            {
                              product.satuan
                            }
                          </p>
                        </div>

                        <ArrowRight
                          size={15}
                          className="text-slate-300 transition-all group-hover:translate-x-0.5 group-hover:text-orange-500"
                        />
                      </div>
                    </button>
                  )
                )}
              </div>
            ) : (
              <div className="flex min-h-[180px] flex-col items-center justify-center px-5 text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
                  <CheckCircle2
                    size={19}
                    className="text-emerald-600"
                  />
                </div>

                <p className="mt-3 text-sm font-medium text-slate-700">
                  Semua stok aman
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Tidak ada barang dengan stok menipis.
                </p>
              </div>
            )}

            {/* FOOTER */}

            <div className="border-t border-slate-100 px-5 py-3 sm:px-6">
              <button
                type="button"
                onClick={() =>
                  router.push(
                    "/barang"
                  )
                }
                className="flex items-center gap-1 text-xs font-medium text-orange-600 transition hover:text-orange-700"
              >
                Kelola stok barang

                <ArrowUpRight
                  size={13}
                />
              </button>
            </div>
          </div>
        </section>

        {/* =====================================
            RECENT TRANSACTIONS
        ===================================== */}

        <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          {/* HEADER */}

          <div className="flex items-center justify-between px-5 py-4 sm:px-6">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
                  <ShoppingCart
                    size={15}
                    className="text-blue-600"
                  />
                </div>

                <h2 className="text-sm font-semibold text-slate-900">
                  Transaksi Terbaru
                </h2>
              </div>

              <p className="mt-2 text-xs text-slate-400">
                Daftar transaksi terakhir
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                router.push(
                  "/transaksi"
                )
              }
              className="group flex items-center gap-1 text-xs font-medium text-blue-600 transition hover:text-blue-700"
            >
              Lihat semua

              <ArrowUpRight
                size={14}
                className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </button>
          </div>

          {/* =====================================
              DESKTOP TABLE
          ===================================== */}

          <div className="hidden overflow-x-auto md:block">
            {recentTransactions.length >
            0 ? (
              <table className="w-full">
                <thead>
                  <tr className="border-y border-slate-100 bg-slate-50/70">
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400">
                      ID Transaksi
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400">
                      Kasir
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400">
                      Waktu
                    </th>

                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-400">
                      Total
                    </th>

                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-400">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {recentTransactions.map(
                    (transaction) => (
                      <tr
                        key={
                          transaction.id_transaksi
                        }
                        onClick={() =>
                          router.push(
                            "/transaksi"
                          )
                        }
                        className="group cursor-pointer transition hover:bg-blue-50/40"
                      >
                        {/* ID */}

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 transition group-hover:bg-blue-100">
                              <ShoppingCart
                                size={15}
                                className="text-blue-600"
                              />
                            </div>

                            <span className="text-sm font-medium text-slate-800">
                              #
                              {transaction.id_transaksi.slice(
                                0,
                                8
                              ).toUpperCase()}
                            </span>
                          </div>
                        </td>

                        {/* KASIR */}

                        <td className="px-6 py-4 text-sm text-slate-600">
                          {
                            transaction.nama_kasir
                          }
                        </td>

                        {/* WAKTU */}

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 text-sm text-slate-500">
                            <Clock3
                              size={14}
                              className="text-slate-400"
                            />

                            {formatDate(
                              transaction.tanggal_transaksi
                            )}
                          </div>
                        </td>

                        {/* TOTAL */}

                        <td className="px-6 py-4 text-right text-sm font-semibold text-slate-900">
                          {formatRupiah(
                            transaction.total_harga
                          )}
                        </td>

                        {/* STATUS */}

                        <td className="px-6 py-4 text-right">
                          <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-600">
                            <CheckCircle2
                              size={13}
                            />

                            {formatStatus(
                              transaction.status
                            )}
                          </span>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            ) : (
              <EmptyTransactions />
            )}
          </div>

          {/* =====================================
              MOBILE
          ===================================== */}

          <div className="divide-y divide-slate-100 md:hidden">
            {recentTransactions.length >
            0 ? (
              recentTransactions.map(
                (transaction) => (
                  <button
                    key={
                      transaction.id_transaksi
                    }
                    type="button"
                    onClick={() =>
                      router.push(
                        "/transaksi"
                      )
                    }
                    className="group w-full px-5 py-4 text-left transition hover:bg-blue-50/40"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 transition group-hover:bg-blue-100">
                          <ShoppingCart
                            size={15}
                            className="text-blue-600"
                          />
                        </div>

                        <div className="min-w-0">
                          <p className="text-sm font-medium text-slate-800">
                            #
                            {transaction.id_transaksi.slice(
                              0,
                              8
                            ).toUpperCase()}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            {
                              transaction.nama_kasir
                            }
                          </p>
                        </div>
                      </div>

                      <p className="shrink-0 text-sm font-semibold text-slate-900">
                        {formatRupiah(
                          transaction.total_harga
                        )}
                      </p>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <Clock3
                          size={13}
                        />

                        {formatDate(
                          transaction.tanggal_transaksi
                        )}
                      </div>

                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600">
                        <CheckCircle2
                          size={12}
                        />

                        {formatStatus(
                          transaction.status
                        )}
                      </span>
                    </div>
                  </button>
                )
              )
            ) : (
              <EmptyTransactions />
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

/* =========================
   DASHBOARD CARD
========================= */

interface DashboardCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ComponentType<{
    size?: number;
    className?: string;
  }>;
  iconClass: string;
  hoverClass: string;
  onClick?: () => void;
  active?: boolean;
}

function DashboardCard({
  title,
  value,
  description,
  icon: Icon,
  iconClass,
  hoverClass,
  onClick,
  active,
}: DashboardCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group w-full rounded-2xl border bg-white p-5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm active:translate-y-0 ${hoverClass} ${
        active
          ? "border-slate-400 ring-2 ring-slate-100"
          : "border-slate-200"
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            {value}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {description}
          </p>
        </div>

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200 group-hover:scale-105 ${iconClass}`}
        >
          <Icon size={19} />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-1 text-[11px] font-medium text-slate-400 opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100">
        Lihat detail

        <ArrowRight size={12} />
      </div>
    </button>
  );
}

/* =========================
   SALES CHART
========================= */

interface SalesChartProps {
  data: DashboardSalesData[];
  formatRupiah: (value: number) => string;
}

function SalesChart({
  data,
  formatRupiah,
}: SalesChartProps) {
  const maxValue = Math.max(
    ...data.map(
      (item) => item.nilai
    ),
    100000
  );

  return (
    <div className="pt-5">
      <div className="relative h-64">
        {/* GRID */}

        <div className="absolute inset-0 flex flex-col justify-between">
          {[4, 3, 2, 1, 0].map(
            (item) => (
              <div
                key={item}
                className="flex items-center gap-3"
              >
                <span className="w-14 shrink-0 text-right text-[10px] text-slate-400">
                  {formatRupiah(
                    Math.round(
                      (maxValue / 4) *
                        item
                    )
                  )}
                </span>

                <div className="h-px flex-1 bg-slate-100" />
              </div>
            )
          )}
        </div>

        {/* BARS */}

        <div className="absolute inset-0 ml-[68px] flex items-end justify-between gap-2">
          {data.map(
            (item, index) => {
              const height =
                item.nilai === 0
                  ? 2
                  : Math.max(
                      (item.nilai /
                        maxValue) *
                        100,
                      4
                    );

              return (
                <div
                  key={`${item.hari}-${index}`}
                  className="group flex h-full flex-1 flex-col items-center justify-end"
                >
                  {/* TOOLTIP */}

                  <div className="mb-2 translate-y-1 opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
                    <div className="whitespace-nowrap rounded-lg bg-slate-900 px-2.5 py-1.5 text-[10px] font-medium text-white shadow-sm">
                      {formatRupiah(
                        item.nilai
                      )}
                    </div>
                  </div>

                  {/* BAR */}

                  <div className="flex h-[calc(100%-30px)] w-full items-end justify-center">
                    <div
                      className="w-full max-w-10 origin-bottom rounded-t-md bg-indigo-300 transition-all duration-300 group-hover:bg-indigo-500"
                      style={{
                        height: `${height}%`,
                        animation:
                          "dashboardBarGrow 500ms ease-out both",
                      }}
                    />
                  </div>

                  {/* LABEL */}

                  <span className="mt-3 text-[11px] font-medium text-slate-400 transition-colors group-hover:text-indigo-600">
                    {item.hari}
                  </span>
                </div>
              );
            }
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes dashboardBarGrow {
          from {
            transform: scaleY(0);
            opacity: 0;
          }

          to {
            transform: scaleY(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

/* =========================
   EMPTY TRANSACTIONS
========================= */

function EmptyTransactions() {
  return (
    <div className="flex min-h-[180px] flex-col items-center justify-center px-5 text-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
        <ShoppingCart
          size={19}
          className="text-slate-400"
        />
      </div>

      <p className="mt-3 text-sm font-medium text-slate-700">
        Belum ada transaksi
      </p>

      <p className="mt-1 text-xs text-slate-400">
        Belum ada data transaksi yang tersedia.
      </p>
    </div>
  );
}