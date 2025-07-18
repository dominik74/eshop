import { API_URL } from "../constants";
import type { OrderItemDto } from "../types/dtos/OrderItemDto";
import type { OrderRequest } from "../types/dtos/OrderRequest";
import type { OrderItem } from "../types/OrderItem";

export async function placeOrder(username: string, orderItems: OrderItem[], token: string) {
    const orderItemDtos: OrderItemDto[] = [];
    
    for (const oi of orderItems) {
        if (!oi.product.id) {
            continue;
        }
        
        const orderItemDto: OrderItemDto = {
            productId: oi.product.id,
            quantity: oi.quantity
        }
        
        orderItemDtos.push(orderItemDto);
    }
    
    const orderReq: OrderRequest = {
        username: username,
        items: orderItemDtos
    };
    
    const resp = await fetch(API_URL + "/orders", {
        method: 'post',
        body: JSON.stringify(orderReq),
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    
    if (!resp.ok) {
        throw new Error(`${resp.status}: ${await resp.text()}`);
    }
}