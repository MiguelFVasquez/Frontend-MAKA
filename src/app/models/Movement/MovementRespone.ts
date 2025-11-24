export interface MovementStatus {
  id: number;
  status: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  created_at: string;
  stock: number;
  reference: string;
  sale_price: number;
  buy_price: number;
  stock_minimo: number;
  status: MovementStatus;
}

export interface TypeMove {
  id: number;
  move: string; // "IN" | "OUT"
}

export interface MovementResponse {
  id: number;
  date_move: string; 
  product: Product;
  typeMove: TypeMove;
  amount: number;
}

// Interface para la respuesta de la API
export interface ApiMovementResponse {
  error: boolean;
  respuesta: MovementResponse[];
}