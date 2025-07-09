export interface Product {
    id: number | undefined,
    name: string,
    description: string,
    brand: string,
    price: string,
    category: string,
    releaseDate: Date,
    available: boolean,
    quantity: number,
    imageUrl: string | undefined
}