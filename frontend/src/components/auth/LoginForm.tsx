import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface LoginFormProps {
  onSwitchToSignup: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToSignup }) => {
  const { login, loading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(formData.email, formData.password);
      toast.success('Welcome back! Logged in successfully.');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed. Please check your credentials.';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleGoogleSignIn = async () => {
    try {
      setError(null);
      setIsGoogleLoading(true);
      
      // TODO: Connect to backend logic via /src/backend-functions/GoogleAuth.ts
      console.log('Attempting Google sign-in...');
      
      // Mock Google sign-in for now - replace with actual Firebase implementation
      const mockUser = {
        uid: 'google_' + Date.now(),
        email: 'user@gmail.com',
        displayName: 'Google User',
        photoURL: null
      };
      
      // Simulate checking if user exists in database
      const userExists = Math.random() > 0.5; // Random for demo
      
      if (!userExists) {
        // New user - redirect to plan selection
        window.location.href = '/pricing';
      } else {
        // Existing user - redirect to dashboard
        await login(mockUser.email, 'google-auth');
        toast.success('Successfully signed in with Google!');
      }
    } catch (error) {
      console.error('Google sign-in error:', error);
      setError('Failed to sign in with Google. Please try again.');
      toast.error('Failed to sign in with Google. Please try again.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md bg-slate-900/50 backdrop-blur-sm border-blue-800/30">
      <CardHeader className="space-y-1">
        <div className="flex justify-center mb-4">
          <img src="/kurzora-logo.svg" alt="Kurzora Logo" className="h-12 w-auto" />
        </div>
        <CardTitle className="text-2xl text-center text-white">Welcome back</CardTitle>
        <CardDescription className="text-center text-slate-400">
          Sign in to your Kurzora account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Error Message Container */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-300">Email</Label>
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
          
          <div className="space-y-2">
            <Label htmlFor="password" className="text-slate-300">Password</Label>
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
              'Sign In'
            )}
          </Button>
        </form>
        
        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-slate-900 text-gray-400">OR CONTINUE WITH</span>
            </div>
          </div>
          
          <button 
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading}
            className="mt-6 w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-700 rounded-lg hover:bg-gray-800/50 transition-colors text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGoogleLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            <span>{isGoogleLoading ? 'Signing in...' : 'Continue with Google'}</span>
          </button>
        </div>
        
        <div className="text-center text-sm">
          <span className="text-slate-400">Don't have an account? </span>
          <button 
            onClick={onSwitchToSignup}
            className="text-blue-400 hover:text-blue-300 font-medium"
          >
            Sign up
          </button>
        </div>
        
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
