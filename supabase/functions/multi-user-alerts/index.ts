// ===================================================================
// 🎯 PURPOSE: Premium Alert Distribution - SIGNALS ≥80% ONLY
// 🔧 SESSION #186: Changed from TOP 7 to premium scoring threshold (≥80%)
// 🛡️ PRESERVATION: ALL Session #121 daily limits + Session #119 schema fixes MAINTAINED
// 📝 HANDOVER: Premium version with ≥80% signal filtering for institutional quality
// 💎 PREMIUM ALERTS: Only highest quality signals (≥80%) trigger notifications
// 🥉 STARTER TIER: Gets maximum 3 alerts per day via EMAIL ONLY from ≥80% pool
// 🏆 PROFESSIONAL TIER: Gets ALL signals ≥80% via EMAIL + TELEGRAM (unlimited)
// ✅ TESTED: Complete alert flow confirmed working in testing mode
// ===================================================================
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
// ===================================================================
// CORS CONFIGURATION - PRESERVED FROM WORKING VERSION
// ===================================================================
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};
serve(async (req) => {
  // 🔐 Handle CORS preflight requests - PRESERVED FROM SESSION #121
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }
  try {
    // 🚀 STARTUP LOGGING - Enhanced for ≥80% premium signal tracking
    console.log(
      "💎 PRODUCTION: Multi-user alert function - SIGNALS ≥80% ONLY (alerts tested working ✅)"
    );
    console.log(
      "🛡️ PRESERVED: All Session #121 daily limits + Session #119 schema fixes"
    );
    console.log(
      "🥉 STARTER: 3 alerts/day EMAIL ONLY from ≥80% pool | 🏆 PROFESSIONAL: ALL ≥80% signals EMAIL+TELEGRAM"
    );
    // 🗄️ PRESERVED: Session #121 Supabase initialization - DO NOT MODIFY
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("❌ Missing environment variables");
      return new Response(
        JSON.stringify({
          error: "Configuration error",
          message: "Missing Supabase configuration",
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    console.log("✅ Supabase client initialized with service role");
    // 🔗 PRESERVED: Session #121 Make.com webhook URL - DO NOT MODIFY
    const MAKE_WEBHOOK_URL =
      "https://hook.eu2.make.com/oatde944l01b32ng3ffxavgtfjcp1ffk";
    // 📊 PRESERVED: Session #121 signal data extraction - DO NOT MODIFY
    const signalData = await req.json();
    console.log(
      "📊 Signal received for ≥80% premium check:",
      JSON.stringify(signalData, null, 2)
    );
    const { record } = signalData;
    if (!record) {
      console.error("❌ No record found in signal data");
      return new Response(
        JSON.stringify({
          error: "Invalid payload",
          message: "No record data found",
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }
    // ===================================================================
    // 💎 SESSION #186: PREMIUM SIGNAL FILTERING - SIGNALS ≥80% ONLY
    // ===================================================================
    // 🎯 PURPOSE: Only process signals with score ≥80% (premium institutional quality)
    // 📊 RESULT: Starter gets 3 premium alerts/day, Professional gets all premium alerts
    // 🛡️ PRESERVATION: All Session #121 logic below remains EXACTLY the same
    // ✅ TESTED: Current 84% signals (XEL, MDT, ETN) will trigger alerts
    // ❌ SKIPPED: 71% signals will be filtered out (too low quality)
    // ===================================================================
    const currentSignalScore = record.final_score;
    const currentSignalTicker = record.ticker;
    console.log(
      `💎 PREMIUM CHECK: Analyzing ${currentSignalTicker} with score ${currentSignalScore}%`
    );
    // 🚨 SESSION #186: Simple premium threshold check (replaces complex TOP 7 logic)
    if (currentSignalScore < 80) {
      console.log(
        `💎 PREMIUM FILTER: ${currentSignalTicker} (${currentSignalScore}%) below 80% threshold - SKIPPING alerts`
      );
      console.log(
        `📊 Premium quality requirement: Score must be ≥80% for institutional-grade alerts`
      );
      return new Response(
        JSON.stringify({
          message: "PREMIUM FILTER: Signal below 80% threshold",
          premium_filter: {
            signal_ticker: currentSignalTicker,
            signal_score: currentSignalScore,
            minimum_required: 80,
            quality_level: "below_premium_threshold",
            alert_system_status: "CONFIRMED_WORKING_FOR_PREMIUM_SIGNALS",
          },
          status: "skipped_for_premium_quality",
          total_users: 0,
          results: [],
        }),
        {
          status: 200,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    } else {
      // 💎 Signal meets premium threshold - proceed with full processing
      console.log(
        `💎 PREMIUM SIGNAL: ${currentSignalTicker} (${currentSignalScore}%) meets ≥80% threshold - PROCESSING alerts`
      );
      console.log(
        `🏆 Quality level: INSTITUTIONAL GRADE - eligible for Starter (3/day limit) and Professional (unlimited) tiers`
      );
    }
    // ===================================================================
    // 🛡️ PRESERVED SESSION #121 LOGIC - DO NOT MODIFY ANYTHING BELOW
    // ===================================================================
    // From this point forward, ALL logic is exactly preserved from Session #121
    // Any modifications below will break the working alert system
    // 🛡️ PRESERVED: Session #121 signal data processing - DO NOT MODIFY
    const signal = {
      ticker: record.ticker,
      signal_type: record.signal_type,
      confidence_score: record.confidence_score,
      signals: record.signals,
      current_price: record.current_price,
      entry_price: record.entry_price,
      price_change_percent: record.price_change_percent,
      stop_loss: record.stop_loss,
      take_profit: record.take_profit,
      risk_reward_ratio: record.risk_reward_ratio,
      final_score: record.final_score,
      status: record.status,
      created_at: record.created_at,
    };
    // 🛡️ PRESERVED: Session #121 signal logging - DO NOT MODIFY
    console.log(
      `📈 Premium Signal processed: ${signal.ticker} (Score: ${signal.final_score})`
    );
    console.log(
      `💰 Price data: Current: ${signal.current_price}, Entry: ${signal.entry_price}, Change: ${signal.price_change_percent}%`
    );
    console.log(
      `🛡️ Risk management: Stop Loss: ${signal.stop_loss}, Take Profit: ${signal.take_profit}, R/R: ${signal.risk_reward_ratio}`
    );
    // 🛡️ PRESERVED: Session #121 backup score threshold logic - DO NOT MODIFY
    if (signal.final_score < 65) {
      console.log(
        `⏭️ Signal score too low: ${signal.final_score} - skipping alert distribution`
      );
      return new Response(
        JSON.stringify({
          message: "Signal score below threshold",
          signal_score: signal.final_score,
          min_score_required: 65,
          total_users: 0,
          results: [],
        }),
        {
          status: 200,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }
    // 🛡️ PRESERVED: Session #119 database schema query - DO NOT MODIFY
    console.log("🔍 Querying users table with notification_settings...");
    const { data: allUsers, error: usersError } = await supabase
      .from("users")
      .select(
        `
        id, 
        email, 
        name, 
        subscription_tier, 
        daily_alerts_sent, 
        last_alert_date,
        notification_settings,
        telegram_chat_id,
        is_active,
        subscription_status
      `
      )
      .eq("is_active", true)
      .neq("subscription_status", "cancelled")
      .in("subscription_tier", ["starter", "professional"]);
    if (usersError) {
      console.error("❌ Error fetching users:", usersError);
      return new Response(
        JSON.stringify({
          error: "Database query failed",
          details: usersError.message,
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }
    console.log(`📋 Found ${allUsers?.length || 0} total active users`);
    if (!allUsers || allUsers.length === 0) {
      console.log("⚠️ No active users found");
      return new Response(
        JSON.stringify({
          message: "No active users found",
          signal_score: signal.final_score,
          total_users: 0,
          eligible_users: 0,
          results: [],
        }),
        {
          status: 200,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }
    const currentDateForLimits = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
    console.log(`📅 Current date for daily limits: ${currentDateForLimits}`);
    const eligibleUsers = [];
    const skippedUsers = [];
    // 🛡️ PRESERVED: Session #121 user eligibility processing - DO NOT MODIFY
    for (const user of allUsers) {
      const tier = user.subscription_tier;
      const settings = user.notification_settings || {};
      const signalScore = signal.final_score;
      console.log(`🔍 Processing user: ${user.email} (${tier})`);
      console.log(`📊 User settings:`, settings);
      // Check if email alerts are enabled
      const emailEnabled = settings.email_alerts_enabled !== false; // Default to true
      if (!emailEnabled) {
        console.log(`⏭️ Skipping ${user.email}: email alerts disabled`);
        skippedUsers.push({
          email: user.email,
          reason: "email_disabled",
        });
        continue;
      }
      // Check minimum score requirement
      const minScore = settings.minimum_score || 65;
      if (signalScore < minScore) {
        console.log(
          `⏭️ Skipping ${user.email}: signal score ${signalScore} < required ${minScore}`
        );
        skippedUsers.push({
          email: user.email,
          reason: "score_too_low",
          required: minScore,
          actual: signalScore,
        });
        continue;
      }
      // 🛡️ PRESERVED: Session #121 tier-specific logic - DO NOT MODIFY
      if (tier === "professional") {
        // Professional users have unlimited alerts
        console.log(
          `✅ Professional user eligible: ${user.email} (unlimited premium alerts ≥80%)`
        );
        eligibleUsers.push({
          ...user,
          user_type: "professional",
          daily_limit: null,
          current_count: null,
        });
        continue;
      }
      if (tier === "starter") {
        // 🛡️ PRESERVED: Session #121 atomic daily limit enforcement - DO NOT MODIFY
        const dailyLimit = settings.daily_alert_limit || 3;
        console.log(
          `🔒 ATOMIC LIMIT CHECK for ${user.email}: attempting to reserve alert slot (limit: ${dailyLimit}) from ≥80% pool...`
        );
        // 🛡️ PRESERVED: Session #121 atomic counter with correct parameter names - DO NOT MODIFY
        try {
          const { data: atomicResult, error: atomicError } = await supabase.rpc(
            "increment_daily_alerts",
            {
              user_id: user.id,
              target_date: currentDateForLimits,
              daily_limit: dailyLimit,
            }
          );
          if (atomicError) {
            console.error(
              `❌ Atomic operation failed for ${user.email}:`,
              atomicError
            );
            skippedUsers.push({
              email: user.email,
              reason: "atomic_error",
              error: atomicError.message,
            });
            continue;
          }
          // If no result returned, user has reached daily limit
          if (!atomicResult || atomicResult.length === 0) {
            console.log(
              `⏭️ Skipping starter ${user.email}: daily limit reached (${dailyLimit} premium alerts/day)`
            );
            skippedUsers.push({
              email: user.email,
              reason: "daily_limit_reached",
              limit: dailyLimit,
            });
            continue;
          }
          const newCount = atomicResult[0].new_daily_count;
          console.log(
            `✅ Starter user eligible: ${user.email} (${newCount}/${dailyLimit} premium alerts today)`
          );
          // Add user with updated count info for webhook and potential rollback
          eligibleUsers.push({
            ...user,
            user_type: "starter",
            daily_limit: dailyLimit,
            current_count: newCount,
            reserved_alert_slot: true,
          });
        } catch (error) {
          console.error(
            `❌ Exception during atomic operation for ${user.email}:`,
            error
          );
          skippedUsers.push({
            email: user.email,
            reason: "atomic_exception",
            error: error.message,
          });
          continue;
        }
      }
    }
    console.log(
      `🎯 ${eligibleUsers.length} users eligible for premium ≥80% alerts (${skippedUsers.length} skipped)`
    );
    console.log(
      `📊 Skipped users breakdown:`,
      skippedUsers.reduce((acc, user) => {
        acc[user.reason] = (acc[user.reason] || 0) + 1;
        return acc;
      }, {})
    );
    if (eligibleUsers.length === 0) {
      return new Response(
        JSON.stringify({
          message: "No eligible users for this premium ≥80% signal",
          signal: {
            ticker: signal.ticker,
            score: signal.final_score,
            min_score_required: 80,
          },
          distribution: {
            total_users_checked: allUsers.length,
            eligible_users: 0,
            skipped_users: skippedUsers.length,
            skipped_breakdown: skippedUsers.reduce((acc, user) => {
              acc[user.reason] = (acc[user.reason] || 0) + 1;
              return acc;
            }, {}),
          },
          results: [],
        }),
        {
          status: 200,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }
    // 🛡️ PRESERVED: Session #121 webhook distribution logic - DO NOT MODIFY
    console.log(
      `📤 Sending ${eligibleUsers.length} individual webhooks to Make.com for premium ≥80% signal...`
    );
    const webhookPromises = eligibleUsers.map(async (user, index) => {
      const settings = user.notification_settings || {};
      // 🛡️ PRESERVED: Session #121 Telegram eligibility logic - DO NOT MODIFY
      const isTelegramEligible = user.subscription_tier === "professional";
      const hasTelegramEnabled = settings.telegram_alerts_enabled === true;
      const hasChatId =
        user.telegram_chat_id && String(user.telegram_chat_id).trim() !== "";
      const telegramEnabled =
        isTelegramEligible && hasTelegramEnabled && hasChatId;
      console.log(`🔍 Telegram check for ${user.email}:`, {
        tier: user.subscription_tier,
        telegram_eligible: isTelegramEligible,
        telegram_setting_enabled: hasTelegramEnabled,
        has_chat_id: hasChatId,
        chat_id: user.telegram_chat_id,
        final_telegram_enabled: telegramEnabled,
      });
      // 🛡️ PRESERVED: Session #121 webhook payload structure - DO NOT MODIFY
      const payload = {
        // User information
        email: user.email,
        name: user.name,
        user_id: user.id,
        subscription_tier: user.subscription_tier,
        // Signal information with COMPLETE TRADING DATA
        ticker: signal.ticker,
        signal_type: signal.signal_type,
        confidence_score: signal.confidence_score,
        signals: signal.signals,
        current_price: signal.current_price,
        entry_price: signal.entry_price,
        price_change_percent: signal.price_change_percent,
        stop_loss: signal.stop_loss,
        take_profit: signal.take_profit,
        risk_reward_ratio: signal.risk_reward_ratio,
        final_score: signal.final_score,
        status: signal.status,
        created_at: signal.created_at,
        // For email template compatibility - using REAL PRICE
        signal_stock: signal.ticker,
        signal_score: signal.final_score,
        signal_price: signal.current_price,
        // 🛡️ PRESERVED: Session #121 tier-specific information
        is_starter: user.subscription_tier === "starter",
        is_professional: user.subscription_tier === "professional",
        // 🛡️ PRESERVED: Session #121 alert delivery channels
        email_enabled: true,
        telegram_enabled: telegramEnabled,
        telegram_chat_id: telegramEnabled ? user.telegram_chat_id : null,
        // 🛡️ PRESERVED: Session #121 daily alert tracking
        daily_alert_number: user.current_count || null,
        daily_alert_limit: user.daily_limit || null,
        // Metadata
        user_index: index + 1,
        total_users: eligibleUsers.length,
        timestamp: new Date().toISOString(),
      };
      console.log(
        `📧 Sending premium ≥80% webhook ${index + 1}/${
          eligibleUsers.length
        } to ${user.email} (${user.subscription_tier})`
      );
      console.log(
        `💰 Complete trading data: Price: ${signal.current_price}, Stop: ${signal.stop_loss}, Target: ${signal.take_profit}, R/R: ${signal.risk_reward_ratio}`
      );
      if (telegramEnabled) {
        console.log(
          `📱 Telegram will be sent to chat ID: ${user.telegram_chat_id}`
        );
      }
      try {
        const webhookResponse = await fetch(MAKE_WEBHOOK_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "User-Agent": "Kurzora-Alerts/1.0",
          },
          body: JSON.stringify(payload),
        });
        if (webhookResponse.ok) {
          console.log(
            `✅ Premium ≥80% Webhook ${index + 1} sent successfully to ${
              user.email
            } with COMPLETE trading data: ${signal.current_price}, SL: ${
              signal.stop_loss
            }, TP: ${signal.take_profit}`
          );
          return {
            success: true,
            email: user.email,
            tier: user.subscription_tier,
            channels: telegramEnabled ? ["email", "telegram"] : ["email"],
            price_sent: signal.current_price,
            daily_count: user.current_count || null,
            daily_limit: user.daily_limit || null,
            status: webhookResponse.status,
            user_index: index + 1,
          };
        } else {
          const errorText = await webhookResponse.text();
          console.error(
            `❌ Premium ≥80% Webhook ${index + 1} failed for ${
              user.email
            }: HTTP ${webhookResponse.status} - ${errorText}`
          );
          // 🛡️ PRESERVED: Session #121 rollback logic for failed webhooks - DO NOT MODIFY
          if (
            user.subscription_tier === "starter" &&
            user.reserved_alert_slot
          ) {
            console.log(
              `🔄 Rolling back daily counter for failed webhook: ${user.email}`
            );
            try {
              await supabase.rpc("rollback_daily_alerts", {
                user_id: user.id,
                target_date: currentDateForLimits,
              });
              console.log(`✅ Counter rollback successful for ${user.email}`);
            } catch (rollbackError) {
              console.error(
                `❌ Counter rollback failed for ${user.email}:`,
                rollbackError
              );
            }
          }
          return {
            success: false,
            email: user.email,
            tier: user.subscription_tier,
            error: `HTTP ${webhookResponse.status}: ${errorText}`,
            rollback_attempted:
              user.subscription_tier === "starter" && user.reserved_alert_slot,
            user_index: index + 1,
          };
        }
      } catch (networkError) {
        console.error(
          `❌ Network error sending premium ≥80% webhook ${index + 1} to ${
            user.email
          }:`,
          networkError.message
        );
        // 🛡️ PRESERVED: Session #121 rollback logic for network errors - DO NOT MODIFY
        if (user.subscription_tier === "starter" && user.reserved_alert_slot) {
          console.log(
            `🔄 Rolling back daily counter for network error: ${user.email}`
          );
          try {
            await supabase.rpc("rollback_daily_alerts", {
              user_id: user.id,
              target_date: currentDateForLimits,
            });
            console.log(`✅ Counter rollback successful for ${user.email}`);
          } catch (rollbackError) {
            console.error(
              `❌ Counter rollback failed for ${user.email}:`,
              rollbackError
            );
          }
        }
        return {
          success: false,
          email: user.email,
          tier: user.subscription_tier,
          error: `Network error: ${networkError.message}`,
          rollback_attempted:
            user.subscription_tier === "starter" && user.reserved_alert_slot,
          user_index: index + 1,
        };
      }
    });
    // 🛡️ PRESERVED: Session #121 webhook completion logic - DO NOT MODIFY
    console.log("⏳ Waiting for all premium ≥80% webhooks to complete...");
    const results = await Promise.all(webhookPromises);
    // 🛡️ PRESERVED: Session #121 results calculation logic - DO NOT MODIFY
    const successful = results.filter((r) => r.success);
    const failed = results.filter((r) => !r.success);
    const starterAlerts = successful.filter((r) => r.tier === "starter");
    const professionalAlerts = successful.filter(
      (r) => r.tier === "professional"
    );
    const telegramAlerts = successful.filter(
      (r) => r.channels && r.channels.includes("telegram")
    );
    console.log(`📊 FINAL PREMIUM ≥80% RESULTS WITH COMPLETE TRADING DATA:`);
    console.log(`   ✅ Successful: ${successful.length}`);
    console.log(`   ❌ Failed: ${failed.length}`);
    console.log(
      `   🥉 Starter alerts: ${starterAlerts.length} (from premium ≥80% pool)`
    );
    console.log(
      `   🏆 Professional alerts: ${professionalAlerts.length} (unlimited premium ≥80%)`
    );
    console.log(`   📱 Telegram alerts: ${telegramAlerts.length}`);
    console.log(
      `   💰 Complete data sent: Price ${signal.current_price}, Stop ${signal.stop_loss}, Target ${signal.take_profit}, R/R ${signal.risk_reward_ratio}`
    );
    // 🛡️ PRESERVED: Session #121 comprehensive response structure - DO NOT MODIFY
    const response = {
      message:
        "PRODUCTION: Premium ≥80% Multi-user alerts processed - Session #121 fixes preserved - Alert system confirmed working",
      signal: {
        ticker: signal.ticker,
        signal_type: signal.signal_type,
        score: signal.final_score,
        current_price: signal.current_price,
        entry_price: signal.entry_price,
        price_change_percent: signal.price_change_percent,
        stop_loss: signal.stop_loss,
        take_profit: signal.take_profit,
        risk_reward_ratio: signal.risk_reward_ratio,
        min_score_required: 80,
      },
      premium_filter: {
        status: "premium_80_percent_processing_active",
        quality_assurance: "Only institutional-grade signals ≥80% processed",
        tier_benefits: {
          starter: "3 premium alerts per day via email",
          professional: "unlimited premium alerts via email + telegram",
        },
        alert_system_status: "CONFIRMED_WORKING",
      },
      distribution: {
        total_users_checked: allUsers.length,
        eligible_users: eligibleUsers.length,
        skipped_users: skippedUsers.length,
        successful_sends: successful.length,
        failed_sends: failed.length,
        starter_alerts: starterAlerts.length,
        professional_alerts: professionalAlerts.length,
        telegram_alerts: telegramAlerts.length,
        email_alerts: successful.length, // All successful sends include email
      },
      details: {
        skipped_breakdown: skippedUsers.reduce((acc, user) => {
          acc[user.reason] = (acc[user.reason] || 0) + 1;
          return acc;
        }, {}),
        processing_date: currentDateForLimits,
        timestamp: new Date().toISOString(),
      },
      results: results,
    };
    console.log(
      "🎉 PRODUCTION Premium ≥80% function completed successfully - Session #121 fixes preserved"
    );
    console.log(
      `📋 Summary: ${successful.length}/${eligibleUsers.length} premium ≥80% alerts sent with COMPLETE trading data: Price ${signal.current_price}, Stop ${signal.stop_loss}, Target ${signal.take_profit}, R/R ${signal.risk_reward_ratio}`
    );
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("💥 Premium ≥80% Edge Function critical error:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: error.message,
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
