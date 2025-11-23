export interface ProductStatus {
  id: number;
  status: "ACTIVO" | "INACTIVO" | "REPOSICION";
}

export interface ProductResponse {
  id: number;
  name: string;
  description?: string;
  created_at?: string;
  stock: number;
  reference?: string;
  sale_price: number;
  buy_price: number;
  stock_minimo: number;
  status: ProductStatus;
}