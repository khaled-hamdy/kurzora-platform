// File: backend/api/signal-alerts/process.js
// API endpoint to process signal alerts triggered by database changes
// 🚀 PRODUCTION: Called by Supabase trigger when signals are inserted/updated

import { createClient } from "@supabase/supabase-js";
import fetch from "node-fetch";

// Initialize Supabase client for backend
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Missing Supabase configuration in backend");
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// 📧 Make.com Email webhook URL (same as used in frontend)
const EMAIL_WEBHOOK_URL =
  "https://hook.eu2.make.com/oatde944l01b32ng3ffxavgtfjcp1ffk";

// Calculate final score (copied from frontend utils)
function calculateFinalScore(signals) {
  const timeframes = ["1H", "4H", "1D", "1W"];
  const weights = { "1H": 0.2, "4H": 0.3, "1D": 0.3, "1W": 0.2 };

  let totalScore = 0;
  let totalWeight = 0;

  for (const timeframe of timeframes) {
    if (signals[timeframe] !== undefined && signals[timeframe] !== null) {
      totalScore += signals[timeframe] * weights[timeframe];
      totalWeight += weights[timeframe];
    }
  }

  return totalWeight > 0 ? Math.round(totalScore / totalWeight) : 0;
}

// Get eligible users for email alerts
async function getEligibleEmailUsers(signalScore) {
  try {
    const { data: users, error } = await supabase
      .from("users")
      .select(
        `
        id,
        email,
        subscription_tier,
        subscription_status,
        user_alert_settings (
          user_id,
          email_enabled,
          min_signal_score,
          max_alerts_per_day,
          trading_hours_only
        )
      `
      )
      .in("subscription_status", ["active", "trial"])
      .eq("user_alert_settings.email_enabled", true)
      .not("email", "is", null)
      .lte("user_alert_settings.min_signal_score", signalScore);

    if (error) {
      console.error("❌ Database error fetching eligible email users:", error);
      return [];
    }

    // Filter users by daily limits
    const filteredUsers = await filterEmailUsersByDailyLimits(users || []);
    console.log(
      `✅ Found ${filteredUsers.length} eligible users for email alerts`
    );

    return filteredUsers;
  } catch (error) {
    console.error("❌ Error fetching eligible email users:", error);
    return [];
  }
}

// Filter users by daily alert limits
async function filterEmailUsersByDailyLimits(users) {
  const today = new Date().toISOString().split("T")[0];
  const filteredUsers = [];

  for (const user of users) {
    try {
      const { count } = await supabase
        .from("alert_delivery_log")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("delivery_channel", "email")
        .gte("created_at", `${today}T00:00:00`)
        .lt("created_at", `${today}T23:59:59`);

      const alertsToday = count || 0;
      const maxAlerts = user.user_alert_settings?.max_alerts_per_day || 10;

      if (alertsToday < maxAlerts) {
        filteredUsers.push({
          id: user.id,
          email: user.email,
          subscription_tier: user.subscription_tier,
          subscription_status: user.subscription_status,
          alert_settings: user.user_alert_settings,
        });
      } else {
        console.log(
          `📧 User ${user.email} exceeded daily email limit (${alertsToday}/${maxAlerts})`
        );
      }
    } catch (error) {
      console.error(
        `❌ Error checking daily email limits for user ${user.id}:`,
        error
      );
    }
  }

  return filteredUsers;
}

// Send email webhook with real signal and user data
async function sendEmailWebhook(signal, finalScore, eligibleUsers) {
  if (!EMAIL_WEBHOOK_URL) {
    console.error("❌ Email webhook URL not configured");
    return false;
  }

  try {
    // Determine signal strength based on score
    let strength = "weak";
    if (finalScore >= 90) strength = "very_strong";
    else if (finalScore >= 80) strength = "strong";
    else if (finalScore >= 70) strength = "moderate";

    const payload = {
      signal_id: signal.id,
      symbol: signal.ticker || signal.symbol,
      final_score: finalScore,
      strength: strength,
      entry_price: signal.entry_price,
      stop_loss: signal.stop_loss,
      take_profit: signal.take_profit,
      signal_type: signal.signal_type || "bullish",
      alert_type: "signal_alert",
      timestamp: new Date().toISOString(),
      user_count: eligibleUsers.length,
      eligible_users: eligibleUsers.map((user) => ({
        user_id: user.id,
        user_email: user.email,
        subscription_tier: user.subscription_tier,
      })),
    };

    console.log(
      `📧 Sending email webhook for ${signal.ticker} to ${eligibleUsers.length} users...`
    );

    const response = await fetch(EMAIL_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      console.log(`✅ Email webhook sent successfully for ${signal.ticker}`);

      // Log alert deliveries
      await logEmailAlertDeliveries(signal.id, eligibleUsers);
      return true;
    } else {
      console.error(
        `❌ Email webhook failed for ${signal.ticker}:`,
        response.status,
        response.statusText
      );
      return false;
    }
  } catch (error) {
    console.error(
      `❌ Error sending email webhook for ${signal.ticker}:`,
      error
    );
    return false;
  }
}

// Log alert deliveries to database
async function logEmailAlertDeliveries(signalId, users) {
  try {
    const deliveryLogs = users.map((user) => ({
      user_id: user.id,
      signal_id: signalId,
      delivery_channel: "email",
      delivery_status: "sent",
      delivery_timestamp: new Date().toISOString(),
    }));

    const { error } = await supabase
      .from("alert_delivery_log")
      .insert(deliveryLogs);

    if (error) {
      console.error("❌ Error logging email alert deliveries:", error);
    } else {
      console.log(`📊 Logged ${deliveryLogs.length} email alert deliveries`);
    }
  } catch (error) {
    console.error("❌ Error in logEmailAlertDeliveries:", error);
  }
}

// Main API handler function
export async function processSignalAlerts(req, res) {
  console.log("🚀 Processing signal alerts API call...");

  try {
    const { type, table, record, old_record } = req.body;

    // Validate webhook payload from Supabase
    if (type !== "INSERT" && type !== "UPDATE") {
      return res.status(400).json({
        success: false,
        error: "Invalid webhook type. Expected INSERT or UPDATE.",
      });
    }

    if (table !== "trading_signals") {
      return res.status(400).json({
        success: false,
        error: "Invalid table. Expected trading_signals.",
      });
    }

    if (!record) {
      return res.status(400).json({
        success: false,
        error: "Missing record data.",
      });
    }

    const signal = record;
    console.log(
      `📊 Processing signal alert for ${signal.ticker} (ID: ${signal.id})`
    );

    // Validate signal has required data
    if (!signal.signals || !signal.ticker || !signal.entry_price) {
      console.log(`⚠️ Signal ${signal.ticker} missing required data structure`);
      return res.json({
        success: false,
        error: "Signal missing required data structure",
        processed: false,
      });
    }

    // Calculate final score
    const finalScore = calculateFinalScore(signal.signals);
    console.log(`📊 Calculated score for ${signal.ticker}: ${finalScore}`);

    // Check if signal meets alert criteria (≥80 score)
    if (finalScore < 80) {
      console.log(
        `📭 Signal ${signal.ticker} score ${finalScore} below threshold (80)`
      );
      return res.json({
        success: true,
        message: "Signal below alert threshold",
        processed: false,
        score: finalScore,
      });
    }

    // Get eligible users
    const eligibleUsers = await getEligibleEmailUsers(finalScore);

    if (eligibleUsers.length === 0) {
      console.log(`📭 No eligible users for ${signal.ticker}`);
      return res.json({
        success: true,
        message: "No eligible users for email alerts",
        processed: false,
        score: finalScore,
      });
    }

    // Send email alerts
    const emailSuccess = await sendEmailWebhook(
      signal,
      finalScore,
      eligibleUsers
    );

    return res.json({
      success: true,
      message: `Email alerts ${emailSuccess ? "sent" : "failed"} for ${
        signal.ticker
      }`,
      processed: emailSuccess,
      score: finalScore,
      userCount: eligibleUsers.length,
      emailSent: emailSuccess,
    });
  } catch (error) {
    console.error("❌ Error in processSignalAlerts:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
      message: error.message,
    });
  }
}
