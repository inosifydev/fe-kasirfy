export interface Barang {
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