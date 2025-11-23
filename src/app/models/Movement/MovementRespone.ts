// src/app/models/movement/MovementResponse.ts
export interface MovementResponse {
  id: number;
  date_mxove: string; // ISO
  productId: number;
  productName?: string;
  typeMove: string; // "IN" | "OUT"
  amount: number;
}
