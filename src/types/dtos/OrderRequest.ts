import type { OrderItemDto } from "./OrderItemDto";

export interface OrderRequest {
    username: string,
    items: OrderItemDto[]
}