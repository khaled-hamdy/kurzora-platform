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
import { supabase, Database } from "@/lib/supabase";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userProfile: Database["public"]["Tables"]["users"]["Row"] | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (
    email: string,
    password: string,
    name: string
  ) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: { name?: string }) => Promise<{ error?: string }>;
  isAdmin: () => boolean;
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

  // Prevent multiple redirects
  const isRedirecting = useRef(false);
  const mounted = useRef(true);

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
  }, []);

  const clearAuthState = useCallback(async () => {
    console.log("🧹 Mac AuthContext: Clearing auth state");
    setUser(null);
    setSession(null);
    setUserProfile(null);
    setLoading(false);

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
  const createUserProfileInBackground = useCallback(async (userId: string) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user || !mounted.current) return;

      console.log(
        "🆕 Mac AuthContext: Creating profile in background for:",
        user.email
      );

      const profileData = {
        id: userId,
        email: user.email?.toLowerCase().trim() || "",
        name: user.user_metadata?.name || user.email?.split("@")[0] || "User",
        subscription_tier: "starter" as const,
        subscription_status: "trial",
        language: "en", // Fixed: was preferred_language
        timezone: "UTC",
        starting_balance: 10000.0,
        current_balance: 10000.0,
        risk_percentage: 2.0,
        notification_settings: {},
        is_active: true,
      };

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
        console.log("✅ Mac AuthContext: Profile created in background");
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
  }, []);

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

  const signUp = async (email: string, password: string, name: string) => {
    try {
      console.log("📝 Mac AuthContext: Sign up attempt for:", email);
      setLoading(true);

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
        return { error: error.message };
      }

      console.log("✅ Mac AuthContext: Sign up successful");
      // Profile will be created by fetchUserProfile when auth state changes
      return {};
    } catch (error) {
      console.error("💥 Mac AuthContext: Sign up error:", error);
      return { error: "An unexpected error occurred during sign up" };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      console.log("🚪 Mac AuthContext: Sign out initiated");

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
