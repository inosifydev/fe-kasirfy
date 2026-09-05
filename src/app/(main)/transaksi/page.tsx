"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Minus,
  Plus,
  Search,
  ShoppingCart,
  Trash2,
  X,
  CreditCard,
  Banknote,
  CheckCircle2,
  Package,
  Receipt,
  Sparkles,
  AlertCircle,
} from "lucide-react";

interface Barang {
  id_barang: string;
  nama_barang: string;
  kategori: string;
  harga: number;
  stok: number;
  satuan: string;
  deskripsi: string;
  created_at: string;
}

interface CartItem extends Barang {
  jumlah: number;
  subtotal: number;
}

interface Transaksi {
  id_transaksi: string;
  id_user: string;
  tanggal_transaksi: string;
  total_harga: number;
  status: string;
  created_at: string;
}

interface DetailTransaksi {
  id_detail_transaksi: string;
  id_transaksi: string;
  id_barang: string;
  jumlah: number;
  harga_satuan: number;
  subtotal: number;
  created_at: string;
}

/* =========================
   DUMMY USER
========================= */

const dummyUser = {
  id_user: crypto.randomUUID(),
  username: "admin",
  nama_lengkap: "Administrator",
};

/* =========================
   DUMMY BARANG
========================= */

const initialBarang: Barang[] = [
  {
    id_barang: crypto.randomUUID(),
    nama_barang: "Indomie Goreng",
    kategori: "Makanan",
    harga: 3000,
    stok: 120,
    satuan: "pcs",
    deskripsi: "Mi instan goreng",
    created_at: "2026-09-01",
  },
  {
    id_barang: crypto.randomUUID(),
    nama_barang: "Aqua 600ml",
    kategori: "Minuman",
    harga: 3000,
    stok: 85,
    satuan: "botol",
    deskripsi: "Air mineral 600ml",
    created_at: "2026-09-01",
  },
  {
    id_barang: crypto.randomUUID(),
    nama_barang: "Teh Pucuk Harum",
    kategori: "Minuman",
    harga: 4000,
    stok: 61,
    satuan: "botol",
    deskripsi: "Teh kemasan",
    created_at: "2026-09-02",
  },
  {
    id_barang: crypto.randomUUID(),
    nama_barang: "Kopi Good Day",
    kategori: "Minuman",
    harga: 4000,
    stok: 48,
    satuan: "pcs",
    deskripsi: "Kopi instan",
    created_at: "2026-09-02",
  },
  {
    id_barang: crypto.randomUUID(),
    nama_barang: "Roti Coklat",
    kategori: "Makanan",
    harga: 5000,
    stok: 35,
    satuan: "pcs",
    deskripsi: "Roti isi coklat",
    created_at: "2026-09-03",
  },
  {
    id_barang: crypto.randomUUID(),
    nama_barang: "Chitato Original",
    kategori: "Snack",
    harga: 11000,
    stok: 27,
    satuan: "pcs",
    deskripsi: "Keripik kentang",
    created_at: "2026-09-03",
  },
  {
    id_barang: crypto.randomUUID(),
    nama_barang: "SilverQueen",
    kategori: "Snack",
    harga: 15000,
    stok: 18,
    satuan: "pcs",
    deskripsi: "Cokelat batang",
    created_at: "2026-09-04",
  },
  {
    id_barang: crypto.randomUUID(),
    nama_barang: "Susu Ultra Milk",
    kategori: "Minuman",
    harga: 7000,
    stok: 8,
    satuan: "kotak",
    deskripsi: "Susu UHT",
    created_at: "2026-09-04",
  },
  {
    id_barang: crypto.randomUUID(),
    nama_barang: "Sabun Lifebuoy",
    kategori: "Kebutuhan",
    harga: 4500,
    stok: 4,
    satuan: "pcs",
    deskripsi: "Sabun mandi",
    created_at: "2026-09-04",
  },
];

/* =========================
   CATEGORY
========================= */

const categories = [
  "Semua",
  "Makanan",
  "Minuman",
  "Snack",
  "Kebutuhan",
];

/* =========================
   QUICK PAYMENT
========================= */

const quickPayments = [
  10000,
  20000,
  50000,
  100000,
];

export default function TransaksiPage() {
  const [barang, setBarang] =
    useState<Barang[]>(initialBarang);

  const [cart, setCart] = useState<CartItem[]>([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Semua");

  const [showPaymentModal, setShowPaymentModal] =
    useState(false);

  const [payment, setPayment] = useState("");

  const [transactionSuccess, setTransactionSuccess] =
    useState(false);

  const [lastTransaction, setLastTransaction] =
    useState<Transaksi | null>(null);

  const [lastDetails, setLastDetails] =
    useState<DetailTransaksi[]>([]);

  const [toast, setToast] = useState<string | null>(
    null
  );

  const [isProcessing, setIsProcessing] =
    useState(false);

  const [isCartOpen, setIsCartOpen] = useState(false);

  const [selectedProduct, setSelectedProduct] =
    useState<string | null>(null);

  /* =========================
     TOAST
  ========================= */

  const showToast = (message: string) => {
    setToast(message);

    setTimeout(() => {
      setToast(null);
    }, 1800);
  };

  /* =========================
     ESC CLOSE
  ========================= */

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") {
        return;
      }

      if (showPaymentModal) {
        setShowPaymentModal(false);
      }

      if (isCartOpen) {
        setIsCartOpen(false);
      }
    };

    window.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [showPaymentModal, isCartOpen]);

  /* =========================
     FILTER BARANG
  ========================= */

  const filteredBarang = useMemo(() => {
    return barang.filter((item) => {
      const matchSearch = item.nama_barang
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchCategory =
        category === "Semua" ||
        item.kategori === category;

      return matchSearch && matchCategory;
    });
  }, [barang, search, category]);

  /* =========================
     TOTAL
  ========================= */

  const totalItem = cart.reduce(
    (total, item) => total + item.jumlah,
    0
  );

  const totalHarga = cart.reduce(
    (total, item) => total + item.subtotal,
    0
  );

  const paymentAmount = Number(payment) || 0;

  const change =
    paymentAmount >= totalHarga
      ? paymentAmount - totalHarga
      : 0;

  /* =========================
     FORMAT RUPIAH
  ========================= */

  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  /* =========================
     TAMBAH KE KERANJANG
  ========================= */

  const addToCart = (item: Barang) => {
    if (item.stok <= 0) {
      showToast("Stok barang habis");
      return;
    }

    const existing = cart.find(
      (cartItem) =>
        cartItem.id_barang === item.id_barang
    );

    if (existing) {
      if (existing.jumlah >= item.stok) {
        showToast(
          `Stok ${item.nama_barang} tidak mencukupi`
        );
        return;
      }

      setCart((prev) =>
        prev.map((cartItem) =>
          cartItem.id_barang === item.id_barang
            ? {
                ...cartItem,
                jumlah: cartItem.jumlah + 1,
                subtotal:
                  (cartItem.jumlah + 1) *
                  cartItem.harga,
              }
            : cartItem
        )
      );

      setSelectedProduct(item.id_barang);

      setTimeout(() => {
        setSelectedProduct(null);
      }, 300);

      showToast(`${item.nama_barang} ditambahkan`);

      return;
    }

    setCart((prev) => [
      ...prev,
      {
        ...item,
        jumlah: 1,
        subtotal: item.harga,
      },
    ]);

    setSelectedProduct(item.id_barang);

    setTimeout(() => {
      setSelectedProduct(null);
    }, 300);

    showToast(`${item.nama_barang} ditambahkan`);
  };

  /* =========================
     TAMBAH JUMLAH
  ========================= */

  const increaseQuantity = (id_barang: string) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id_barang !== id_barang) {
          return item;
        }

        if (item.jumlah >= item.stok) {
          showToast("Jumlah sudah mencapai stok");
          return item;
        }

        const jumlahBaru = item.jumlah + 1;

        return {
          ...item,
          jumlah: jumlahBaru,
          subtotal: jumlahBaru * item.harga,
        };
      })
    );
  };

  /* =========================
     KURANGI JUMLAH
  ========================= */

  const decreaseQuantity = (id_barang: string) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id_barang !== id_barang) {
            return item;
          }

          const jumlahBaru = item.jumlah - 1;

          return {
            ...item,
            jumlah: jumlahBaru,
            subtotal: jumlahBaru * item.harga,
          };
        })
        .filter((item) => item.jumlah > 0)
    );
  };

  /* =========================
     HAPUS DARI KERANJANG
  ========================= */

  const removeFromCart = (id_barang: string) => {
    const item = cart.find(
      (cartItem) =>
        cartItem.id_barang === id_barang
    );

    setCart((prev) =>
      prev.filter(
        (cartItem) =>
          cartItem.id_barang !== id_barang
      )
    );

    if (item) {
      showToast(`${item.nama_barang} dihapus`);
    }
  };

  /* =========================
     KOSONGKAN KERANJANG
  ========================= */

  const clearCart = () => {
    if (cart.length === 0) {
      return;
    }

    setCart([]);
    showToast("Keranjang dikosongkan");
  };

  /* =========================
     PROSES PEMBAYARAN
  ========================= */

  const handlePayment = () => {
    if (paymentAmount < totalHarga) {
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      const idTransaksi =
        crypto.randomUUID();

      /* =========================
         DATA TB_TRANSAKSI
      ========================= */

      const transaksi: Transaksi = {
        id_transaksi: idTransaksi,
        id_user: dummyUser.id_user,
        tanggal_transaksi:
          new Date().toISOString(),
        total_harga: totalHarga,
        status: "selesai",
        created_at:
          new Date().toISOString(),
      };

      /* =========================
         DATA TB_DETAIL_TRANSAKSI
      ========================= */

      const detail: DetailTransaksi[] =
        cart.map((item) => ({
          id_detail_transaksi:
            crypto.randomUUID(),
          id_transaksi: idTransaksi,
          id_barang: item.id_barang,
          jumlah: item.jumlah,
          harga_satuan: item.harga,
          subtotal: item.subtotal,
          created_at:
            new Date().toISOString(),
        }));

      setLastTransaction(transaksi);
      setLastDetails(detail);

      /* =========================
         UPDATE STOK DUMMY
      ========================= */

      setBarang((prev) =>
        prev.map((barangItem) => {
          const cartItem = cart.find(
            (item) =>
              item.id_barang ===
              barangItem.id_barang
          );

          if (!cartItem) {
            return barangItem;
          }

          return {
            ...barangItem,
            stok:
              barangItem.stok -
              cartItem.jumlah,
          };
        })
      );

      setIsProcessing(false);
      setShowPaymentModal(false);
      setTransactionSuccess(true);
    }, 600);
  };

  /* =========================
     TRANSAKSI BARU
  ========================= */

  const resetTransaction = () => {
    setCart([]);
    setPayment("");
    setTransactionSuccess(false);
    setLastTransaction(null);
    setLastDetails([]);
    setIsCartOpen(false);
  };

  /* =========================
     QUICK PAYMENT
  ========================= */

  const handleQuickPayment = (
    amount: number
  ) => {
    setPayment(String(amount));
  };

  return (
    <>
      <main className="min-h-full bg-slate-50 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-[1600px]">
          {/* =========================
              MOBILE CART BUTTON
          ========================= */}

          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-200 transition hover:scale-105 hover:bg-indigo-700 active:scale-95 lg:hidden"
          >
            <ShoppingCart size={21} />

            {totalItem > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-500 px-1 text-[10px] font-bold text-white ring-2 ring-white">
                {totalItem}
              </span>
            )}
          </button>

          <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
            {/* =========================
                LEFT PRODUCT
            ========================= */}

            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              {/* HEADER */}

              <div className="border-b border-slate-100 p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50">
                      <Receipt
                        size={19}
                        className="text-indigo-600"
                      />
                    </div>

                    <div>
                      <h1 className="text-base font-semibold text-slate-900">
                        Buat Transaksi
                      </h1>

                      <p className="mt-0.5 text-xs text-slate-400">
                        Pilih barang untuk ditambahkan
                      </p>
                    </div>
                  </div>

                  <div className="hidden items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 sm:flex">
                    <Sparkles
                      size={14}
                      className="text-emerald-500"
                    />

                    <span className="text-xs font-medium text-emerald-600">
                      Kasir Aktif
                    </span>
                  </div>
                </div>

                {/* SEARCH */}

                <div className="relative mt-5">
                  <Search
                    size={18}
                    className={`absolute left-3 top-1/2 -translate-y-1/2 transition ${
                      search
                        ? "text-indigo-500"
                        : "text-slate-400"
                    }`}
                  />

                  <input
                    type="text"
                    value={search}
                    onChange={(e) =>
                      setSearch(e.target.value)
                    }
                    placeholder="Cari nama barang..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-10 text-sm outline-none transition placeholder:text-slate-400 text-slate-400 focus:border-indigo-300 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                  />

                  {search && (
                    <button
                      type="button"
                      onClick={() => setSearch("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                    >
                      <X size={15} />
                    </button>
                  )}
                </div>

                {/* CATEGORY */}

                <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
                  {categories.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() =>
                        setCategory(item)
                      }
                      className={`whitespace-nowrap rounded-lg px-3.5 py-2 text-xs font-medium transition-all duration-200 ${
                        category === item
                          ? "bg-indigo-600 text-white shadow-sm shadow-indigo-200"
                          : "bg-slate-50 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* PRODUCT */}

              <div className="p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h2 className="font-semibold text-slate-900">
                      Daftar Barang
                    </h2>

                    <p className="mt-1 text-xs text-slate-400">
                      Klik barang untuk menambahkan
                    </p>
                  </div>

                  <span className="rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-600">
                    {filteredBarang.length} produk
                  </span>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredBarang.map((item) => {
                    const cartItem = cart.find(
                      (cartItem) =>
                        cartItem.id_barang ===
                        item.id_barang
                    );

                    const quantityInCart =
                      cartItem?.jumlah || 0;

                    const isOutOfStock =
                      item.stok === 0;

                    const isLowStock =
                      item.stok > 0 &&
                      item.stok <= 10;

                    const isSelected =
                      selectedProduct ===
                      item.id_barang;

                    return (
                      <div
                        key={item.id_barang}
                        role="button"
                        tabIndex={
                          isOutOfStock ? -1 : 0
                        }
                        onClick={() =>
                          addToCart(item)
                        }
                        onKeyDown={(event) => {
                          if (
                            event.key ===
                              "Enter" ||
                            event.key === " "
                          ) {
                            event.preventDefault();
                            addToCart(item);
                          }
                        }}
                        className={`group relative rounded-xl border p-4 text-left transition-all duration-200 ${
                          isOutOfStock
                            ? "cursor-not-allowed border-slate-200 opacity-50"
                            : isSelected
                              ? "scale-[0.98] border-indigo-300 bg-indigo-50 shadow-sm"
                              : quantityInCart > 0
                                ? "cursor-pointer border-indigo-200 bg-indigo-50/30 shadow-sm hover:-translate-y-0.5"
                                : "cursor-pointer border-slate-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-indigo-50/20 hover:shadow-sm"
                        }`}
                      >
                        {/* SELECTED INDICATOR */}

                        {quantityInCart > 0 && (
                          <div className="absolute right-3 top-3">
                            <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-indigo-600 px-2 text-[11px] font-semibold text-white shadow-sm shadow-indigo-200">
                              {quantityInCart}
                            </span>
                          </div>
                        )}

                        <div className="flex items-start justify-between gap-3">
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-xl transition ${
                              quantityInCart > 0
                                ? "bg-indigo-100"
                                : "bg-indigo-50 group-hover:bg-indigo-100"
                            }`}
                          >
                            <Package
                              size={18}
                              className="text-indigo-600"
                            />
                          </div>
                        </div>

                        <p className="mt-4 line-clamp-1 text-sm font-semibold text-slate-800">
                          {item.nama_barang}
                        </p>

                        <span className="mt-1 inline-block rounded-md bg-slate-100 px-2 py-1 text-[10px] font-medium text-slate-500">
                          {item.kategori}
                        </span>

                        <div className="mt-4 flex items-end justify-between">
                          <div>
                            <p className="text-sm font-bold text-indigo-600">
                              {formatRupiah(
                                item.harga
                              )}
                            </p>

                            <p
                              className={`mt-1 text-[11px] ${
                                isLowStock
                                  ? "font-semibold text-orange-500"
                                  : "text-slate-400"
                              }`}
                            >
                              Stok {item.stok}{" "}
                              {item.satuan}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              addToCart(item);
                            }}
                            disabled={
                              isOutOfStock ||
                              quantityInCart >=
                                item.stok
                            }
                            aria-label={`Tambah ${item.nama_barang}`}
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 transition-all hover:bg-indigo-600 hover:text-white hover:shadow-sm hover:shadow-indigo-200 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 disabled:shadow-none"
                          >
                            <Plus size={17} />
                          </button>
                        </div>

                        {/* OUT OF STOCK */}

                        {isOutOfStock && (
                          <div className="absolute inset-x-0 bottom-0 rounded-b-xl bg-slate-100 py-1.5 text-center">
                            <span className="text-[10px] font-semibold text-slate-500">
                              Stok Habis
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* EMPTY */}

                {filteredBarang.length === 0 && (
                  <div className="py-16 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50">
                      <Search
                        size={22}
                        className="text-indigo-400"
                      />
                    </div>

                    <p className="mt-3 text-sm font-medium text-slate-600">
                      Barang tidak ditemukan
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Coba gunakan kata kunci lain
                    </p>

                    <button
                      type="button"
                      onClick={() => {
                        setSearch("");
                        setCategory("Semua");
                      }}
                      className="mt-4 rounded-lg bg-indigo-50 px-3 py-2 text-xs font-medium text-indigo-600 transition hover:bg-indigo-100"
                    >
                      Reset pencarian
                    </button>
                  </div>
                )}
              </div>
            </section>

            {/* =========================
                RIGHT CART DESKTOP
            ========================= */}

            <section className="hidden h-fit flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:sticky lg:top-6 lg:flex">
              <CartContent
                cart={cart}
                totalItem={totalItem}
                totalHarga={totalHarga}
                formatRupiah={formatRupiah}
                increaseQuantity={
                  increaseQuantity
                }
                decreaseQuantity={
                  decreaseQuantity
                }
                removeFromCart={removeFromCart}
                clearCart={clearCart}
                onPayment={() =>
                  setShowPaymentModal(true)
                }
              />
            </section>
          </div>
        </div>
      </main>

      {/* =========================
          MOBILE CART
      ========================= */}

      {isCartOpen && (
        <div className="fixed inset-0 z-[90] lg:hidden">
          <div
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px]"
            onClick={() => setIsCartOpen(false)}
          />

          <div className="absolute bottom-0 left-0 right-0 max-h-[90vh] overflow-hidden rounded-t-2xl bg-white shadow-2xl">
            <CartContent
              cart={cart}
              totalItem={totalItem}
              totalHarga={totalHarga}
              formatRupiah={formatRupiah}
              increaseQuantity={
                increaseQuantity
              }
              decreaseQuantity={
                decreaseQuantity
              }
              removeFromCart={removeFromCart}
              clearCart={clearCart}
              onPayment={() => {
                setIsCartOpen(false);
                setShowPaymentModal(true);
              }}
              mobile
              onClose={() =>
                setIsCartOpen(false)
              }
            />
          </div>
        </div>
      )}

      {/* =========================
          PAYMENT MODAL
      ========================= */}

      {showPaymentModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-[2px]">
          <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50">
                  <Banknote
                    size={19}
                    className="text-amber-600"
                  />
                </div>

                <div>
                  <h2 className="font-semibold text-slate-900">
                    Pembayaran
                  </h2>

                  <p className="mt-1 text-xs text-slate-400">
                    Masukkan jumlah uang pelanggan
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowPaymentModal(false)
                }
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={19} />
              </button>
            </div>

            <div className="p-5">
              {/* TOTAL */}

              <div className="rounded-xl bg-indigo-50 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-indigo-500">
                      Total Pembayaran
                    </p>

                    <p className="mt-1 text-2xl font-bold text-indigo-700">
                      {formatRupiah(totalHarga)}
                    </p>
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white">
                    <Receipt
                      size={18}
                      className="text-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* PAYMENT */}

              <div className="mt-5">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Uang Dibayar
                </label>

                <div className="relative">
                  <Banknote
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500"
                  />

                  <input
                    type="number"
                    inputMode="numeric"
                    autoFocus
                    value={payment}
                    onChange={(e) =>
                      setPayment(e.target.value)
                    }
                    placeholder="0"
                    min={0}
                    className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-lg font-semibold text-slate-900 outline-none transition placeholder:text-slate-300 focus:border-amber-300 focus:ring-2 focus:ring-amber-100"
                  />

                  {payment && (
                    <button
                      type="button"
                      onClick={() => setPayment("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 hover:bg-slate-100"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                {/* QUICK PAYMENT */}

                <div className="mt-4">
                  <p className="mb-2 text-xs font-medium text-slate-400">
                    Nominal cepat
                  </p>

                  <div className="grid grid-cols-4 gap-2">
                    {quickPayments.map(
                      (amount) => (
                        <button
                          key={amount}
                          type="button"
                          onClick={() =>
                            handleQuickPayment(
                              amount
                            )
                          }
                          className={`rounded-lg border px-2 py-2 text-xs font-medium transition ${
                            paymentAmount ===
                            amount
                              ? "border-amber-300 bg-amber-50 text-amber-700"
                              : "border-slate-200 bg-slate-50 text-slate-600 hover:border-amber-200 hover:bg-amber-50 hover:text-amber-700"
                          }`}
                        >
                          {formatRupiah(amount)}
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* CHANGE */}

              <div
                className={`mt-4 rounded-xl border p-4 transition-all ${
                  paymentAmount > 0 &&
                  paymentAmount < totalHarga
                    ? "border-red-100 bg-red-50"
                    : paymentAmount >=
                          totalHarga &&
                        paymentAmount > 0
                      ? "border-emerald-100 bg-emerald-50"
                      : "border-slate-200 bg-slate-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-600">
                    Kembalian
                  </span>

                  <span
                    className={`text-lg font-bold ${
                      paymentAmount >=
                        totalHarga &&
                      paymentAmount > 0
                        ? "text-emerald-600"
                        : paymentAmount > 0
                          ? "text-slate-900"
                          : "text-slate-400"
                    }`}
                  >
                    {formatRupiah(change)}
                  </span>
                </div>

                {paymentAmount > 0 &&
                  paymentAmount < totalHarga && (
                    <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-red-500">
                      <AlertCircle size={13} />

                      <span>
                        Kurang{" "}
                        {formatRupiah(
                          totalHarga -
                            paymentAmount
                        )}
                      </span>
                    </div>
                  )}

                {paymentAmount >= totalHarga &&
                  paymentAmount > 0 && (
                    <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                      <CheckCircle2 size={13} />
                      Pembayaran mencukupi
                    </div>
                  )}
              </div>

              {/* BUTTON */}

              <div className="mt-5 flex gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setShowPaymentModal(false)
                  }
                  className="flex-1 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
                >
                  Batal
                </button>

                <button
                  type="button"
                  onClick={handlePayment}
                  disabled={
                    paymentAmount < totalHarga ||
                    isProcessing
                  }
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm shadow-indigo-200 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none"
                >
                  {isProcessing ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Memproses...
                    </>
                  ) : (
                    <>
                      <CreditCard size={17} />
                      Bayar
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================
          SUCCESS MODAL
      ========================= */}

      {transactionSuccess &&
        lastTransaction && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-[2px]">
            <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-300">
              <div className="p-7 text-center">
                <div className="mx-auto flex h-16 w-16 animate-pulse items-center justify-center rounded-full bg-emerald-50">
                  <CheckCircle2
                    size={34}
                    className="text-emerald-500"
                  />
                </div>

                <h2 className="mt-5 text-xl font-bold text-slate-900">
                  Transaksi Berhasil
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Pembayaran berhasil diproses.
                </p>

                <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50 p-4 text-left">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-400">
                      ID Transaksi
                    </span>

                    <span className="rounded-md bg-indigo-50 px-2 py-1 text-xs font-semibold text-indigo-600">
                      #
                      {lastTransaction.id_transaksi.slice(
                        0,
                        8
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-sm text-slate-500">
                      Total
                    </span>

                    <span className="font-semibold text-slate-900">
                      {formatRupiah(
                        lastTransaction.total_harga
                      )}
                    </span>
                  </div>

                  <div className="mt-3 flex justify-between">
                    <span className="text-sm text-slate-500">
                      Dibayar
                    </span>

                    <span className="font-semibold text-slate-900">
                      {formatRupiah(
                        paymentAmount
                      )}
                    </span>
                  </div>

                  <div className="mt-3 border-t border-slate-200 pt-3">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-slate-600">
                        Kembalian
                      </span>

                      <span className="font-bold text-emerald-600">
                        {formatRupiah(change)}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={resetTransaction}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm shadow-indigo-200 transition hover:bg-indigo-700 hover:shadow-md"
                >
                  <Plus size={17} />
                  Transaksi Baru
                </button>
              </div>

              <div className="border-t border-slate-100 bg-emerald-50/50 px-5 py-3 text-center">
                <p className="flex items-center justify-center gap-1.5 text-xs font-medium text-emerald-600">
                  <CheckCircle2 size={13} />
                  Transaksi telah berhasil diselesaikan
                </p>
              </div>
            </div>
          </div>
        )}

      {/* =========================
          TOAST
      ========================= */}

      {toast && (
        <div className="fixed bottom-5 left-1/2 z-[200] -translate-x-1/2 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-xl">
            <CheckCircle2
              size={16}
              className="text-emerald-400"
            />

            {toast}
          </div>
        </div>
      )}
    </>
  );
}

/* =========================
   CART CONTENT
========================= */

interface CartContentProps {
  cart: CartItem[];
  totalItem: number;
  totalHarga: number;
  formatRupiah: (value: number) => string;
  increaseQuantity: (id_barang: string) => void;
  decreaseQuantity: (id_barang: string) => void;
  removeFromCart: (id_barang: string) => void;
  clearCart: () => void;
  onPayment: () => void;
  mobile?: boolean;
  onClose?: () => void;
}

function CartContent({
  cart,
  totalItem,
  totalHarga,
  formatRupiah,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
  onPayment,
  mobile,
  onClose,
}: CartContentProps) {
  return (
    <>
      {/* HEADER */}

      <div className="border-b border-slate-100 p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
              <ShoppingCart
                size={19}
                className="text-emerald-600"
              />
            </div>

            <div>
              <h2 className="font-semibold text-slate-900">
                Keranjang
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                {totalItem} item
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {cart.length > 0 && (
              <button
                type="button"
                onClick={clearCart}
                className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-red-500 transition hover:bg-red-50 hover:text-red-600"
              >
                Kosongkan
              </button>
            )}

            {mobile && onClose && (
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ITEMS */}

      <div className="max-h-[480px] overflow-y-auto p-5">
        {cart.length === 0 ? (
          <div className="py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
              <ShoppingCart
                size={23}
                className="text-emerald-500"
              />
            </div>

            <p className="mt-4 text-sm font-medium text-slate-600">
              Keranjang masih kosong
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Pilih barang untuk memulai transaksi
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {cart.map((item) => (
              <div
                key={item.id_barang}
                className="rounded-xl border border-slate-100 bg-slate-50/60 p-3.5 transition-all duration-200 hover:border-emerald-100 hover:bg-emerald-50/30"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50">
                      <Package
                        size={15}
                        className="text-emerald-600"
                      />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-800">
                        {item.nama_barang}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {formatRupiah(item.harga)} /{" "}
                        {item.satuan}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      removeFromCart(
                        item.id_barang
                      )
                    }
                    className="shrink-0 rounded-lg p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  {/* QUANTITY */}

                  <div className="flex items-center gap-2 rounded-lg bg-white p-1 shadow-sm ring-1 ring-slate-100">
                    <button
                      type="button"
                      onClick={() =>
                        decreaseQuantity(
                          item.id_barang
                        )
                      }
                      className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-50 text-slate-500 transition hover:bg-red-50 hover:text-red-500"
                    >
                      <Minus size={13} />
                    </button>

                    <span className="w-7 text-center text-sm font-semibold text-slate-700">
                      {item.jumlah}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        increaseQuantity(
                          item.id_barang
                        )
                      }
                      disabled={
                        item.jumlah >= item.stok
                      }
                      className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-50 text-emerald-600 transition hover:bg-emerald-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Plus size={13} />
                    </button>
                  </div>

                  {/* SUBTOTAL */}

                  <p className="text-sm font-bold text-slate-900">
                    {formatRupiah(item.subtotal)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SUMMARY */}

      <div className="border-t border-slate-100 p-5">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">
              Total Item
            </span>

            <span className="font-medium text-slate-700">
              {totalItem}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">
              Subtotal
            </span>

            <span className="font-medium text-slate-700">
              {formatRupiah(totalHarga)}
            </span>
          </div>

          <div className="rounded-xl bg-indigo-50 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-indigo-900">
                Total
              </span>

              <span className="text-xl font-bold text-indigo-600">
                {formatRupiah(totalHarga)}
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          disabled={cart.length === 0}
          onClick={onPayment}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3.5 text-sm font-semibold text-white shadow-sm shadow-indigo-200 transition hover:bg-indigo-700 hover:shadow-md hover:shadow-indigo-200 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none"
        >
          <CreditCard size={18} />
          Proses Pembayaran
        </button>
      </div>
    </>
  );
}