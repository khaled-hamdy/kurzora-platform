import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { SignalsProvider } from "./contexts/SignalsContext";
import { PositionsProvider } from "./contexts/PositionsContext";
// ADMIN IMPORTS
import AdminProtectedRoute from "./components/admin/AdminProtectedRoute";
import AdminLayout from "./components/admin/AdminLayout";
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

// Temporary Admin Dashboard Component (until we create the real one)
const TempAdminDashboard = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-bold text-white mb-2">Admin Dashboard</h1>
      <p className="text-slate-400">Welcome to your Kurzora admin panel</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-2">Total Users</h3>
        <p className="text-3xl font-bold text-blue-400">1,247</p>
        <p className="text-sm text-slate-400 mt-1">+12% from last month</p>
      </div>

      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-2">
          Active Signals
        </h3>
        <p className="text-3xl font-bold text-green-400">89</p>
        <p className="text-sm text-slate-400 mt-1">Currently processing</p>
      </div>

      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-2">Revenue</h3>
        <p className="text-3xl font-bold text-purple-400">$24,567</p>
        <p className="text-sm text-slate-400 mt-1">This month</p>
      </div>
    </div>

    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      <h3 className="text-lg font-semibold text-white mb-4">Quick Stats</h3>
      <div className="text-slate-300">
        <p className="mb-2">✅ AdminLayout: Working</p>
        <p className="mb-2">🎯 Next: Create AdminDashboard component</p>
        <p className="mb-2">🎯 Next: Create AdminUsers component</p>
        <p className="mb-2">🎯 Next: Create AdminSettings component</p>
      </div>
    </div>
  </div>
);

// Temporary Admin Users Component
const TempAdminUsers = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-bold text-white mb-2">User Management</h1>
      <p className="text-slate-400">Manage platform users and subscriptions</p>
    </div>

    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      <p className="text-slate-300">User management interface coming soon...</p>
    </div>
  </div>
);

// Temporary Admin Settings Component
const TempAdminSettings = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-bold text-white mb-2">System Settings</h1>
      <p className="text-slate-400">Configure platform settings and features</p>
    </div>

    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      <p className="text-slate-300">Settings interface coming soon...</p>
    </div>
  </div>
);

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

                  {/* 🛡️ ADMIN ROUTES - NEW PROFESSIONAL INTERFACE */}
                  <Route
                    path="/admin"
                    element={
                      <AdminProtectedRoute>
                        <AdminLayout />
                      </AdminProtectedRoute>
                    }
                  >
                    <Route index element={<TempAdminDashboard />} />
                    <Route path="users" element={<TempAdminUsers />} />
                    <Route path="settings" element={<TempAdminSettings />} />
                  </Route>

                  {/* 🛡️ ADMIN TEST ROUTE - TEMPORARY BACKUP */}
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
                                <li>AdminLayout ✅ Working</li>
                                <li>AdminDashboard ✅ Working</li>
                                <li>User Management (In Progress)</li>
                              </ul>
                            </div>
                            <div className="mt-6">
                              <a
                                href="/admin"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                              >
                                → Go to New Admin Interface
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
              </SignalsProvider>
            </PositionsProvider>
          </AuthProvider>
        </LanguageProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
