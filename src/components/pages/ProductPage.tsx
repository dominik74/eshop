import { useEffect, useMemo, useState } from "react";
import type { Product } from "../../types/Product";
import { useNavigate, useParams } from "react-router-dom";
import s from '../../less/product.module.less'
import * as prodApi from '../../api/products'
import type { User } from "../../types/User";

interface Props {
    setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
    user: User | undefined;
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
    
    return (
        <div className={s.component}>
            {imageUrl &&
                <img src={imageUrl} />
            }
        
            <h2>{product?.name}</h2>
            <p>{product?.brand}</p>
            <p>${product?.price}</p>
            <p>{product?.description}</p>
            <p>stock available: {product?.quantity}</p>
            <p>category: {product?.category}</p>
            <p>listed: {releaseDate}</p>
            
            {props.user && props.user.admin &&
                <div className={s.adminPanel}>
                    <h4>admin</h4>
                    <button onClick={updateProduct}>update</button>
                    <button onClick={deleteProduct}>delete</button>
                </div>
            }
        </div>
    );
}