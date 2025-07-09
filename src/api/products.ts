import { API_URL } from "../constants";
import type { Product } from "../types/Product";

export async function getProducts(): Promise<Product[]> {
    const resp = await fetch(API_URL + '/products');
        
    if (!resp.ok) {
        throw new Error(`${resp.status}: ${await resp.text()}`);
    }
    
    const prodData = await resp.json();
    
    if (!prodData) {
        throw new Error('invalid data received from server');
    }
    
    return prodData;
}

export async function fetchImagesAndUpdateProducts(products: Product[]): Promise<Product[]> {
    const promises = await Promise.allSettled(
        products.map(async prod => {
            const resp = await fetch(API_URL + `/product/${prod.id}/image`);
            
            if (!resp.ok) {
                throw new Error(`${resp.status}: ${await resp.text()}`);
            }
            
            const blob = await resp.blob();
            
            return { ...prod, imageUrl: URL.createObjectURL(blob) };
        })
    );
    
    const updatedProducts = promises.map((prm, i) =>
        prm.status === 'fulfilled' ?
            prm.value
            : { ...products[i], imageUrl: undefined }
    );
    
    return updatedProducts;
}

export async function getProductById(id: string): Promise<Product> {
    const resp = await fetch(`${API_URL}/product/${id}`);

    if (!resp.ok) {
        throw new Error(`${resp.status}: ${await resp.text()}`);
    }
    
    const data = await resp.json();
    
    if (!data) {
        throw new Error('invalid data received from server');
    }
    
    return data;
};

            
export async function getProductImage(id: string): Promise<string> {
    const resp = await fetch(`${API_URL}/product/${id}/image`);
        
    if (!resp.ok) {
        throw new Error(`${resp.status}: ${await resp.text()}`);
    }
    
    const blob = await resp.blob();
    return URL.createObjectURL(blob);
}

export async function deleteProduct(id: string) {
    const resp = await fetch(API_URL + `/product/${id}`, {
        method: 'delete'
    });
        
    if (!resp.ok) {
        throw new Error(`${resp.status}: ${await resp.text()}`);
    }
}

export async function createProduct(product: Product, image: File) {
    const formData = new FormData();
    
    formData.append('imageFile', image);
    formData.append('product', new Blob([JSON.stringify(product)], {type: 'application/json'}));
    
    const resp = await fetch('http://localhost:8081/api/product', {
        method: 'post',
        body: formData
    });
    
    if (!resp.ok) {
        throw new Error(`${resp.status}: ${await resp.text()}`);
    }
}

export async function updateProduct(product: Product, image: File) {
    const formData = new FormData();
    
    formData.append('imageFile', image);
    formData.append('product', new Blob([JSON.stringify(product)], {type: 'application/json'}));
    
    const resp = await fetch(API_URL + `/product/${product.id}`, {
        method: 'put',
        body: formData
    });
    
    if (!resp.ok) {
        throw new Error(`${resp.status}: ${await resp.text()}`);
    }
}

export async function searchProducts(keyword: string): Promise<Product[]> {
    const resp = await fetch(API_URL + '/products/search?keyword=' + keyword);
    
    if (!resp.ok) {
        throw new Error(`${resp.status}: ${await resp.text()}`);
    }
    
    const data = await resp.json();
    
    if (!data) {
        throw new Error('invalid data received from server');
    }
    
    return data;
}