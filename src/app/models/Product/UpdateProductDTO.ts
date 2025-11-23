export interface UpdateProductDTO {
    idProduct: number;
    newName: string;
    newDescription: string;
    newSalePrice: number;
    newBuyPrice: number;
    newStockMinimo: number;
}