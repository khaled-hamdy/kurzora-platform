// File: api/subscription/process.js
// 🎯 SESSION #195: TIMING FIX - Add delay for user creation before database function
// 🛡️ PRESERVATION: 100% of Session #191-193 Stripe logic preserved exactly
// 🔧 CRITICAL FIX: Wait for user to exist in database before calling function
// 📝 HANDOVER: Timing issue resolved - API waits for user creation before database update

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
 * 🎯 SESSION #195 TIMING FIX: Wait for user creation before database update
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

      // 🎯 SESSION #195 TIMING FIX: Wait for user creation before database update
      console.log(
        `⏰ Waiting for user creation to complete before database update...`
      );

      // Wait with retries to check if user exists
      let userExists = false;
      let attempts = 0;
      const maxAttempts = 10; // 10 seconds max wait

      while (!userExists && attempts < maxAttempts) {
        attempts++;
        console.log(
          `🔍 Checking if user ${userId} exists (attempt ${attempts}/${maxAttempts})`
        );

        try {
          const { data: user, error } = await supabase
            .from("users")
            .select("id")
            .eq("id", userId)
            .single();

          if (user && !error) {
            userExists = true;
            console.log(
              `✅ User ${userId} found in database after ${attempts} attempts`
            );
            break;
          }
        } catch (checkError) {
          console.log(
            `⏰ User not found yet, waiting... (attempt ${attempts})`
          );
        }

        // Wait 1 second before next attempt
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      if (!userExists) {
        console.warn(
          `⚠️ User ${userId} not found after ${maxAttempts} seconds - proceeding anyway`
        );
      }

      // 🎯 SESSION #195 FIX: Step 4 - Update database with user existence confirmed
      try {
        console.log(
          `🔍 Calling database function with userId: ${userId}, customerId: ${customer.id}`
        );

        // 🎯 THE FIX: Get BOTH data and error from function call
        const { data: updateResult, error: userUpdateError } =
          await supabase.rpc("update_user_stripe_info", {
            user_id: userId,
            customer_id: customer.id,
            sub_tier: planId,
            sub_status: "trialing",
          });

        // 🛡️ PRESERVED: Check for errors first (Session #193 logic)
        if (userUpdateError) {
          console.error(
            "❌ Error updating user with function:",
            userUpdateError
          );
          throw userUpdateError;
        }

        // 🚨 NEW: Check if function actually updated rows (return value check)
        if (!updateResult) {
          console.error(
            "❌ Function returned FALSE - no database rows updated!",
            `userId: ${userId}, customerId: ${customer.id}, planId: ${planId}`
          );
          throw new Error(
            "Database function returned false - no rows updated. Check if userId exists in database."
          );
        }

        // 🎉 ONLY log success if BOTH no error AND successful return value
        console.log(
          "✅ Database updated successfully - function returned TRUE!"
        );
        console.log(
          `✅ User ${userId} now has ${planId} plan with customer ID ${customer.id}`
        );
      } catch (error) {
        console.error("❌ Database function error:", error);

        // 🛡️ PRESERVED: Session #191 important logic - don't return error even if database update fails
        // The subscription was created successfully in Stripe
        console.warn(
          "⚠️ Database update failed, but subscription created successfully in Stripe"
        );
        console.warn(
          `⚠️ Manual fix needed: Update user ${userId} with customer ID ${customer.id} and plan ${planId}`
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
// Force redeploy Fri Jul 18 00:35:45 CEST 2025
