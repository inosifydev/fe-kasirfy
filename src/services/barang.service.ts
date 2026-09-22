import type { Barang } from "@/features/barang/types";

const API_URL = "/api/backend/barang";

interface ApiResponse<T> {
  success: boolean;
  status: number;
  message: string;
  data?: T;
  meta?: {
    timestamp: string;
    path?: string;
  };
}

export interface CreateBarangPayload {
  nama_barang: string;
  kategori: string;
  harga: number;
  stok: number;
  satuan: string;
  deskripsi: string;
}

export type UpdateBarangPayload = CreateBarangPayload;

/**
 * Membaca response API dengan aman,
 * termasuk ketika server mengembalikan response kosong.
 */
async function parseResponse<T>(
  response: Response
): Promise<ApiResponse<T> | null> {
  const responseText = await response.text();

  if (!responseText.trim()) {
    return null;
  }

  try {
    return JSON.parse(responseText) as ApiResponse<T>;
  } catch {
    throw new Error("Response dari server bukan JSON yang valid.");
  }
}

/**
 * Mengambil semua data barang.
 */
export async function getBarangs(): Promise<Barang[]> {
  const response = await fetch(API_URL, {
    method: "GET",
    credentials: "include",
    cache: "no-store",
    headers: {
      Accept: "application/json",
    },
  });

  const result = await parseResponse<Barang[]>(response);

  if (!response.ok || !result?.success) {
    throw new Error(
      result?.message ||
        `Gagal mengambil data barang. Status: ${response.status}`
    );
  }

  return result.data ?? [];
}

/**
 * Mengambil detail barang berdasarkan ID.
 */
export async function getBarangById(
  id_barang: string
): Promise<Barang> {
  const response = await fetch(
    `${API_URL}/${encodeURIComponent(id_barang)}`,
    {
      method: "GET",
      credentials: "include",
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    }
  );

  const result = await parseResponse<Barang>(response);

  if (!response.ok || !result?.success || !result.data) {
    throw new Error(
      result?.message ||
        `Gagal mengambil detail barang. Status: ${response.status}`
    );
  }

  return result.data;
}

/**
 * Menambahkan barang baru.
 */
export async function createBarang(
  payload: CreateBarangPayload
): Promise<Barang> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const result = await parseResponse<Barang>(response);

  if (!response.ok || !result?.success || !result.data) {
    throw new Error(
      result?.message ||
        `Gagal menambahkan barang. Status: ${response.status}`
    );
  }

  return result.data;
}

/**
 * Memperbarui data barang berdasarkan ID.
 * Menggunakan PATCH sesuai method API backend.
 */
export async function updateBarang(
  id_barang: string,
  payload: UpdateBarangPayload
): Promise<Barang> {
  const response = await fetch(
    `${API_URL}/${encodeURIComponent(id_barang)}`,
    {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
      cache: "no-store",
      body: JSON.stringify(payload),
    }
  );

  const result = await parseResponse<Barang>(response);

  if (!response.ok || result?.success === false) {
    console.error("Update barang gagal:", {
      id_barang,
      method: "PATCH",
      status: response.status,
      statusText: response.statusText,
      response: result,
    });

    throw new Error(
      result?.message ||
        `Gagal memperbarui barang. Status: ${response.status} ${response.statusText}`
    );
  }

  // Jika API mengembalikan data barang, gunakan data tersebut.
  if (result?.data) {
    return result.data;
  }

  // Jika API sukses tetapi response kosong,
  // ambil ulang data barang terbaru.
  return getBarangById(id_barang);
}

/**
 * Menghapus barang berdasarkan ID.
 */
export async function deleteBarang(
  id_barang: string
): Promise<Barang> {
  const response = await fetch(
    `${API_URL}/${encodeURIComponent(id_barang)}`,
    {
      method: "DELETE",
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
    }
  );

  const result = await parseResponse<Barang>(response);

  if (!response.ok || !result?.success || !result.data) {
    throw new Error(
      result?.message ||
        `Gagal menghapus barang. Status: ${response.status}`
    );
  }

  return result.data;
}

/**
 * Memulihkan barang yang telah dihapus.
 */
export async function restoreBarang(
  id_barang: string
): Promise<Barang> {
  const response = await fetch(
    `${API_URL}/${encodeURIComponent(id_barang)}/restore`,
    {
      method: "PATCH",
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
    }
  );

  const result = await parseResponse<Barang>(response);

  if (!response.ok || !result?.success || !result.data) {
    throw new Error(
      result?.message ||
        `Gagal memulihkan barang. Status: ${response.status}`
    );
  }

  return result.data;
}