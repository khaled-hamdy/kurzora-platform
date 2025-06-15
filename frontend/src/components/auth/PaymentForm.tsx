
import React, { useState, useEffect } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

interface PaymentFormProps {
  onPaymentSuccess: (paymentMethodId: string) => void;
  onPaymentError: (error: string) => void;
  loading: boolean;
  planInfo?: {
    id: string;
    name: string;
    price: string;
    billingCycle?: string;
  };
}

const PaymentForm: React.FC<PaymentFormProps> = ({ onPaymentSuccess, onPaymentError, loading, planInfo }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [cardError, setCardError] = useState<string | null>(null);
  const [cardComplete, setCardComplete] = useState(false);

  const handleCardChange = (event: any) => {
    if (event.error) {
      setCardError(event.error.message);
      setCardComplete(false);
    } else {
      setCardError(null);
      setCardComplete(event.complete);
    }
  };

  // Automatically create payment method when card is complete
  useEffect(() => {
    if (cardComplete && stripe && elements && !loading) {
      createPaymentMethod();
    }
  }, [cardComplete, stripe, elements, loading]);

  const createPaymentMethod = async () => {
    if (!stripe || !elements) {
      onPaymentError('Stripe not loaded');
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      onPaymentError('Card element not found');
      return;
    }

    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (error) {
        setCardError(error.message || 'Payment failed');
        onPaymentError(error.message || 'Payment failed');
      } else {
        setCardError(null);
        onPaymentSuccess(paymentMethod.id);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Payment processing failed';
      setCardError(errorMessage);
      onPaymentError(errorMessage);
    }
  };

  // Show message if Stripe is not properly configured
  if (!stripe) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white">Payment Information</h3>
        <div className="p-4 bg-amber-900/50 rounded-lg border border-amber-700">
          <p className="text-amber-200 text-sm">
            ⚠️ Stripe is not configured yet. Please add your Stripe publishable key to enable payments.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-white">Payment Information</h3>
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
        <span>🔒</span>
        <span>Your card won't be charged for 7 days</span>
      </div>
      
      {/* Expanded Card Input Fields */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <div className="p-3 bg-gray-800/50 border border-gray-700 rounded-lg">
              <CardElement 
                onChange={handleCardChange}
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#ffffff',
                      '::placeholder': {
                        color: '#6b7280',
                      },
                      backgroundColor: 'transparent',
                    },
                    invalid: {
                      color: '#ef4444',
                    },
                  },
                  hidePostalCode: true,
                }}
              />
            </div>
          </div>
        </div>
        <input 
          placeholder="ZIP/Postal Code" 
          className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400"
        />
      </div>
      
      {cardError && (
        <p className="text-sm text-red-400">{cardError}</p>
      )}
      
      {cardComplete && (
        <p className="text-sm text-green-400">✓ Payment method ready</p>
      )}

      {/* Plan-specific payment description */}
      {planInfo && (
        <div className="mt-4 p-3 bg-gray-800/30 rounded-lg">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Plan:</span>
            <span className="text-white">{planInfo.name}</span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span className="text-gray-400">Trial period:</span>
            <span className="text-white">7 days free</span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span className="text-gray-400">Then:</span>
            <span className="font-medium text-white">${planInfo.price}/month</span>
          </div>
        </div>
      )}

      {/* Trust Elements and Payment Methods Section */}
      <div className="mt-6 pt-6 border-t border-gray-800">
        <p className="text-xs text-gray-500 text-center mb-4">
          Secure payment processing
        </p>
        
        {/* Trust Elements */}
        <div className="flex items-center justify-center gap-4 md:gap-6 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <span>🔒</span>
            <span>PCI Compliant</span>
          </span>
          <span className="flex items-center gap-1">
            <span>💳</span>
            <span>Powered by Stripe</span>
          </span>
          <span className="flex items-center gap-1">
            <span>↩️</span>
            <span>Cancel Anytime</span>
          </span>
        </div>

        {/* Payment Method Logos */}
        <div className="flex items-center justify-center gap-4 mt-4 mb-6">
          {/* Visa Logo */}
          <svg className="h-8 w-auto opacity-60" viewBox="0 0 48 32" fill="none">
            <rect width="48" height="32" rx="4" fill="#1A1F71"/>
            <path d="M20.5 22H16.5L19 10H23L20.5 22Z" fill="white"/>
            <path d="M30 10L26.5 18.5L26 10H22L21 22H24.5L28.5 13.5L29 22H33L34 10H30Z" fill="white"/>
            <text x="18" y="20" fill="white" fontSize="8" fontWeight="bold">VISA</text>
          </svg>
          
          {/* Mastercard Logo */}
          <svg className="h-8 w-auto opacity-60" viewBox="0 0 48 32" fill="none">
            <rect width="48" height="32" rx="4" fill="#EB001B"/>
            <circle cx="19" cy="16" r="9" fill="#FF5F00"/>
            <circle cx="29" cy="16" r="9" fill="#F79E1B"/>
          </svg>
          
          {/* Amex Logo */}
          <svg className="h-8 w-auto opacity-60" viewBox="0 0 48 32" fill="none">
            <rect width="48" height="32" rx="4" fill="#006FCF"/>
            <text x="12" y="20" fill="white" fontSize="6" fontWeight="bold">AMEX</text>
          </svg>
          
          <span className="text-xs text-gray-500">& more</span>
        </div>
      </div>
      
      <p className="text-xs text-gray-500">
        You can cancel anytime during your trial. We'll send a reminder email 2 days before your trial ends.
      </p>
    </div>
  );
};

export default PaymentForm;
