import React, { useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { AlertCircle, CheckCircle, Eye, EyeOff } from "lucide-react";

// ==================================================================================
// 🛡️ SECURE CHANGE PASSWORD MODAL - ENHANCED WITH CURRENT PASSWORD VERIFICATION
// ==================================================================================
// 🔧 SECURITY ENHANCEMENT: Added proper current password verification before update
// 🛡️ PRESERVATION: All existing UI, styling, validation, and user experience maintained exactly
// 📝 HANDOVER: Complete security implementation with real re-authentication flow
// 🚨 CRITICAL: Production-ready security enhancement with comprehensive error handling

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  onClose,
}) => {
  // 🔧 SECURITY ENHANCEMENT: Get current user for re-authentication
  // 🎯 PURPOSE: Required for verifying current password before update
  const { user } = useAuth();

  // 🛡️ PRESERVATION: All existing state management maintained exactly
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 🛡️ PRESERVATION: Existing form validation logic maintained exactly
  const isValidPassword = newPassword.length >= 6;
  const doPasswordsMatch = newPassword === confirmPassword;
  const isFormValid = currentPassword && isValidPassword && doPasswordsMatch;

  // 🔧 SECURITY ENHANCEMENT: Secure password update with current password verification
  // 🎯 PURPOSE: Verify current password before allowing update - prevents unauthorized changes
  // 📝 HANDOVER: Two-step process: re-authenticate, then update password
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid) return;

    // 🔧 SECURITY CHECK: Ensure user email is available for re-authentication
    if (!user?.email) {
      setError("Unable to verify user identity. Please log in again.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // 🔧 STEP 1: VERIFY CURRENT PASSWORD - Re-authenticate user with current password
      // 🎯 PURPOSE: Confirm user knows their current password before allowing change
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });

      if (signInError) {
        // 🔧 SECURITY: Handle incorrect current password with clear error message
        throw new Error("Current password is incorrect. Please try again.");
      }

      // 🔧 STEP 2: UPDATE TO NEW PASSWORD - Only proceed if current password verified
      // 🎯 PURPOSE: Secure password update after successful re-authentication
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        throw updateError;
      }

      // 🛡️ PRESERVATION: Existing success handling maintained exactly
      setSuccess(true);

      // Clear form
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      // Close modal after 2 seconds
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2000);
    } catch (err) {
      // 🔧 ENHANCED ERROR HANDLING: Clear error messages for security failures
      console.error("Password update error:", err);
      setError(
        err instanceof Error ? err.message : "Failed to update password"
      );
    } finally {
      setLoading(false);
    }
  };

  // 🛡️ PRESERVATION: Existing modal close handler maintained exactly
  const handleClose = () => {
    if (loading) return; // Prevent closing while loading

    // Reset form state
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
    setSuccess(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-slate-800 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Change Password
          </DialogTitle>
        </DialogHeader>

        {success ? (
          // 🛡️ PRESERVATION: Existing success state UI maintained exactly
          <div className="py-6 text-center">
            <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">
              Password Updated Successfully!
            </h3>
            <p className="text-slate-400 text-sm">
              Your password has been changed. This modal will close
              automatically.
            </p>
          </div>
        ) : (
          // 🛡️ PRESERVATION: Existing form UI and validation maintained exactly
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Current Password */}
            <div className="space-y-2">
              <Label
                htmlFor="current-password"
                className="text-sm font-medium text-slate-300"
              >
                Current Password
              </Label>
              <div className="relative">
                <Input
                  id="current-password"
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter your current password"
                  className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showCurrentPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <Label
                htmlFor="new-password"
                className="text-sm font-medium text-slate-300"
              >
                New Password
              </Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter your new password"
                  className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {newPassword && !isValidPassword && (
                <p className="text-red-400 text-xs">
                  Password must be at least 6 characters long
                </p>
              )}
            </div>

            {/* Confirm New Password */}
            <div className="space-y-2">
              <Label
                htmlFor="confirm-password"
                className="text-sm font-medium text-slate-300"
              >
                Confirm New Password
              </Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your new password"
                  className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {confirmPassword && !doPasswordsMatch && (
                <p className="text-red-400 text-xs">Passwords do not match</p>
              )}
            </div>

            {/* 🛡️ PRESERVATION: Existing error display maintained exactly */}
            {error && (
              <div className="flex items-center space-x-2 text-red-400 text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}

            {/* 🛡️ PRESERVATION: Existing button layout and styling maintained exactly */}
            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={loading}
                className="flex-1 bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!isFormValid || loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Updating...</span>
                  </div>
                ) : (
                  "Update Password"
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
