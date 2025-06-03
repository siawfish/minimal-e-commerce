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
import { useToast } from '@/hooks/use-toast';
import { saveTransaction, saveCustomer, updateTransactionStatus } from '@/lib/firestore';
import { TransactionData } from '@/types/checkout';
import numeral from 'numeral';
import { X, User, Mail, Phone, MapPin, CreditCard, Check, Info } from 'lucide-react';

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

// Paystack response interface
interface PaystackResponse {
  reference: string;
  status: string;
  trans: string;
  transaction: string;
  trxref: string;
  message: string;
}

// Paystack configuration interface
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

// Global Paystack interface
declare global {
  interface Window {
    PaystackPop?: {
      setup: (config: PaystackConfig) => {
        openIframe: () => void;
      };
    };
  }
}

export default function CheckoutDialog({ isOpen, onClose, total }: CheckoutDialogProps) {
  const { state, clearCart } = useCart();
  const { toasts, success, error, removeToast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState<'form' | 'payment' | 'success'>('form');
  const [isPaystackOpen, setIsPaystackOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    mode: 'onChange',
  });

  const generateReference = () => {
    return `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const loadPaystackScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.PaystackPop) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://js.paystack.co/v1/inline.js';
      script.onload = () => resolve(!!window.PaystackPop);
      script.onerror = () => resolve(false);
      document.head.appendChild(script);
    });
  };

  const onSubmit = async (formData: CheckoutFormData) => {
    setIsProcessing(true);
    
    try {
      // Generate transaction reference
      const reference = generateReference();

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

      // Load Paystack script
      const isPaystackLoaded = await loadPaystackScript();
      
      if (!isPaystackLoaded || !window.PaystackPop) {
        throw new Error('Failed to load Paystack payment system');
      }

      // Configure Paystack payment
      const handler = window.PaystackPop.setup({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '',
        email: formData.email,
        amount: Math.round(total * 100), // Amount in kobo
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
        callback: function(response: PaystackResponse) {
          console.log('Payment response:', response);
          setIsPaystackOpen(false); // Hide Paystack state
          
          if (response.status === 'success') {
            // Handle successful payment asynchronously
            updateTransactionStatus(transactionId, 'success')
              .then(() => saveCustomer(formData))
              .then(() => {
                clearCart();
                setCurrentStep('success');
                success(
                  'Payment Successful!',
                  'Your order has been confirmed. You will receive a confirmation email shortly.',
                  6000
                );
              })
              .catch((err) => {
                console.error('Error handling payment success:', err);
                error(
                  'Payment Successful',
                  'Your payment was successful but there was an error saving your information. Please contact support.',
                  8000
                );
              })
              .finally(() => {
                setIsProcessing(false);
              });
          } else {
            // Handle failed payment
            updateTransactionStatus(transactionId, 'failed')
              .then(() => {
                error(
                  'Payment Failed',
                  'Your payment could not be processed. Please try again or contact support if the problem persists.',
                  6000
                );
              })
              .catch((err) => {
                console.error('Error updating transaction status:', err);
                error(
                  'Payment Error',
                  'There was an error processing your payment. Please contact support.',
                  6000
                );
              })
              .finally(() => {
                setIsProcessing(false);
              });
          }
        },
        onClose: function() {
          console.log('Payment dialog closed');
          setIsPaystackOpen(false); // Hide Paystack state
          // Update transaction status to failed if user closes payment popup
          updateTransactionStatus(transactionId, 'failed')
            .catch((err) => {
              console.error('Error updating transaction status on close:', err);
            })
            .finally(() => {
              setIsProcessing(false);
            });
        }
      });

      // Set Paystack state and open popup
      setIsPaystackOpen(true);
      
      // Small delay to ensure state update, then open popup
      setTimeout(() => {
        handler.openIframe();
      }, 100);

    } catch (err) {
      console.error('Checkout error:', err);
      error(
        'Checkout Error',
        'An error occurred during checkout. Please try again or contact support if the problem persists.',
        6000
      );
      setIsProcessing(false);
    }
  };

  const handleDialogClose = () => {
    if (!isProcessing && !isPaystackOpen) {
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
        onClick={handleDialogClose}
        className="bg-black text-white hover:bg-gray-800"
      >
        Continue Shopping
      </Button>
    </div>
  );

  return (
    <>
      <Dialog open={isOpen && !isPaystackOpen} onOpenChange={handleDialogClose}>
        <DialogContent 
          className="sm:max-w-md max-h-[90vh] overflow-y-auto"
          style={{
            zIndex: isPaystackOpen ? -1 : 50, // Lower z-index when Paystack is open
          }}
        >
          <DialogHeader>
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
          </DialogHeader>

          <div className="mt-4">
            {currentStep === 'form' && renderFormStep()}
            {currentStep === 'success' && renderSuccessStep()}
          </div>
        </DialogContent>
        
        {/* Overlay for when Paystack is open */}
        {isPaystackOpen && (
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm"
            style={{ zIndex: 40 }}
          >
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-white text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                <p>Loading payment...</p>
              </div>
            </div>
          </div>
        )}
      </Dialog>

      {/* Toast Container */}
      <div className="fixed top-6 right-6 z-50 space-y-2">
        {toasts.map((toast) => (
          <div key={toast.id}>
            <div className="transform transition-all duration-200 ease-in-out translate-x-0 opacity-100">
              <div className={`bg-white border shadow-lg rounded-lg p-4 min-w-[300px] max-w-md ${
                toast.type === 'success' ? 'bg-green-50 border-green-200 text-green-900' :
                toast.type === 'error' ? 'bg-red-50 border-red-200 text-red-900' :
                'bg-blue-50 border-blue-200 text-blue-900'
              }`}>
                <div className="flex items-start space-x-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                    toast.type === 'success' ? 'bg-green-500 text-white' :
                    toast.type === 'error' ? 'bg-red-500 text-white' :
                    'bg-blue-500 text-white'
                  }`}>
                    {toast.type === 'success' && <Check className="w-3.5 h-3.5" />}
                    {toast.type === 'error' && <X className="w-3.5 h-3.5" />}
                    {toast.type === 'info' && <Info className="w-3.5 h-3.5" />}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold">{toast.title}</p>
                    {toast.description && (
                      <p className="text-xs mt-1 opacity-80">{toast.description}</p>
                    )}
                  </div>
                  
                  <button
                    onClick={() => removeToast(toast.id)}
                    className="w-5 h-5 flex items-center justify-center hover:bg-black/10 rounded-full transition-colors flex-shrink-0"
                  >
                    <X className="w-3 h-3 opacity-60" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
} 