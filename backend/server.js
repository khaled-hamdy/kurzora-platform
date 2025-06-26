// File: backend/server.js
// Main Express server for Kurzora subscription processing

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import {
  processSubscription,
  getSubscriptionStatus,
} from "./api/subscription/process.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(
  cors({
    origin: ["http://localhost:8081", "http://localhost:3000"], // Allow your frontend URLs
    credentials: true,
  })
);
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`📡 ${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    service: "Kurzora Subscription API",
    version: "1.0.0",
  });
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Kurzora Subscription API",
    status: "operational",
    endpoints: {
      health: "GET /health",
      processSubscription: "POST /api/subscription/process",
      getSubscriptionStatus: "GET /api/subscription/status/:userId",
    },
  });
});

// Subscription endpoints
app.post("/api/subscription/process", processSubscription);
app.get("/api/subscription/status/:userId", getSubscriptionStatus);

// Error handling middleware
app.use((error, req, res, next) => {
  console.error("🚨 API Error:", error);
  res.status(500).json({
    success: false,
    error: "Internal server error",
    message: error.message,
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    error: "Endpoint not found",
    path: req.originalUrl,
    availableEndpoints: [
      "GET /health",
      "POST /api/subscription/process",
      "GET /api/subscription/status/:userId",
    ],
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Kurzora Subscription API started successfully!`);
  console.log(`📊 Server running on: http://localhost:${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
  console.log(
    `💳 Process subscription: POST http://localhost:${PORT}/api/subscription/process`
  );
  console.log(
    `📈 Get subscription status: GET http://localhost:${PORT}/api/subscription/status/:userId`
  );
  console.log(`⚡ Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(
    `🔑 Stripe configured: ${process.env.STRIPE_SECRET_KEY ? "✅" : "❌"}`
  );
  console.log(
    `🗄️ Supabase configured: ${
      process.env.SUPABASE_SERVICE_ROLE_KEY ? "✅" : "❌"
    }\n`
  );
});

export default app;
