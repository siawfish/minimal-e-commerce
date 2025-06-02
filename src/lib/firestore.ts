import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  query,
  where,
  orderBy,
  limit
} from 'firebase/firestore';
import { db } from './firebase';
import { Product } from '@/types/product';
import { CustomerData, TransactionData } from '@/types/checkout';

// Get all products
export async function getProducts(): Promise<Product[]> {
  try {
    const querySnapshot = await getDocs(collection(db, 'products'));
    const products: Product[] = [];
    
    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() } as Product);
    });
    
    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

// Get a single product by ID
export async function getProduct(productId: string): Promise<Product | null> {
  try {
    const docRef = doc(db, 'products', productId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Product;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
}

// Get products by category
export async function getProductsByCategory(category: string): Promise<Product[]> {
  try {
    const q = query(
      collection(db, 'products'),
      where('category', '==', category)
    );
    
    const querySnapshot = await getDocs(q);
    const products: Product[] = [];
    
    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() } as Product);
    });
    
    return products;
  } catch (error) {
    console.error('Error fetching products by category:', error);
    throw error;
  }
}

// Get trending products (limited number)
export async function getTrendingProducts(limitCount: number = 4): Promise<Product[]> {
  try {
    const q = query(
      collection(db, 'products'),
      orderBy('name'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const products: Product[] = [];
    
    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() } as Product);
    });
    
    return products;
  } catch (error) {
    console.error('Error fetching trending products:', error);
    throw error;
  }
}

// Search products by name
export async function searchProducts(searchTerm: string): Promise<Product[]> {
  try {
    // Note: This is a simple approach. For better search functionality,
    // consider using Algolia or implementing full-text search
    const querySnapshot = await getDocs(collection(db, 'products'));
    const products: Product[] = [];
    
    querySnapshot.forEach((doc) => {
      const product = { id: doc.id, ...doc.data() } as Product;
      if (product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase())) {
        products.push(product);
      }
    });
    
    return products;
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
}

// Get unique categories from all products
export async function getProductCategories(): Promise<string[]> {
  try {
    const querySnapshot = await getDocs(collection(db, 'products'));
    const categories = new Set<string>();
    
    querySnapshot.forEach((doc) => {
      const product = { id: doc.id, ...doc.data() } as Product;
      if (product.category) {
        categories.add(product.category);
      }
    });
    
    return Array.from(categories).sort();
  } catch (error) {
    console.error('Error fetching product categories:', error);
    throw error;
  }
}

// Save transaction to Firestore
export async function saveTransaction(transactionData: Omit<TransactionData, 'id'>): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, 'transactions'), {
      ...transactionData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error saving transaction:', error);
    throw error;
  }
}

// Save customer data to Firestore
export async function saveCustomer(customerData: CustomerData): Promise<void> {
  try {
    // Use email as document ID to avoid duplicates
    const customerDocRef = doc(db, 'customers', customerData.email);
    
    await setDoc(customerDocRef, {
      ...customerData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }, { merge: true });
    
  } catch (error) {
    console.error('Error saving customer:', error);
    throw error;
  }
}

// Update transaction status
export async function updateTransactionStatus(transactionId: string, status: 'success' | 'failed' | 'pending'): Promise<void> {
  try {
    const transactionRef = doc(db, 'transactions', transactionId);
    await setDoc(transactionRef, {
      status,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    
  } catch (error) {
    console.error('Error updating transaction status:', error);
    throw error;
  }
}

// Check if customer exists
export async function getCustomer(email: string): Promise<CustomerData | null> {
  try {
    const customerRef = doc(db, 'customers', email);
    const customerSnap = await getDoc(customerRef);
    
    if (customerSnap.exists()) {
      return customerSnap.data() as CustomerData;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching customer:', error);
    throw error;
  }
} 