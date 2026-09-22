"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  X,
  CreditCard,
  Banknote,
  Package,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowLeftRight,
  QrCode,
} from "lucide-react";

import { getSession } from "@/lib/auth";

/* =========================================================
   TYPES
========================================================= */

type Barang = {
  id_barang: string;
  nama_barang: string;
  kategori: string;
  harga: number;
  stok: number;
  satuan: string;
  deskripsi?: string | null;
  created_at?: string;
};

type CartItem = Barang & {
  jumlah: number;
};

type DetailTransaksi = {
  id_detail_transaksi: string;
  id_transaksi: string;
  id_barang: string;
  jumlah: number;
  harga_satuan: number;
  subtotal: number;
  created_at: string;
  tb_barang?: Barang;
};

type Transaksi = {
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
  tb_detail_transaksi?: DetailTransaksi[];
};

type PaymentMethod =
  | "tunai"
  | "qris"
  | "debit"
  | "transfer";

/* =========================================================
   HELPERS
========================================================= */

const formatRupiah = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
};

/* =========================================================
   PAGE
========================================================= */

export default function TransaksiPage() {
  /* =======================================================
     STATE BARANG
  ======================================================= */

  const [barang, setBarang] = useState<Barang[]>([]);
  const [loadingBarang, setLoadingBarang] = useState(true);
  const [barangError, setBarangError] = useState("");

  /* =======================================================
     SEARCH & FILTER
  ======================================================= */

  const [search, setSearch] = useState("");
  const [kategori, setKategori] = useState("Semua");

  /* =======================================================
     CART
  ======================================================= */

  const [cart, setCart] = useState<CartItem[]>([]);

  /* =======================================================
     PAYMENT
  ======================================================= */

  const [showPaymentModal, setShowPaymentModal] =
    useState(false);

  const [payment, setPayment] = useState("");

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("tunai");

  const [paymentError, setPaymentError] =
    useState("");

  const [processingPayment, setProcessingPayment] =
    useState(false);

  /* =======================================================
     SUCCESS
  ======================================================= */

  const [showSuccessModal, setShowSuccessModal] =
    useState(false);

  const [transaction, setTransaction] =
    useState<Transaksi | null>(null);

  /* =======================================================
     GENERAL ERROR
  ======================================================= */

  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  /* =======================================================
     FETCH BARANG
  ======================================================= */

  const fetchBarang = async () => {
    try {
      setLoadingBarang(true);
      setBarangError("");

      const response = await fetch(
        "/api/backend/barang",
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result?.message ||
            "Gagal mengambil data barang."
        );
      }

      /*
       * Backend bisa mengembalikan:
       *
       * data: [...]
       *
       * atau:
       *
       * data: {
       *   data: [...]
       * }
       */

      let dataBarang: Barang[] = [];

      if (Array.isArray(result.data)) {
        dataBarang = result.data;
      } else if (
        Array.isArray(result.data?.data)
      ) {
        dataBarang = result.data.data;
      }

      setBarang(dataBarang);
    } catch (error) {
      console.error(
        "FETCH BARANG ERROR:",
        error
      );

      setBarangError(
        error instanceof Error
          ? error.message
          : "Gagal mengambil data barang."
      );
    } finally {
      setLoadingBarang(false);
    }
  };

  useEffect(() => {
    fetchBarang();
  }, []);

  /* =======================================================
     CATEGORIES
  ======================================================= */

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(
        barang
          .map((item) => item.kategori)
          .filter(Boolean)
      )
    );

    return ["Semua", ...uniqueCategories];
  }, [barang]);

  /* =======================================================
     FILTER BARANG
  ======================================================= */

  const filteredBarang = useMemo(() => {
    return barang.filter((item) => {
      const matchSearch = item.nama_barang
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchCategory =
        kategori === "Semua" ||
        item.kategori === kategori;

      return matchSearch && matchCategory;
    });
  }, [barang, search, kategori]);

  /* =======================================================
     CART TOTAL
  ======================================================= */

  const totalHarga = useMemo(() => {
    return cart.reduce(
      (total, item) =>
        total + item.harga * item.jumlah,
      0
    );
  }, [cart]);

  const totalItem = useMemo(() => {
    return cart.reduce(
      (total, item) =>
        total + item.jumlah,
      0
    );
  }, [cart]);

  /* =======================================================
     PAYMENT VALUE
  ======================================================= */

  /*
   * Untuk tunai:
   * nominal berasal dari input user.
   *
   * Untuk QRIS / Debit / Transfer:
   * nominal dianggap sama dengan total transaksi.
   */

  const paymentAmount =
    paymentMethod === "tunai"
      ? Number(payment || 0)
      : totalHarga;

  const kembalian =
    paymentMethod === "tunai" &&
    paymentAmount >= totalHarga
      ? paymentAmount - totalHarga
      : 0;

  /* =======================================================
     ADD TO CART
  ======================================================= */

  const addToCart = (item: Barang) => {
    if (item.stok <= 0) {
      showToast(
        "error",
        "Stok barang habis."
      );
      return;
    }

    setCart((currentCart) => {
      const existingItem =
        currentCart.find(
          (cartItem) =>
            cartItem.id_barang ===
            item.id_barang
        );

      if (existingItem) {
        if (
          existingItem.jumlah >=
          item.stok
        ) {
          showToast(
            "error",
            `Stok ${item.nama_barang} hanya tersedia ${item.stok}.`
          );

          return currentCart;
        }

        return currentCart.map(
          (cartItem) =>
            cartItem.id_barang ===
            item.id_barang
              ? {
                  ...cartItem,
                  jumlah:
                    cartItem.jumlah + 1,
                }
              : cartItem
        );
      }

      return [
        ...currentCart,
        {
          ...item,
          jumlah: 1,
        },
      ];
    });
  };

  /* =======================================================
     INCREASE CART
  ======================================================= */

  const increaseQuantity = (
    id_barang: string
  ) => {
    setCart((currentCart) =>
      currentCart.map((item) => {
        if (
          item.id_barang !==
          id_barang
        ) {
          return item;
        }

        if (item.jumlah >= item.stok) {
          showToast(
            "error",
            `Stok ${item.nama_barang} hanya tersedia ${item.stok}.`
          );

          return item;
        }

        return {
          ...item,
          jumlah: item.jumlah + 1,
        };
      })
    );
  };

  /* =======================================================
     DECREASE CART
  ======================================================= */

  const decreaseQuantity = (
    id_barang: string
  ) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id_barang ===
          id_barang
            ? {
                ...item,
                jumlah:
                  item.jumlah - 1,
              }
            : item
        )
        .filter(
          (item) => item.jumlah > 0
        )
    );
  };

  /* =======================================================
     REMOVE CART
  ======================================================= */

  const removeFromCart = (
    id_barang: string
  ) => {
    setCart((currentCart) =>
      currentCart.filter(
        (item) =>
          item.id_barang !==
          id_barang
      )
    );
  };

  /* =======================================================
     CLEAR CART
  ======================================================= */

  const clearCart = () => {
    setCart([]);
  };

  /* =======================================================
     OPEN PAYMENT
  ======================================================= */

  const openPaymentModal = () => {
    if (cart.length === 0) {
      showToast(
        "error",
        "Keranjang masih kosong."
      );
      return;
    }

    setPayment("");
    setPaymentError("");
    setPaymentMethod("tunai");
    setShowPaymentModal(true);
  };

  /* =======================================================
     CLOSE PAYMENT
  ======================================================= */

  const closePaymentModal = () => {
    if (processingPayment) {
      return;
    }

    setShowPaymentModal(false);
    setPayment("");
    setPaymentError("");
  };

  /* =======================================================
     PAYMENT INPUT
  ======================================================= */

  const handlePaymentChange = (
    value: string
  ) => {
    /*
     * Hanya izinkan angka.
     */

    const numericValue =
      value.replace(
        /[^0-9]/g,
        ""
      );

    setPayment(numericValue);
    setPaymentError("");
  };

  /* =======================================================
     QUICK PAYMENT
  ======================================================= */

  const setQuickPayment = (
    amount: number
  ) => {
    setPayment(String(amount));
    setPaymentError("");
  };

  /* =======================================================
     PAYMENT METHOD
  ======================================================= */

  const handlePaymentMethodChange = (
    method: PaymentMethod
  ) => {
    setPaymentMethod(method);
    setPaymentError("");

    /*
     * Kalau bukan tunai,
     * input pembayaran tidak diperlukan.
     */

    if (method !== "tunai") {
      setPayment("");
    }
  };

  /* =======================================================
     HANDLE PAYMENT
  ======================================================= */

  const handlePayment = async () => {
    setPaymentError("");

    if (cart.length === 0) {
      setPaymentError(
        "Keranjang masih kosong."
      );
      return;
    }

    /*
     * Validasi hanya berlaku
     * untuk pembayaran tunai.
     */

    if (
      paymentMethod === "tunai" &&
      paymentAmount <= 0
    ) {
      setPaymentError(
        "Masukkan nominal pembayaran."
      );
      return;
    }

    if (
      paymentMethod === "tunai" &&
      paymentAmount < totalHarga
    ) {
      setPaymentError(
        `Pembayaran kurang ${formatRupiah(
          totalHarga - paymentAmount
        )}.`
      );
      return;
    }

    const session = getSession();

    if (!session) {
      setPaymentError(
        "Session pengguna tidak ditemukan. Silakan login kembali."
      );
      return;
    }

    if (!session.id_user) {
      setPaymentError(
        "ID user tidak ditemukan pada session."
      );
      return;
    }

    try {
      setProcessingPayment(true);

      /*
       * Payload dikirim ke backend.
       *
       * Contoh tunai:
       *
       * {
       *   id_user: "...",
       *   jenis_pembayaran: "tunai",
       *   dibayar: 100000,
       *   items: [...]
       * }
       *
       * Contoh QRIS:
       *
       * {
       *   id_user: "...",
       *   jenis_pembayaran: "qris",
       *   dibayar: 50000,
       *   items: [...]
       * }
       */

      const payload = {
        id_user: session.id_user,

        jenis_pembayaran:
          paymentMethod,

        dibayar:
          paymentMethod === "tunai"
            ? paymentAmount
            : totalHarga,

        items: cart.map((item) => ({
          id_barang:
            item.id_barang,
          jumlah: item.jumlah,
        })),
      };

      console.log(
        "ORDER PAYLOAD:",
        payload
      );

      const response = await fetch(
        "/api/backend/orders",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(
            payload
          ),
        }
      );

      const result =
        await response.json();

      console.log(
        "ORDER RESPONSE:",
        result
      );

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result?.message ||
            "Gagal membuat transaksi."
        );
      }

      /*
       * Response backend:
       *
       * data: {
       *   id_transaksi,
       *   id_user,
       *   tanggal_transaksi,
       *   total_harga,
       *   status,
       *   jenis_pembayaran,
       *   dibayar,
       *   kembalian,
       *   ...
       * }
       */

      const orderData =
        result.data;

      const newTransaction: Transaksi =
        {
          id_transaksi:
            orderData.id_transaksi,

          id_user:
            orderData.id_user ??
            session.id_user,

          tanggal_transaksi:
            orderData.tanggal_transaksi ??
            new Date().toISOString(),

          total_harga:
            Number(
              orderData.total_harga ??
                totalHarga
            ),

          status:
            orderData.status ??
            "selesai",

          created_at:
            orderData.created_at ??
            new Date().toISOString(),

          jenis_pembayaran:
            orderData.jenis_pembayaran ??
            paymentMethod,

          dibayar:
            Number(
              orderData.dibayar ??
                paymentAmount
            ),

          kembalian:
            Number(
              orderData.kembalian ??
                kembalian
            ),

          status_pembayaran:
            orderData.status_pembayaran ??
            "lunas",

          tb_detail_transaksi:
            orderData.tb_detail_transaksi ??
            [],
        };

      setTransaction(
        newTransaction
      );

      /*
       * Tutup payment modal
       */

      setShowPaymentModal(false);

      /*
       * Tampilkan success modal
       */

      setShowSuccessModal(true);

      /*
       * Bersihkan cart
       */

      setCart([]);

      /*
       * Reset payment
       */

      setPayment("");

      /*
       * Reset metode ke tunai
       * untuk transaksi berikutnya.
       */

      setPaymentMethod("tunai");

      /*
       * Ambil ulang data barang
       * agar stok sesuai database.
       */

      await fetchBarang();

      showToast(
        "success",
        "Transaksi berhasil dibuat."
      );
    } catch (error) {
      console.error(
        "CREATE ORDER ERROR:",
        error
      );

      setPaymentError(
        error instanceof Error
          ? error.message
          : "Gagal membuat transaksi."
      );
    } finally {
      setProcessingPayment(false);
    }
  };

  /* =======================================================
     TOAST
  ======================================================= */

  const showToast = (
    type: "success" | "error",
    message: string
  ) => {
    setToast({
      type,
      message,
    });

    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  /* =======================================================
     STATUS BARANG
  ======================================================= */

  const getStockStatus = (
    stok: number
  ) => {
    if (stok <= 0) {
      return {
        label: "Habis",
        className:
          "bg-red-50 text-red-600",
      };
    }

    if (stok <= 10) {
      return {
        label: "Menipis",
        className:
          "bg-amber-50 text-amber-600",
      };
    }

    return {
      label: "Tersedia",
      className:
        "bg-emerald-50 text-emerald-600",
    };
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="min-h-full bg-slate-50">
      {/* ===================================================
          TOAST
      =================================================== */}

      {toast && (
        <div className="fixed right-5 top-5 z-[100]">
          <div
            className={`flex items-center gap-3 rounded-xl border bg-white px-4 py-3 shadow-lg ${
              toast.type === "success"
                ? "border-emerald-200"
                : "border-red-200"
            }`}
          >
            {toast.type ===
            "success" ? (
              <CheckCircle2
                size={20}
                className="text-emerald-500"
              />
            ) : (
              <AlertCircle
                size={20}
                className="text-red-500"
              />
            )}

            <p className="text-sm font-medium text-slate-700">
              {toast.message}
            </p>
          </div>
        </div>
      )}

      {/* ===================================================
          HEADER
      =================================================== */}

      <div className="border-b border-slate-200 bg-white">
        <div className="px-6 py-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Transaksi
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Buat transaksi penjualan baru
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5">
                <Package
                  size={18}
                  className="text-slate-400"
                />

                <div>
                  <p className="text-xs text-slate-400">
                    Produk
                  </p>

                  <p className="text-sm font-semibold text-slate-800">
                    {barang.length}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5">
                <ShoppingCart
                  size={18}
                  className="text-slate-400"
                />

                <div>
                  <p className="text-xs text-slate-400">
                    Keranjang
                  </p>

                  <p className="text-sm font-semibold text-slate-800">
                    {totalItem}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===================================================
          MAIN
      =================================================== */}

      <div className="grid min-h-[calc(100vh-140px)] grid-cols-1 xl:grid-cols-[1fr_390px]">
        {/* =================================================
            PRODUCT SECTION
        ================================================= */}

        <section className="p-6">
          {/* SEARCH */}

          <div className="mb-5 flex flex-col gap-3 lg:flex-row">
            <div className="relative flex-1">
              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                placeholder="Cari nama barang..."
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
              />
            </div>
          </div>

          {/* CATEGORY */}

          <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
            {categories.map(
              (item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() =>
                    setKategori(item)
                  }
                  className={`whitespace-nowrap rounded-xl px-4 py-2 text-sm font-medium transition ${
                    kategori === item
                      ? "bg-slate-900 text-white"
                      : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {item}
                </button>
              )
            )}
          </div>

          {/* ERROR */}

          {barangError && (
            <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
              <AlertCircle
                size={20}
                className="mt-0.5 shrink-0 text-red-500"
              />

              <div>
                <p className="text-sm font-semibold text-red-700">
                  Gagal memuat barang
                </p>

                <p className="mt-1 text-sm text-red-600">
                  {barangError}
                </p>

                <button
                  type="button"
                  onClick={
                    fetchBarang
                  }
                  className="mt-3 text-sm font-semibold text-red-700 underline"
                >
                  Coba lagi
                </button>
              </div>
            </div>
          )}

          {/* LOADING */}

          {loadingBarang ? (
            <div className="flex min-h-[400px] items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <Loader2
                  size={28}
                  className="animate-spin text-slate-400"
                />

                <p className="text-sm text-slate-500">
                  Memuat data barang...
                </p>
              </div>
            </div>
          ) : filteredBarang.length ===
            0 ? (
            /* EMPTY */

            <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
                <Package
                  size={26}
                  className="text-slate-400"
                />
              </div>

              <h3 className="mt-4 text-sm font-semibold text-slate-800">
                Tidak ada barang
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                {search
                  ? "Barang yang dicari tidak ditemukan."
                  : "Belum ada data barang."}
              </p>
            </div>
          ) : (
            /* PRODUCT GRID */

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
              {filteredBarang.map(
                (item) => {
                  const stockStatus =
                    getStockStatus(
                      item.stok
                    );

                  return (
                    <div
                      key={
                        item.id_barang
                      }
                      className="group rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-slate-300 hover:shadow-sm"
                    >
                      {/* PRODUCT ICON */}

                      <div className="flex items-start justify-between">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
                          <Package
                            size={22}
                            className="text-slate-500"
                          />
                        </div>

                        <span
                          className={`rounded-lg px-2.5 py-1 text-xs font-medium ${stockStatus.className}`}
                        >
                          {
                            stockStatus.label
                          }
                        </span>
                      </div>

                      {/* PRODUCT INFO */}

                      <div className="mt-4">
                        <p className="line-clamp-2 min-h-[40px] text-sm font-semibold text-slate-800">
                          {
                            item.nama_barang
                          }
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {
                            item.kategori
                          }
                        </p>

                        <div className="mt-3 flex items-end justify-between gap-3">
                          <div>
                            <p className="text-base font-bold text-slate-900">
                              {formatRupiah(
                                item.harga
                              )}
                            </p>

                            <p className="mt-0.5 text-xs text-slate-400">
                              Stok:{" "}
                              {
                                item.stok
                              }{" "}
                              {
                                item.satuan
                              }
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              addToCart(
                                item
                              )
                            }
                            disabled={
                              item.stok <=
                              0
                            }
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
                            title="Tambah ke keranjang"
                          >
                            <Plus
                              size={18}
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          )}
        </section>

        {/* =================================================
            CART
        ================================================= */}

        <aside className="border-t border-slate-200 bg-white xl:border-l xl:border-t-0">
          <div className="sticky top-0 flex h-[calc(100vh-140px)] flex-col">
            {/* CART HEADER */}

            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                  <ShoppingCart
                    size={19}
                    className="text-slate-600"
                  />
                </div>

                <div>
                  <h2 className="text-sm font-bold text-slate-900">
                    Keranjang
                  </h2>

                  <p className="text-xs text-slate-400">
                    {totalItem} item
                  </p>
                </div>
              </div>

              {cart.length > 0 && (
                <button
                  type="button"
                  onClick={
                    clearCart
                  }
                  className="text-xs font-medium text-red-500 hover:text-red-600"
                >
                  Kosongkan
                </button>
              )}
            </div>

            {/* CART CONTENT */}

            <div className="flex-1 overflow-y-auto p-5">
              {cart.length === 0 ? (
                <div className="flex h-full min-h-[300px] flex-col items-center justify-center text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
                    <ShoppingCart
                      size={28}
                      className="text-slate-400"
                    />
                  </div>

                  <h3 className="mt-4 text-sm font-semibold text-slate-800">
                    Keranjang kosong
                  </h3>

                  <p className="mt-1 max-w-[220px] text-xs leading-5 text-slate-400">
                    Tambahkan barang dari
                    daftar produk untuk
                    membuat transaksi.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map(
                    (item) => (
                      <div
                        key={
                          item.id_barang
                        }
                        className="rounded-xl border border-slate-200 p-3"
                      >
                        <div className="flex gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                            <Package
                              size={17}
                              className="text-slate-500"
                            />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <p className="line-clamp-2 text-sm font-semibold text-slate-800">
                                {
                                  item.nama_barang
                                }
                              </p>

                              <button
                                type="button"
                                onClick={() =>
                                  removeFromCart(
                                    item.id_barang
                                  )
                                }
                                className="shrink-0 text-slate-400 transition hover:text-red-500"
                              >
                                <Trash2
                                  size={
                                    15
                                  }
                                />
                              </button>
                            </div>

                            <p className="mt-1 text-xs text-slate-400">
                              {formatRupiah(
                                item.harga
                              )}{" "}
                              /{" "}
                              {
                                item.satuan
                              }
                            </p>

                            <div className="mt-3 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() =>
                                    decreaseQuantity(
                                      item.id_barang
                                    )
                                  }
                                  className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-100"
                                >
                                  <Minus
                                    size={
                                      14
                                    }
                                  />
                                </button>

                                <span className="min-w-[24px] text-center text-sm font-semibold text-slate-800">
                                  {
                                    item.jumlah
                                  }
                                </span>

                                <button
                                  type="button"
                                  onClick={() =>
                                    increaseQuantity(
                                      item.id_barang
                                    )
                                  }
                                  className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-100"
                                >
                                  <Plus
                                    size={
                                      14
                                    }
                                  />
                                </button>
                              </div>

                              <p className="text-sm font-bold text-slate-900">
                                {formatRupiah(
                                  item.harga *
                                    item.jumlah
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>

            {/* CART FOOTER */}

            <div className="border-t border-slate-200 p-5">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">
                    Total item
                  </span>

                  <span className="font-medium text-slate-800">
                    {totalItem}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-600">
                    Total pembayaran
                  </span>

                  <span className="text-lg font-bold text-slate-900">
                    {formatRupiah(
                      totalHarga
                    )}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={
                  openPaymentModal
                }
                disabled={
                  cart.length === 0
                }
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
              >
                <CreditCard
                  size={18}
                />

                Bayar Sekarang
              </button>
            </div>
          </div>
        </aside>
      </div>

      {/* =====================================================
          PAYMENT MODAL
      ===================================================== */}

      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl">

            {/* HEADER */}

            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Pembayaran
                </h2>

                <p className="mt-0.5 text-xs text-slate-400">
                  Pilih metode dan selesaikan pembayaran
                </p>
              </div>

              <button
                type="button"
                onClick={
                  closePaymentModal
                }
                disabled={
                  processingPayment
                }
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 disabled:cursor-not-allowed"
              >
                <X size={18} />
              </button>
            </div>

            {/* CONTENT */}

            <div className="p-5">

              {/* TOTAL */}

              <div className="rounded-xl bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">
                    Total yang harus dibayar
                  </span>

                  <span className="text-xl font-bold text-slate-900">
                    {formatRupiah(
                      totalHarga
                    )}
                  </span>
                </div>
              </div>

              {/* PAYMENT METHOD */}

              <div className="mt-5">
                <label className="mb-3 block text-sm font-medium text-slate-700">
                  Metode Pembayaran
                </label>

                <div className="grid grid-cols-2 gap-3">

                  {/* TUNAI */}

                  <button
                    type="button"
                    onClick={() =>
                      handlePaymentMethodChange(
                        "tunai"
                      )
                    }
                    disabled={
                      processingPayment
                    }
                    className={`flex items-center gap-3 rounded-xl border p-3 text-left transition ${
                      paymentMethod ===
                      "tunai"
                        ? "border-slate-400 bg-slate-50 ring-2 ring-slate-100"
                        : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                        paymentMethod ===
                        "tunai"
                          ? "bg-white"
                          : "bg-slate-100"
                      }`}
                    >
                      <Banknote
                        size={19}
                        className={
                          paymentMethod ===
                          "tunai"
                            ? "text-slate-700"
                            : "text-slate-500"
                        }
                      />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        Tunai
                      </p>

                      <p className="mt-0.5 text-[11px] text-slate-400">
                        Uang fisik
                      </p>
                    </div>
                  </button>

                  {/* QRIS */}

                  <button
                    type="button"
                    onClick={() =>
                      handlePaymentMethodChange(
                        "qris"
                      )
                    }
                    disabled={
                      processingPayment
                    }
                    className={`flex items-center gap-3 rounded-xl border p-3 text-left transition ${
                      paymentMethod ===
                      "qris"
                        ? "border-slate-400 bg-slate-50 ring-2 ring-slate-100"
                        : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                        paymentMethod ===
                        "qris"
                          ? "bg-white"
                          : "bg-slate-100"
                      }`}
                    >
                      <QrCode
                        size={19}
                        className={
                          paymentMethod ===
                          "qris"
                            ? "text-slate-700"
                            : "text-slate-500"
                        }
                      />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        QRIS
                      </p>

                      <p className="mt-0.5 text-[11px] text-slate-400">
                        Scan QR
                      </p>
                    </div>
                  </button>

                  {/* DEBIT */}

                  <button
                    type="button"
                    onClick={() =>
                      handlePaymentMethodChange(
                        "debit"
                      )
                    }
                    disabled={
                      processingPayment
                    }
                    className={`flex items-center gap-3 rounded-xl border p-3 text-left transition ${
                      paymentMethod ===
                      "debit"
                        ? "border-slate-400 bg-slate-50 ring-2 ring-slate-100"
                        : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                        paymentMethod ===
                        "debit"
                          ? "bg-white"
                          : "bg-slate-100"
                      }`}
                    >
                      <CreditCard
                        size={19}
                        className={
                          paymentMethod ===
                          "debit"
                            ? "text-slate-700"
                            : "text-slate-500"
                        }
                      />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        Debit
                      </p>

                      <p className="mt-0.5 text-[11px] text-slate-400">
                        Kartu debit
                      </p>
                    </div>
                  </button>

                  {/* TRANSFER */}

                  <button
                    type="button"
                    onClick={() =>
                      handlePaymentMethodChange(
                        "transfer"
                      )
                    }
                    disabled={
                      processingPayment
                    }
                    className={`flex items-center gap-3 rounded-xl border p-3 text-left transition ${
                      paymentMethod ===
                      "transfer"
                        ? "border-slate-400 bg-slate-50 ring-2 ring-slate-100"
                        : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                        paymentMethod ===
                        "transfer"
                          ? "bg-white"
                          : "bg-slate-100"
                      }`}
                    >
                      <ArrowLeftRight
                        size={19}
                        className={
                          paymentMethod ===
                          "transfer"
                            ? "text-slate-700"
                            : "text-slate-500"
                        }
                      />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        Transfer
                      </p>

                      <p className="mt-0.5 text-[11px] text-slate-400">
                        Transfer bank
                      </p>
                    </div>
                  </button>

                </div>
              </div>

              {/* =================================================
                  CASH PAYMENT
              ================================================= */}

              {paymentMethod ===
                "tunai" && (
                <div className="mt-5">

                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Uang diterima
                  </label>

                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400">
                      Rp
                    </span>

                    <input
                      type="text"
                      inputMode="numeric"
                      value={
                        payment
                          ? new Intl.NumberFormat(
                              "id-ID"
                            ).format(
                              Number(
                                payment
                              )
                            )
                          : ""
                      }
                      onChange={(e) =>
                        handlePaymentChange(
                          e.target
                            .value
                        )
                      }
                      placeholder="0"
                      disabled={
                        processingPayment
                      }
                      className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-right text-lg font-semibold text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100 disabled:bg-slate-100"
                    />
                  </div>

                  {/* QUICK AMOUNT */}

                  <div className="mt-3 flex flex-wrap gap-2">
                    {[
                      totalHarga,
                      Math.ceil(
                        totalHarga /
                          10000
                      ) * 10000,
                      Math.ceil(
                        totalHarga /
                          50000
                      ) * 50000,
                      Math.ceil(
                        totalHarga /
                          100000
                      ) * 100000,
                    ]
                      .filter(
                        (
                          value,
                          index,
                          array
                        ) =>
                          array.indexOf(
                            value
                          ) ===
                          index
                      )
                      .map(
                        (amount) => (
                          <button
                            key={
                              amount
                            }
                            type="button"
                            onClick={() =>
                              setQuickPayment(
                                amount
                              )
                            }
                            disabled={
                              processingPayment
                            }
                            className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed"
                          >
                            {formatRupiah(
                              amount
                            )}
                          </button>
                        )
                      )}
                  </div>

                  {/* CHANGE */}

                  <div className="mt-5 rounded-xl border border-slate-200 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">
                        Kembalian
                      </span>

                      <span
                        className={`text-lg font-bold ${
                          paymentAmount >=
                          totalHarga
                            ? "text-emerald-600"
                            : "text-slate-400"
                        }`}
                      >
                        {formatRupiah(
                          kembalian
                        )}
                      </span>
                    </div>
                  </div>

                </div>
              )}

              {/* =================================================
                  NON CASH PAYMENT
              ================================================= */}

              {paymentMethod !==
                "tunai" && (
                <div className="mt-5">

                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-slate-400">
                          Metode pembayaran
                        </p>

                        <p className="mt-1 text-sm font-semibold capitalize text-slate-800">
                          {paymentMethod}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-xs text-slate-400">
                          Nominal
                        </p>

                        <p className="mt-1 text-sm font-bold text-slate-900">
                          {formatRupiah(
                            totalHarga
                          )}
                        </p>
                      </div>
                    </div>

                  </div>

                  <div className="mt-3 flex items-start gap-2 rounded-xl border border-amber-100 bg-amber-50 p-3">
                    <AlertCircle
                      size={16}
                      className="mt-0.5 shrink-0 text-amber-500"
                    />

                    <p className="text-xs leading-5 text-amber-700">
                      Pastikan pembayaran{" "}
                      <span className="font-semibold uppercase">
                        {paymentMethod}
                      </span>{" "}
                      sudah diterima sebelum
                      mengonfirmasi transaksi.
                    </p>
                  </div>

                </div>
              )}

              {/* ERROR */}

              {paymentError && (
                <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3">
                  <AlertCircle
                    size={17}
                    className="mt-0.5 shrink-0 text-red-500"
                  />

                  <p className="text-sm text-red-600">
                    {paymentError}
                  </p>
                </div>
              )}

              {/* BUTTON */}

              <button
                type="button"
                onClick={
                  handlePayment
                }
                disabled={
                  processingPayment ||
                  (paymentMethod ===
                    "tunai" &&
                    paymentAmount <
                      totalHarga)
                }
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
              >
                {processingPayment ? (
                  <>
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />

                    Memproses...
                  </>
                ) : (
                  <>
                    {paymentMethod ===
                    "tunai" ? (
                      <Banknote
                        size={18}
                      />
                    ) : paymentMethod ===
                      "qris" ? (
                      <QrCode
                        size={18}
                      />
                    ) : paymentMethod ===
                      "debit" ? (
                      <CreditCard
                        size={18}
                      />
                    ) : (
                      <ArrowLeftRight
                        size={18}
                      />
                    )}

                    {paymentMethod ===
                    "tunai"
                      ? "Konfirmasi Pembayaran"
                      : "Konfirmasi Pembayaran"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          SUCCESS MODAL
      ===================================================== */}

      {showSuccessModal &&
        transaction && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl">

              {/* SUCCESS ICON */}

              <div className="flex flex-col items-center px-6 pb-5 pt-7 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
                  <CheckCircle2
                    size={36}
                    className="text-emerald-500"
                  />
                </div>

                <h2 className="mt-4 text-xl font-bold text-slate-900">
                  Transaksi Berhasil
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Transaksi berhasil
                  disimpan ke sistem.
                </p>
              </div>

              {/* TRANSACTION DETAIL */}

              <div className="border-y border-slate-200 px-6 py-5">
                <div className="space-y-3">

                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-slate-500">
                      ID Transaksi
                    </span>

                    <span className="max-w-[220px] truncate text-right text-xs font-medium text-slate-700">
                      {
                        transaction.id_transaksi
                      }
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">
                      Total
                    </span>

                    <span className="text-sm font-bold text-slate-900">
                      {formatRupiah(
                        transaction.total_harga
                      )}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">
                      Dibayar
                    </span>

                    <span className="text-sm font-medium text-slate-700">
                      {formatRupiah(
                        Number(
                          transaction.dibayar ??
                            paymentAmount
                        )
                      )}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">
                      Kembalian
                    </span>

                    <span className="text-sm font-semibold text-emerald-600">
                      {formatRupiah(
                        Number(
                          transaction.kembalian ??
                            0
                        )
                      )}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">
                      Pembayaran
                    </span>

                    <span className="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-medium capitalize text-emerald-600">
                      {transaction.jenis_pembayaran ??
                        "tunai"}
                    </span>
                  </div>

                </div>
              </div>

              {/* ACTION */}

              <div className="p-5">
                <button
                  type="button"
                  onClick={() =>
                    setShowSuccessModal(
                      false
                    )
                  }
                  className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
                >
                  Selesai
                </button>
              </div>

            </div>
          </div>
        )}
    </div>
  );
}