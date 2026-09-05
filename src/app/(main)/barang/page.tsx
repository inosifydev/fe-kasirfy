"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  Edit,
  MoreHorizontal,
  Package,
  Search,
  Trash2,
  X,
  Boxes,
  Plus,
  AlertTriangle,
  CheckCircle2,
  PackagePlus,
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

const initialBarang: Barang[] = [
  {
    id_barang: "550e8400-e29b-41d4-a716-446655440001",
    nama_barang: "Indomie Goreng",
    kategori: "Makanan",
    harga: 3000,
    stok: 120,
    satuan: "pcs",
    deskripsi: "Mi instan goreng",
    created_at: "2026-09-01",
  },
  {
    id_barang: "550e8400-e29b-41d4-a716-446655440002",
    nama_barang: "Aqua 600ml",
    kategori: "Minuman",
    harga: 3000,
    stok: 85,
    satuan: "botol",
    deskripsi: "Air mineral 600ml",
    created_at: "2026-09-01",
  },
  {
    id_barang: "550e8400-e29b-41d4-a716-446655440003",
    nama_barang: "Teh Pucuk Harum",
    kategori: "Minuman",
    harga: 4000,
    stok: 61,
    satuan: "botol",
    deskripsi: "Teh kemasan",
    created_at: "2026-09-02",
  },
  {
    id_barang: "550e8400-e29b-41d4-a716-446655440004",
    nama_barang: "Kopi Good Day",
    kategori: "Minuman",
    harga: 4000,
    stok: 48,
    satuan: "pcs",
    deskripsi: "Kopi instan",
    created_at: "2026-09-02",
  },
  {
    id_barang: "550e8400-e29b-41d4-a716-446655440005",
    nama_barang: "Roti Coklat",
    kategori: "Makanan",
    harga: 5000,
    stok: 35,
    satuan: "pcs",
    deskripsi: "Roti isi coklat",
    created_at: "2026-09-03",
  },
  {
    id_barang: "550e8400-e29b-41d4-a716-446655440006",
    nama_barang: "Chitato Original",
    kategori: "Snack",
    harga: 11000,
    stok: 27,
    satuan: "pcs",
    deskripsi: "Keripik kentang",
    created_at: "2026-09-03",
  },
  {
    id_barang: "550e8400-e29b-41d4-a716-446655440007",
    nama_barang: "SilverQueen",
    kategori: "Snack",
    harga: 15000,
    stok: 18,
    satuan: "pcs",
    deskripsi: "Cokelat batang",
    created_at: "2026-09-04",
  },
  {
    id_barang: "550e8400-e29b-41d4-a716-446655440008",
    nama_barang: "Susu Ultra Milk",
    kategori: "Minuman",
    harga: 7000,
    stok: 8,
    satuan: "kotak",
    deskripsi: "Susu UHT",
    created_at: "2026-09-04",
  },
  {
    id_barang: "550e8400-e29b-41d4-a716-446655440009",
    nama_barang: "Sabun Lifebuoy",
    kategori: "Kebutuhan",
    harga: 4500,
    stok: 4,
    satuan: "pcs",
    deskripsi: "Sabun mandi",
    created_at: "2026-09-04",
  },
  {
    id_barang: "550e8400-e29b-41d4-a716-446655440010",
    nama_barang: "Pulpen Standard",
    kategori: "ATK",
    harga: 2500,
    stok: 0,
    satuan: "pcs",
    deskripsi: "Pulpen hitam",
    created_at: "2026-09-04",
  },
];

const categories = [
  "Semua",
  "Makanan",
  "Minuman",
  "Snack",
  "Kebutuhan",
  "ATK",
];

export default function BarangPage() {
  const [barang, setBarang] =
    useState<Barang[]>(initialBarang);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Semua");

  const [showAddModal, setShowAddModal] =
    useState(false);

  const [showStockModal, setShowStockModal] =
    useState(false);

  const [showEditModal, setShowEditModal] =
    useState(false);

  const [showDeleteModal, setShowDeleteModal] =
    useState(false);

  const [selectedBarang, setSelectedBarang] =
    useState<Barang | null>(null);

  const [stockAmount, setStockAmount] =
    useState("");

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const [newBarang, setNewBarang] = useState({
    nama_barang: "",
    kategori: "Makanan",
    harga: "",
    stok: "",
    satuan: "pcs",
    deskripsi: "",
  });

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

  const totalProduk = barang.length;

  const totalStok = barang.reduce(
    (total, item) => total + item.stok,
    0
  );

  const stokMenipis = barang.filter(
    (item) => item.stok > 0 && item.stok <= 10
  ).length;

  const stokHabis = barang.filter(
    (item) => item.stok === 0
  ).length;

  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const showToast = (
    message: string,
    type: "success" | "error" = "success"
  ) => {
    setToast({
      message,
      type,
    });

    setTimeout(() => {
      setToast(null);
    }, 2500);
  };

  const getStockStatus = (stok: number) => {
    if (stok === 0) {
      return {
        label: "Habis",
        className:
          "border-red-100 bg-red-50 text-red-600",
        icon: AlertTriangle,
      };
    }

    if (stok <= 10) {
      return {
        label: "Menipis",
        className:
          "border-amber-100 bg-amber-50 text-amber-600",
        icon: AlertTriangle,
      };
    }

    return {
      label: "Tersedia",
      className:
        "border-emerald-100 bg-emerald-50 text-emerald-600",
      icon: CheckCircle2,
    };
  };

  const handleAddBarang = (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!newBarang.nama_barang.trim()) {
      showToast(
        "Nama barang harus diisi",
        "error"
      );
      return;
    }

    if (
      !newBarang.harga ||
      Number(newBarang.harga) <= 0
    ) {
      showToast(
        "Harga barang harus lebih dari 0",
        "error"
      );
      return;
    }

    if (
      newBarang.stok === "" ||
      Number(newBarang.stok) < 0
    ) {
      showToast(
        "Stok barang tidak valid",
        "error"
      );
      return;
    }

    const item: Barang = {
      id_barang: crypto.randomUUID(),
      nama_barang:
        newBarang.nama_barang.trim(),
      kategori: newBarang.kategori,
      harga: Number(newBarang.harga),
      stok: Number(newBarang.stok),
      satuan: newBarang.satuan,
      deskripsi:
        newBarang.deskripsi.trim(),
      created_at:
        new Date().toISOString(),
    };

    setBarang((prev) => [
      ...prev,
      item,
    ]);

    setNewBarang({
      nama_barang: "",
      kategori: "Makanan",
      harga: "",
      stok: "",
      satuan: "pcs",
      deskripsi: "",
    });

    setShowAddModal(false);

    showToast(
      `${item.nama_barang} berhasil ditambahkan`
    );
  };

  const handleAddStock = (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!selectedBarang) return;

    const amount = Number(stockAmount);

    if (!amount || amount <= 0) {
      showToast(
        "Jumlah stok harus lebih dari 0",
        "error"
      );
      return;
    }

    setBarang((prev) =>
      prev.map((item) =>
        item.id_barang ===
        selectedBarang.id_barang
          ? {
              ...item,
              stok:
                item.stok + amount,
            }
          : item
      )
    );

    setStockAmount("");
    setSelectedBarang(null);
    setShowStockModal(false);

    showToast(
      `Stok ${selectedBarang.nama_barang} berhasil ditambahkan`
    );
  };

  const handleEditBarang = (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!selectedBarang) return;

    if (!selectedBarang.nama_barang.trim()) {
      showToast(
        "Nama barang harus diisi",
        "error"
      );
      return;
    }

    if (selectedBarang.harga <= 0) {
      showToast(
        "Harga harus lebih dari 0",
        "error"
      );
      return;
    }

    if (selectedBarang.stok < 0) {
      showToast(
        "Stok tidak boleh negatif",
        "error"
      );
      return;
    }

    setBarang((prev) =>
      prev.map((item) =>
        item.id_barang ===
        selectedBarang.id_barang
          ? selectedBarang
          : item
      )
    );

    setShowEditModal(false);

    showToast(
      `${selectedBarang.nama_barang} berhasil diperbarui`
    );

    setSelectedBarang(null);
  };

  const handleDeleteBarang = () => {
    if (!selectedBarang) return;

    const namaBarang =
      selectedBarang.nama_barang;

    setBarang((prev) =>
      prev.filter(
        (item) =>
          item.id_barang !==
          selectedBarang.id_barang
      )
    );

    setSelectedBarang(null);
    setShowDeleteModal(false);

    showToast(
      `${namaBarang} berhasil dihapus`
    );
  };

  const openEditModal = (item: Barang) => {
    setSelectedBarang({
      ...item,
    });

    setShowEditModal(true);
  };

  const openStockModal = (item: Barang) => {
    setSelectedBarang(item);
    setStockAmount("");
    setShowStockModal(true);
  };

  const openDeleteModal = (item: Barang) => {
    setSelectedBarang(item);
    setShowDeleteModal(true);
  };

  return (
    <>
      <main className="min-h-full bg-slate-50 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-[1600px]">

          {/* =========================
              HEADER
          ========================= */}

          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                Data Barang
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Kelola produk dan stok inventori
                toko.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setShowAddModal(true)
              }
              className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-indigo-700 hover:shadow-md active:scale-[0.98]"
            >
              <Plus size={18} />
              Tambah Barang
            </button>
          </div>

          {/* =========================
              SUMMARY
          ========================= */}

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <SummaryCard
              icon={Package}
              title="Total Produk"
              value={String(totalProduk)}
              description="Jenis produk"
            />

            <SummaryCard
              icon={Boxes}
              title="Total Stok"
              value={String(totalStok)}
              description="Total seluruh stok"
            />

            <SummaryCard
              icon={AlertTriangle}
              title="Stok Menipis"
              value={String(stokMenipis)}
              description="Perlu diperhatikan"
              warning={stokMenipis > 0}
            />

            <SummaryCard
              icon={AlertTriangle}
              title="Stok Habis"
              value={String(stokHabis)}
              description="Perlu restock"
              danger={stokHabis > 0}
            />
          </div>

          {/* =========================
              TABLE CARD
          ========================= */}

          <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">

            {/* TOOLBAR */}

            <div className="border-b border-slate-100 p-4 sm:p-5">
              <div className="flex flex-col gap-4">

                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                  {/* SEARCH */}

                  <div className="relative w-full lg:max-w-md">
                    <Search
                      size={18}
                      className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${
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
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-10 text-sm text-slate-400 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-indigo-300 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                    />

                    {search && (
                      <button
                        type="button"
                        onClick={() =>
                          setSearch("")
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                      >
                        <X size={15} />
                      </button>
                    )}
                  </div>

                  {/* RESULT */}

                  <div className="text-xs text-slate-400">
                    Menampilkan{" "}
                    <span className="font-semibold text-slate-700">
                      {filteredBarang.length}
                    </span>{" "}
                    produk
                  </div>
                </div>

                {/* CATEGORY */}

                <div className="flex gap-2 overflow-x-auto pb-1">
                  {categories.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() =>
                        setCategory(item)
                      }
                      className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition-all duration-200 ${
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
            </div>

            {/* =========================
                TABLE
            ========================= */}

            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px] text-left text-sm">

                <thead className="bg-slate-50 text-xs text-slate-500">
                  <tr>
                    <th className="px-5 py-4 font-medium">
                      Produk
                    </th>

                    <th className="px-5 py-4 font-medium">
                      Kategori
                    </th>

                    <th className="px-5 py-4 font-medium">
                      Harga
                    </th>

                    <th className="px-5 py-4 font-medium">
                      Stok
                    </th>

                    <th className="px-5 py-4 font-medium">
                      Status
                    </th>

                    <th className="px-5 py-4 text-right font-medium">
                      Aksi
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredBarang.length > 0 ? (
                    filteredBarang.map((item) => {
                      const stockStatus =
                        getStockStatus(
                          item.stok
                        );

                      const StatusIcon =
                        stockStatus.icon;

                      return (
                        <tr
                          key={
                            item.id_barang
                          }
                          className="group transition-colors duration-150 hover:bg-indigo-50/30"
                        >

                          {/* PRODUCT */}

                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">

                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 transition-all duration-200 group-hover:bg-indigo-50 group-hover:shadow-sm">
                                <Package
                                  size={18}
                                  className="text-slate-500 transition-colors duration-200 group-hover:text-indigo-500"
                                />
                              </div>

                              <div className="min-w-0">
                                <p className="font-medium text-slate-800 transition-colors group-hover:text-indigo-700">
                                  {
                                    item.nama_barang
                                  }
                                </p>

                                <p className="mt-0.5 text-xs text-slate-400">
                                  ID:{" "}
                                  {item.id_barang.slice(
                                    0,
                                    8
                                  )}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* CATEGORY */}

                          <td className="px-5 py-4">
                            <span className="inline-flex rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors group-hover:bg-white">
                              {
                                item.kategori
                              }
                            </span>
                          </td>

                          {/* PRICE */}

                          <td className="px-5 py-4">
                            <span className="font-semibold text-indigo-600">
                              {formatRupiah(
                                item.harga
                              )}
                            </span>
                          </td>

                          {/* STOCK */}

                          <td className="px-5 py-4">
                            <div>
                              <span
                                className={`font-semibold ${
                                  item.stok ===
                                  0
                                    ? "text-red-600"
                                    : item.stok <=
                                        10
                                      ? "text-amber-600"
                                      : "text-slate-700"
                                }`}
                              >
                                {item.stok}
                              </span>

                              <span className="ml-1 text-xs text-slate-400">
                                {
                                  item.satuan
                                }
                              </span>
                            </div>

                            {item.stok >
                              0 &&
                              item.stok <=
                                10 && (
                                <p className="mt-1 text-[10px] font-medium text-amber-500">
                                  Segera
                                  restock
                                </p>
                              )}
                          </td>

                          {/* STATUS */}

                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium ${stockStatus.className}`}
                            >
                              <StatusIcon
                                size={13}
                              />

                              {
                                stockStatus.label
                              }
                            </span>
                          </td>

                          {/* ACTION */}

                          <td className="px-5 py-4">
                            <div className="flex justify-end gap-1.5">

                              {/* STOCK */}

                              <button
                                type="button"
                                onClick={() =>
                                  openStockModal(
                                    item
                                  )}
                                title="Tambah stok"
                                className="flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-2 text-xs font-medium text-slate-600 transition-all duration-200 hover:bg-emerald-50 hover:text-emerald-600 active:scale-[0.97]"
                              >
                                <PackagePlus
                                  size={14}
                                />
                                Stok
                              </button>

                              {/* EDIT */}

                              <button
                                type="button"
                                onClick={() =>
                                  openEditModal(
                                    item
                                  )}
                                title="Edit barang"
                                className="rounded-lg p-2 text-slate-400 transition-all duration-200 hover:bg-indigo-50 hover:text-indigo-600 active:scale-[0.95]"
                              >
                                <Edit
                                  size={17}
                                />
                              </button>

                              {/* DELETE */}

                              <button
                                type="button"
                                onClick={() =>
                                  openDeleteModal(
                                    item
                                  )}
                                title="Hapus barang"
                                className="rounded-lg p-2 text-slate-400 transition-all duration-200 hover:bg-red-50 hover:text-red-600 active:scale-[0.95]"
                              >
                                <Trash2
                                  size={17}
                                />
                              </button>

                              {/* MORE */}

                              <button
                                type="button"
                                title="Lainnya"
                                className="rounded-lg p-2 text-slate-400 transition-all duration-200 hover:bg-slate-100 hover:text-slate-700 active:scale-[0.95]"
                              >
                                <MoreHorizontal
                                  size={17}
                                />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-5 py-16 text-center"
                      >
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                          <Search
                            size={22}
                            className="text-slate-400"
                          />
                        </div>

                        <p className="mt-3 text-sm font-medium text-slate-600">
                          Barang tidak ditemukan
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          Coba gunakan kata
                          kunci pencarian lain.
                        </p>

                        <button
                          type="button"
                          onClick={() => {
                            setSearch("");
                            setCategory(
                              "Semua"
                            );
                          }}
                          className="mt-4 rounded-lg bg-slate-100 px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-200"
                        >
                          Reset Filter
                        </button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* FOOTER */}

            <div className="flex flex-col gap-2 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-slate-400">
                Menampilkan{" "}
                <span className="font-medium text-slate-600">
                  {filteredBarang.length}
                </span>{" "}
                dari{" "}
                <span className="font-medium text-slate-600">
                  {barang.length}
                </span>{" "}
                produk
              </p>

              {category !== "Semua" && (
                <p className="text-xs text-slate-400">
                  Filter:{" "}
                  <span className="font-medium text-indigo-600">
                    {category}
                  </span>
                </p>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* =========================
          ADD MODAL
      ========================= */}

      {showAddModal && (
        <Modal
          title="Tambah Barang"
          description="Tambahkan produk baru ke dalam inventori."
          onClose={() =>
            setShowAddModal(false)
          }
        >
          <form
            onSubmit={handleAddBarang}
            className="space-y-5"
          >
            <InputField
              label="Nama Barang"
              value={
                newBarang.nama_barang
              }
              onChange={(value) =>
                setNewBarang({
                  ...newBarang,
                  nama_barang: value,
                })
              }
              placeholder="Contoh: Indomie Goreng"
              required
            />

            <div className="grid gap-5 sm:grid-cols-2">
              <SelectField
                label="Kategori"
                value={
                  newBarang.kategori
                }
                onChange={(value) =>
                  setNewBarang({
                    ...newBarang,
                    kategori: value,
                  })
                }
                options={[
                  "Makanan",
                  "Minuman",
                  "Snack",
                  "Kebutuhan",
                  "ATK",
                ]}
              />

              <SelectField
                label="Satuan"
                value={
                  newBarang.satuan
                }
                onChange={(value) =>
                  setNewBarang({
                    ...newBarang,
                    satuan: value,
                  })
                }
                options={[
                  "pcs",
                  "botol",
                  "kotak",
                  "pack",
                  "kg",
                  "liter",
                ]}
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <InputField
                label="Harga"
                type="number"
                value={newBarang.harga}
                onChange={(value) =>
                  setNewBarang({
                    ...newBarang,
                    harga: value,
                  })
                }
                placeholder="0"
                required
              />

              <InputField
                label="Stok Awal"
                type="number"
                value={newBarang.stok}
                onChange={(value) =>
                  setNewBarang({
                    ...newBarang,
                    stok: value,
                  })
                }
                placeholder="0"
                required
              />
            </div>

            <TextareaField
              label="Deskripsi"
              value={
                newBarang.deskripsi
              }
              onChange={(value) =>
                setNewBarang({
                  ...newBarang,
                  deskripsi: value,
                })
              }
              placeholder="Deskripsi barang..."
            />

            <ModalActions
              onCancel={() =>
                setShowAddModal(false)
              }
              submitText="Simpan Barang"
            />
          </form>
        </Modal>
      )}

      {/* =========================
          STOCK MODAL
      ========================= */}

      {showStockModal &&
        selectedBarang && (
          <Modal
            title="Tambah Stok"
            description={`Tambahkan stok untuk ${selectedBarang.nama_barang}.`}
            onClose={() => {
              setShowStockModal(false);
              setSelectedBarang(null);
            }}
          >
            <form
              onSubmit={handleAddStock}
              className="space-y-5"
            >
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white">
                    <Package
                      size={18}
                      className="text-indigo-500"
                    />
                  </div>

                  <div>
                    <p className="font-medium text-slate-900">
                      {
                        selectedBarang.nama_barang
                      }
                    </p>

                    <p className="mt-0.5 text-xs text-slate-400">
                      {
                        selectedBarang.kategori
                      }
                    </p>
                  </div>
                </div>

                <div className="mt-4 border-t border-slate-200 pt-4">
                  <p className="text-xs text-slate-400">
                    Stok saat ini
                  </p>

                  <p className="mt-1 text-xl font-bold text-slate-900">
                    {
                      selectedBarang.stok
                    }{" "}
                    <span className="text-sm font-normal text-slate-400">
                      {
                        selectedBarang.satuan
                      }
                    </span>
                  </p>
                </div>
              </div>

              <InputField
                label="Jumlah Stok Ditambahkan"
                type="number"
                value={stockAmount}
                onChange={
                  setStockAmount
                }
                placeholder="Contoh: 50"
                required
              />

              {stockAmount &&
                Number(stockAmount) >
                  0 && (
                  <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                    <p className="text-xs font-medium text-emerald-600">
                      Stok setelah ditambah
                    </p>

                    <p className="mt-1 text-lg font-bold text-emerald-700">
                      {
                        selectedBarang.stok +
                          Number(
                            stockAmount
                          )
                      }{" "}
                      <span className="text-sm font-normal">
                        {
                          selectedBarang.satuan
                        }
                      </span>
                    </p>
                  </div>
                )}

              <ModalActions
                onCancel={() => {
                  setShowStockModal(
                    false
                  );
                  setSelectedBarang(
                    null
                  );
                }}
                submitText="Tambah Stok"
              />
            </form>
          </Modal>
        )}

      {/* =========================
          EDIT MODAL
      ========================= */}

      {showEditModal &&
        selectedBarang && (
          <Modal
            title="Edit Barang"
            description="Perbarui informasi produk."
            onClose={() => {
              setShowEditModal(false);
              setSelectedBarang(null);
            }}
          >
            <form
              onSubmit={
                handleEditBarang
              }
              className="space-y-5"
            >
              <InputField
                label="Nama Barang"
                value={
                  selectedBarang.nama_barang
                }
                onChange={(value) =>
                  setSelectedBarang({
                    ...selectedBarang,
                    nama_barang:
                      value,
                  })
                }
                required
              />

              <div className="grid gap-5 sm:grid-cols-2">
                <SelectField
                  label="Kategori"
                  value={
                    selectedBarang.kategori
                  }
                  onChange={(value) =>
                    setSelectedBarang({
                      ...selectedBarang,
                      kategori:
                        value,
                    })
                  }
                  options={[
                    "Makanan",
                    "Minuman",
                    "Snack",
                    "Kebutuhan",
                    "ATK",
                  ]}
                />

                <SelectField
                  label="Satuan"
                  value={
                    selectedBarang.satuan
                  }
                  onChange={(value) =>
                    setSelectedBarang({
                      ...selectedBarang,
                      satuan:
                        value,
                    })
                  }
                  options={[
                    "pcs",
                    "botol",
                    "kotak",
                    "pack",
                    "kg",
                    "liter",
                  ]}
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <InputField
                  label="Harga"
                  type="number"
                  value={String(
                    selectedBarang.harga
                  )}
                  onChange={(value) =>
                    setSelectedBarang({
                      ...selectedBarang,
                      harga:
                        Number(
                          value
                        ),
                    })
                  }
                  required
                />

                <InputField
                  label="Stok"
                  type="number"
                  value={String(
                    selectedBarang.stok
                  )}
                  onChange={(value) =>
                    setSelectedBarang({
                      ...selectedBarang,
                      stok:
                        Number(
                          value
                        ),
                    })
                  }
                  required
                />
              </div>

              <TextareaField
                label="Deskripsi"
                value={
                  selectedBarang.deskripsi
                }
                onChange={(value) =>
                  setSelectedBarang({
                    ...selectedBarang,
                    deskripsi:
                      value,
                  })
                }
              />

              <ModalActions
                onCancel={() => {
                  setShowEditModal(
                    false
                  );
                  setSelectedBarang(
                    null
                  );
                }}
                submitText="Simpan Perubahan"
              />
            </form>
          </Modal>
        )}

      {/* =========================
          DELETE MODAL
      ========================= */}

      {showDeleteModal &&
        selectedBarang && (
          <Modal
            title="Hapus Barang"
            description="Tindakan ini akan menghapus data barang dari daftar."
            onClose={() => {
              setShowDeleteModal(
                false
              );
              setSelectedBarang(
                null
              );
            }}
          >
            <div className="space-y-5">
              <div className="rounded-xl border border-red-100 bg-red-50 p-4">
                <div className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white">
                    <Trash2
                      size={18}
                      className="text-red-500"
                    />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-red-700">
                      Hapus{" "}
                      {
                        selectedBarang.nama_barang
                      }
                      ?
                    </p>

                    <p className="mt-1 text-xs leading-5 text-red-500">
                      Data barang ini akan
                      dihapus dari daftar
                      inventori.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteModal(
                      false
                    );
                    setSelectedBarang(
                      null
                    );
                  }}
                  className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 transition-all duration-200 hover:bg-slate-100 active:scale-[0.98]"
                >
                  Batal
                </button>

                <button
                  type="button"
                  onClick={
                    handleDeleteBarang
                  }
                  className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-red-700 hover:shadow-sm active:scale-[0.98]"
                >
                  Hapus Barang
                </button>
              </div>
            </div>
          </Modal>
        )}

      {/* =========================
          TOAST
      ========================= */}

      {toast && (
        <div className="pointer-events-none fixed bottom-6 left-1/2 z-[200] -translate-x-1/2 animate-in fade-in slide-in-from-bottom-3 duration-300 ease-out">
          <div
            className={`flex min-w-[280px] items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white shadow-lg ring-1 ring-white/10 ${
              toast.type === "success"
                ? "bg-slate-900"
                : "bg-red-600"
            }`}
          >
            {toast.type ===
            "success" ? (
              <CheckCircle2
                size={17}
                className="shrink-0 text-emerald-400"
              />
            ) : (
              <AlertTriangle
                size={17}
                className="shrink-0 text-white"
              />
            )}

            <span>
              {toast.message}
            </span>
          </div>
        </div>
      )}
    </>
  );
}

/* =========================
   SUMMARY CARD
========================= */

function SummaryCard({
  icon: Icon,
  title,
  value,
  description,
  warning,
  danger,
}: {
  icon: React.ElementType;
  title: string;
  value: string;
  description: string;
  warning?: boolean;
  danger?: boolean;
}) {
  return (
    <div className="group rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500">
            {title}
          </p>

          <p
            className={`mt-2 text-2xl font-bold tracking-tight ${
              danger
                ? "text-red-600"
                : warning
                  ? "text-amber-600"
                  : "text-slate-900"
            }`}
          >
            {value}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {description}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-200 ${
            danger
              ? "bg-red-50 group-hover:bg-red-100"
              : warning
                ? "bg-amber-50 group-hover:bg-amber-100"
                : "bg-slate-100 group-hover:bg-indigo-50"
          }`}
        >
          <Icon
            size={20}
            className={
              danger
                ? "text-red-500"
                : warning
                  ? "text-amber-500"
                  : "text-slate-700 transition-colors group-hover:text-indigo-500"
            }
          />
        </div>
      </div>
    </div>
  );
}

/* =========================
   MODAL
========================= */

function Modal({
  title,
  description,
  children,
  onClose,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-[2px]">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-100 p-5">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              {title}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {description}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition-all duration-200 hover:bg-slate-100 hover:text-slate-700 active:scale-[0.95]"
          >
            <X size={19} />
          </button>
        </div>

        <div className="p-5">
          {children}
        </div>
      </div>
    </div>
  );
}

/* =========================
   INPUT
========================= */

function InputField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        placeholder={placeholder}
        required={required}
        min={
          type === "number"
            ? "0"
            : undefined
        }
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
      />
    </div>
  );
}

/* =========================
   SELECT
========================= */

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </label>

      <select
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all duration-200 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
      >
        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

/* =========================
   TEXTAREA
========================= */

function TextareaField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </label>

      <textarea
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        placeholder={placeholder}
        rows={3}
        className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
      />
    </div>
  );
}

/* =========================
   MODAL ACTIONS
========================= */

function ModalActions({
  onCancel,
  submitText,
}: {
  onCancel: () => void;
  submitText: string;
}) {
  return (
    <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
      <button
        type="button"
        onClick={onCancel}
        className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 transition-all duration-200 hover:bg-slate-100 hover:text-slate-800 active:scale-[0.98]"
      >
        Batal
      </button>

      <button
        type="submit"
        className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-indigo-700 hover:shadow-md active:scale-[0.98]"
      >
        {submitText}
      </button>
    </div>
  );
}