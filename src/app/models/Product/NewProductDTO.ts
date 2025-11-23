export interface NewProductDTO {
    name: string;
    description: string;
    stock: number;
    reference: string;
    salePrice: number;
    buyPrice: number;
    stockMinimo: number;
}