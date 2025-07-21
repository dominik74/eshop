import { useEffect, useMemo, useState } from "react";
import type { Product } from "../../types/Product";
import { useNavigate, useParams } from "react-router-dom";
import s from '../../less/product.module.less'
import * as prodApi from '../../api/products'
import type { User } from "../../types/User";
import type { OrderItem } from "../../types/OrderItem";

interface Props {
    setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
    user: User | undefined;
    orderItems: OrderItem[];
    setOrderItems: React.Dispatch<React.SetStateAction<OrderItem[]>>;
}

export default function ProductPage(props: Props) {
    const { id } = useParams();
    
    const [product, setProduct] = useState<Product | undefined>();
    const [imageUrl, setImageUrl] = useState<string | undefined>();
    
    const navigate = useNavigate();
    
    useEffect(() => {
        async function fetchData() {
            try {
                if (!id) {
                    props.setErrorMessage('product id is undefined');
                    return;
                }
                
                setProduct(await prodApi.getProductById(id));
                const img = await prodApi.getProductImage(id);
                setImageUrl(img);
            } catch (e) {
                if (e instanceof Error) {
                    props.setErrorMessage(e.message);
                }
            }
        }
        
        fetchData();
    }, [id]);
    
    
    async function updateProduct() {
        navigate(`/update/${id}`);
    }
    
    async function deleteProduct() {
        if (!id) {
            props.setErrorMessage('product id is undefined');
            return;
        }
        
        try {
            prodApi.deleteProduct(id);
            alert('product successfully deleted');
            navigate('/');
        } catch (e) {
            if (e instanceof Error) {
                props.setErrorMessage(e.message);
            }
        }
    }
    
    const releaseDate = useMemo(() => {
        const date = product?.releaseDate;
        return date ? new Date(date).toLocaleDateString() : '';
    }, [product?.releaseDate]);
    
    function addToCart() {
        if (!product) {
            return;
        }
        
        const orderItem: OrderItem = {
            product,
            quantity: 1
        };
        
        props.setOrderItems([...props.orderItems, orderItem]);
    }
    
    function removeFromCart() {
        if (!product) {
            return;
        }
        
        props.setOrderItems(prevOrderItems => prevOrderItems.filter(oi => oi.product.id !== product.id));
    }
    
    function isProductInCart(): boolean {
        if (!product) {
            return false;
        }
        
        for (const oi of props.orderItems) {
            if (oi.product.id === product.id) {
                return true;
            }
        }
        
        return false;
    }
    
    function getOrderItemFromProduct() {
        if (!product) {
            return undefined;
        }
        
        for (const oi of props.orderItems) {
            if (oi.product.id === product.id) {
                return oi;
            }
        }
        
        return undefined;
    }
    
    function updateOrderItem(quantity: number) {
        if (!product) {
            return;
        }
        
        props.setOrderItems(prev =>
           prev.map(oi =>
               oi.product.id === product.id ? { ...oi, quantity } : oi
           )
        );
    }
    
    return (
        <div className={s.component}>
            <div className={s.panel}>
                {imageUrl &&
                    <img src={imageUrl} />
                }
            
                <h2>{product?.name}</h2>
                <p>{product?.brand}</p>
                
                <h4 className={s.subheading}>description</h4>
                <p>{product?.description}</p>
                
                <h4 className={s.subheading}>stock item properties</h4>
                
                <div className={s.stockItemProperties}>
                    <p>stock available: {product?.quantity}</p>
                    <p>category: {product?.category}</p>
                    <p>listed: {releaseDate}</p>
                </div>
                
                <p className={s.price}>${product?.price}</p>
                
                <div className={s.buttonbar}>
                    {isProductInCart() ?
                        <div className={s.addToCartDiv}>
                                <button onClick={removeFromCart}>remove from cart</button>
                                
                                <input
                                    type="text"
                                    value={getOrderItemFromProduct()?.quantity}
                                    onChange={(e) => updateOrderItem(Number(e.currentTarget.value))}
                                />
                        </div>
                    :
                        <button onClick={addToCart}>add to cart</button>
                    }
                </div>
                    
                
                {props.user && props.user.admin &&
                    <div className={s.adminPanel}>
                        <h4>admin</h4>
                        <button onClick={updateProduct}>update</button>
                        <button onClick={deleteProduct}>delete</button>
                    </div>
                }
            </div>
        </div>
    );
}