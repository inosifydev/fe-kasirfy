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

/* =========================
   TYPES
========================= */

interface RecentTransaction {
  id_transaksi: string;
  nama_kasir: string;
  total_harga: number;
  status: string;
  tanggal_transaksi: string;
}

interface LowStockProduct {
  id_barang: string;
  nama_barang: string;
  stok: number;
  satuan: string;
}

interface SalesData {
  hari: string;
  nilai: number;
}

/* =========================
   DUMMY DATA
========================= */

const recentTransactions: RecentTransaction[] = [
  {
    id_transaksi: "#INV-001",
    nama_kasir: "Administrator",
    total_harga: 25000,
    status: "Selesai",
    tanggal_transaksi: "Hari ini, 14:32",
  },
  {
    id_transaksi: "#INV-002",
    nama_kasir: "Administrator",
    total_harga: 18000,
    status: "Selesai",
    tanggal_transaksi: "Hari ini, 13:18",
  },
  {
    id_transaksi: "#INV-003",
    nama_kasir: "Administrator",
    total_harga: 42000,
    status: "Selesai",
    tanggal_transaksi: "Hari ini, 11:45",
  },
  {
    id_transaksi: "#INV-004",
    nama_kasir: "Administrator",
    total_harga: 10000,
    status: "Selesai",
    tanggal_transaksi: "Kemarin, 19:21",
  },
];

const lowStockProducts: LowStockProduct[] = [
  {
    id_barang: "1",
    nama_barang: "Susu Ultra Milk",
    stok: 8,
    satuan: "kotak",
  },
  {
    id_barang: "2",
    nama_barang: "Sabun Lifebuoy",
    stok: 4,
    satuan: "pcs",
  },
];

/* =========================
   SALES DATA - 7 HARI
========================= */

const sales7Days: SalesData[] = [
  {
    hari: "Sen",
    nilai: 45000,
  },
  {
    hari: "Sel",
    nilai: 68000,
  },
  {
    hari: "Rab",
    nilai: 52000,
  },
  {
    hari: "Kam",
    nilai: 85000,
  },
  {
    hari: "Jum",
    nilai: 72000,
  },
  {
    hari: "Sab",
    nilai: 95000,
  },
  {
    hari: "Min",
    nilai: 0,
  },
];

/* =========================
   SALES DATA - 30 HARI
========================= */

const sales30Days: SalesData[] = [
  {
    hari: "1",
    nilai: 25000,
  },
  {
    hari: "5",
    nilai: 48000,
  },
  {
    hari: "10",
    nilai: 32000,
  },
  {
    hari: "15",
    nilai: 75000,
  },
  {
    hari: "20",
    nilai: 56000,
  },
  {
    hari: "25",
    nilai: 92000,
  },
  {
    hari: "30",
    nilai: 68000,
  },
];

/* =========================
   MAIN COMPONENT
========================= */

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState<AuthSession | null>(null);

  const [period, setPeriod] = useState<"7" | "30">("7");

  const [activeStat, setActiveStat] = useState<string | null>(
    null
  );

  /* =========================
     SESSION
  ========================= */

  useEffect(() => {
    const session = getSession();

    if (!session) {
      router.replace("/login");
      return;
    }

    setUser(session);
  }, [router]);

  /* =========================
     LOADING
  ========================= */

  if (!user) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900" />
      </div>
    );
  }

  /* =========================
     HELPERS
  ========================= */

  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const currentDate = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  /* =========================
     SALES
  ========================= */

  const salesData =
    period === "7" ? sales7Days : sales30Days;

  const totalSales = salesData.reduce(
    (total, item) => total + item.nilai,
    0
  );

  /* =========================
     STAT CLICK
  ========================= */

  const handleStatClick = (title: string) => {
    setActiveStat(title);

    if (title === "Barang") {
      router.push("/barang");
      return;
    }

    if (title === "Transaksi") {
      router.push("/transaksi");
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
            value="Rp 0"
            description="Hari ini"
            icon={Wallet}
            iconClass="bg-emerald-50 text-emerald-600"
            hoverClass="hover:border-emerald-200"
            onClick={() =>
              handleStatClick("Penjualan")
            }
            active={activeStat === "Penjualan"}
          />

          <DashboardCard
            title="Transaksi"
            value="0"
            description="Hari ini"
            icon={ShoppingCart}
            iconClass="bg-blue-50 text-blue-600"
            hoverClass="hover:border-blue-200"
            onClick={() =>
              handleStatClick("Transaksi")
            }
            active={activeStat === "Transaksi"}
          />

          <DashboardCard
            title="Barang"
            value="9"
            description="Terdaftar"
            icon={Package}
            iconClass="bg-orange-50 text-orange-600"
            hoverClass="hover:border-orange-200"
            onClick={() =>
              handleStatClick("Barang")
            }
            active={activeStat === "Barang"}
          />

          <DashboardCard
            title="Pengguna"
            value="0"
            description="Aktif"
            icon={Users}
            iconClass="bg-violet-50 text-violet-600"
            hoverClass="hover:border-violet-200"
            onClick={() =>
              handleStatClick("Pengguna")
            }
            active={activeStat === "Pengguna"}
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
                  onClick={() => setPeriod("7")}
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
                  onClick={() => setPeriod("30")}
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
                {formatRupiah(totalSales)}
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
                formatRupiah={formatRupiah}
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

                {lowStockProducts.length > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500 px-1 text-[9px] font-semibold text-white">
                    {lowStockProducts.length}
                  </span>
                )}
              </div>
            </div>

            {/* PRODUCTS */}

            <div className="divide-y divide-slate-100">
              {lowStockProducts.map((product) => (
                <button
                  key={product.id_barang}
                  type="button"
                  onClick={() => router.push("/barang")}
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
                        {product.nama_barang}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        Stok tersisa
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm font-semibold text-orange-600">
                        {product.stok}
                      </p>

                      <p className="text-[11px] text-slate-400">
                        {product.satuan}
                      </p>
                    </div>

                    <ArrowRight
                      size={15}
                      className="text-slate-300 transition-all group-hover:translate-x-0.5 group-hover:text-orange-500"
                    />
                  </div>
                </button>
              ))}
            </div>

            {/* FOOTER */}

            <div className="border-t border-slate-100 px-5 py-3 sm:px-6">
              <button
                type="button"
                onClick={() => router.push("/barang")}
                className="flex items-center gap-1 text-xs font-medium text-orange-600 transition hover:text-orange-700"
              >
                Kelola stok barang

                <ArrowUpRight size={13} />
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
              onClick={() => router.push("/transaksi")}
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
                      key={transaction.id_transaksi}
                      onClick={() =>
                        router.push("/transaksi")
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
                            {
                              transaction.id_transaksi
                            }
                          </span>
                        </div>
                      </td>

                      {/* KASIR */}

                      <td className="px-6 py-4 text-sm text-slate-600">
                        {transaction.nama_kasir}
                      </td>

                      {/* WAKTU */}

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-sm text-slate-500">
                          <Clock3
                            size={14}
                            className="text-slate-400"
                          />

                          {
                            transaction.tanggal_transaksi
                          }
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
                          <CheckCircle2 size={13} />

                          {transaction.status}
                        </span>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>

          {/* =====================================
              MOBILE
          ===================================== */}

          <div className="divide-y divide-slate-100 md:hidden">
            {recentTransactions.map(
              (transaction) => (
                <button
                  key={transaction.id_transaksi}
                  type="button"
                  onClick={() =>
                    router.push("/transaksi")
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
                          {
                            transaction.id_transaksi
                          }
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
                      <Clock3 size={13} />

                      {
                        transaction.tanggal_transaksi
                      }
                    </div>

                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600">
                      <CheckCircle2 size={12} />

                      {transaction.status}
                    </span>
                  </div>
                </button>
              )
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
  data: SalesData[];
  formatRupiah: (value: number) => string;
}

function SalesChart({
  data,
  formatRupiah,
}: SalesChartProps) {
  const maxValue = Math.max(
    ...data.map((item) => item.nilai),
    100000
  );

  return (
    <div className="pt-5">
      <div className="relative h-64">
        {/* GRID */}

        <div className="absolute inset-0 flex flex-col justify-between">
          {[4, 3, 2, 1, 0].map((item) => (
            <div
              key={item}
              className="flex items-center gap-3"
            >
              <span className="w-14 shrink-0 text-right text-[10px] text-slate-400">
                {formatRupiah(
                  Math.round(
                    (maxValue / 4) * item
                  )
                )}
              </span>

              <div className="h-px flex-1 bg-slate-100" />
            </div>
          ))}
        </div>

        {/* BARS */}

        <div className="absolute inset-0 ml-[68px] flex items-end justify-between gap-2">
          {data.map((item, index) => {
            const height =
              item.nilai === 0
                ? 2
                : Math.max(
                    (item.nilai / maxValue) * 100,
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
                    {formatRupiah(item.nilai)}
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
          })}
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