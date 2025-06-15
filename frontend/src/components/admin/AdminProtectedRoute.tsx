
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        console.log('AdminProtectedRoute: No user, redirecting to home');
        navigate('/');
      } else if (!isAdmin()) {
        console.log('AdminProtectedRoute: User is not admin, redirecting to dashboard');
        navigate('/dashboard');
      }
    }
  }, [user, loading, isAdmin, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  if (!user || !isAdmin()) {
    return null;
  }

  return <>{children}</>;
};

export default AdminProtectedRoute;
