export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  sizes: string[];
  category: string;
}

export interface CartItem {
  product: Product;
  size: string;
  quantity: number;
} 