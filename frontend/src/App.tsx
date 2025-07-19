// ==================================================================================
// 🎯 KURZORA PLATFORM - MAIN APPLICATION ROUTER
// ==================================================================================
// 🛡️ ANTI-REGRESSION: This is a PRODUCTION-CRITICAL file - handle with extreme care
// 📝 SESSION #173: Removed fake data components (DailyBreakdownReportGenerator, CombinedBacktestAnalyzer)
// 🔄 PRESERVED: All existing routes from Sessions #169, #171 and earlier
// 🚨 CRITICAL: Never modify existing routes without understanding their purpose
// 📋 COMPLETE: All imports, providers, and routes maintained exactly as before
// 🧹 CLEANED: Removed components with fake data as requested by user
// 🎯 NEW: Added Google Analytics tracking with proper script loading for Vite/React

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { SignalsProvider } from "./contexts/SignalsContext";
import { PositionsProvider } from "./contexts/PositionsContext";

// ==================================================================================
// 📊 GOOGLE ANALYTICS IMPORTS
// ==================================================================================
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { initGA, trackPageView, GA_MEASUREMENT_ID } from "./lib/analytics";

// ==================================================================================
// 🛡️ ADMIN IMPORTS - COMPLETE ADMIN PANEL (PRESERVED FROM PREVIOUS SESSIONS)
// ==================================================================================
import AdminProtectedRoute from "./components/admin/AdminProtectedRoute";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminUsers from "./components/admin/AdminUsers";
import AdminSettings from "./components/admin/AdminSettings";

// ==================================================================================
// 🧪 TEST COMPONENTS (PRESERVED FROM PREVIOUS SESSIONS)
// ==================================================================================
import SubscriptionTierTest from "./components/test/SubscriptionTierTest";

// ==================================================================================
// 📄 CORE PAGE IMPORTS (PRESERVED FROM PREVIOUS SESSIONS)
// ==================================================================================
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import Signals from "./pages/Signals";
import OpenPositions from "./pages/OpenPositions";
import Orders from "./pages/Orders";
import OrdersHistory from "./pages/OrdersHistory";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import SignalDetail from "./pages/SignalDetail";
import HowItWorks from "./pages/HowItWorks";
import Pricing from "./pages/Pricing";
import FAQ from "./pages/FAQ";
import About from "./pages/About";
import Contact from "./pages/Contact";
import BrokerIntegration from "./pages/BrokerIntegration";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";

// ==================================================================================
// 📋 LEGAL PAGE IMPORTS (PRESERVED FROM PREVIOUS SESSIONS)
// ==================================================================================
import PrivacyPolicy from "./pages/legal/PrivacyPolicy";
import TermsOfService from "./pages/legal/TermsOfService";
import GermanTermsOfService from "./pages/legal/de/TermsOfService";
import RiskDisclosure from "./pages/legal/RiskDisclosure";
import ShariahCompliance from "./pages/legal/ShariahCompliance";
import GDPRCompliance from "./pages/legal/GDPRCompliance";
import CookieNotice from "./pages/legal/CookieNotice";

// ==================================================================================
// 🔬 TESTING & ANALYSIS IMPORTS (PRESERVED FROM PREVIOUS SESSIONS)
// ==================================================================================
import PolygonTest from "./pages/PolygonTest";
// ✅ CLEANED: Single signals test component (Enhanced with sector fix)
import SignalsTest from "./pages/SignalsTest";

// ==================================================================================
// 📊 BACKTESTING SYSTEM IMPORTS (PRESERVED FROM PREVIOUS SESSIONS)
// ==================================================================================
// 🚀 SESSION #169: Backtesting System - Complete 30-day simulation
import BacktestAnalyzer from "./components/BacktestAnalyzer";

// ==================================================================================
// ⚙️ QUERY CLIENT CONFIGURATION (PRESERVED FROM PREVIOUS SESSIONS)
// ==================================================================================
// Create QueryClient with default options
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// ==================================================================================
// 📊 GOOGLE ANALYTICS SETUP COMPONENT
// ==================================================================================
// 🎯 PURPOSE: Properly load Google Analytics scripts and track page views
function GoogleAnalyticsSetup() {
  const location = useLocation();

  useEffect(() => {
    // Load Google Analytics script dynamically
    if (GA_MEASUREMENT_ID && typeof window !== "undefined") {
      // Create and load gtag script
      const script1 = document.createElement("script");
      script1.async = true;
      script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
      document.head.appendChild(script1);

      // Initialize gtag
      const script2 = document.createElement("script");
      script2.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${GA_MEASUREMENT_ID}');
        console.log('🎯 Google Analytics script loaded with ID: ${GA_MEASUREMENT_ID}');
      `;
      document.head.appendChild(script2);

      // Initialize our analytics
      setTimeout(() => {
        initGA();
      }, 1000);

      // Cleanup function
      return () => {
        // Clean up scripts if component unmounts
        try {
          document.head.removeChild(script1);
          document.head.removeChild(script2);
        } catch (e) {
          // Scripts may already be removed
        }
      };
    }
  }, []); // Run once when component mounts

  useEffect(() => {
    // Track page views when location changes
    if (GA_MEASUREMENT_ID) {
      console.log("📊 Tracking page view:", location.pathname);
      trackPageView(location.pathname);
    }
  }, [location.pathname]); // Run when route changes

  return null; // This component doesn't render anything
}

// ==================================================================================
// 🎯 MAIN APPLICATION COMPONENT
// ==================================================================================
// 🛡️ ANTI-REGRESSION: This function contains ALL routes for the platform
// 📝 SESSION #173: Removed fake data component routes as requested
// 🔄 PRESERVED: All existing routes maintained exactly as before
// 🚨 CRITICAL: Never remove or modify existing routes without understanding impact
// 🎯 NEW: Added Google Analytics tracking throughout the application

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        {/* Google Analytics Setup - Loads scripts and tracks page views */}
        <GoogleAnalyticsSetup />

        <Toaster />
        <Sonner />
        <LanguageProvider>
          <AuthProvider>
            <PositionsProvider>
              <SignalsProvider>
                <Routes>
                  {/* ================================================================== */}
                  {/* 🏠 CORE PLATFORM ROUTES (PRESERVED FROM PREVIOUS SESSIONS) */}
                  {/* ================================================================== */}
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/signals" element={<Signals />} />
                  <Route path="/signals/:symbol" element={<SignalDetail />} />
                  <Route path="/open-positions" element={<OpenPositions />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/orders-history" element={<OrdersHistory />} />
                  <Route path="/admin-old" element={<Admin />} />
                  <Route path="/how-it-works" element={<HowItWorks />} />
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route
                    path="/broker-integration"
                    element={<BrokerIntegration />}
                  />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/profile" element={<Profile />} />

                  {/* ================================================================== */}
                  {/* 🔬 TESTING & DEVELOPMENT ROUTES (PRESERVED FROM PREVIOUS SESSIONS) */}
                  {/* ================================================================== */}

                  {/* 🚀 POLYGON.IO TEST PAGE */}
                  <Route path="/polygon-test" element={<PolygonTest />} />

                  {/* ✅ CLEANED: Enhanced Signal Generation Test with Database Auto-Save & Sector Fix */}
                  <Route path="/signals-test" element={<SignalsTest />} />

                  {/* 🧪 SUBSCRIPTION TIER TEST PAGE */}
                  <Route
                    path="/test-subscription"
                    element={<SubscriptionTierTest />}
                  />

                  {/* ================================================================== */}
                  {/* 📊 BACKTESTING SYSTEM ROUTES (SESSION #169) */}
                  {/* ================================================================== */}

                  {/* 🚀 SESSION #169: BACKTESTING SYSTEM - Complete 30-Day Trading Simulation */}
                  {/* 🛡️ PRESERVED: Original backtesting system from Session #169 */}
                  <Route path="/backtest" element={<BacktestAnalyzer />} />

                  {/* ================================================================== */}
                  {/* 🛡️ ADMIN ROUTES - COMPLETE PROFESSIONAL ADMIN PANEL */}
                  {/* ================================================================== */}
                  {/* 🛡️ PRESERVED: All admin functionality from previous sessions */}
                  <Route
                    path="/admin"
                    element={
                      <AdminProtectedRoute>
                        <AdminLayout />
                      </AdminProtectedRoute>
                    }
                  >
                    {/* ✅ ADMIN DASHBOARD - Real-time metrics and analytics */}
                    <Route index element={<AdminDashboard />} />

                    {/* ✅ ADMIN USERS - Complete user management with subscriptions */}
                    <Route path="users" element={<AdminUsers />} />

                    {/* ✅ ADMIN SETTINGS - Complete platform configuration system */}
                    <Route path="settings" element={<AdminSettings />} />
                  </Route>

                  {/* 🛡️ ADMIN TEST ROUTE - DEMONSTRATION (PRESERVED) */}
                  <Route
                    path="/admin-test"
                    element={
                      <AdminProtectedRoute>
                        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white p-8">
                          <div className="max-w-4xl mx-auto">
                            <h1 className="text-3xl font-bold mb-4">
                              🎉 Complete Admin Panel Success!
                            </h1>
                            <p className="text-lg mb-4">
                              Your professional admin interface is 100% complete
                              and operational.
                            </p>
                            <div className="bg-slate-800 p-6 rounded-lg">
                              <h2 className="text-xl font-semibold mb-4">
                                ✅ Admin Panel Components Complete:
                              </h2>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <ul className="list-disc list-inside space-y-2">
                                  <li>
                                    ✅ AdminProtectedRoute - Email-based
                                    authentication
                                  </li>
                                  <li>
                                    ✅ AdminLayout - Professional navigation &
                                    header
                                  </li>
                                  <li>
                                    ✅ AdminDashboard - Real-time metrics &
                                    analytics
                                  </li>
                                </ul>
                                <ul className="list-disc list-inside space-y-2">
                                  <li>
                                    ✅ AdminUsers - Complete user management
                                    system
                                  </li>
                                  <li>
                                    ✅ AdminSettings - Platform configuration &
                                    controls
                                  </li>
                                  <li>
                                    ✅ Professional UI - Responsive design &
                                    dark theme
                                  </li>
                                </ul>
                              </div>

                              <div className="mt-6 p-4 bg-green-900/20 border border-green-500/50 rounded-lg">
                                <h3 className="text-green-400 font-semibold mb-2">
                                  🎊 Milestone Complete!
                                </h3>
                                <p className="text-green-300 text-sm">
                                  Your admin panel foundation is complete with
                                  Dashboard, Users, and Settings. Ready for
                                  investor demos and platform management!
                                </p>
                              </div>
                            </div>
                            <div className="mt-6 flex space-x-4">
                              <a
                                href="/admin"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                              >
                                → Access Admin Dashboard
                              </a>
                              <a
                                href="/admin/users"
                                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                              >
                                → Manage Users
                              </a>
                              <a
                                href="/admin/settings"
                                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                              >
                                → Configure Settings
                              </a>
                            </div>
                          </div>
                        </div>
                      </AdminProtectedRoute>
                    }
                  />

                  {/* ================================================================== */}
                  {/* 📋 LEGAL PAGES (PRESERVED FROM PREVIOUS SESSIONS) */}
                  {/* ================================================================== */}
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route
                    path="/terms-of-service"
                    element={<TermsOfService />}
                  />
                  <Route
                    path="/de/terms-of-service"
                    element={<GermanTermsOfService />}
                  />
                  <Route path="/risk-disclosure" element={<RiskDisclosure />} />
                  <Route
                    path="/shariah-compliance"
                    element={<ShariahCompliance />}
                  />
                  <Route path="/gdpr-compliance" element={<GDPRCompliance />} />
                  <Route path="/cookie-notice" element={<CookieNotice />} />

                  {/* ================================================================== */}
                  {/* 🚨 CATCH-ALL ROUTE (PRESERVED FROM PREVIOUS SESSIONS) */}
                  {/* ================================================================== */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </SignalsProvider>
            </PositionsProvider>
          </AuthProvider>
        </LanguageProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

// ==================================================================================
// 📤 EXPORT (PRESERVED FROM PREVIOUS SESSIONS)
// ==================================================================================
export default App;

// ==================================================================================
// 📝 SESSION HANDOVER NOTES FOR FUTURE SESSIONS
// ==================================================================================
// 🧹 WHAT WAS REMOVED: DailyBreakdownReportGenerator and CombinedBacktestAnalyzer imports and routes
// 🛡️ WHAT WAS PRESERVED: All existing routes, imports, and functionality unchanged
// 🔄 ROUTE STRUCTURE: /backtest (Session #169) still functional, fake data routes removed
// 🚨 CRITICAL ROUTES: Admin panel, core platform, and all legal pages preserved exactly
// 📋 FUTURE MODIFICATIONS: Always preserve existing functionality and add extensive comments
// 🎊 TESTING: All remaining routes still functional, fake data components safely removed
// 🛡️ SAFETY: Core backtesting system still functional at /backtest route
// 🎯 NEW ADDITION: Google Analytics tracking implemented with proper dynamic script loading for Vite/React
// 📊 ANALYTICS FEATURES: Real-time user behavior tracking, conversion tracking ready for Kurzora events
// 🔧 SCRIPT LOADING: Fixed React/Vite compatibility issues with dynamic script injection
