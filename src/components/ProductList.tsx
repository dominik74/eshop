import { Link } from 'react-router-dom';
import s from '../less/product_list.module.less';
import type { Product } from '../types/Product';
import { useState } from 'react';

interface Props {
    products: Product[];
    setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
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
                        
                    </div>
                ))}
            </div>
        </div>
    )
}