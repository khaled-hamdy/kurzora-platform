"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { Database } from "@/types/database";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userProfile: Database["public"]["Tables"]["users"]["Row"] | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (
    email: string,
    password: string,
    name: string,
    planInfo?: {
      id: string;
      name: string;
      price: string;
      billingCycle?: string;
    }
  ) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: { name?: string }) => Promise<{ error?: string }>;
  isAdmin: () => boolean;
  isProcessingSubscription: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<
    Database["public"]["Tables"]["users"]["Row"] | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const [isProcessingSubscription, setIsProcessingSubscription] =
    useState(false);

  // Store plan info temporarily during signup
  const pendingPlanInfo = useRef<any>(null);

  // Prevent multiple redirects
  const isRedirecting = useRef(false);
  const mounted = useRef(true);

  // 🎯 FIXED: Robust plan tier determination with multiple sources
  const determineSubscriptionTier = useCallback(
    (planInfo: any, userEmail?: string): "starter" | "professional" => {
      console.log("🎯 PLAN LOGIC START: Determining subscription tier");
      console.log("🎯 PLAN LOGIC: Input planInfo:", planInfo);
      console.log("🎯 PLAN LOGIC: User email:", userEmail);

      // Method 1: Direct planInfo parameter (HIGHEST PRIORITY)
      if (planInfo?.id) {
        const planId = planInfo.id.toLowerCase().trim();
        console.log("🎯 PLAN LOGIC: Method 1 - Direct planInfo.id:", planId);

        if (planId === "professional") {
          console.log("✅ PLAN LOGIC: PROFESSIONAL plan from direct planInfo");
          return "professional";
        } else if (planId === "starter") {
          console.log("✅ PLAN LOGIC: STARTER plan from direct planInfo");
          return "starter";
        }
      }

      // Method 2: Check pendingPlanInfo.current (backup)
      if (pendingPlanInfo.current?.id) {
        const planId = pendingPlanInfo.current.id.toLowerCase().trim();
        console.log(
          "🎯 PLAN LOGIC: Method 2 - pendingPlanInfo.current.id:",
          planId
        );

        if (planId === "professional") {
          console.log("✅ PLAN LOGIC: PROFESSIONAL plan from pendingPlanInfo");
          return "professional";
        } else if (planId === "starter") {
          console.log("✅ PLAN LOGIC: STARTER plan from pendingPlanInfo");
          return "starter";
        }
      }

      // Method 3: Check localStorage selectedPlan (second backup)
      try {
        const selectedPlanStr = localStorage.getItem("selectedPlan");
        if (selectedPlanStr) {
          const selectedPlan = JSON.parse(selectedPlanStr);
          console.log(
            "🎯 PLAN LOGIC: Method 3 - localStorage selectedPlan:",
            selectedPlan
          );

          if (selectedPlan?.id) {
            const planId = selectedPlan.id.toLowerCase().trim();
            if (planId === "professional") {
              console.log("✅ PLAN LOGIC: PROFESSIONAL plan from localStorage");
              return "professional";
            } else if (planId === "starter") {
              console.log("✅ PLAN LOGIC: STARTER plan from localStorage");
              return "starter";
            }
          }
        }
      } catch (error) {
        console.warn("⚠️ PLAN LOGIC: localStorage parsing error:", error);
      }

      // Method 4: Check URL parameters (third backup)
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const planFromUrl = urlParams.get("plan");
        if (planFromUrl) {
          const planId = planFromUrl.toLowerCase().trim();
          console.log("🎯 PLAN LOGIC: Method 4 - URL parameter:", planId);

          if (planId === "professional") {
            console.log("✅ PLAN LOGIC: PROFESSIONAL plan from URL");
            return "professional";
          } else if (planId === "starter") {
            console.log("✅ PLAN LOGIC: STARTER plan from URL");
            return "starter";
          }
        }
      } catch (error) {
        console.warn("⚠️ PLAN LOGIC: URL parsing error:", error);
      }

      // Method 5: Check pendingSubscription in localStorage (fourth backup)
      try {
        const pendingSubscriptionStr = localStorage.getItem(
          "pendingSubscription"
        );
        if (pendingSubscriptionStr) {
          const pendingSubscription = JSON.parse(pendingSubscriptionStr);
          console.log(
            "🎯 PLAN LOGIC: Method 5 - pendingSubscription:",
            pendingSubscription
          );

          if (pendingSubscription?.planId) {
            const planId = pendingSubscription.planId.toLowerCase().trim();
            if (planId === "professional") {
              console.log(
                "✅ PLAN LOGIC: PROFESSIONAL plan from pendingSubscription"
              );
              return "professional";
            } else if (planId === "starter") {
              console.log(
                "✅ PLAN LOGIC: STARTER plan from pendingSubscription"
              );
              return "starter";
            }
          }
        }
      } catch (error) {
        console.warn(
          "⚠️ PLAN LOGIC: pendingSubscription parsing error:",
          error
        );
      }

      // 🚨 FINAL FALLBACK: Use starter as default BUT log warning
      console.warn("⚠️ PLAN LOGIC: NO PLAN INFO FOUND - using default starter");
      console.warn("🔍 PLAN LOGIC DEBUG: planInfo was:", planInfo);
      console.warn(
        "🔍 PLAN LOGIC DEBUG: pendingPlanInfo.current was:",
        pendingPlanInfo.current
      );

      return "starter";
    },
    []
  );

  // OPTIMIZATION: New background profile fetching - doesn't block login
  const fetchUserProfileInBackground = useCallback(async (userId: string) => {
    try {
      console.log("👤 Mac AuthContext: Background profile fetch for:", userId);

      // Use a timeout to prevent hanging
      const profilePromise = supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Profile fetch timeout")), 2000)
      );

      const { data, error } = (await Promise.race([
        profilePromise,
        timeoutPromise,
      ])) as any;

      if (!mounted.current) return;

      if (error) {
        if (error.code === "PGRST116") {
          console.log(
            "🆕 Mac AuthContext: No profile found, creating in background..."
          );
          createUserProfileInBackground(userId);
        } else {
          console.error("❌ Mac AuthContext: Profile fetch error:", error);
          setUserProfile(null);
        }
        return;
      }

      console.log("✅ Mac AuthContext: Profile loaded in background");
      setUserProfile(data);
    } catch (error) {
      console.error(
        "💥 Mac AuthContext: Background profile fetch error:",
        error
      );
      // Don't set profile to null on timeout - user can still use the app
    }
  }, []);

  // OPTIMIZATION: Background profile creation - doesn't block login
  const createUserProfileInBackground = useCallback(
    async (userId: string) => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user || !mounted.current) return;

        console.log(
          "🆕 Mac AuthContext: Creating profile in background for:",
          user.email
        );

        // 🔍 ENHANCED DEBUG: Check ALL plan info sources
        console.log(
          "🔍 CREATE PROFILE DEBUG: pendingPlanInfo.current =",
          pendingPlanInfo.current
        );

        // Check localStorage backup
        try {
          const selectedPlan = localStorage.getItem("selectedPlan");
          const pendingSubscription = localStorage.getItem(
            "pendingSubscription"
          );
          console.log(
            "🔍 CREATE PROFILE DEBUG: localStorage selectedPlan =",
            selectedPlan
          );
          console.log(
            "🔍 CREATE PROFILE DEBUG: localStorage pendingSubscription =",
            pendingSubscription
          );
        } catch (e) {
          console.log("🔍 CREATE PROFILE DEBUG: localStorage error =", e);
        }

        // 🎯 FIXED: Pass user email to improve debugging
        console.log(
          "🔍 CREATE PROFILE DEBUG: About to call determineSubscriptionTier..."
        );

        // 🔧 FIXED: Use let instead of const to allow reassignment
        let subscriptionTier = determineSubscriptionTier(
          pendingPlanInfo.current,
          user.email
        );
        console.log(
          "🔍 CREATE PROFILE DEBUG: Final tier decision:",
          subscriptionTier
        );

        // 🚨 ADDITIONAL VALIDATION: Double-check the result
        if (
          subscriptionTier !== "professional" &&
          subscriptionTier !== "starter"
        ) {
          console.error(
            "🚨 INVALID TIER DETECTED:",
            subscriptionTier,
            "- forcing to starter"
          );
          subscriptionTier = "starter"; // ✅ NOW WORKS: Can reassign let variable
        }

        console.log(
          "🎯 FINAL DECISION: Creating user with tier:",
          subscriptionTier
        );

        const profileData = {
          id: userId,
          email: user.email?.toLowerCase().trim() || "",
          name: user.user_metadata?.name || user.email?.split("@")[0] || "User",
          subscription_tier: subscriptionTier as "starter" | "professional",
          subscription_status: "trial",
          language: "en",
          timezone: "UTC",
          starting_balance: 10000.0,
          current_balance: 10000.0,
          risk_percentage: 2.0,
          notification_settings: {
            email_alerts_enabled: true,
            telegram_alerts_enabled: subscriptionTier === "professional",
            daily_alert_limit: subscriptionTier === "starter" ? 3 : null,
            minimum_score: 65,
          },
          is_active: true,
        };

        console.log("🎯 CREATING USER: Final profile data:", {
          email: profileData.email,
          subscription_tier: profileData.subscription_tier,
          subscription_status: profileData.subscription_status,
          notification_settings: profileData.notification_settings,
        });

        console.log(
          "🔍 CREATE PROFILE DEBUG: About to insert into Supabase..."
        );
        const { data, error } = await supabase
          .from("users")
          .insert([profileData])
          .select()
          .single();

        if (error) {
          console.error(
            "❌ Mac AuthContext: Background profile creation error:",
            error
          );
        } else {
          console.log("✅ Mac AuthContext: Profile created successfully!");
          console.log(
            "✅ VERIFICATION: User tier in database:",
            data.subscription_tier
          );
          console.log(
            "✅ VERIFICATION: Notification settings:",
            data.notification_settings
          );

          // 🚨 FINAL VERIFICATION: Log the actual database result
          if (data.subscription_tier !== subscriptionTier) {
            console.error("🚨 DATABASE MISMATCH:", {
              expected: subscriptionTier,
              actual: data.subscription_tier,
              planInfo: pendingPlanInfo.current,
            });
          } else {
            console.log(
              "✅ VERIFICATION PASSED: Database tier matches expected tier"
            );
          }

          if (mounted.current) {
            setUserProfile(data);
          }
        }

        // Clear pending plan info after use (but keep localStorage for debugging)
        console.log(
          "🔍 CREATE PROFILE DEBUG: Clearing pendingPlanInfo.current"
        );
        pendingPlanInfo.current = null;
      } catch (error) {
        console.error(
          "💥 Mac AuthContext: Background create profile error:",
          error
        );
      }
    },
    [determineSubscriptionTier]
  );

  useEffect(() => {
    mounted.current = true;

    const initializeAuth = async () => {
      try {
        console.log(
          "🍎 AuthContext (Mac): Starting OPTIMIZED initialization..."
        );

        // OPTIMIZATION: Reduced timeout from 8s to 3s
        const emergencyTimeout = setTimeout(() => {
          if (mounted.current && !initialized) {
            console.warn(
              "🚨 Mac Emergency: Forcing initialization complete (3s timeout)"
            );
            setLoading(false);
            setInitialized(true);
          }
        }, 3000);

        // Get initial session
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (!mounted.current) return;

        clearTimeout(emergencyTimeout);

        if (error) {
          console.error("❌ Mac AuthContext: Session error:", error);
          await clearAuthState();
          return;
        }

        if (session?.user) {
          console.log(
            "✅ Mac AuthContext: Found session for:",
            session.user.email
          );
          setSession(session);
          setUser(session.user);

          // OPTIMIZATION: Don't wait for profile - fetch it in background
          fetchUserProfileInBackground(session.user.id);
        } else {
          console.log("🔍 Mac AuthContext: No session found");
          await clearAuthState();
        }
      } catch (error) {
        console.error("💥 Mac AuthContext: Init error:", error);
        if (mounted.current) {
          await clearAuthState();
        }
      } finally {
        if (mounted.current) {
          setLoading(false);
          setInitialized(true);
          console.log("🏁 Mac AuthContext: FAST initialization complete");
        }
      }
    };

    initializeAuth();

    // Auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted.current) return;

      console.log(
        "🔄 Mac AuthContext: Auth state changed:",
        event,
        session?.user?.email
      );

      try {
        if (event === "SIGNED_OUT") {
          console.log("🚪 Mac AuthContext: User signed out");
          await clearAuthState();
          if (!isRedirecting.current && window.location.pathname !== "/") {
            await safeRedirect("/");
          }
          return;
        }

        if (event === "SIGNED_IN" && session?.user) {
          console.log(
            "👤 Mac AuthContext: User signed in:",
            session.user.email
          );
          setSession(session);
          setUser(session.user);

          // OPTIMIZATION: Don't wait for profile on login
          fetchUserProfileInBackground(session.user.id);

          // Only redirect on login page
          if (!isRedirecting.current && window.location.pathname === "/") {
            await safeRedirect("/dashboard");
          }
          return;
        }

        if (event === "TOKEN_REFRESHED" && session) {
          console.log("🔄 Mac AuthContext: Token refreshed");
          setSession(session);
          setUser(session.user);
          return;
        }

        // Handle other events
        if (session?.user) {
          setSession(session);
          setUser(session.user);
          fetchUserProfileInBackground(session.user.id);
        } else {
          await clearAuthState();
        }
      } catch (error) {
        console.error("💥 Mac AuthContext: Auth state change error:", error);
      } finally {
        if (mounted.current) {
          setLoading(false);
        }
      }
    });

    return () => {
      mounted.current = false;
      subscription.unsubscribe();
    };
  }, [fetchUserProfileInBackground, createUserProfileInBackground]);

  const clearAuthState = useCallback(async () => {
    console.log("🧹 Mac AuthContext: Clearing auth state");
    setUser(null);
    setSession(null);
    setUserProfile(null);
    setLoading(false);
    pendingPlanInfo.current = null; // Clear pending plan info

    // Clear Mac browser storage
    try {
      // Safari/Chrome on Mac storage clearing
      if (typeof window !== "undefined") {
        localStorage.removeItem("supabase.auth.token");

        // Clear all Supabase-related items
        Object.keys(localStorage).forEach((key) => {
          if (key.includes("supabase") || key.includes("sb-")) {
            localStorage.removeItem(key);
          }
        });

        sessionStorage.clear();
      }
    } catch (error) {
      console.warn("⚠️ Mac AuthContext: Storage clear warning:", error);
    }
  }, []);

  const safeRedirect = useCallback(async (path: string) => {
    if (isRedirecting.current) {
      console.log("🔄 Mac AuthContext: Already redirecting, skipping");
      return;
    }

    isRedirecting.current = true;
    console.log(`🔄 Mac AuthContext: Safe redirect to ${path}`);

    // Mac-compatible redirect with small delay
    setTimeout(() => {
      if (mounted.current) {
        window.location.replace(path);
      }
    }, 100);
  }, []);

  // 🎯 NEW: Process pending subscription after signup
  const processPendingSubscription = useCallback(
    async (userId: string, userEmail: string, userName: string) => {
      try {
        console.log("💳 Mac AuthContext: Checking for pending subscription...");

        // Check for pending subscription in localStorage
        const pendingSubscriptionStr = localStorage.getItem(
          "pendingSubscription"
        );

        if (!pendingSubscriptionStr) {
          console.log("ℹ️ Mac AuthContext: No pending subscription found");
          return null;
        }

        const pendingSubscription = JSON.parse(pendingSubscriptionStr);
        console.log(
          "📦 Mac AuthContext: Found pending subscription:",
          pendingSubscription
        );

        setIsProcessingSubscription(true);

        // Call backend API to process subscription
        const response = await fetch(
          "http://localhost:3001/api/subscription/process",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId,
              userEmail,
              userName,
              planId: pendingSubscription.planId,
              paymentMethodId: pendingSubscription.paymentMethodId,
              billingCycle: pendingSubscription.billingCycle || "monthly",
            }),
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Subscription processing failed");
        }

        console.log(
          "✅ Mac AuthContext: Subscription processed successfully:",
          result
        );

        // Clear pending subscription from localStorage
        localStorage.removeItem("pendingSubscription");
        console.log("🧹 Mac AuthContext: Cleared pending subscription data");

        // Refresh user profile to get updated subscription data
        await fetchUserProfileInBackground(userId);

        return result;
      } catch (error) {
        console.error(
          "❌ Mac AuthContext: Subscription processing error:",
          error
        );
        throw error;
      } finally {
        setIsProcessingSubscription(false);
      }
    },
    [fetchUserProfileInBackground]
  );

  // Keep your original fetchUserProfile for backwards compatibility
  const fetchUserProfile = fetchUserProfileInBackground;
  const createUserProfile = createUserProfileInBackground;

  const signIn = async (email: string, password: string) => {
    try {
      console.log("🔐 Mac AuthContext: FAST sign in attempt for:", email);
      setLoading(true);

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password,
      });

      if (error) {
        console.error("❌ Mac AuthContext: Sign in failed:", error.message);
        return { error: error.message };
      }

      console.log("✅ Mac AuthContext: FAST sign in successful");
      // Don't manually redirect - let auth state change handle it
      return {};
    } catch (error) {
      console.error("💥 Mac AuthContext: Sign in error:", error);
      return { error: "An unexpected error occurred during sign in" };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (
    email: string,
    password: string,
    name: string,
    planInfo?: {
      id: string;
      name: string;
      price: string;
      billingCycle?: string;
    }
  ) => {
    try {
      console.log("📝 Mac AuthContext: Sign up attempt for:", email);
      console.log("🎯 SIGNUP: Plan info received:", planInfo);
      console.log("🔍 SIGNUP DEBUG: planInfo type:", typeof planInfo);
      console.log("🔍 SIGNUP DEBUG: planInfo.id:", planInfo?.id);
      setLoading(true);

      // 🎯 FIXED: Store plan info with multiple backup methods
      if (planInfo) {
        // Validate plan info structure
        if (!planInfo.id || !planInfo.name || !planInfo.price) {
          console.warn("⚠️ SIGNUP: Invalid plan info structure:", planInfo);
        } else {
          // Store in memory
          pendingPlanInfo.current = planInfo;
          console.log("💾 SIGNUP: Stored plan info in memory:", planInfo);

          // Store in localStorage as backup
          localStorage.setItem("selectedPlan", JSON.stringify(planInfo));
          console.log("💾 SIGNUP: Stored plan info in localStorage backup");

          // 🔍 VERIFICATION: Check that storage worked
          console.log(
            "🔍 SIGNUP DEBUG: pendingPlanInfo.current after storage:",
            pendingPlanInfo.current
          );

          const verifyLocalStorage = localStorage.getItem("selectedPlan");
          console.log(
            "🔍 SIGNUP DEBUG: localStorage verification:",
            verifyLocalStorage
          );
        }
      } else {
        console.log(
          "ℹ️ SIGNUP: No plan info provided - will use default logic"
        );
      }

      // Step 1: Create user account in Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: email.toLowerCase().trim(),
        password,
        options: {
          data: {
            name: name.trim(),
          },
        },
      });

      if (error) {
        pendingPlanInfo.current = null; // Clear on error
        return { error: error.message };
      }

      if (!data.user) {
        pendingPlanInfo.current = null; // Clear on error
        return { error: "Failed to create user account" };
      }

      console.log("✅ Mac AuthContext: Sign up successful");

      // Step 2: Process pending subscription if exists
      try {
        const subscriptionResult = await processPendingSubscription(
          data.user.id,
          email.toLowerCase().trim(),
          name.trim()
        );

        if (subscriptionResult) {
          console.log(
            "🎉 Mac AuthContext: Subscription created with 7-day trial!"
          );
        } else {
          console.log("ℹ️ Mac AuthContext: No subscription to process");
        }
      } catch (subscriptionError) {
        console.error(
          "❌ Mac AuthContext: Subscription processing failed:",
          subscriptionError
        );
        // Don't return error here - user account was created successfully
        // They can contact support or try again later
      }

      // Profile will be created by fetchUserProfile when auth state changes
      console.log(
        "🔍 SIGNUP DEBUG: End of signUp function. pendingPlanInfo.current:",
        pendingPlanInfo.current
      );
      return {};
    } catch (error) {
      console.error("💥 Mac AuthContext: Sign up error:", error);
      pendingPlanInfo.current = null; // Clear on error
      return { error: "An unexpected error occurred during sign up" };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      console.log("🚪 Mac AuthContext: Sign out initiated");

      // Clear subscription data on logout
      localStorage.removeItem("pendingSubscription");
      localStorage.removeItem("selectedPlan");
      localStorage.removeItem("signupFormData");
      pendingPlanInfo.current = null; // Clear pending plan info

      // Immediate state clearing for Mac Safari compatibility
      await clearAuthState();

      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.warn("⚠️ Mac AuthContext: Supabase signOut warning:", error);
      } else {
        console.log("✅ Mac AuthContext: Supabase sign out successful");
      }

      // Force redirect on Mac
      await safeRedirect("/");
    } catch (error) {
      console.error("💥 Mac AuthContext: Sign out error:", error);
      // Force redirect even on error
      await clearAuthState();
      await safeRedirect("/");
    }
  };

  const updateProfile = async (updates: { name?: string }) => {
    try {
      if (!user) return { error: "No user logged in" };

      console.log("👤 Mac AuthContext: Updating profile");

      // Update auth metadata
      const { error: authError } = await supabase.auth.updateUser({
        data: updates,
      });

      if (authError) {
        return { error: authError.message };
      }

      // Update database record
      const { error: dbError } = await supabase
        .from("users")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (dbError) {
        return { error: dbError.message };
      }

      // Refresh profile
      await fetchUserProfile(user.id);
      return {};
    } catch (error) {
      console.error("💥 Mac AuthContext: Update profile error:", error);
      return { error: "An unexpected error occurred while updating profile" };
    }
  };

  // 🚀 FIXED isAdmin FUNCTION - Now includes test@kurzora.com!
  const isAdmin = useCallback(() => {
    if (!user) return false;

    // Admin email list - including test@kurzora.com
    const adminEmails = [
      "admin@kurzora.com",
      "khaled@kurzora.com",
      "khaledhamdy@gmail.com",
      "test@kurzora.com", // ← ADDED THIS!
    ];

    return (
      adminEmails.includes(user.email || "") ||
      user.user_metadata?.has_admin_access === true ||
      user.user_metadata?.role === "admin" ||
      userProfile?.subscription_tier === "elite"
    );
  }, [user, userProfile]);

  const value = {
    user,
    session,
    userProfile,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    isAdmin,
    isProcessingSubscription,
  };

  // OPTIMIZATION: Reduced initialization timeout
  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>🍎 Fast-loading Kurzora on Mac...</p>
        </div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
