import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Loader2, ArrowLeft, X } from "lucide-react";
import { toast } from "sonner";

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

  // Plan selection logic
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

  // Create test payment method for development
  const createTestPaymentMethod = () => {
    // For development: Use Stripe test card numbers
    // In production, this would be replaced with real Stripe Elements
    const testPaymentMethods = {
      visa: "pm_card_visa_" + Date.now(),
      mastercard: "pm_card_mastercard_" + Date.now(),
      // These simulate real payment method IDs for development
    };

    return testPaymentMethods.visa;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    console.log("🚀 FORM SUBMIT TRIGGERED!");
    e.preventDefault();
    console.log("📝 Form data:", formData);
    console.log("💳 Plan info:", planInfo);
    setError(null);

    // Basic validation
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

      // 🎯 FIXED: Pass planInfo directly to signUp function
      const signUpResult = await signUp(
        formData.email,
        formData.password,
        formData.name,
        planInfo || undefined // Pass plan info as parameter
      );

      if (signUpResult.error) {
        throw new Error(signUpResult.error);
      }

      console.log("✅ User signup successful!");

      // Store plan info for later processing (backend still needs this)
      if (planInfo) {
        localStorage.setItem("selectedPlan", JSON.stringify(planInfo));
      }

      // 🔗 CRITICAL: Call backend subscription processing
      if (planInfo) {
        console.log("🔗 CALLING BACKEND: Subscription processing...");

        // Create development test payment method
        const testPaymentMethodId = createTestPaymentMethod();

        const payload = {
          userId: "temp-user-id", // In production, this would be the actual user ID
          userEmail: formData.email,
          userName: formData.name,
          planId: planInfo.id,
          paymentMethodId: testPaymentMethodId, // Test payment method for development
        };

        console.log("🔗 BACKEND PAYLOAD:", payload);

        try {
          // First check if backend is running
          console.log("🔗 TESTING: Backend health check...");
          const healthCheck = await fetch("http://localhost:3001/health");
          if (!healthCheck.ok) {
            throw new Error(
              `Backend health check failed: ${healthCheck.status}`
            );
          }
          console.log("✅ Backend health check passed");

          // Call subscription processing with new payload format
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

            // Handle development payment method errors gracefully
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

          // Handle specific development errors gracefully
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

      // Success redirect
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
      return `Start ${planInfo.name} Plan ($${planInfo.price}/month)`;
    }
    return "Create Account";
  };

  // Debug current state
  console.log("🔧 DEBUG: Current planInfo state:", planInfo);
  console.log("🔧 DEBUG: selectedPlan prop:", selectedPlan);
  console.log("🔧 DEBUG: Button disabled:", loading || isProcessingPayment);
  console.log("🔧 DEBUG: Loading:", loading);
  console.log("🔧 DEBUG: Processing payment:", isProcessingPayment);

  return (
    <div className="w-full max-w-md mx-auto bg-slate-900/50 backdrop-blur-sm border border-blue-800/30 rounded-lg p-6">
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

        {/* Password Field */}
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

        {/* Confirm Password Field */}
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

export default SignupForm;
