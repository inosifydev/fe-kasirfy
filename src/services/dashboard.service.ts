/* =========================================================
   DASHBOARD SERVICE
========================================================= */

/* =========================
   TYPES - BARANG
========================= */

export interface DashboardBarang {
  id_barang: string;
  nama_barang: string;
  kategori: string;
  harga: number;
  stok: number;
  satuan: string;
  deskripsi: string;
  created_at: string;
  updated_at?: string;
  deleted_at?: string | null;
}

/* =========================
   TYPES - USER
========================= */

export interface DashboardUserRole {
  id_role: string;
  nama_role: string;
}

export interface DashboardUser {
  id_user: string;
  username: string;
  nama_lengkap: string;
  email: string;
  no_hp: string;
  is_active: boolean;
  created_at: string;
  role?: DashboardUserRole;
}

/* =========================
   TYPES - TRANSACTION
========================= */

export interface DashboardTransactionUser {
  id_user: string;
  username: string;
  nama_lengkap: string;
  email: string;
}

export interface DashboardTransactionProduct {
  id_barang: string;
  nama_barang: string;
  harga: number;
}

export interface DashboardTransactionDetail {
  id_detail_transaksi: string;
  id_transaksi: string;
  id_barang: string;
  jumlah: number;
  harga_satuan: number;
  subtotal: number;
  created_at: string;
  tb_barang?: DashboardTransactionProduct | null;
}

export interface DashboardTransaction {
  id_transaksi: string;
  id_user: string | null;
  tanggal_transaksi: string;
  total_harga: number;
  status: string;
  created_at: string;
  jenis_pembayaran?: string;
  dibayar?: number;
  kembalian?: number;
  status_pembayaran?: string;
  tb_user?: DashboardTransactionUser | null;
  tb_detail_transaksi?: DashboardTransactionDetail[];
}

/* =========================
   TYPES - API RESPONSE
========================= */

interface BarangApiResponse {
  success: boolean;
  status: number;
  message: string;
  data: DashboardBarang[];
  meta?: {
    timestamp?: string;
  };
}

interface UserApiResponse {
  success: boolean;
  status: number;
  message: string;
  data: DashboardUser[];
  meta?: {
    timestamp?: string;
  };
}

interface OrdersApiResponse {
  success: boolean;
  status: number;
  message: string;
  data: {
    count: number;
    data: DashboardTransaction[];
  };
  meta?: {
    timestamp?: string;
  };
}

/* =========================
   TYPES - DASHBOARD RESULT
========================= */

export interface DashboardRecentTransaction {
  id_transaksi: string;
  nama_kasir: string;
  total_harga: number;
  status: string;
  tanggal_transaksi: string;
}

export interface DashboardLowStockProduct {
  id_barang: string;
  nama_barang: string;
  stok: number;
  satuan: string;
}

export interface DashboardSalesData {
  hari: string;
  nilai: number;
}

export interface DashboardStatistics {
  totalPenjualanHariIni: number;
  totalTransaksiHariIni: number;
  totalBarang: number;
  totalPenggunaAktif: number;
}

export interface DashboardData {
  statistics: DashboardStatistics;
  recentTransactions: DashboardRecentTransaction[];
  lowStockProducts: DashboardLowStockProduct[];
  sales7Days: DashboardSalesData[];
  sales30Days: DashboardSalesData[];
}

/* =========================================================
   HELPER - API ERROR
========================================================= */

async function parseApiError(
  response: Response
): Promise<string> {
  try {
    const result = await response.json();

    if (
      result &&
      typeof result.message === "string"
    ) {
      return result.message;
    }
  } catch {
    // Abaikan jika response bukan JSON.
  }

  return `Request gagal dengan status ${response.status}`;
}

/* =========================================================
   GET BARANG
========================================================= */

export async function getDashboardBarang(): Promise<
  DashboardBarang[]
> {
  const response = await fetch(
    "/api/backend/barang",
    {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(
      await parseApiError(response)
    );
  }

  const result =
    (await response.json()) as BarangApiResponse;

  if (!result.success) {
    throw new Error(
      result.message || "Gagal memuat data barang."
    );
  }

  return result.data ?? [];
}

/* =========================================================
   GET USERS
========================================================= */

export async function getDashboardUsers(): Promise<
  DashboardUser[]
> {
  const response = await fetch(
    "/api/backend/users",
    {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(
      await parseApiError(response)
    );
  }

  const result =
    (await response.json()) as UserApiResponse;

  if (!result.success) {
    throw new Error(
      result.message ||
        "Gagal memuat data pengguna."
    );
  }

  return result.data ?? [];
}

/* =========================================================
   GET ORDERS
========================================================= */

export async function getDashboardOrders(): Promise<
  DashboardTransaction[]
> {
  const response = await fetch(
    "/api/backend/orders/",
    {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(
      await parseApiError(response)
    );
  }

  const result =
    (await response.json()) as OrdersApiResponse;

  if (!result.success) {
    throw new Error(
      result.message ||
        "Gagal memuat data transaksi."
    );
  }

  return result.data?.data ?? [];
}

/* =========================================================
   DATE HELPER
========================================================= */

/**
 * Membuat key tanggal berdasarkan waktu lokal browser.
 *
 * Contoh:
 * 2026-09-12
 */

function getDateKey(date: Date): string {
  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/* =========================================================
   TODAY CHECK
========================================================= */

function isToday(
  dateString: string
): boolean {
  const transactionDate =
    new Date(dateString);

  if (
    Number.isNaN(
      transactionDate.getTime()
    )
  ) {
    return false;
  }

  const today = new Date();

  return (
    getDateKey(transactionDate) ===
    getDateKey(today)
  );
}

/* =========================================================
   START OF DAY
========================================================= */

function startOfDay(
  date: Date
): Date {
  const result = new Date(date);

  result.setHours(
    0,
    0,
    0,
    0
  );

  return result;
}

/* =========================================================
   ADD DAYS
========================================================= */

function addDays(
  date: Date,
  amount: number
): Date {
  const result = new Date(date);

  result.setDate(
    result.getDate() + amount
  );

  return result;
}

/* =========================================================
   SALES - 7 DAYS
========================================================= */

function generateSales7Days(
  transactions: DashboardTransaction[]
): DashboardSalesData[] {
  const today = startOfDay(
    new Date()
  );

  /*
   * Mengambil 7 hari terakhir,
   * termasuk hari ini.
   *
   * Urutan:
   * hari ke-6 sebelumnya
   * ...
   * hari ini
   */

  const days: DashboardSalesData[] =
    [];

  for (
    let index = 6;
    index >= 0;
    index--
  ) {
    const date = addDays(
      today,
      -index
    );

    const dateKey =
      getDateKey(date);

    const total = transactions
      .filter((transaction) => {
        const transactionDate =
          new Date(
            transaction.tanggal_transaksi
          );

        return (
          !Number.isNaN(
            transactionDate.getTime()
          ) &&
          getDateKey(
            transactionDate
          ) === dateKey
        );
      })
      .reduce(
        (sum, transaction) =>
          sum +
          Number(
            transaction.total_harga
          ),
        0
      );

    const dayName =
      new Intl.DateTimeFormat(
        "id-ID",
        {
          weekday: "short",
        }
      ).format(date);

    days.push({
      hari:
        dayName.charAt(0).toUpperCase() +
        dayName.slice(1),
      nilai: total,
    });
  }

  return days;
}

/* =========================================================
   SALES - 30 DAYS
========================================================= */

function generateSales30Days(
  transactions: DashboardTransaction[]
): DashboardSalesData[] {
  const today = startOfDay(
    new Date()
  );

  /*
   * Untuk grafik 30 hari,
   * kita gunakan 7 titik:
   *
   * 30 hari lalu
   * 25 hari lalu
   * 20 hari lalu
   * 15 hari lalu
   * 10 hari lalu
   * 5 hari lalu
   * hari ini
   *
   * Setiap titik mewakili
   * penjualan pada tanggal tersebut.
   */

  const offsets = [
    30,
    25,
    20,
    15,
    10,
    5,
    0,
  ];

  return offsets.map(
    (offset) => {
      const date = addDays(
        today,
        -offset
      );

      const dateKey =
        getDateKey(date);

      const total = transactions
        .filter((transaction) => {
          const transactionDate =
            new Date(
              transaction.tanggal_transaksi
            );

          return (
            !Number.isNaN(
              transactionDate.getTime()
            ) &&
            getDateKey(
              transactionDate
            ) === dateKey
          );
        })
        .reduce(
          (sum, transaction) =>
            sum +
            Number(
              transaction.total_harga
            ),
          0
        );

      return {
        hari: String(
          date.getDate()
        ),
        nilai: total,
      };
    }
  );
}

/* =========================================================
   RECENT TRANSACTIONS
========================================================= */

function generateRecentTransactions(
  transactions: DashboardTransaction[]
): DashboardRecentTransaction[] {
  return [...transactions]
    .sort((a, b) => {
      const dateA =
        new Date(
          a.tanggal_transaksi
        ).getTime();

      const dateB =
        new Date(
          b.tanggal_transaksi
        ).getTime();

      return dateB - dateA;
    })
    .slice(0, 5)
    .map((transaction) => ({
      id_transaksi:
        transaction.id_transaksi,

      nama_kasir:
        transaction.tb_user
          ?.nama_lengkap ??
        "Tidak diketahui",

      total_harga:
        Number(
          transaction.total_harga
        ),

      status:
        transaction.status,

      tanggal_transaksi:
        transaction.tanggal_transaksi,
    }));
}

/* =========================================================
   LOW STOCK
========================================================= */

function generateLowStockProducts(
  barang: DashboardBarang[]
): DashboardLowStockProduct[] {
  return barang
    .filter(
      (item) =>
        item.stok > 0 &&
        item.stok <= 10
    )
    .sort(
      (a, b) =>
        a.stok - b.stok
    )
    .slice(0, 5)
    .map((item) => ({
      id_barang:
        item.id_barang,

      nama_barang:
        item.nama_barang,

      stok: Number(
        item.stok
      ),

      satuan:
        item.satuan,
    }));
}

/* =========================================================
   GET COMPLETE DASHBOARD DATA
========================================================= */

export async function getDashboardData(): Promise<
  DashboardData
> {
  /*
   * Jalankan ketiga API secara bersamaan
   * supaya Dashboard tidak perlu menunggu
   * request satu per satu.
   */

  const [
    barang,
    transactions,
    users,
  ] = await Promise.all([
    getDashboardBarang(),
    getDashboardOrders(),
    getDashboardUsers(),
  ]);

  /* =========================
     TRANSAKSI HARI INI
  ========================= */

  const todayTransactions =
    transactions.filter(
      (transaction) =>
        isToday(
          transaction.tanggal_transaksi
        )
    );

  /* =========================
     PENJUALAN HARI INI
  ========================= */

  const totalPenjualanHariIni =
    todayTransactions.reduce(
      (total, transaction) =>
        total +
        Number(
          transaction.total_harga
        ),
      0
    );

  /* =========================
     STATISTICS
  ========================= */

  const statistics: DashboardStatistics =
    {
      totalPenjualanHariIni,

      totalTransaksiHariIni:
        todayTransactions.length,

      totalBarang:
        barang.length,

      totalPenggunaAktif:
        users.filter(
          (user) =>
            user.is_active
        ).length,
    };

  /* =========================
     RETURN
  ========================= */

  return {
    statistics,

    recentTransactions:
      generateRecentTransactions(
        transactions
      ),

    lowStockProducts:
      generateLowStockProducts(
        barang
      ),

    sales7Days:
      generateSales7Days(
        transactions
      ),

    sales30Days:
      generateSales30Days(
        transactions
      ),
  };
}