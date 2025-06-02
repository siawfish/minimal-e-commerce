export interface CustomerData {
  fullName: string;
  email: string;
  phoneNumber: string;
  location: string;
}

export interface TransactionData {
  id: string;
  reference: string;
  amount: number;
  currency: string;
  status: 'success' | 'failed' | 'pending';
  customerData: CustomerData;
  cartItems: Array<{
    productId: string;
    productName: string;
    size: string;
    quantity: number;
    price: number;
    total: number;
  }>;
  subtotal: number;
  tax: number;
  total: number;
  createdAt: string;
  updatedAt: string;
}

export interface PaystackResponse {
  reference: string;
  trans: string;
  status: string;
  message: string;
  transaction: string;
  trxref: string;
  redirecturl: string;
} 