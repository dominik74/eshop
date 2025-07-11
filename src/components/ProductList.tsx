import { Link } from 'react-router-dom';
import s from '../less/product_list.module.less';
import type { Product } from '../types/Product';

interface Props {
    products: Product[];
}

export default function ProductList(props: Props) {
    return (
        <div className={`${s.component} ${s.grid}`}>
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
    )
}