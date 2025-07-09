import { useEffect, useState } from "react";
import type { Product } from "../../types/Product";
import { Link } from "react-router-dom";
import s from '../../less/home.module.less'
// import { getProducts } from "../api";
import * as prodApi from "../../api/products";

interface Props {
    setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
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
        <div className={s.component}>
            <h1>home</h1>  
            
            <div className={s.grid}>
                {products.map(prod => (
                    <div
                        className={s.card}
                        key={prod.id}
                    >
                        {prod.imageUrl &&
                            <img src={prod.imageUrl} />
                        }
                        
                        <h3><Link to={`/product/${prod.id}`}>{prod.name}</Link></h3>
                        <p>{prod.brand}</p>
                        <p>${prod.price}</p>
                        
                    </div>
                ))}
            </div>
        </div>
    );
}