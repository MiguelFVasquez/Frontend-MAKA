export interface NewMovementDTO{
    moveType: 'IN' | 'OUT';
    productId: number;
    amount: number;
}