import { useEffect, useState } from "react";
import type { Product } from "../../types/Product";
import * as prodApi from "../../api/products";
import ProductList from "../ProductList";
import type { OrderItem } from "../../types/OrderItem";

interface Props {
    setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
    orderItems: OrderItem[];
    setOrderItems: React.Dispatch<React.SetStateAction<OrderItem[]>>;
}

export default function HomePage(props: Props) {
    const [products, setProducts] = useState<Product[] | []>([]);
    
    useEffect(() => {
        async function run() {
            try {
                let products = await prodApi.getProducts();
                products = await prodApi.fetchImagesAndUpdateProducts(products);
                setProducts(products);
            } catch (e) {
                if (e instanceof Error) {
                    props.setErrorMessage(e.message);
                }
            }
        }
        
        run();
    }, []);
    
    return (
        <>
            <h1>home</h1>
            
            <ProductList
                products={products}
                setProducts={setProducts}
                orderItems={props.orderItems}
                setOrderItems={props.setOrderItems}
            />
        </>
    );
}