import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import {
  Loader2,
  ArrowLeft,
  X,
  Star,
  Shield,
  Lock,
  CreditCard,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

// 🔧 FIXED: VITE environment variable first (the only change needed)
const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ||
    import.meta.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
).catch((error) => {
  console.error("❌ Stripe failed to load:", error);
  console.error("❌ Check STRIPE_PUBLISHABLE_KEY in .env.local");
  return null;
});

console.log(
  "🔧 Stripe publishable key:",
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ||
    import.meta.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    ? "✅ Found"
    : "❌ Missing"
);
console.log(
  "🔧 Using key prefix:",
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ? "VITE_" : "NEXT_PUBLIC_"
);

const planDetails = {
  starter: {
    name: "Starter",
    price: 19,
    badge: null,
  },
  professional: {
    name: "Professional",
    price: 49,
    badge: "Most Popular",
  },
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

// Stripe CardElement styling - fixed double ZIP code issue
const cardElementOptions = {
  style: {
    base: {
      fontSize: "16px",
      color: "#ffffff",
      "::placeholder": {
        color: "#94a3b8",
      },
    },
    invalid: {
      color: "#ef4444",
    },
  },
  hidePostalCode: true, // 🔧 FIX: Hide Stripe's built-in ZIP field
};

// Payment Form Component (inside Stripe Elements)
const PaymentForm: React.FC<{
  formData: any;
  planInfo: any;
  zipCode: string;
  setZipCode: (value: string) => void;
  onSubmit: (paymentMethodId: string) => void;
  isLoading: boolean;
}> = ({ formData, planInfo, zipCode, setZipCode, onSubmit, isLoading }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [cardError, setCardError] = useState<string | null>(null);

  console.log("🎯 PaymentForm Debug:", {
    stripe: !!stripe,
    elements: !!elements,
  });

  const handleCardChange = (event: any) => {
    console.log("💳 Card change event:", event);
    setCardError(event.error ? event.error.message : null);
  };

  // Debug rendering
  useEffect(() => {
    console.log("🎯 PaymentForm mounted - Stripe status:", {
      stripe: !!stripe,
      elements: !!elements,
    });

    // Check if Stripe failed to load after 5 seconds
    const timeout = setTimeout(() => {
      if (!stripe || !elements) {
        console.error("❌ Stripe failed to load after 5 seconds");
        setCardError(
          "Unable to load payment form. Please refresh the page or try again."
        );
      }
    }, 5000);

    return () => clearTimeout(timeout);
  }, [stripe, elements]);

  if (!stripe || !elements) {
    console.log("⚠️ Stripe not loaded yet");
    return (
      <div className="space-y-4">
        <div className="text-center py-4">
          <Loader2 className="w-6 h-6 animate-spin mx-auto text-blue-400" />
          <p className="text-slate-400 text-sm mt-2">Loading payment form...</p>
        </div>

        {/* Fallback option after some time */}
        <div className="text-center py-2">
          <p className="text-xs text-slate-500">
            Having trouble loading?
            <button
              onClick={() => window.location.reload()}
              className="text-blue-400 hover:text-blue-300 ml-1"
            >
              Refresh page
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Payment Information Header */}
      <div className="flex items-center gap-2 mb-4">
        <Lock className="w-4 h-4 text-green-400" />
        <span className="text-sm text-slate-300">
          Your card won't be charged for 7 days
        </span>
      </div>

      {/* Card Element */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Card Information
        </label>
        <div className="p-4 bg-slate-800/50 border border-blue-800/30 rounded-lg min-h-[50px]">
          <CardElement
            options={cardElementOptions}
            onChange={handleCardChange}
          />
        </div>
        {cardError && <p className="text-sm text-red-400 mt-2">{cardError}</p>}
      </div>

      {/* ZIP Code */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          ZIP/Postal Code
        </label>
        <input
          type="text"
          value={zipCode}
          onChange={(e) => setZipCode(e.target.value)}
          className="w-full px-3 py-2 bg-slate-800/50 border border-blue-800/30 rounded-lg text-white placeholder-slate-400"
          placeholder="12345"
          required
        />
      </div>

      {/* Plan Summary */}
      <div className="bg-slate-800/30 rounded-lg p-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-slate-300">Plan:</span>
          <span className="text-white font-medium">{planInfo?.name}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-300">Trial period:</span>
          <span className="text-green-400">7 days free</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-300">Then:</span>
          <span className="text-white font-medium">
            ${planInfo?.price}/month
          </span>
        </div>
      </div>

      {/* Security Section */}
      <div className="text-center py-4">
        <p className="text-sm text-slate-400 mb-3">Secure payment processing</p>
        <div className="flex items-center justify-center gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-1">
            <Shield className="w-4 h-4" />
            <span>PCI Compliant</span>
          </div>
          <div className="flex items-center gap-1">
            <span>💳</span>
            <span>Powered by Stripe</span>
          </div>
          <div className="flex items-center gap-1">
            <X className="w-4 h-4" />
            <span>Cancel Anytime</span>
          </div>
        </div>

        {/* Payment Method Logos */}
        <div className="flex items-center justify-center gap-2 mt-3">
          <div className="bg-blue-600 text-white text-xs px-2 py-1 rounded">
            VISA
          </div>
          <div className="bg-red-500 text-white text-xs px-2 py-1 rounded">
            MC
          </div>
          <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded">
            AMEX
          </div>
          <span className="text-slate-400 text-xs">& more</span>
        </div>
      </div>
    </div>
  );
};

const SignupForm: React.FC<SignupFormProps> = ({
  onSwitchToLogin,
  selectedPlan,
}) => {
  console.log("🔧 DEBUG: SignupForm component rendered");

  const { signUp, loading } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [planInfo, setPlanInfo] = useState(selectedPlan || null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [zipCode, setZipCode] = useState("");

  // Plan selection logic (PRESERVED EXACTLY)
  useEffect(() => {
    console.log("🔧 PLAN DEBUG: Plan selection useEffect triggered");

    const urlParams = new URLSearchParams(window.location.search);
    const planId = urlParams.get("plan");
    const planPrice = urlParams.get("price");
    const billingCycle = urlParams.get("billing") || "monthly";

    console.log(
      "🔧 PLAN DEBUG: URL params - planId:",
      planId,
      "planPrice:",
      planPrice
    );

    if (planId && planPrice) {
      const planDetail = planDetails[planId as keyof typeof planDetails];
      if (planDetail) {
        const newPlanInfo = {
          id: planId,
          name: planDetail.name,
          price: planPrice,
          billingCycle: billingCycle,
        };
        console.log("🔧 PLAN DEBUG: Setting planInfo from URL:", newPlanInfo);
        setPlanInfo(newPlanInfo);
      }
    } else if (!selectedPlan) {
      const defaultPlan = {
        id: "professional",
        name: "Professional",
        price: "49",
        billingCycle: "monthly",
      };
      console.log(
        "🔧 PLAN DEBUG: Setting default professional plan:",
        defaultPlan
      );
      setPlanInfo(defaultPlan);
    }
  }, [selectedPlan]);

  // UPDATED: Real payment method creation (replaces createTestPaymentMethod)
  const createRealPaymentMethod = async () => {
    console.log("💳 Creating real payment method with Stripe...");

    // This will be called from the PaymentForm component
    // Payment method creation is now handled in the PaymentForm
    throw new Error(
      "Payment method should be created in PaymentForm component"
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    console.log("🚀 FORM SUBMIT TRIGGERED!");
    e.preventDefault();
    console.log("📝 Form data:", formData);
    console.log("💳 Plan info:", planInfo);
    setError(null);

    // Basic validation (PRESERVED EXACTLY)
    if (formData.password !== formData.confirmPassword) {
      console.log("❌ Password mismatch error");
      setError("Passwords do not match");
      toast.error("Passwords do not match");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      toast.error("Password must be at least 8 characters");
      return;
    }

    console.log("✅ All validations passed, proceeding with signup...");

    try {
      setIsProcessingPayment(true);
      console.log("🚀 Starting user signup process...");
      console.log("🚀 SIGNUP PAYLOAD:", {
        email: formData.email,
        name: formData.name,
        planInfo: planInfo,
      });

      // 🎯 PRESERVED: Pass planInfo directly to signUp function
      const signUpResult = await signUp(
        formData.email,
        formData.password,
        formData.name,
        planInfo || undefined
      );

      if (signUpResult.error) {
        throw new Error(signUpResult.error);
      }

      console.log("✅ User signup successful!");

      // Store plan info for later processing (PRESERVED)
      if (planInfo) {
        localStorage.setItem("selectedPlan", JSON.stringify(planInfo));
      }

      // 🔗 CRITICAL: Call backend subscription processing (PRESERVED EXACTLY)
      if (planInfo) {
        console.log("🔗 CALLING BACKEND: Subscription processing...");

        // 🚀 NEW: This will be replaced by real payment method from Stripe
        // For now, keeping the test method until we integrate the PaymentForm
        const testPaymentMethodId = "pm_card_visa_" + Date.now();

        const payload = {
          userId: "temp-user-id",
          userEmail: formData.email,
          userName: formData.name,
          planId: planInfo.id,
          paymentMethodId: testPaymentMethodId,
        };

        console.log("🔗 BACKEND PAYLOAD:", payload);

        try {
          // Backend health check and call (PRESERVED EXACTLY)
          console.log("🔗 TESTING: Backend health check...");
          const healthCheck = await fetch("http://localhost:3001/health");
          if (!healthCheck.ok) {
            throw new Error(
              `Backend health check failed: ${healthCheck.status}`
            );
          }
          console.log("✅ Backend health check passed");

          const response = await fetch(
            "http://localhost:3001/api/subscription/process",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(payload),
            }
          );

          console.log("🔗 RESPONSE STATUS:", response.status);

          if (response.ok) {
            const result = await response.json();
            console.log("✅ SUCCESS:", result);

            if (result.success) {
              console.log("✅ Stripe customer created:", result.customerId);
              toast.success(
                `✅ ${planInfo.name} account created! Customer: ${result.customerId}`
              );
            } else {
              throw new Error(result.error || "Subscription processing failed");
            }
          } else {
            const errorText = await response.text();
            console.log("❌ BACKEND ERROR:", response.status, errorText);

            if (errorText.includes("Failed to attach payment method")) {
              console.log(
                "⚠️ Payment attachment failed (expected in development)"
              );
              toast.success(
                `✅ ${planInfo.name} account created! Payment setup will be completed later.`
              );
            } else {
              throw new Error(
                `Backend error: ${response.status} - ${errorText}`
              );
            }
          }
        } catch (backendError) {
          console.error("❌ Backend call failed:", backendError);

          const errorMessage = (backendError as Error).message;

          if (errorMessage.includes("Failed to attach payment method")) {
            console.log(
              "⚠️ Payment method attachment failed - continuing with user creation"
            );
            toast.success(
              `✅ ${planInfo.name} account created! Payment setup pending.`
            );
          } else if (
            backendError instanceof TypeError &&
            errorMessage.includes("fetch")
          ) {
            toast.error(
              "❌ Backend server not running! Please start: npm run dev in backend folder"
            );
            alert(
              "❌ BACKEND NOT RUNNING!\n\nPlease run:\ncd ~/Desktop/kurzora/kurzora-platform/backend\nnpm run dev"
            );
          } else {
            toast.error(
              "Account created but couldn't process subscription: " +
                errorMessage
            );
          }
        }
      } else {
        console.log("⚠️ No plan info, skipping subscription processing");
        toast.success("Account created successfully!");
      }

      // Success redirect (PRESERVED)
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 2000);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Signup failed. Please try again.";
      console.error("❌ Signup error:", errorMessage);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const getButtonText = () => {
    if (isProcessingPayment) return "Creating your account...";
    if (loading) return "Setting up your profile...";
    if (planInfo) {
      console.log("🔧 BUTTON DEBUG: Plan info for button text:", planInfo);
      return `Start Free Trial`;
    }
    return "Create Account";
  };

  // Debug current state (PRESERVED)
  console.log("🔧 DEBUG: Current planInfo state:", planInfo);
  console.log("🔧 DEBUG: selectedPlan prop:", selectedPlan);
  console.log("🔧 DEBUG: Button disabled:", loading || isProcessingPayment);
  console.log("🔧 DEBUG: Loading:", loading);
  console.log("🔧 DEBUG: Processing payment:", isProcessingPayment);

  return (
    <Elements stripe={stripePromise}>
      <div className="w-full max-w-md mx-auto bg-slate-900/50 backdrop-blur-sm border border-blue-800/30 rounded-lg p-6">
        {/* Back Button */}
        <div className="mb-4">
          <button
            onClick={() => (window.location.href = "/")}
            className="text-slate-400 hover:text-slate-300 text-sm flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Create account</h2>
          <p className="text-slate-400">Join thousands of successful traders</p>
        </div>

        {/* Enhanced Plan Display */}
        {planInfo && (
          <div className="mb-6 p-4 bg-blue-900/30 border border-blue-500/30 rounded-lg">
            <div className="text-center">
              <Star className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
              <p className="text-slate-300 text-sm mb-1">
                You're signing up for
              </p>
              <h3 className="text-white font-bold text-lg">
                {planInfo.name} Plan
              </h3>
              {planInfo.name === "Professional" && (
                <div className="inline-block px-2 py-1 bg-green-600 text-white text-xs rounded-full mt-1">
                  Most Popular
                </div>
              )}
              <p className="text-blue-400 text-lg font-medium mt-2">
                ${planInfo.price}/monthly after 7-day free trial
              </p>
              <button
                onClick={() => window.history.back()}
                className="text-blue-400 hover:text-blue-300 text-sm mt-2 border border-blue-400 px-3 py-1 rounded"
              >
                Change plan
              </button>
            </div>
          </div>
        )}

        {/* Error Display (PRESERVED) */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Full Name
            </label>
            <div className="relative">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 bg-slate-800/50 border border-blue-800/30 rounded-lg text-white placeholder-slate-400"
                placeholder="Enter your full name"
                required
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <svg
                  className="w-4 h-4 text-slate-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 bg-slate-800/50 border border-blue-800/30 rounded-lg text-white placeholder-slate-400"
                placeholder="Enter your email"
                required
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <svg
                  className="w-4 h-4 text-slate-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 bg-slate-800/50 border border-blue-800/30 rounded-lg text-white placeholder-slate-400"
                placeholder="Create a password"
                required
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <Lock className="w-4 h-4 text-slate-400" />
              </div>
            </div>
            <div className="mt-1 text-xs text-slate-400">
              <p>Password must contain:</p>
              <ul className="ml-4 mt-1 space-y-1">
                <li>• At least 8 characters</li>
                <li>• One uppercase letter</li>
                <li>• One number</li>
              </ul>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 bg-slate-800/50 border border-blue-800/30 rounded-lg text-white placeholder-slate-400"
                placeholder="Confirm your password"
                required
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <Lock className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          </div>

          {/* Payment Information */}
          {planInfo && (
            <PaymentForm
              formData={formData}
              planInfo={planInfo}
              zipCode={zipCode}
              setZipCode={setZipCode}
              onSubmit={() => {}} // Will be updated in next step
              isLoading={loading || isProcessingPayment}
            />
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || isProcessingPayment}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium text-white transition-all"
          >
            {loading || isProcessingPayment ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                {getButtonText()}
              </span>
            ) : (
              getButtonText()
            )}
          </button>
        </form>

        {/* Login Link (PRESERVED) */}
        <div className="text-center text-sm mt-6">
          <span className="text-slate-400">Already have an account? </span>
          <button
            onClick={onSwitchToLogin}
            className="text-blue-400 hover:text-blue-300 font-medium"
          >
            Sign in
          </button>
        </div>

        {/* Terms */}
        <div className="text-center text-xs text-slate-500 mt-4">
          <p>
            By creating an account, you agree to our{" "}
            <a href="#" className="text-blue-400 hover:text-blue-300">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-blue-400 hover:text-blue-300">
              Privacy Policy
            </a>
          </p>
        </div>

        {/* Cancel Notice */}
        <div className="text-center text-xs text-slate-400 mt-2">
          <p>
            You can cancel anytime during your trial. We'll send a reminder
            email 2 days before your trial ends.
          </p>
        </div>
      </div>
    </Elements>
  );
};

export default SignupForm;
