import type { Product } from "../../types/Product";
import s from '../../less/cart.module.less';
import ProductList from "../ProductList";

interface Props {
    cartProducts: Product[];
    setCartProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

export default function CartPage(props: Props) {
    function clearCart() {
        const userConfirmed = confirm('empty cart?');
        
        if (userConfirmed) {
            props.setCartProducts([]);
        }
    }
    
    return (
        <div>
            <h1>shopping cart</h1>
            
            <button onClick={clearCart} className={s.clearCart}>empty cart</button>
            
            <ProductList
                products={props.cartProducts}
                setProducts={props.setCartProducts}
                cartProducts={props.cartProducts}
                setCartProducts={props.setCartProducts}
            />
        </div>
    )
}