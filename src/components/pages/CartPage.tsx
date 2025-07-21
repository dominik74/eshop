import type { Product } from "../../types/Product";
import s from '../../less/cart.module.less';
import ProductList from "../ProductList";
import * as ordersApi from '../../api/orders';
import * as authApi from '../../api/auth';
import type { OrderItem } from "../../types/OrderItem";
import { useMemo, type Dispatch, type SetStateAction } from "react";
import type { User } from "../../types/User";
import { useNavigate } from "react-router-dom";
import { LOCAL_STORAGE_AUTH_TOKEN } from "../../constants";

interface Props {
    orderItems: OrderItem[];
    setOrderItems: React.Dispatch<React.SetStateAction<OrderItem[]>>;
    user: User | undefined;
    setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
    setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
}

export default function CartPage(props: Props) {
    const navigate = useNavigate();
    
    const products = useMemo(() =>
        props.orderItems.map(cartProd => cartProd.product),
    [props.orderItems]);
    
    const setProducts: Dispatch<SetStateAction<Product[]>> = (valueOrUpdater) => {
        props.setOrderItems(prevOrderItems => {
            const newProducts = typeof valueOrUpdater === 'function' ?
            (valueOrUpdater as (prev: Product[]) => Product[])(
                prevOrderItems.map(oi => oi.product).filter((p): p is Product => !!p)
            )
            : valueOrUpdater;
            
            
            return newProducts.map(product => {
               const orderItem = prevOrderItems.find(oi => oi.product.id === product.id);
               return orderItem ? { ...orderItem, product } : undefined;
            })
            .filter((oi): oi is OrderItem => !!oi);
        });
    };
    
    
    function clearCart() {
        const userConfirmed = confirm('empty cart?');
        
        if (userConfirmed) {
            props.setOrderItems([]);
        }
    }
    
    function getTotalPrice(): number {
        let total = 0;
        
        for (const orderItem of props.orderItems) {
            total += Number(orderItem.product.price) * orderItem.quantity;
        }
        
        return Math.round(total * 100) / 100;
    }
    
    async function placeOrder() {
        if (!props.user) {
            navigate('/login');
            return;
        }
        
        try {
            const authToken = localStorage.getItem(LOCAL_STORAGE_AUTH_TOKEN);
            
            if (!authToken) {
                return;
            }
            
            await ordersApi.placeOrder(props.user.username, props.orderItems, authToken);
            const user = await authApi.getUserDetails(authToken);
            props.setUser(user);
        } catch (e) {
            if (e instanceof Error) {
                props.setErrorMessage(e.message);
            }
        }
    }
    
    return (
        <div>
            <h1>shopping cart</h1>
            
            <button onClick={clearCart} className={s.clearCart}>empty cart</button>
            
            <ProductList
                products={products}
                setProducts={setProducts}
                orderItems={props.orderItems}
                setOrderItems={props.setOrderItems}
            />
            
            <div className={s.buttonbar}>
                <button onClick={placeOrder}>
                    {props.user ?
                        'place order'
                    :
                        'login to place order'
                    }
                    
                    &nbsp;(total: ${getTotalPrice()})
                </button>
            </div>
        </div>
    )
}