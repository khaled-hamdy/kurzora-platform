// src/components/telegram/TelegramConnection.tsx
// Complete rewrite with uncontrolled input to fix focus issues
// 🚀 PRODUCTION: Step-by-step bot connection with subscription validation
// 🔧 REWRITTEN: Using useRef for input to prevent focus loss

import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  MessageSquare,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Copy,
  RefreshCw,
  Crown,
  Zap,
  TrendingUp,
} from "lucide-react";
import { useUserAlertSettings } from "@/hooks/useUserAlertSettings";

interface TelegramConnectionProps {
  className?: string;
}

const TelegramConnection: React.FC<TelegramConnectionProps> = ({
  className = "",
}) => {
  const {
    alertSettings,
    userProfile,
    loading,
    saving,
    error,
    canUseTelegram,
    isConnected,
    canReceiveAlerts,
    updateTelegramChatId,
    disableTelegramAlerts,
    refreshSettings,
    getAlertStats,
  } = useUserAlertSettings();

  const [showInstructions, setShowInstructions] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [alertStats, setAlertStats] = useState<any>(null);
  const [copyFeedback, setCopyFeedback] = useState("");

  // 🔧 FIX: Use uncontrolled input with ref instead of state
  const chatIdInputRef = useRef<HTMLInputElement>(null);

  const BOT_USERNAME = "@kurzora_alert_bot";
  const BOT_LINK = "https://t.me/kurzora_alert_bot";

  // Load alert statistics
  useEffect(() => {
    if (isConnected) {
      getAlertStats().then((stats) => setAlertStats(stats));
    }
  }, [isConnected, getAlertStats]);

  // Handle chat ID connection
  const handleConnect = async () => {
    const chatId = chatIdInputRef.current?.value?.trim();
    if (!chatId) {
      return;
    }

    setConnecting(true);
    const success = await updateTelegramChatId(chatId);

    if (success) {
      if (chatIdInputRef.current) {
        chatIdInputRef.current.value = "";
      }
      setShowInstructions(false);
    }

    setConnecting(false);
  };

  // Handle disconnect
  const handleDisconnect = async () => {
    const success = await disableTelegramAlerts();
    if (success) {
      setAlertStats(null);
    }
  };

  // Copy to clipboard helper
  const copyToClipboard = async (text: string, feedback: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyFeedback(feedback);
      setTimeout(() => setCopyFeedback(""), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  if (loading) {
    return (
      <Card
        className={`bg-slate-800/50 backdrop-blur-sm border-slate-700 ${className}`}
      >
        <CardContent className="p-8">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-slate-400" />
            <p className="text-slate-400">Loading Telegram settings...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Upgrade prompt for non-Professional users
  if (!canUseTelegram) {
    return (
      <Card
        className={`bg-slate-800/50 backdrop-blur-sm border-slate-700 hover:bg-slate-800/70 transition-all duration-300 ${className}`}
      >
        <CardContent className="p-8">
          <div className="text-center bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg border border-purple-500/20 p-8">
            <Crown className="h-16 w-16 mx-auto mb-4 text-purple-400" />
            <h3 className="text-xl font-semibold text-white mb-2">
              Upgrade to Professional
            </h3>
            <p className="text-slate-300 mb-6">
              Get instant Telegram alerts for high-probability trading signals.
              Never miss a profitable opportunity again.
            </p>
            <Button className="bg-purple-500 hover:bg-purple-600 text-white">
              <Crown className="h-4 w-4 mr-2" />
              Upgrade Now
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Connected status
  if (isConnected) {
    return (
      <Card
        className={`bg-slate-800/50 backdrop-blur-sm border-slate-700 hover:bg-slate-800/70 transition-all duration-300 ${className}`}
      >
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <div className="flex items-center">
              <MessageSquare className="h-5 w-5 mr-2 text-blue-400" />
              Telegram Alerts
              <Badge className="ml-2 bg-green-500/20 text-green-400 border-green-500/30">
                Connected
              </Badge>
            </div>
            {saving && (
              <RefreshCw className="h-4 w-4 animate-spin text-slate-400" />
            )}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <Alert className="bg-red-500/10 border-red-500/20">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <AlertDescription className="text-red-200">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <div className="text-center p-6 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg border border-green-500/20">
            <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-400" />
            <h3 className="text-xl font-semibold text-white mb-2">
              Telegram Connected!
            </h3>
            <p className="text-slate-300">
              You'll receive instant alerts for signals scoring 65% or higher
            </p>
          </div>

          {alertStats && (
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800/50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">
                    Alerts (7 days)
                  </span>
                  <TrendingUp className="h-4 w-4 text-blue-400" />
                </div>
                <p className="text-2xl font-bold text-white">
                  {alertStats.total_alerts_7_days || 0}
                </p>
              </div>
              <div className="bg-slate-800/50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">Success Rate</span>
                  <Zap className="h-4 w-4 text-green-400" />
                </div>
                <p className="text-2xl font-bold text-white">
                  {alertStats.success_rate?.toFixed(1) || 0}%
                </p>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Chat ID:</span>
              <code className="bg-slate-700 px-3 py-1 rounded text-green-400">
                {alertSettings?.telegram_chat_id}
              </code>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-300">Status:</span>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                {canReceiveAlerts ? "Active" : "Connected"}
              </Badge>
            </div>

            <div className="flex space-x-2 pt-4">
              <Button
                onClick={() => refreshSettings()}
                variant="outline"
                size="sm"
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button
                onClick={handleDisconnect}
                variant="outline"
                size="sm"
                className="border-red-600 text-red-400 hover:bg-red-500/10"
              >
                Disconnect
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Connection flow
  return (
    <Card
      className={`bg-slate-800/50 backdrop-blur-sm border-slate-700 hover:bg-slate-800/70 transition-all duration-300 ${className}`}
    >
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <div className="flex items-center">
            <MessageSquare className="h-5 w-5 mr-2 text-blue-400" />
            Telegram Alerts
          </div>
          {saving && (
            <RefreshCw className="h-4 w-4 animate-spin text-slate-400" />
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {error && (
          <Alert className="bg-red-500/10 border-red-500/20">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-200">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {!showInstructions ? (
          <div className="text-center space-y-4">
            <div className="p-6">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-slate-400" />
              <h3 className="text-lg font-medium text-white mb-2">
                Connect Telegram
              </h3>
              <p className="text-slate-400 mb-6">
                Get instant notifications when high-probability signals are
                detected
              </p>
              <Button
                onClick={() => setShowInstructions(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Connect Telegram Bot
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/20">
              <MessageSquare className="h-16 w-16 mx-auto mb-4 text-blue-400" />
              <h3 className="text-xl font-semibold text-white mb-2">
                Connect Your Telegram
              </h3>
              <p className="text-slate-300">
                Get instant trading signals delivered directly to your phone
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  1
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-white mb-2">
                    Open Telegram Bot
                  </h4>
                  <p className="text-slate-400 text-sm mb-3">
                    Click the button below to open our trading signals bot in
                    Telegram
                  </p>
                  <Button
                    onClick={() => window.open(BOT_LINK, "_blank")}
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                    size="sm"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open {BOT_USERNAME}
                  </Button>
                </div>
              </div>

              <Separator className="bg-slate-700" />

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  2
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-white mb-2">Start the Bot</h4>
                  <p className="text-slate-400 text-sm mb-3">
                    Send the{" "}
                    <code className="bg-slate-700 px-2 py-1 rounded text-blue-300">
                      /start
                    </code>{" "}
                    command to the bot
                  </p>
                  <Button
                    onClick={() => copyToClipboard("/start", "Command copied!")}
                    variant="outline"
                    size="sm"
                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy /start
                  </Button>
                  {copyFeedback && (
                    <span className="ml-2 text-green-400 text-sm">
                      {copyFeedback}
                    </span>
                  )}
                </div>
              </div>

              <Separator className="bg-slate-700" />

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  3
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-white mb-2">
                    Get Your Chat ID
                  </h4>
                  <p className="text-slate-400 text-sm mb-3">
                    The bot will send you a message with your Chat ID. Copy that
                    number and paste it below.
                  </p>
                  <div className="space-y-3">
                    {/* 🔧 FIX: Uncontrolled input with ref */}
                    <input
                      ref={chatIdInputRef}
                      type="text"
                      placeholder="Enter your Chat ID (e.g., 123456789)"
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      autoComplete="off"
                    />
                    <div className="flex space-x-2">
                      <Button
                        onClick={handleConnect}
                        disabled={connecting}
                        className="bg-green-500 hover:bg-green-600 text-white"
                      >
                        {connecting ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            Connecting...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Connect Telegram
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={() => setShowInstructions(false)}
                        variant="outline"
                        className="border-slate-600 text-slate-300 hover:bg-slate-700"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Alert className="bg-blue-500/10 border-blue-500/20">
              <AlertCircle className="h-4 w-4 text-blue-400" />
              <AlertDescription className="text-blue-200">
                Your Chat ID is unique to your Telegram account and allows us to
                send alerts directly to you. We never share this information or
                use it for any purpose other than delivering trading signals.
              </AlertDescription>
            </Alert>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TelegramConnection;
