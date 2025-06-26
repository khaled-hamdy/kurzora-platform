// File: backend/api/subscription/process.js
// Core subscription processing logic - converts payment methods to Stripe subscriptions

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

// Simple plan pricing
const PLAN_PRICES = {
  starter: {
    monthly: 1900, // $19.00 in cents
    yearly: 19000, // $190.00 in cents
  },
  professional: {
    monthly: 4900, // $49.00 in cents
    yearly: 49000, // $490.00 in cents
  },
};

/**
 * Process subscription creation after user signup
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

    // Step 3: Create subscription
    let subscription;
    try {
      const priceAmount = PLAN_PRICES[planId][billingCycle];

      subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: `Kurzora ${
                  planId.charAt(0).toUpperCase() + planId.slice(1)
                } Plan`,
              },
              unit_amount: priceAmount,
              recurring: {
                interval: billingCycle === "yearly" ? "year" : "month",
              },
            },
          },
        ],
        trial_period_days: 7,
        default_payment_method: paymentMethodId,
        metadata: {
          supabase_user_id: userId,
          plan_id: planId,
        },
      });

      console.log(`✅ Created subscription: ${subscription.id}`);
    } catch (error) {
      console.error("❌ Error creating subscription:", error);
      return res.status(500).json({
        success: false,
        error: "Failed to create subscription",
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
      return res.status(500).json({
        success: false,
        error: "Database update failed",
      });
    }

    // Success response
    res.status(200).json({
      success: true,
      subscription: {
        id: subscription.id,
        status: subscription.status,
        plan_id: planId,
        billing_cycle: billingCycle,
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
