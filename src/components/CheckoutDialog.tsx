'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { saveTransaction, saveCustomer, updateTransactionStatus } from '@/lib/firestore';
import { CustomerData, TransactionData, PaystackResponse } from '@/types/checkout';
import numeral from 'numeral';
import { X, User, Mail, Phone, MapPin, CreditCard } from 'lucide-react';

// Validation schema
const checkoutSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phoneNumber: z.string().min(10, 'Please enter a valid phone number'),
  location: z.string().min(5, 'Please provide your delivery location'),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

interface CheckoutDialogProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
}

// Add proper typing for Paystack
interface PaystackPopInterface {
  setup: (config: PaystackConfig) => {
    openIframe: () => void;
  };
}

interface PaystackConfig {
  key: string;
  email: string;
  amount: number;
  currency: string;
  ref: string;
  metadata?: {
    transactionId: string;
    custom_fields?: Array<{
      display_name: string;
      variable_name: string;
      value: string;
    }>;
  };
  callback: (response: PaystackResponse) => void;
  onClose: () => void;
}

declare global {
  interface Window {
    PaystackPop?: PaystackPopInterface;
  }
}

export default function CheckoutDialog({ isOpen, onClose, total }: CheckoutDialogProps) {
  const { state, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState<'form' | 'payment' | 'success'>('form');

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    mode: 'onChange',
  });

  const initializePaystack = (): Promise<PaystackPopInterface> => {
    return new Promise<PaystackPopInterface>((resolve, reject) => {
      // Check if PaystackPop is already loaded
      if (typeof window !== 'undefined' && window.PaystackPop) {
        resolve(window.PaystackPop);
        return;
      }

      // Load Paystack script
      const script = document.createElement('script');
      script.src = 'https://js.paystack.co/v1/inline.js';
      script.onload = () => {
        if (window.PaystackPop) {
          resolve(window.PaystackPop);
        } else {
          reject(new Error('Paystack failed to load'));
        }
      };
      script.onerror = () => reject(new Error('Failed to load Paystack script'));
      document.head.appendChild(script);
    });
  };

  const generateReference = () => {
    return `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const onSubmit = async (formData: CheckoutFormData) => {
    setIsProcessing(true);
    
    try {
      // Generate transaction reference
      const reference = generateReference();
      const amountInKobo = Math.round(total * 100); // Convert to kobo (Paystack expects amount in kobo)

      // Prepare transaction data
      const transactionData: Omit<TransactionData, 'id'> = {
        reference,
        amount: total,
        currency: 'GHS',
        status: 'pending',
        customerData: formData,
        cartItems: state.items.map(item => ({
          productId: item.product.id,
          productName: item.product.name,
          size: item.size,
          quantity: item.quantity,
          price: item.product.price,
          total: item.product.price * item.quantity,
        })),
        subtotal: state.total,
        tax: state.total * 0.08,
        total: total,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Save initial transaction (pending status)
      const transactionId = await saveTransaction(transactionData);

      // Initialize Paystack
      const PaystackPop = await initializePaystack();

      // Configure Paystack payment
      const handler = PaystackPop.setup({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '', // Handle undefined case
        email: formData.email,
        amount: amountInKobo,
        currency: 'GHS',
        ref: reference,
        metadata: {
          transactionId,
          custom_fields: [
            {
              display_name: "Full Name",
              variable_name: "full_name",
              value: formData.fullName
            },
            {
              display_name: "Phone Number",
              variable_name: "phone_number",
              value: formData.phoneNumber
            },
            {
              display_name: "Location",
              variable_name: "location",
              value: formData.location
            }
          ]
        },
        callback: async function(response: PaystackResponse) {
          try {
            if (response.status === 'success') {
              // Update transaction status to success
              await updateTransactionStatus(transactionId, 'success');
              
              // Save customer data
              await saveCustomer(formData);
              
              // Clear cart
              clearCart();
              
              // Show success state
              setCurrentStep('success');
            } else {
              // Update transaction status to failed
              await updateTransactionStatus(transactionId, 'failed');
              alert('Payment failed. Please try again.');
            }
          } catch (error) {
            console.error('Error handling payment callback:', error);
            alert('An error occurred while processing your payment. Please contact support.');
          }
          setIsProcessing(false);
        },
        onClose: function() {
          // Update transaction status to failed if user closes payment popup
          updateTransactionStatus(transactionId, 'failed').catch(console.error);
          setIsProcessing(false);
        }
      });

      // Open payment popup
      handler.openIframe();

    } catch (error) {
      console.error('Checkout error:', error);
      alert('An error occurred during checkout. Please try again.');
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    if (!isProcessing) {
      reset();
      setCurrentStep('form');
      onClose();
    }
  };

  const renderFormStep = () => (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Full Name */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 flex items-center">
          <User className="h-4 w-4 mr-2 text-gray-500" />
          Full Name
        </label>
        <input
          {...register('fullName')}
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
          placeholder="Enter your full name"
        />
        {errors.fullName && (
          <p className="text-sm text-red-600">{errors.fullName.message}</p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 flex items-center">
          <Mail className="h-4 w-4 mr-2 text-gray-500" />
          Email Address
        </label>
        <input
          {...register('email')}
          type="email"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
          placeholder="Enter your email address"
        />
        {errors.email && (
          <p className="text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      {/* Phone Number */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 flex items-center">
          <Phone className="h-4 w-4 mr-2 text-gray-500" />
          Phone Number
        </label>
        <input
          {...register('phoneNumber')}
          type="tel"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
          placeholder="Enter your phone number"
        />
        {errors.phoneNumber && (
          <p className="text-sm text-red-600">{errors.phoneNumber.message}</p>
        )}
      </div>

      {/* Location */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 flex items-center">
          <MapPin className="h-4 w-4 mr-2 text-gray-500" />
          Delivery Location
        </label>
        <textarea
          {...register('location')}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black resize-none"
          placeholder="Enter your delivery address (street, city, area)"
        />
        {errors.location && (
          <p className="text-sm text-red-600">{errors.location.message}</p>
        )}
        <p className="text-xs text-gray-500">
          This information will help us with accurate and timely delivery of your order.
        </p>
      </div>

      {/* Order Summary */}
      <div className="border-t pt-4 space-y-2">
        <h4 className="font-medium text-gray-900">Order Summary</h4>
        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span>₵{numeral(state.total).format('0,0')}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Tax (8%)</span>
          <span>₵{numeral(state.total * 0.08).format('0,0')}</span>
        </div>
        <div className="flex justify-between font-medium border-t pt-2">
          <span>Total</span>
          <span>₵{numeral(total).format('0,0')}</span>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={!isValid || isProcessing}
        className="w-full bg-black text-white hover:bg-gray-800 flex items-center justify-center"
      >
        {isProcessing ? (
          'Processing...'
        ) : (
          <>
            <CreditCard className="h-4 w-4 mr-2" />
            Pay ₵{numeral(total).format('0,0')}
          </>
        )}
      </Button>
    </form>
  );

  const renderSuccessStep = () => (
    <div className="text-center py-8">
      <div className="mb-6">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Payment Successful!</h3>
      <p className="text-gray-600 mb-6">
        Thank you for your order. You will receive a confirmation email shortly.
      </p>
      <Button
        onClick={handleClose}
        className="bg-black text-white hover:bg-gray-800"
      >
        Continue Shopping
      </Button>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>
                {currentStep === 'form' && 'Checkout'}
                {currentStep === 'success' && 'Order Complete'}
              </DialogTitle>
              {currentStep === 'form' && (
                <DialogDescription>
                  Please provide your information for delivery
                </DialogDescription>
              )}
            </div>
            {!isProcessing && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </DialogHeader>

        <div className="mt-4">
          {currentStep === 'form' && renderFormStep()}
          {currentStep === 'success' && renderSuccessStep()}
        </div>
      </DialogContent>
    </Dialog>
  );
} 