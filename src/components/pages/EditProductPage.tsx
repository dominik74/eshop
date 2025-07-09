import { useEffect, useState, type ChangeEvent } from "react";
import type { Product } from "../../types/Product";
import { useNavigate, useParams } from "react-router-dom";
import styles from '../../less/edit_product.module.less'
import * as prodApi from '../../api/products'

interface Props {
    setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
}

export default function EditProductPage(props: Props) {
    const { id } = useParams();
    
    const [product, setProduct] = useState<Product | undefined>({
        id: undefined,
        name: "",
        description: "",
        brand: "",
        price: "",
        category: "",
        releaseDate: new Date(),
        available: true,
        quantity: 1,
        imageUrl: undefined
    });

    const [image, setImage] = useState<File | undefined>();
    
    const navigate = useNavigate();
    
    useEffect(() => {
        async function run() {
            if (!id) {
                props.setErrorMessage('product id is undefined');
                return;
            }
            
            try {
                setProduct(await prodApi.getProductById(id));
            } catch (error) {
                if (error instanceof Error) {
                    props.setErrorMessage(error.message);
                }
            }
        }
        
        run();
    }, []);
    
    async function createProduct() {
        if (!product || !image) {
            return;
        }
        
        try {
            prodApi.createProduct(product, image);
            alert('product added successfully');
        } catch (error) {
            if (error instanceof Error) {
                props.setErrorMessage(error.message);
            }
        }
    }
    
    async function updateProduct() {
        if (!product || !image) {
            return;
        }
        
        try {
            prodApi.updateProduct(product, image);
            alert('product updated successfully');
            navigate('/product/' + id);
        } catch (error) {
            if (error instanceof Error) {
                props.setErrorMessage(error.message);
            }
        }
    }
    
    async function handleSubmit(event: ChangeEvent<HTMLFormElement>) {
        event.preventDefault();
        
        if (id) {
            updateProduct();
        } else {
            createProduct();
        }
    }

    function handleImageChange(event: ChangeEvent<HTMLInputElement>): void {
        if (event.target.files == null) {
            return;
        }
        
        setImage(event.target.files[0]);
    }
    
    function handleInputChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
        const { name, value } = event.target;
        
        if (!product) {
            return;
        }
        
        setProduct({ ...product, [name]: value});
    }
    
    function handleCheckboxChange(event: ChangeEvent<HTMLInputElement>): void {
        const { name, checked } = event.target;
        
        if (!product) {
            return;
        }
        
        setProduct({ ...product, [name]: checked});
    }

    return (
        <div className={styles.component}>
            <h3>
                {id ? 'edit product' : 'new product'}    
            </h3>
            
            <form onSubmit={handleSubmit}>
                <label>
                    <span>name</span>
                    <input
                        type="text"
                        placeholder="name"
                        name="name"
                        onChange={handleInputChange}
                        value={product?.name}
                    />
                </label>
                
                <label>
                    <span>brand</span>    
                    <input
                        type="text"
                        placeholder="brand"
                        name="brand"
                        onChange={handleInputChange}
                        value={product?.brand}
                    />
                </label>
                    
                <label>
                    <span>description</span>
                    <textarea
                        placeholder="description"
                        name="description"
                        onChange={handleInputChange}
                        value={product?.description}
                        maxLength={10}
                    />
                </label>
                
                <label>
                    <span>price</span>
                    <input
                        type="number"
                        placeholder="price"
                        name="price"
                        onChange={handleInputChange}
                        value={product?.price}
                    />
                </label>
                
                <label>
                    <span>category</span>
                    <input
                        type="text"
                        placeholder="category"
                        name="category"
                        onChange={handleInputChange}
                        value={product?.category}
                    />
                </label>
                
                <label>
                    <span>quantity</span>
                    <input
                        type="number"
                        placeholder="quantity"
                        name="quantity"
                        onChange={handleInputChange}
                        value={product?.quantity}
                    />
                </label>
                
                <label>
                    <span>date</span>
                    <input
                        type="date"
                        placeholder="release date"
                        name="releaseDate"
                        onChange={handleInputChange}
                    />
                </label>

                <label>
                    <span>available</span>
                    <input
                        type="checkbox"
                        placeholder="available"
                        name="available"
                        onChange={handleCheckboxChange}
                        checked={product?.available}
                    />
                </label>                

                <label>
                    <span>image</span>
                    <input
                        type="file"
                        placeholder="image"
                        onChange={handleImageChange}
                    />
                </label>                
                
                <input
                    type="submit"
                    value="submit"
                />
            </form>
        </div>
    );
}