// File: backend/api/subscription/process.js
// FIXED VERSION - Corrected Stripe API usage for production launch

import dotenv from "dotenv";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

// Load environment variables FIRST
dotenv.config();

// Initialize Stripe with secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

// Initialize Supabase client with service role
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// 🔧 FIXED: Better Stripe Price handling - create products first
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
 * 🔧 FIXED: More reliable subscription creation method
 */
export async function processSubscription(req, res) {
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

    // Validate required fields
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

    // Step 1: Create Stripe customer
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
      });
    }

    // Step 2: Attach payment method
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
      });
    }

    // 🔧 FIXED: Step 3 - Create product and price first, then subscription
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

      // 🔧 FIXED: Create subscription using price ID (more reliable)
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

      // 🔧 IMPROVED: Better error handling for specific Stripe errors
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
      });
    }

    // Step 4: Update database
    try {
      const { error: userUpdateError } = await supabase
        .from("users")
        .update({
          stripe_customer_id: customer.id,
          subscription_tier: planId,
          subscription_status: "trialing",
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      if (userUpdateError) {
        console.error("❌ Error updating user:", userUpdateError);
        throw userUpdateError;
      }

      console.log("✅ Database updated successfully");
    } catch (error) {
      console.error("❌ Database error:", error);

      // 🔧 IMPORTANT: Even if database update fails, don't return error
      // The subscription was created successfully in Stripe
      console.warn(
        "⚠️ Database update failed, but subscription created successfully"
      );
    }

    // Success response
    res.status(200).json({
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

    console.log(`🎉 Subscription completed for ${userEmail}`);
  } catch (error) {
    console.error("❌ Subscription processing failed:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Subscription processing failed",
    });
  }
}

/**
 * Get subscription status for a user
 */
export async function getSubscriptionStatus(req, res) {
  try {
    const { userId } = req.params;

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

    res.status(200).json({
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
    res.status(500).json({
      success: false,
      error: "Failed to get subscription status",
    });
  }
}

export default {
  processSubscription,
  getSubscriptionStatus,
};
