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

export async function getBarangs(): Promise<Barang[]> {
  const response = await fetch(API_URL, {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });

  const result: ApiResponse<Barang[]> = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(
      result.message || "Gagal mengambil data barang."
    );
  }

  return result.data ?? [];
}

export async function getBarangById(
  id_barang: string
): Promise<Barang> {
  const response = await fetch(
    `${API_URL}/${id_barang}`,
    {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    }
  );

  const result: ApiResponse<Barang> =
    await response.json();

  if (!response.ok || !result.success || !result.data) {
    throw new Error(
      result.message || "Gagal mengambil detail barang."
    );
  }

  return result.data;
}

export async function createBarang(
  payload: CreateBarangPayload
): Promise<Barang> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const result: ApiResponse<Barang> =
    await response.json();

  if (!response.ok || !result.success || !result.data) {
    throw new Error(
      result.message || "Gagal menambahkan barang."
    );
  }

  return result.data;
}

export async function updateBarang(
  id_barang: string,
  payload: UpdateBarangPayload
): Promise<Barang> {
  const response = await fetch(
    `${API_URL}/${id_barang}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(payload),
    }
  );

  const result: ApiResponse<Barang> =
    await response.json();

  if (!response.ok || !result.success || !result.data) {
    throw new Error(
      result.message || "Gagal memperbarui barang."
    );
  }

  return result.data;
}

export async function deleteBarang(
  id_barang: string
): Promise<Barang> {
  const response = await fetch(
    `${API_URL}/${id_barang}`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );

  const result: ApiResponse<Barang> =
    await response.json();

  if (!response.ok || !result.success || !result.data) {
    throw new Error(
      result.message || "Gagal menghapus barang."
    );
  }

  return result.data;
}

export async function restoreBarang(
  id_barang: string
): Promise<Barang> {
  const response = await fetch(
    `${API_URL}/${id_barang}/restore`,
    {
      method: "PATCH",
      credentials: "include",
    }
  );

  const result: ApiResponse<Barang> =
    await response.json();

  if (!response.ok || !result.success || !result.data) {
    throw new Error(
      result.message || "Gagal memulihkan barang."
    );
  }

  return result.data;
}