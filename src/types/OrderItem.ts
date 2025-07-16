import type { Product } from "./Product";

export interface OrderItem {
    product: Product;
    quantity: number;
}