import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Loader2, CreditCard, Lock, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

// ✅ FIXED: Load Stripe with Vite-compatible environment variable
const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "pk_test_51234567890"
);

const planDetails = {
  starter: {
    name: "Starter",
    price: 19, // ✅ FIXED: Starter is now $19/month
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

// ✅ STRIPE CARD STYLING
const cardElementOptions = {
  style: {
    base: {
      fontSize: "16px",
      color: "#ffffff",
      fontFamily: "Inter, system-ui, sans-serif",
      "::placeholder": {
        color: "#94a3b8",
      },
      backgroundColor: "transparent",
    },
    invalid: {
      color: "#ef4444",
    },
  },
  hidePostalCode: false,
};

// ✅ MAIN SIGNUP FORM COMPONENT
const SignupFormContent: React.FC<SignupFormProps> = ({
  onSwitchToLogin,
  selectedPlan,
}) => {
  const { signUp, loading } = useAuth();
  const stripe = useStripe();
  const elements = useElements();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [planInfo, setPlanInfo] = useState(selectedPlan || null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [cardComplete, setCardComplete] = useState(false);
  const [cardError, setCardError] = useState<string | null>(null);

  // ✅ PLAN SELECTION LOGIC
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const planId = urlParams.get("plan");
    const planPrice = urlParams.get("price");
    const billingCycle = urlParams.get("billing") || "monthly";

    if (planId && planPrice) {
      const planDetail = planDetails[planId as keyof typeof planDetails];
      if (planDetail) {
        const newPlanInfo = {
          id: planId,
          name: planDetail.name,
          price: planPrice,
          billingCycle: billingCycle,
        };
        setPlanInfo(newPlanInfo);
      }
    } else if (!selectedPlan) {
      // Default to professional plan
      const defaultPlan = {
        id: "professional",
        name: "Professional",
        price: "49",
        billingCycle: "monthly",
      };
      setPlanInfo(defaultPlan);
    }
  }, [selectedPlan]);

  // ✅ HANDLE CARD ELEMENT CHANGES
  const handleCardChange = (event: any) => {
    setCardComplete(event.complete);
    setCardError(event.error ? event.error.message : null);
  };

  // ✅ FORM SUBMISSION WITH IMPROVED REDIRECT FIX
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setCardError(null);

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      toast.error("Passwords do not match");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      toast.error("Password must be at least 8 characters");
      return;
    }

    // ✅ FIXED: VALIDATE STRIPE ELEMENTS FOR ALL PAID PLANS (both starter and professional)
    if (
      planInfo &&
      (planInfo.id === "starter" || planInfo.id === "professional")
    ) {
      if (!stripe || !elements) {
        setError("Stripe is not loaded. Please refresh and try again.");
        return;
      }

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        setError(
          "Credit card element not found. Please refresh and try again."
        );
        return;
      }

      if (!cardComplete) {
        setError("Please complete your credit card information.");
        return;
      }
    }

    try {
      setIsProcessingPayment(true);
      let paymentMethodId = null;

      // ✅ FIXED: CREATE PAYMENT METHOD FOR ALL PAID PLANS (both starter and professional)
      if (
        planInfo &&
        (planInfo.id === "starter" || planInfo.id === "professional") &&
        stripe &&
        elements
      ) {
        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
          throw new Error("Credit card element not found");
        }

        const { error: paymentMethodError, paymentMethod } =
          await stripe.createPaymentMethod({
            type: "card",
            card: cardElement,
            billing_details: {
              name: formData.name,
              email: formData.email,
            },
          });

        if (paymentMethodError) {
          throw new Error(paymentMethodError.message);
        }

        paymentMethodId = paymentMethod.id;

        // Store payment method for backend processing
        if (planInfo) {
          localStorage.setItem(
            "pendingSubscription",
            JSON.stringify({
              planId: planInfo.id,
              paymentMethodId: paymentMethodId,
              billingCycle: planInfo.billingCycle || "monthly",
            })
          );
        }
      }

      // ✅ CREATE USER ACCOUNT
      console.log("🚀 Starting account creation...");
      const signUpResult = await signUp(
        formData.email,
        formData.password,
        formData.name,
        planInfo || undefined
      );

      if (signUpResult.error) {
        throw new Error(signUpResult.error);
      }

      console.log("✅ Account creation successful!");

      // Store plan info for persistence
      if (planInfo) {
        localStorage.setItem("selectedPlan", JSON.stringify(planInfo));
      }

      // ✅ SUCCESS MESSAGE - Both plans now have 7-day trials
      if (planInfo) {
        toast.success(
          `✅ ${planInfo.name} account created with 7-day trial! Welcome to Kurzora!`,
          { duration: 4000 }
        );
      } else {
        toast.success("✅ Account created successfully! Welcome to Kurzora!", {
          duration: 4000,
        });
      }

      console.log(
        "✅ Success message shown - letting AuthContext handle redirect..."
      );

      // ✅ FIXED: Remove redirect from SignupForm completely
      // Let AuthContext handle the redirect after auth state changes
      // This prevents redirect conflicts and ensures proper authentication flow
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
      // ✅ FIXED: Both plans now have trials and pricing
      return `Start ${planInfo.name} Plan (${planInfo.price}/month)`;
    }
    return "Create Account";
  };

  // ✅ FIXED: Show card element for ALL plans (both starter and professional need payment info)
  const showCardElement =
    planInfo && (planInfo.id === "starter" || planInfo.id === "professional");

  return (
    <div className="w-full max-w-md mx-auto bg-slate-900/50 backdrop-blur-sm border border-blue-800/30 rounded-lg p-6">
      {/* Back Button */}
      <div className="mb-4">
        <button
          onClick={() => (window.location.href = "/")}
          className="flex items-center text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Homepage
        </button>
      </div>

      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Create account</h2>
        <p className="text-slate-400">Join thousands of successful traders</p>
      </div>

      {/* Plan Display */}
      {planInfo && (
        <div className="mb-6 p-4 bg-blue-900/30 border border-blue-500/30 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-medium">{planInfo.name} Plan</h3>
              <p className="text-blue-400">${planInfo.price}/month</p>
              {/* ✅ FIXED: Both plans now have 7-day trials */}
              <p className="text-xs text-slate-400">
                7-day free trial included
              </p>
            </div>
            <div className="text-sm text-slate-400">
              {planInfo.billingCycle}
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
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
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-slate-800/50 border border-blue-800/30 rounded-lg text-white placeholder-slate-400"
            placeholder="Enter your full name"
            required
          />
        </div>

        {/* Email Field */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-slate-800/50 border border-blue-800/30 rounded-lg text-white placeholder-slate-400"
            placeholder="Enter your email"
            required
          />
        </div>

        {/* Password Fields */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-slate-800/50 border border-blue-800/30 rounded-lg text-white placeholder-slate-400"
            placeholder="Create a password"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Confirm Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-slate-800/50 border border-blue-800/30 rounded-lg text-white placeholder-slate-400"
            placeholder="Confirm your password"
            required
          />
        </div>

        {/* ✅ FIXED: CREDIT CARD SECTION FOR ALL PAID PLANS (both starter and professional) */}
        {showCardElement && (
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              <CreditCard className="inline w-4 h-4 mr-2" />
              Credit Card Information
            </label>
            <div className="p-3 bg-slate-800/50 border border-blue-800/30 rounded-lg">
              <CardElement
                options={cardElementOptions}
                onChange={handleCardChange}
              />
            </div>
            {cardError && (
              <p className="text-sm text-red-400 mt-1">{cardError}</p>
            )}
            <div className="flex items-center text-xs text-slate-400 mt-2">
              <Lock className="w-3 h-3 mr-1" />
              <span>Secured by Stripe. No charges during 7-day trial.</span>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={
            loading || isProcessingPayment || (showCardElement && !cardComplete)
          }
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

      {/* Login Link */}
      <div className="text-center text-sm mt-6">
        <span className="text-slate-400">Already have an account? </span>
        <button
          onClick={onSwitchToLogin}
          className="text-blue-400 hover:text-blue-300 font-medium"
        >
          Sign in
        </button>
      </div>
    </div>
  );
};

// ✅ WRAPPER COMPONENT WITH STRIPE PROVIDER
const SignupForm: React.FC<SignupFormProps> = (props) => {
  return (
    <Elements stripe={stripePromise}>
      <SignupFormContent {...props} />
    </Elements>
  );
};

export default SignupForm;
