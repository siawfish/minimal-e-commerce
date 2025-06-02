export interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  description: string;
  sizes: string[];
  category: string;
  quantity: number;
}

export interface CartItem {
  product: Product;
  size: string;
  quantity: number;
} 