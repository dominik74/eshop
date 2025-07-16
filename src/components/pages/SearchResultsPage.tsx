import { useLocation } from 'react-router-dom';
import ProductList from '../ProductList';
import * as prodApi from '../../api/products';
import { useEffect, useState } from 'react';
import type { Product } from '../../types/Product';
import type { OrderItem } from '../../types/OrderItem';

interface Props {
    setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
    orderItems: OrderItem[];
    setOrderItems: React.Dispatch<React.SetStateAction<OrderItem[]>>;
}

export default function SearchResultsPage(props: Props) {
    const [products, setProducts] = useState<Product[]>([]);
    
    const query = new URLSearchParams(useLocation().search);
    
    useEffect(() => {
        async function run() {
            const q = query.get('q');
        
            if (!q) {
                return;
            }
            
            try {
                let products = await prodApi.searchProducts(q);
                products = await prodApi.fetchImagesAndUpdateProducts(products);
                setProducts(products);
            } catch (e) {
                if (e instanceof Error) {
                    props.setErrorMessage(e.message);
                }
            }
        }
        
        run();
    }, [useLocation().search]);
    
    return (
        <>
            <h1>results for "{query.get('q')}"</h1>
            <p>found {products.length} products.</p>
            
            <ProductList
                products={products}
                setProducts={setProducts}
                orderItems={props.orderItems}
                setOrderItems={props.setOrderItems}
            />
        </>
    )
}