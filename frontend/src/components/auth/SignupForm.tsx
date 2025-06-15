import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import PlanDisplay from './PlanDisplay';
import SignupFormFields from './SignupFormFields';
import SocialAuth from './SocialAuth';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import PaymentForm from './PaymentForm';

// Use your actual test key for testing with test cards
const STRIPE_PUBLISHABLE_KEY = 'pk_test_51RYbcjP6fp0wCWWukGV48u4rYD6mhqCxFlEKjsKmwmqNkPJcDI7bKrNlqe7SPGBu4dyxy2kpBnejKQDgS0YU5uVL00omhfiN1n';
const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

const planDetails = {
  starter: {
    name: 'Starter',
    price: 29,
    badge: null,
  },
  professional: {
    name: 'Professional', 
    price: 79,
    badge: 'Most Popular',
  },
  elite: {
    name: 'Elite',
    price: 199,
    badge: 'Best Value',
  }
};

interface SignupFormProps {
  onSwitchToLogin: () => void;
  selectedPlan?: {
    id: string;
    name: string;
    price: string;
    billingCycle?: string;
  };
}

const SignupForm: React.FC<SignupFormProps> = ({ onSwitchToLogin, selectedPlan }) => {
  const { signup, loading } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [planInfo, setPlanInfo] = useState(selectedPlan || null);
  const [paymentMethodId, setPaymentMethodId] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isGoogleSignIn, setIsGoogleSignIn] = useState(false);

  useEffect(() => {
    // Check URL parameters for plan info
    const urlParams = new URLSearchParams(window.location.search);
    const planId = urlParams.get('plan');
    const planPrice = urlParams.get('price');
    const billingCycle = urlParams.get('billing') || 'monthly';

    if (planId && planPrice) {
      const planDetail = planDetails[planId as keyof typeof planDetails];
      if (planDetail) {
        setPlanInfo({
          id: planId,
          name: planDetail.name,
          price: planPrice,
          billingCycle: billingCycle
        });
      }
    } else if (!selectedPlan) {
      // Default to professional plan if no plan specified
      setPlanInfo({
        id: 'professional',
        name: 'Professional',
        price: '79',
        billingCycle: 'monthly'
      });
    }

    // Restore form data if available
    const savedFormData = localStorage.getItem('signupFormData');
    if (savedFormData) {
      try {
        setFormData(JSON.parse(savedFormData));
      } catch (error) {
        console.error('Error parsing saved form data:', error);
      }
    }
  }, [selectedPlan]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!isGoogleSignIn && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      toast.error('Passwords do not match');
      return;
    }

    if (planInfo && !paymentMethodId) {
      setError('Please enter your payment information');
      toast.error('Please enter your payment information');
      return;
    }
    
    try {
      setIsProcessingPayment(true);
      
      // First create the user account (only if not Google sign-in)
      if (!isGoogleSignIn) {
        await signup(formData.email, formData.password, formData.name);
      }
      
      // If there's a plan and payment method, create subscription
      if (planInfo && paymentMethodId) {
        // TODO: Connect to backend logic via /src/backend-functions/CreateSubscription.ts
        console.log('Creating subscription with payment method:', paymentMethodId);
        console.log('Plan info:', planInfo);
        
        // Store subscription info for later processing
        localStorage.setItem('pendingSubscription', JSON.stringify({
          planId: planInfo.id,
          paymentMethodId: paymentMethodId
        }));
      }
      
      // Store plan selection for post-signup flow
      if (planInfo) {
        localStorage.setItem('selectedPlan', JSON.stringify(planInfo));
        localStorage.setItem('showWelcome', 'true');
      }
      
      // Clear saved form data on successful signup
      localStorage.removeItem('signupFormData');
      
      toast.success('Account created successfully! Welcome to Kurzora.');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Signup failed. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFormData = {
      ...formData,
      [e.target.name]: e.target.value
    };
    setFormData(newFormData);
    
    // Save form data to localStorage
    localStorage.setItem('signupFormData', JSON.stringify(newFormData));
  };

  const handleChangePlan = () => {
    // Save current form data before navigation
    localStorage.setItem('signupFormData', JSON.stringify(formData));
    window.location.href = '/pricing';
  };

  const handlePaymentSuccess = (paymentMethodId: string) => {
    setPaymentMethodId(paymentMethodId);
    setPaymentError(null);
    toast.success('Payment method added successfully');
  };

  const handlePaymentError = (error: string) => {
    setPaymentError(error);
    setPaymentMethodId(null);
  };

  const handleGoogleSignIn = async () => {
    try {
      setError(null);
      setIsGoogleSignIn(true);
      
      // TODO: Connect to backend logic via /src/backend-functions/GoogleAuth.ts
      console.log('Attempting Google sign-in...');
      
      // Mock Google sign-in for now - replace with actual Firebase implementation
      const mockUser = {
        uid: 'google_' + Date.now(),
        email: 'user@gmail.com',
        displayName: 'Google User',
        photoURL: null
      };
      
      // Set form data from Google user
      setFormData(prev => ({
        ...prev,
        name: mockUser.displayName || '',
        email: mockUser.email || ''
      }));
      
      toast.success('Google sign-in successful! Please complete payment information.');
    } catch (error) {
      console.error('Google sign-in error:', error);
      setError('Failed to sign in with Google. Please try again.');
      setIsGoogleSignIn(false);
    }
  };

  const getButtonText = () => {
    if (isProcessingPayment) {
      return 'Setting up your subscription...';
    }
    if (loading) {
      return planInfo ? 'Creating account...' : 'Creating account...';
    }
    if (planInfo) {
      return 'Start Free Trial';
    }
    return 'Create Account';
  };

  return (
    <Card className="w-full max-w-md bg-slate-900/50 backdrop-blur-sm border-blue-800/30">
      <CardHeader className="space-y-1">
        <div className="flex justify-center mb-4">
          <img src="/kurzora-logo.svg" alt="Kurzora Logo" className="h-12 w-auto" />
        </div>
        <CardTitle className="text-2xl text-center text-white">Create account</CardTitle>
        <CardDescription className="text-center text-slate-400">
          Join thousands of successful traders
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <PlanDisplay planInfo={planInfo} onChangePlan={handleChangePlan} />
        
        {/* Error Message Container */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isGoogleSignIn && <SignupFormFields formData={formData} onChange={handleChange} />}
          
          {isGoogleSignIn && (
            <div className="space-y-2">
              <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                <p className="text-sm text-green-400">Signed in with Google as {formData.email}</p>
              </div>
            </div>
          )}

          {/* Payment Information Section - Always show if plan is selected */}
          {planInfo && (
            <div className="mt-6">
              <Elements stripe={stripePromise}>
                <PaymentForm
                  onPaymentSuccess={handlePaymentSuccess}
                  onPaymentError={handlePaymentError}
                  loading={loading || isProcessingPayment}
                  planInfo={planInfo}
                />
              </Elements>
              {paymentError && (
                <p className="text-sm text-red-400 mt-2">{paymentError}</p>
              )}
            </div>
          )}
          
          <button 
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed text-white"
            disabled={loading || isProcessingPayment}
          >
            {(loading || isProcessingPayment) ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                {getButtonText()}
              </span>
            ) : (
              getButtonText()
            )}
          </button>
        </form>
        
        <SocialAuth onGoogleSignIn={handleGoogleSignIn} />
        
        <div className="text-center text-sm">
          <span className="text-slate-400">Already have an account? </span>
          <button 
            onClick={onSwitchToLogin}
            className="text-blue-400 hover:text-blue-300 font-medium"
          >
            Sign in
          </button>
        </div>
        
        <div className="text-center text-xs text-slate-400">
          By creating an account, you agree to our{' '}
          <a href="#" className="text-blue-400 hover:text-blue-300">Terms of Service</a>
          {' '}and{' '}
          <a href="#" className="text-blue-400 hover:text-blue-300">Privacy Policy</a>
        </div>
      </CardContent>
    </Card>
  );
};

export default SignupForm;
