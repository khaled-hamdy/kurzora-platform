import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({
  children,
}) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Check if user is admin
  const isAdmin = () => {
    if (!user) return false;

    // Check multiple ways a user can be admin:
    // 1. has_admin_access field in user metadata
    // 2. email in admin list (for initial setup)
    // 3. user role is 'admin'
    const adminEmails = [
      "admin@kurzora.com",
      "khaled@kurzora.com",
      "khaledhamdy@gmail.com",
      "test@kurzora.com", // Add your test email
      // Add your actual email here
    ];

    return (
      user.user_metadata?.has_admin_access === true ||
      user.user_metadata?.role === "admin" ||
      adminEmails.includes(user.email || "")
    );
  };

  useEffect(() => {
    if (!loading) {
      if (!user) {
        console.log("AdminProtectedRoute: No user, redirecting to home");
        navigate("/");
      } else if (!isAdmin()) {
        console.log(
          "AdminProtectedRoute: User is not admin, redirecting to dashboard"
        );
        navigate("/dashboard");
      }
    }
  }, [user, loading, navigate]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center">
        <div className="text-white text-lg">Checking admin access...</div>
      </div>
    );
  }

  // Not logged in or not admin
  if (!user || !isAdmin()) {
    return null;
  }

  // User is admin, show admin content
  return <>{children}</>;
};

export default AdminProtectedRoute;
