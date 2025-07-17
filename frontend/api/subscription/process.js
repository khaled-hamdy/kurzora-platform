// File: api/subscription/process.js
// 🎯 SESSION #193: FINAL COMPLETE FIX - Using database function to bypass RLS
// 🛡️ PRESERVATION: 100% of Session #191-192 Stripe logic preserved exactly
// 🔧 CHANGE: Using update_user_stripe_info() function instead of direct UPDATE
// 📝 HANDOVER: Database function bypasses RLS while preserving all functionality

import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

// Initialize Stripe with secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

// Initialize Supabase client with service role
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// 🛡️ PRESERVED: Session #191 Stripe Price handling - create products first
const PLAN_CONFIGS = {
  starter: {
    name: "Kurzora Starter Plan",
    monthly: 1900, // $19.00 in cents
    yearly: 19000, // $190.00 in cents
  },
  professional: {
    name: "Kurzora Professional Plan",
    monthly: 4900, // $49.00 in cents
    yearly: 49000, // $490.00 in cents
  },
};

/**
 * 🔧 VERCEL API ROUTE: ES6 default export for Vite projects with "type": "module"
 * 🛡️ PRESERVATION: 100% of Session #191-192 subscription logic preserved exactly
 * 🎯 FINAL FIX: Using database function to bypass RLS for stripe_customer_id updates
 */
export default async function handler(req, res) {
  // Handle CORS for cross-origin requests
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // 🔧 POST: Handle subscription processing (main functionality)
  if (req.method === "POST") {
    try {
      const {
        userId,
        userEmail,
        userName,
        planId,
        paymentMethodId,
        billingCycle = "monthly",
      } = req.body;

      console.log(
        `🔄 Processing subscription for user: ${userEmail} (${planId})`
      );

      // 🛡️ PRESERVED: Session #191 validation logic
      if (!userId || !userEmail || !userName || !planId || !paymentMethodId) {
        return res.status(400).json({
          success: false,
          error: "Missing required fields",
          required: [
            "userId",
            "userEmail",
            "userName",
            "planId",
            "paymentMethodId",
          ],
        });
      }

      // Validate plan ID
      if (!PLAN_CONFIGS[planId]) {
        return res.status(400).json({
          success: false,
          error: `Invalid plan ID: ${planId}. Must be 'starter' or 'professional'`,
        });
      }

      // 🛡️ PRESERVED: Step 1 - Create Stripe customer (Session #191 logic)
      let customer;
      try {
        customer = await stripe.customers.create({
          email: userEmail,
          name: userName,
          metadata: {
            supabase_user_id: userId,
            plan_id: planId,
          },
        });
        console.log(`✅ Created Stripe customer: ${customer.id}`);
      } catch (error) {
        console.error("❌ Error creating customer:", error);
        return res.status(500).json({
          success: false,
          error: "Failed to create Stripe customer",
          details: error.message,
        });
      }

      // 🛡️ PRESERVED: Step 2 - Attach payment method (Session #191 logic)
      try {
        await stripe.paymentMethods.attach(paymentMethodId, {
          customer: customer.id,
        });

        await stripe.customers.update(customer.id, {
          invoice_settings: {
            default_payment_method: paymentMethodId,
          },
        });
        console.log(`✅ Payment method attached`);
      } catch (error) {
        console.error("❌ Error attaching payment method:", error);
        return res.status(500).json({
          success: false,
          error: "Failed to attach payment method",
          details: error.message,
        });
      }

      // 🛡️ PRESERVED: Step 3 - Create product and price first, then subscription (Session #191 fix)
      let subscription;
      try {
        const planConfig = PLAN_CONFIGS[planId];
        const priceAmount = planConfig[billingCycle];
        const interval = billingCycle === "yearly" ? "year" : "month";

        // Create product first
        const product = await stripe.products.create({
          name: planConfig.name,
          metadata: {
            plan_id: planId,
            billing_cycle: billingCycle,
          },
        });

        console.log(`✅ Created Stripe product: ${product.id}`);

        // Create price for the product
        const price = await stripe.prices.create({
          product: product.id,
          unit_amount: priceAmount,
          currency: "usd",
          recurring: {
            interval: interval,
          },
          metadata: {
            plan_id: planId,
            billing_cycle: billingCycle,
          },
        });

        console.log(`✅ Created Stripe price: ${price.id}`);

        // 🛡️ PRESERVED: Create subscription using price ID (Session #191 reliability fix)
        subscription = await stripe.subscriptions.create({
          customer: customer.id,
          items: [
            {
              price: price.id, // ✅ Use price ID instead of inline price_data
            },
          ],
          trial_period_days: 7,
          default_payment_method: paymentMethodId,
          metadata: {
            supabase_user_id: userId,
            plan_id: planId,
            billing_cycle: billingCycle,
          },
        });

        console.log(`✅ Created subscription: ${subscription.id}`);
      } catch (error) {
        console.error("❌ Error creating subscription:", error);

        // 🛡️ PRESERVED: Session #191 improved error handling for specific Stripe errors
        let errorMessage = "Failed to create subscription";
        if (error.code === "resource_missing") {
          errorMessage = "Payment method not found";
        } else if (error.code === "card_declined") {
          errorMessage = "Payment method declined";
        } else if (error.type === "StripeInvalidRequestError") {
          errorMessage = `Stripe configuration error: ${error.message}`;
        }

        return res.status(500).json({
          success: false,
          error: errorMessage,
          stripe_error: error.message,
          details: error.code || "unknown_error",
        });
      }

      // 🎯 NEW: Step 4 - Update database using function that bypasses RLS
      try {
        const { error: userUpdateError } = await supabase.rpc(
          "update_user_stripe_info",
          {
            user_id: userId,
            customer_id: customer.id,
            sub_tier: planId,
            sub_status: "trialing",
          }
        );

        if (userUpdateError) {
          console.error(
            "❌ Error updating user with function:",
            userUpdateError
          );
          throw userUpdateError;
        }

        console.log("✅ Database updated successfully using function");
      } catch (error) {
        console.error("❌ Database function error:", error);

        // 🛡️ PRESERVED: Session #191 important logic - don't return error even if database update fails
        // The subscription was created successfully in Stripe
        console.warn(
          "⚠️ Database update failed, but subscription created successfully"
        );
      }

      // 🛡️ PRESERVED: Session #191 success response format
      return res.status(200).json({
        success: true,
        subscription: {
          id: subscription.id,
          status: subscription.status,
          plan_id: planId,
          billing_cycle: billingCycle,
          trial_end: subscription.trial_end,
        },
        customer: {
          id: customer.id,
          email: customer.email,
        },
        message: `🎉 ${planId} subscription created successfully with 7-day trial!`,
      });
    } catch (error) {
      console.error("❌ Subscription processing failed:", error);
      return res.status(500).json({
        success: false,
        error: error.message || "Subscription processing failed",
        details: "Unexpected error during subscription processing",
      });
    }
  }

  // 🔧 GET: Handle subscription status requests (Session #191 functionality preserved)
  else if (req.method === "GET") {
    try {
      const { userId } = req.query; // Vercel uses req.query instead of req.params

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: "User ID required",
        });
      }

      const { data: user, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      if (error || !user) {
        return res.status(404).json({
          success: false,
          error: "User not found",
        });
      }

      return res.status(200).json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          subscription_tier: user.subscription_tier,
          subscription_status: user.subscription_status,
          stripe_customer_id: user.stripe_customer_id,
        },
      });
    } catch (error) {
      console.error("Error getting subscription status:", error);
      return res.status(500).json({
        success: false,
        error: "Failed to get subscription status",
        details: error.message,
      });
    }
  }

  // Handle unsupported methods
  else {
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({
      success: false,
      error: `Method ${req.method} not allowed`,
    });
  }
}
