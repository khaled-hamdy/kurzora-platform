import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { User, Mail, Calendar, Shield, Lock } from 'lucide-react';
import ChangePasswordDialog from '../components/profile/ChangePasswordDialog';

const Profile: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  React.useEffect(() => {
    console.log('Profile page: Auth state - loading:', loading, 'user:', user);
    
    // Only redirect if not loading and no user
    if (!loading && !user) {
      console.log('Profile page: User not authenticated, redirecting to home');
      navigate('/');
    }
  }, [user, loading, navigate]);

  // Show loading spinner while authentication state is being determined
  if (loading) {
    console.log('Profile page: Still loading auth state');
    return (
      <Layout>
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
          <div className="text-white text-lg">Loading...</div>
        </div>
      </Layout>
    );
  }

  // Show nothing if no user (will redirect via useEffect)
  if (!user) {
    console.log('Profile page: No user found, should redirect');
    return null;
  }

  const handleChangePassword = () => {
    console.log('Opening change password dialog');
    setIsChangePasswordOpen(true);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Profile</h1>
          <p className="text-slate-400">Manage your account information</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
            <CardHeader>
              <CardTitle className="text-lg text-white flex items-center">
                <User className="h-5 w-5 mr-2 text-blue-400" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-slate-300">Name</Label>
                <Input 
                  value={user.name} 
                  className="bg-slate-700 border-slate-600 text-white mt-1"
                  readOnly
                />
              </div>
              <div>
                <Label className="text-slate-300">Email</Label>
                <Input 
                  value={user.email} 
                  className="bg-slate-700 border-slate-600 text-white mt-1"
                  readOnly
                />
              </div>
              <Button 
                onClick={handleChangePassword}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <Lock className="h-4 w-4 mr-2" />
                Change Password
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
            <CardHeader>
              <CardTitle className="text-lg text-white flex items-center">
                <Shield className="h-5 w-5 mr-2 text-green-400" />
                Subscription
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {user.subscription ? (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Plan</span>
                    <span className="text-green-400 font-medium">{user.subscription.tier}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Status</span>
                    <span className="text-green-400 font-medium">
                      {user.subscription.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Expires</span>
                    <span className="text-white">
                      {new Date(user.subscription.expiresAt).toLocaleDateString()}
                    </span>
                  </div>
                </>
              ) : (
                <div className="text-center py-4">
                  <p className="text-slate-400 mb-4">No active subscription</p>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Subscribe Now
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <ChangePasswordDialog 
        open={isChangePasswordOpen} 
        onOpenChange={setIsChangePasswordOpen} 
      />
    </Layout>
  );
};

export default Profile;
