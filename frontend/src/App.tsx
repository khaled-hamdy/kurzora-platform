import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { SignalsProvider } from "./contexts/SignalsContext";
import { PositionsProvider } from "./contexts/PositionsContext";
// ADMIN IMPORT FOR TESTING
import AdminProtectedRoute from "./components/admin/AdminProtectedRoute";
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
// TEMPORARILY COMMENTED OUT ADMIN PAGE IMPORTS
// import AdminDashboard from "./pages/admin/AdminDashboard";
// import AdminUsers from "./pages/admin/AdminUsers";
// import AdminSignals from "./pages/admin/AdminSignals";
// import AdminSettings from "./pages/admin/AdminSettings";
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

                  {/* 🚀 POLYGON.IO TEST PAGE - NEW! */}
                  <Route path="/polygon-test" element={<PolygonTest />} />

                  {/* 🎯 SIGNAL GENERATION TEST PAGE - NEW! */}
                  <Route path="/signals-test" element={<SignalsTest />} />

                  {/* 🛡️ ADMIN TEST ROUTE - TEMPORARY */}
                  <Route
                    path="/admin-test"
                    element={
                      <AdminProtectedRoute>
                        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white p-8">
                          <div className="max-w-4xl mx-auto">
                            <h1 className="text-3xl font-bold mb-4">
                              🎉 Admin Access Working!
                            </h1>
                            <p className="text-lg mb-4">
                              If you see this page, admin authentication is
                              working correctly.
                            </p>
                            <div className="bg-slate-800 p-4 rounded-lg">
                              <h2 className="text-xl font-semibold mb-2">
                                Next Steps:
                              </h2>
                              <ul className="list-disc list-inside space-y-1">
                                <li>AdminProtectedRoute ✅ Working</li>
                                <li>AdminLayout (Next)</li>
                                <li>AdminDashboard (Next)</li>
                                <li>User Management (Next)</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </AdminProtectedRoute>
                    }
                  />

                  {/* TEMPORARILY COMMENTED OUT ADMIN ROUTES */}
                  {/*
                  <Route
                    path="/admin"
                    element={
                      <AdminProtectedRoute>
                        <AdminDashboard />
                      </AdminProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/users"
                    element={
                      <AdminProtectedRoute>
                        <AdminUsers />
                      </AdminProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/signals"
                    element={
                      <AdminProtectedRoute>
                        <AdminSignals />
                      </AdminProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/settings"
                    element={
                      <AdminProtectedRoute>
                        <AdminSettings />
                      </AdminProtectedRoute>
                    }
                  />
                  */}

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
              </SignalsProvider>
            </PositionsProvider>
          </AuthProvider>
        </LanguageProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
