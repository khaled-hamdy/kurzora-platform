
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
      <div className="text-center">
        <div className="mb-8">
          <img src="/lovable-uploads/cd45e587-857f-49d9-9e54-8f7ac9bb5792.png" alt="Kurzora Logo" className="h-20 w-auto mx-auto mb-4" />
        </div>
        <h1 className="text-6xl font-bold mb-4 text-white">404</h1>
        <p className="text-xl text-slate-400 mb-6">Oops! Page not found</p>
        <p className="text-slate-500 mb-8">The page you're looking for doesn't exist.</p>
        <a 
          href="/" 
          className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
        >
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
