import { Link } from 'react-router-dom';
import s from '../less/product_list.module.less';
import type { Product } from '../types/Product';
import { useState } from 'react';
import type { OrderItem } from '../types/OrderItem';

interface Props {
    products: Product[];
    setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
    orderItems: OrderItem[];
    setOrderItems: React.Dispatch<React.SetStateAction<OrderItem[]>>;
}

export default function ProductList(props: Props) {
    const [isAzAscending, setIsAzAscending] = useState<boolean>(false);
    const [isPriceAscending, setIsPriceAscending] = useState<boolean>(false);
    const [activeFilter, setActiveFilter] = useState<number>(0);
    
    function sortAz() {
        const sortedProducts = isAzAscending ?
            [...props.products].sort((a, b) => b.name.localeCompare(a.name))
                :
            [...props.products].sort((a, b) => a.name.localeCompare(b.name));
            
        props.setProducts(sortedProducts);
        setIsAzAscending(!isAzAscending);
        setActiveFilter(1);
    }
    
    function sortPrice() {
        const sortedProducts = isPriceAscending ?
            [...props.products].sort((a, b) => Number(b.price) - Number(a.price))
                :
            [...props.products].sort((a, b) => Number(a.price) - Number(b.price));
        
        props.setProducts(sortedProducts);
        setIsPriceAscending(!isPriceAscending);
        setActiveFilter(2);
    }
    
    function addToCart(product: Product) {
        const orderItem: OrderItem = {
            product,
            quantity: 1
        };
        
        props.setOrderItems([...props.orderItems, orderItem]);
    }
    
    function removeFromCart(product: Product) {
        props.setOrderItems(prevOrderItems => prevOrderItems.filter(oi => oi.product.id !== product.id));
    }
    
    function isProductInCart(product: Product): boolean {
        for (const oi of props.orderItems) {
            if (oi.product.id === product.id) {
                return true;
            }
        }
        
        return false;
    }
    
    function getOrderItemFromProduct(product: Product) {
        for (const oi of props.orderItems) {
            if (oi.product.id === product.id) {
                return oi;
            }
        }
        
        return undefined;
    }
    
    function updateOrderItem(product: Product, quantity: number) {
        props.setOrderItems(prev =>
           prev.map(oi =>
               oi.product.id === product.id ? { ...oi, quantity } : oi
           )
        );
    }
    
    return (
        <div className={s.component}>
            <div className={s.sortbar}>
                <button onClick={sortAz} className={activeFilter === 1 ? s.activeFilter : ''}>A-Z {isAzAscending ? '▲' : '▼'}</button>
                <button onClick={sortPrice} className={activeFilter === 2 ? s.activeFilter : ''}>$ {isPriceAscending ? '▲' : '▼'}</button>
            </div>
            
            <div className={s.grid}>
                {props.products.map(prod => (
                    <div
                        className={s.card}
                        key={prod.id}
                    >
                        {prod.imageUrl &&
                            <img src={prod.imageUrl} />
                        }
                        
                        <h3><Link to={`/product/${prod.id}`}>{prod.name}</Link></h3>
                        <p>{prod.brand}</p>
                        <p className={s.price}>${prod.price}</p>
                        
                        {!isProductInCart(prod) ?
                            <button onClick={() => addToCart(prod)}>add to cart</button>
                        :
                            <>
                                <button onClick={() => removeFromCart(prod)}>remove from cart</button>
                                
                                <input
                                    type="text"
                                    value={getOrderItemFromProduct(prod)?.quantity}
                                    onChange={(e) => updateOrderItem(prod, Number(e.currentTarget.value))}
                                />
                            </>
                        }
                    </div>
                ))}
            </div>
        </div>
    )
}