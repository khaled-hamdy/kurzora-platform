import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { SignalsProvider } from "./contexts/SignalsContext";
import { PositionsProvider } from "./contexts/PositionsContext";
// TELEGRAM ALERTS INTEGRATION
import { useSignalAlerts } from "./hooks/useSignalAlerts";
// ADMIN IMPORTS - COMPLETE ADMIN PANEL
import AdminProtectedRoute from "./components/admin/AdminProtectedRoute";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminUsers from "./components/admin/AdminUsers";
import AdminSettings from "./components/admin/AdminSettings";
// TEST COMPONENTS
import SubscriptionTierTest from "./components/test/SubscriptionTierTest";
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
import PrivacyPolicy from "./pages/legal/PrivacyPolicy";
import TermsOfService from "./pages/legal/TermsOfService";
import GermanTermsOfService from "./pages/legal/de/TermsOfService";
import RiskDisclosure from "./pages/legal/RiskDisclosure";
import ShariahCompliance from "./pages/legal/ShariahCompliance";
import GDPRCompliance from "./pages/legal/GDPRCompliance";
import CookieNotice from "./pages/legal/CookieNotice";
import PolygonTest from "./pages/PolygonTest";
import SignalsTest from "./pages/SignalsTest";

// Create QueryClient with default options
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  // 🚨 TELEGRAM ALERTS INTEGRATION - Monitor signals and send alerts automatically
  const { sendTestAlert } = useSignalAlerts();

  // Test alert handler for development
  const handleTestAlert = async () => {
    console.log("🧪 Testing Telegram alert...");
    try {
      const success = await sendTestAlert();
      if (success) {
        alert(
          "✅ Test alert sent successfully! Check your Telegram (Chat ID: 1390805707)"
        );
      } else {
        alert("❌ Test alert failed - check browser console for details");
      }
    } catch (error) {
      console.error("Error sending test alert:", error);
      alert("❌ Test alert error - check browser console");
    }
  };

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <Toaster />
        <Sonner />
        <LanguageProvider>
          <AuthProvider>
            <PositionsProvider>
              <SignalsProvider>
                <Routes>
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

                  {/* 🚀 POLYGON.IO TEST PAGE */}
                  <Route path="/polygon-test" element={<PolygonTest />} />

                  {/* 🎯 SIGNAL GENERATION TEST PAGE */}
                  <Route path="/signals-test" element={<SignalsTest />} />

                  {/* 🧪 SUBSCRIPTION TIER TEST PAGE */}
                  <Route
                    path="/test-subscription"
                    element={<SubscriptionTierTest />}
                  />

                  {/* 🛡️ ADMIN ROUTES - COMPLETE PROFESSIONAL ADMIN PANEL */}
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

                  {/* 🛡️ ADMIN TEST ROUTE - DEMONSTRATION */}
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

                  {/* Legal Pages */}
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

                  {/* Catch-all route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>

                {/* 🧪 TELEGRAM ALERTS TEST BUTTON - Development Only */}
                {process.env.NODE_ENV === "development" && (
                  <button
                    onClick={handleTestAlert}
                    style={{
                      position: "fixed",
                      bottom: "20px",
                      right: "20px",
                      background: "#0088cc",
                      color: "white",
                      border: "none",
                      padding: "12px 16px",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontSize: "14px",
                      fontWeight: "600",
                      boxShadow: "0 4px 12px rgba(0, 136, 204, 0.3)",
                      zIndex: 1000,
                      transition: "all 0.2s ease",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = "#006699";
                      e.currentTarget.style.transform = "translateY(-1px)";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = "#0088cc";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    🧪 Test Telegram Alert
                  </button>
                )}
              </SignalsProvider>
            </PositionsProvider>
          </AuthProvider>
        </LanguageProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
