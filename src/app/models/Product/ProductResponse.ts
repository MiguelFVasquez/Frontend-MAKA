export interface ProductResponse {
  id: number;
  name: string;
  description?: string;
  created_at?: string; // ISO
  stock: number;
  reference?: string;
  sale_price: number;
  buy_price: number;
  stock_minimo: number;
  status: string; // "ACTIVO" | "INACTIVO" | "REPOSICION"
}