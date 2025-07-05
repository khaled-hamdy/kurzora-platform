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

  // ✅ IMPROVED: Better redirect management
  const redirectTimeouts = useRef<Set<NodeJS.Timeout>>(new Set());
  const mounted = useRef(true);

  // 🔥 BULLETPROOF PLAN STORAGE: Multiple redundant storage methods
  const storePlanDataWithMultipleBackups = useCallback((planInfo: any) => {
    if (!planInfo || !planInfo.id) {
      console.log("🚫 PLAN STORAGE: No valid plan info to store");
      return;
    }

    console.log("🔐 BULLETPROOF STORAGE: Starting multi-layer plan storage...");
    console.log("🔐 PLAN DATA:", planInfo);

    try {
      // Method 1: In-memory storage (immediate)
      pendingPlanInfo.current = planInfo;
      console.log("✅ STORAGE METHOD 1: pendingPlanInfo.current stored");

      // Method 2: localStorage with timestamp (survives page refresh)
      const storageData = {
        ...planInfo,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        url: window.location.href,
      };
      localStorage.setItem(
        "kurzora_plan_selection",
        JSON.stringify(storageData)
      );
      console.log(
        "✅ STORAGE METHOD 2: localStorage kurzora_plan_selection stored"
      );

      // Method 3: Legacy localStorage (backward compatibility)
      localStorage.setItem("selectedPlan", JSON.stringify(planInfo));
      console.log("✅ STORAGE METHOD 3: localStorage selectedPlan stored");

      // Method 4: sessionStorage (backup if localStorage corrupted)
      sessionStorage.setItem(
        "kurzora_plan_backup",
        JSON.stringify(storageData)
      );
      console.log("✅ STORAGE METHOD 4: sessionStorage backup stored");

      // Method 5: URL parameters (survives email verification redirect)
      try {
        const url = new URL(window.location.href);
        url.searchParams.set("plan_id", planInfo.id);
        url.searchParams.set("plan_name", planInfo.name);
        url.searchParams.set("plan_price", planInfo.price);
        window.history.replaceState({}, "", url.toString());
        console.log("✅ STORAGE METHOD 5: URL parameters stored");
      } catch (urlError) {
        console.warn("⚠️ STORAGE METHOD 5 failed:", urlError);
      }

      // Method 6: Browser cookie (final fallback)
      try {
        const cookieData = encodeURIComponent(JSON.stringify(planInfo));
        document.cookie = `kurzora_plan=${cookieData}; path=/; max-age=3600; SameSite=Strict`;
        console.log("✅ STORAGE METHOD 6: Cookie stored");
      } catch (cookieError) {
        console.warn("⚠️ STORAGE METHOD 6 failed:", cookieError);
      }

      console.log(
        "🎉 BULLETPROOF STORAGE: All 6 methods attempted successfully"
      );

      // VERIFICATION: Immediately test retrieval
      const verification = retrievePlanDataFromAllSources();
      if (verification?.id === planInfo.id) {
        console.log(
          "✅ STORAGE VERIFICATION: Plan data retrieval working correctly"
        );
      } else {
        console.error("🚨 STORAGE VERIFICATION FAILED:", {
          expected: planInfo.id,
          retrieved: verification?.id,
        });
      }
    } catch (error) {
      console.error("💥 BULLETPROOF STORAGE ERROR:", error);
    }
  }, []);

  // 🔍 BULLETPROOF PLAN RETRIEVAL: Check all storage methods
  const retrievePlanDataFromAllSources = useCallback(() => {
    console.log("🔍 BULLETPROOF RETRIEVAL: Checking all 6 storage methods...");

    // Method 1: In-memory storage (fastest)
    if (pendingPlanInfo.current?.id) {
      console.log(
        "✅ RETRIEVAL METHOD 1: Found in pendingPlanInfo.current:",
        pendingPlanInfo.current
      );
      return pendingPlanInfo.current;
    }

    // Method 2: Primary localStorage with timestamp
    try {
      const stored = localStorage.getItem("kurzora_plan_selection");
      if (stored) {
        const planData = JSON.parse(stored);
        console.log(
          "✅ RETRIEVAL METHOD 2: Found in kurzora_plan_selection:",
          planData
        );

        // Check if data is fresh (within 1 hour)
        if (planData.timestamp && Date.now() - planData.timestamp < 3600000) {
          return planData;
        } else {
          console.log(
            "⚠️ RETRIEVAL METHOD 2: Data expired, checking other methods"
          );
        }
      }
    } catch (e) {
      console.warn("⚠️ RETRIEVAL METHOD 2 failed:", e);
    }

    // Method 3: Legacy localStorage (backward compatibility)
    try {
      const legacy = localStorage.getItem("selectedPlan");
      if (legacy) {
        const planData = JSON.parse(legacy);
        console.log("✅ RETRIEVAL METHOD 3: Found in selectedPlan:", planData);
        return planData;
      }
    } catch (e) {
      console.warn("⚠️ RETRIEVAL METHOD 3 failed:", e);
    }

    // Method 4: sessionStorage backup
    try {
      const session = sessionStorage.getItem("kurzora_plan_backup");
      if (session) {
        const planData = JSON.parse(session);
        console.log(
          "✅ RETRIEVAL METHOD 4: Found in sessionStorage:",
          planData
        );
        return planData;
      }
    } catch (e) {
      console.warn("⚠️ RETRIEVAL METHOD 4 failed:", e);
    }

    // Method 5: URL parameters
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const planId = urlParams.get("plan_id");
      const planName = urlParams.get("plan_name");
      const planPrice = urlParams.get("plan_price");

      if (planId && planName && planPrice) {
        const planData = { id: planId, name: planName, price: planPrice };
        console.log(
          "✅ RETRIEVAL METHOD 5: Found in URL parameters:",
          planData
        );
        return planData;
      }
    } catch (e) {
      console.warn("⚠️ RETRIEVAL METHOD 5 failed:", e);
    }

    // Method 6: Cookie fallback
    try {
      const cookies = document.cookie.split(";");
      const planCookie = cookies.find((c) =>
        c.trim().startsWith("kurzora_plan=")
      );
      if (planCookie) {
        const cookieValue = planCookie.split("=")[1];
        const planData = JSON.parse(decodeURIComponent(cookieValue));
        console.log("✅ RETRIEVAL METHOD 6: Found in cookie:", planData);
        return planData;
      }
    } catch (e) {
      console.warn("⚠️ RETRIEVAL METHOD 6 failed:", e);
    }

    // Method 7: Check pendingSubscription localStorage (existing method)
    try {
      const pendingSubscriptionStr = localStorage.getItem(
        "pendingSubscription"
      );
      if (pendingSubscriptionStr) {
        const pendingSubscription = JSON.parse(pendingSubscriptionStr);
        if (pendingSubscription?.planId) {
          const planData = { id: pendingSubscription.planId };
          console.log(
            "✅ RETRIEVAL METHOD 7: Found in pendingSubscription:",
            planData
          );
          return planData;
        }
      }
    } catch (e) {
      console.warn("⚠️ RETRIEVAL METHOD 7 failed:", e);
    }

    console.log(
      "❌ BULLETPROOF RETRIEVAL: No plan data found in any of the 7 methods"
    );
    return null;
  }, []);

  // 🧹 CLEANUP: Clear all plan data storage
  const clearAllPlanData = useCallback(() => {
    console.log(
      "🧹 CLEANUP: Clearing all plan data from all storage methods..."
    );

    // Clear in-memory
    pendingPlanInfo.current = null;

    // Clear localStorage
    localStorage.removeItem("kurzora_plan_selection");
    localStorage.removeItem("selectedPlan");
    localStorage.removeItem("pendingSubscription");

    // Clear sessionStorage
    sessionStorage.removeItem("kurzora_plan_backup");

    // Clear URL parameters
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete("plan_id");
      url.searchParams.delete("plan_name");
      url.searchParams.delete("plan_price");
      window.history.replaceState({}, "", url.toString());
    } catch (e) {
      console.warn("⚠️ URL cleanup failed:", e);
    }

    // Clear cookie
    try {
      document.cookie =
        "kurzora_plan=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    } catch (e) {
      console.warn("⚠️ Cookie cleanup failed:", e);
    }

    console.log("✅ CLEANUP: All plan data storage methods cleared");
  }, []);

  // 🎯 BULLETPROOF: Enhanced plan tier determination with detailed logging
  const determineSubscriptionTier = useCallback(
    (directPlanInfo: any, userEmail?: string): "starter" | "professional" => {
      console.log(
        "🎯 BULLETPROOF TIER DETERMINATION: Starting comprehensive analysis..."
      );
      console.log("🎯 INPUT: directPlanInfo:", directPlanInfo);
      console.log("🎯 INPUT: userEmail:", userEmail);

      // Priority 1: Direct planInfo parameter (from function call)
      if (directPlanInfo?.id) {
        const planId = String(directPlanInfo.id).toLowerCase().trim();
        console.log("🎯 PRIORITY 1: Direct planInfo.id found:", planId);

        if (planId === "professional") {
          console.log("✅ TIER DECISION: PROFESSIONAL from direct planInfo");
          return "professional";
        } else if (planId === "starter") {
          console.log("✅ TIER DECISION: STARTER from direct planInfo");
          return "starter";
        }
      }

      // Priority 2: Comprehensive retrieval from all storage methods
      const retrievedPlan = retrievePlanDataFromAllSources();
      if (retrievedPlan?.id) {
        const planId = String(retrievedPlan.id).toLowerCase().trim();
        console.log("🎯 PRIORITY 2: Retrieved plan ID:", planId);

        if (planId === "professional") {
          console.log(
            "✅ TIER DECISION: PROFESSIONAL from comprehensive retrieval"
          );
          return "professional";
        } else if (planId === "starter") {
          console.log("✅ TIER DECISION: STARTER from comprehensive retrieval");
          return "starter";
        }
      }

      // Priority 3: Email-based detection (for known admin emails)
      if (userEmail) {
        const email = userEmail.toLowerCase().trim();
        const adminEmails = [
          "admin@kurzora.com",
          "khaled@kurzora.com",
          "khaledhamdy@gmail.com",
          "test@kurzora.com",
        ];

        if (adminEmails.includes(email)) {
          console.log("✅ TIER DECISION: PROFESSIONAL for admin email:", email);
          return "professional";
        }
      }

      // 🚨 FINAL FALLBACK: Default to starter with comprehensive logging
      console.warn("⚠️ BULLETPROOF TIER DETERMINATION: NO PLAN DATA FOUND");
      console.warn("🔍 FALLBACK DEBUG: directPlanInfo was:", directPlanInfo);
      console.warn("🔍 FALLBACK DEBUG: retrievedPlan was:", retrievedPlan);
      console.warn("🔍 FALLBACK DEBUG: userEmail was:", userEmail);
      console.warn("🎯 FALLBACK DECISION: Using default STARTER tier");

      return "starter";
    },
    [retrievePlanDataFromAllSources]
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
          "🆕 BULLETPROOF PROFILE CREATION: Starting for user:",
          user.email
        );

        // 🔍 ENHANCED DEBUG: Comprehensive plan info analysis
        console.log("🔍 PROFILE CREATION: Analyzing all plan data sources...");
        console.log(
          "🔍 PROFILE CREATION: pendingPlanInfo.current =",
          pendingPlanInfo.current
        );

        // Test all storage methods
        const comprehensivePlanData = retrievePlanDataFromAllSources();
        console.log(
          "🔍 PROFILE CREATION: Comprehensive plan data =",
          comprehensivePlanData
        );

        // 🎯 BULLETPROOF: Enhanced tier determination
        console.log(
          "🔍 PROFILE CREATION: About to call bulletproof tier determination..."
        );

        const subscriptionTier = determineSubscriptionTier(
          comprehensivePlanData || pendingPlanInfo.current,
          user.email
        );

        console.log(
          "🔍 PROFILE CREATION: FINAL TIER DECISION:",
          subscriptionTier
        );

        // 🚨 VALIDATION: Ensure tier is valid
        if (
          subscriptionTier !== "professional" &&
          subscriptionTier !== "starter"
        ) {
          console.error(
            "🚨 INVALID TIER DETECTED:",
            subscriptionTier,
            "- forcing to starter"
          );
          console.error("🚨 DEBUG DATA:", {
            comprehensivePlanData,
            pendingPlanInfo: pendingPlanInfo.current,
            userEmail: user.email,
          });
        }

        const validTier =
          subscriptionTier === "professional" ? "professional" : "starter";
        console.log(
          "🎯 VALIDATED FINAL DECISION: Creating user with tier:",
          validTier
        );

        const profileData = {
          id: userId,
          email: user.email?.toLowerCase().trim() || "",
          name: user.user_metadata?.name || user.email?.split("@")[0] || "User",
          subscription_tier: validTier,
          subscription_status: "trial",
          language: "en",
          timezone: "UTC",
          starting_balance: 10000.0,
          current_balance: 10000.0,
          risk_percentage: 2.0,
          notification_settings: {
            email_alerts_enabled: true,
            telegram_alerts_enabled: validTier === "professional",
            daily_alert_limit: validTier === "starter" ? 3 : null,
            minimum_score: 65,
          },
          is_active: true,
        };

        console.log("🎯 BULLETPROOF PROFILE: Final profile data:", {
          email: profileData.email,
          subscription_tier: profileData.subscription_tier,
          subscription_status: profileData.subscription_status,
          notification_settings: profileData.notification_settings,
        });

        console.log("🔍 PROFILE CREATION: About to insert into Supabase...");
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
          console.log("✅ BULLETPROOF SUCCESS: Profile created successfully!");
          console.log(
            "✅ VERIFICATION: User tier in database:",
            data.subscription_tier
          );
          console.log(
            "✅ VERIFICATION: Notification settings:",
            data.notification_settings
          );

          // 🚨 FINAL VERIFICATION: Comprehensive database result validation
          if (data.subscription_tier !== validTier) {
            console.error("🚨 DATABASE MISMATCH DETECTED:", {
              expected: validTier,
              actual: data.subscription_tier,
              originalPlanInfo: pendingPlanInfo.current,
              comprehensivePlanData: comprehensivePlanData,
              userEmail: user.email,
            });
          } else {
            console.log(
              "✅ VERIFICATION PASSED: Database tier matches expected tier"
            );

            // Clear plan data after successful creation
            clearAllPlanData();
            console.log(
              "✅ CLEANUP: Plan data cleared after successful profile creation"
            );
          }

          if (mounted.current) {
            setUserProfile(data);
          }
        }
      } catch (error) {
        console.error(
          "💥 Mac AuthContext: Background create profile error:",
          error
        );
      }
    },
    [
      determineSubscriptionTier,
      retrievePlanDataFromAllSources,
      clearAllPlanData,
    ]
  );

  // ✅ IMPROVED: Reliable redirect function that actually works
  const performReliableRedirect = useCallback(
    (path: string, reason: string = "") => {
      console.log(
        `🔄 Mac AuthContext: Reliable redirect to ${path} (${reason})`
      );

      // Clear any pending timeouts
      redirectTimeouts.current.forEach((timeout) => clearTimeout(timeout));
      redirectTimeouts.current.clear();

      try {
        // Method 1: Try immediate redirect
        window.location.href = path;
      } catch (error) {
        console.warn("⚠️ Method 1 failed, trying Method 2");

        try {
          // Method 2: Try location.replace
          window.location.replace(path);
        } catch (error2) {
          console.warn("⚠️ Method 2 failed, trying Method 3");

          // Method 3: Force reload with new path
          const timeout = setTimeout(() => {
            if (mounted.current) {
              window.history.pushState({}, "", path);
              window.location.reload();
            }
          }, 100);

          redirectTimeouts.current.add(timeout);
        }
      }
    },
    []
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

    // ✅ IMPROVED: Auth state change listener with better redirect logic
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

          // ✅ FIXED: Only redirect if not already on landing page
          const currentPath = window.location.pathname;
          if (
            currentPath !== "/" &&
            !currentPath.includes("/auth") &&
            !currentPath.includes("/signup")
          ) {
            console.log(
              "🔄 Mac AuthContext: Redirecting from",
              currentPath,
              "to landing page"
            );
            performReliableRedirect("/", "signed out");
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

          // ✅ FIXED: Only redirect to dashboard if on login/signup pages
          const currentPath = window.location.pathname;
          if (
            currentPath === "/" ||
            currentPath.includes("/auth") ||
            currentPath.includes("/signup")
          ) {
            console.log(
              "🔄 Mac AuthContext: Redirecting from",
              currentPath,
              "to dashboard"
            );
            performReliableRedirect("/dashboard", "signed in");
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

      // Clear any pending redirects
      redirectTimeouts.current.forEach((timeout) => clearTimeout(timeout));
      redirectTimeouts.current.clear();
    };
  }, [
    fetchUserProfileInBackground,
    createUserProfileInBackground,
    performReliableRedirect,
  ]);

  const clearAuthState = useCallback(async () => {
    console.log("🧹 Mac AuthContext: Clearing auth state");
    setUser(null);
    setSession(null);
    setUserProfile(null);
    setLoading(false);

    // Clear plan data on auth state clear
    clearAllPlanData();

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
  }, [clearAllPlanData]);

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
      console.log("📝 BULLETPROOF SIGNUP: Starting signup for:", email);
      console.log("🎯 BULLETPROOF SIGNUP: Plan info received:", planInfo);
      setLoading(true);

      // 🔥 BULLETPROOF: Store plan info with multiple backup methods
      if (planInfo) {
        // Validate plan info structure
        if (!planInfo.id || !planInfo.name || !planInfo.price) {
          console.warn(
            "⚠️ BULLETPROOF SIGNUP: Invalid plan info structure:",
            planInfo
          );
        } else {
          console.log(
            "🔐 BULLETPROOF SIGNUP: Storing plan data with all 6 methods..."
          );
          storePlanDataWithMultipleBackups(planInfo);

          // Additional verification
          setTimeout(() => {
            const verification = retrievePlanDataFromAllSources();
            console.log(
              "🔍 BULLETPROOF SIGNUP: Plan data verification:",
              verification
            );
          }, 100);
        }
      } else {
        console.log(
          "ℹ️ BULLETPROOF SIGNUP: No plan info provided - will use default logic"
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
        clearAllPlanData(); // Clear on error
        return { error: error.message };
      }

      if (!data.user) {
        clearAllPlanData(); // Clear on error
        return { error: "Failed to create user account" };
      }

      console.log("✅ BULLETPROOF SIGNUP: Sign up successful");

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
        "🔍 BULLETPROOF SIGNUP: End of signUp function. Plan data stored with bulletproof methods."
      );
      return {};
    } catch (error) {
      console.error("💥 Mac AuthContext: Sign up error:", error);
      clearAllPlanData(); // Clear on error
      return { error: "An unexpected error occurred during sign up" };
    } finally {
      setLoading(false);
    }
  };

  // ✅ IMPROVED: Simplified signOut with reliable redirect
  const signOut = async () => {
    try {
      console.log("🚪 Mac AuthContext: Sign out initiated");

      // Clear all plan and subscription data on logout
      clearAllPlanData();
      localStorage.removeItem("signupFormData");

      // Immediate state clearing for Mac Safari compatibility
      await clearAuthState();

      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.warn("⚠️ Mac AuthContext: Supabase signOut warning:", error);
      } else {
        console.log("✅ Mac AuthContext: Supabase sign out successful");
      }

      // ✅ FIXED: Reliable redirect to landing page
      console.log(
        "🔄 Mac AuthContext: Redirecting to landing page after signout"
      );
      performReliableRedirect("/", "sign out completed");
    } catch (error) {
      console.error("💥 Mac AuthContext: Sign out error:", error);
      // Force redirect even on error
      await clearAuthState();
      performReliableRedirect("/", "sign out error recovery");
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
