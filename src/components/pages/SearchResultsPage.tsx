import { useLocation, useParams } from 'react-router-dom';
import ProductList from '../ProductList';
import * as prodApi from '../../api/products';
import { useEffect, useState } from 'react';
import type { Product } from '../../types/Product';

interface Props {
    setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
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
            <ProductList products={products} setProducts={setProducts} />
        </>
    )
}