// src/components/telegram/TelegramAlertBanner.tsx
// Compact banner for promoting Telegram alerts across the platform
// 🚀 PRODUCTION: Smart display based on user subscription and connection status

import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, CheckCircle, Crown, Zap, X } from "lucide-react";
import { useUserAlertSettings } from "@/hooks/useUserAlertSettings";

interface TelegramAlertBannerProps {
  onConnect?: () => void;
  onDismiss?: () => void;
  showOnSignalsPage?: boolean;
  className?: string;
}

const TelegramAlertBanner: React.FC<TelegramAlertBannerProps> = ({
  onConnect,
  onDismiss,
  showOnSignalsPage = false,
  className = "",
}) => {
  const {
    userProfile,
    loading,
    canUseTelegram,
    isConnected,
    canReceiveAlerts,
  } = useUserAlertSettings();

  // Don't show while loading
  if (loading) {
    return null;
  }

  // Connected users - show success status on signals page
  if (isConnected && showOnSignalsPage) {
    return (
      <Alert className={`bg-green-500/10 border-green-500/20 ${className}`}>
        <CheckCircle className="h-4 w-4 text-green-400" />
        <AlertDescription className="text-green-200 flex items-center justify-between">
          <div className="flex items-center">
            <span>
              Telegram alerts are active - you'll receive notifications for
              signals ≥80%
            </span>
            <Badge className="ml-2 bg-green-500/20 text-green-400 border-green-500/30 text-xs">
              <Zap className="h-3 w-3 mr-1" />
              Live
            </Badge>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  // Don't show banner to connected users in other contexts
  if (isConnected && !showOnSignalsPage) {
    return null;
  }

  // Professional users who aren't connected - show connect prompt
  if (canUseTelegram && !isConnected) {
    return (
      <Alert className={`bg-blue-500/10 border-blue-500/20 ${className}`}>
        <MessageSquare className="h-4 w-4 text-blue-400" />
        <AlertDescription className="text-blue-200 flex items-center justify-between">
          <div className="flex-1">
            <strong>Get instant Telegram alerts!</strong>
            <span className="ml-2">
              Never miss a high-probability signal again.
            </span>
          </div>
          <div className="flex items-center space-x-2 ml-4">
            <Button
              onClick={onConnect}
              size="sm"
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              <MessageSquare className="h-3 w-3 mr-1" />
              Connect
            </Button>
            {onDismiss && (
              <Button
                onClick={onDismiss}
                size="sm"
                variant="ghost"
                className="text-slate-400 hover:text-white h-8 w-8 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  // Starter users - show upgrade prompt
  if (userProfile?.subscription_tier === "starter") {
    return (
      <Alert className={`bg-purple-500/10 border-purple-500/20 ${className}`}>
        <Crown className="h-4 w-4 text-purple-400" />
        <AlertDescription className="text-purple-200 flex items-center justify-between">
          <div className="flex-1">
            <strong>Upgrade to Professional</strong>
            <span className="ml-2">
              Get instant Telegram alerts for premium signals.
            </span>
          </div>
          <div className="flex items-center space-x-2 ml-4">
            <Button
              size="sm"
              className="bg-purple-500 hover:bg-purple-600 text-white"
            >
              <Crown className="h-3 w-3 mr-1" />
              Upgrade
            </Button>
            {onDismiss && (
              <Button
                onClick={onDismiss}
                size="sm"
                variant="ghost"
                className="text-slate-400 hover:text-white h-8 w-8 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  // Don't show banner in other cases
  return null;
};

export default TelegramAlertBanner;
