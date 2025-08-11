import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Mail, Lock, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface LoginFormProps {
  onSwitchToSignup: () => void;
}

/**
 * 🎯 PURPOSE: Login form component for user authentication
 * 🔧 SESSION #204: Removed Google authentication per user request
 * 🛡️ PRESERVATION: All email/password authentication functionality intact
 * 📝 HANDOVER: This component handles user login with email/password only
 */
const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToSignup }) => {
  // Authentication hook from AuthContext (Session #191 enhanced version)
  const { signIn, loading } = useAuth();

  // Form state management for email and password
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Error state for displaying authentication errors
  const [error, setError] = useState<string | null>(null);

  /**
   * Handle form submission for email/password authentication
   * 🛡️ PRESERVATION: Core authentication logic unchanged
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      console.log("LoginForm: Submitting login form");
      const result = await signIn(formData.email, formData.password);
      if (result.error) {
        throw new Error(result.error);
      }
      console.log("LoginForm: Sign in successful, showing success message");
      toast.success("Welcome back! Logged in successfully.");

      // Don't redirect immediately - let the auth state change handle it
      // 📝 HANDOVER: AuthContext handles redirect after successful authentication
      console.log("LoginForm: Waiting for auth state to update and redirect");
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Login failed. Please check your credentials.";
      console.error("LoginForm: Login error:", errorMessage);
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  /**
   * Handle input field changes
   * Updates form state as user types
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <Card className="w-full max-w-md bg-slate-900/50 backdrop-blur-sm border-blue-800/30">
      <CardHeader className="space-y-1">
        <div className="flex justify-center mb-4">
          <img
            src="/kurzora-logo.svg"
            alt="Kurzora Logo"
            className="h-12 w-auto"
          />
        </div>
        <CardTitle className="text-2xl text-center text-white">
          Welcome back
        </CardTitle>
        <CardDescription className="text-center text-slate-400">
          Sign in to your Kurzora account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Error Message Container - displays authentication errors */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Main login form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email input field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-300">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="pl-10 bg-slate-800/50 border-blue-800/30 text-white placeholder-slate-400"
                required
              />
            </div>
          </div>

          {/* Password input field */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-slate-300">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className="pl-10 bg-slate-800/50 border-blue-800/30 text-white placeholder-slate-400"
                required
              />
            </div>
          </div>

          {/* Submit button - shows loading state during authentication */}
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

        {/* Sign up link for new users */}
        <div className="text-center text-sm mt-6">
          <span className="text-slate-400">Don't have an account? </span>
          <button
            onClick={onSwitchToSignup}
            className="text-blue-400 hover:text-blue-300 font-medium"
          >
            Sign up
          </button>
        </div>

        {/* Forgot password link */}
        <div className="text-center">
          <button className="text-sm text-slate-400 hover:text-slate-300">
            Forgot your password?
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
