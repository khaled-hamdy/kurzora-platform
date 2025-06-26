import dotenv from "dotenv";

// Load environment variables
dotenv.config();

console.log("🔍 Environment Variables Test:");
console.log("PORT:", process.env.PORT);
console.log(
  "STRIPE_SECRET_KEY:",
  process.env.STRIPE_SECRET_KEY ? "✅ Found" : "❌ Missing"
);
console.log(
  "SUPABASE_URL:",
  process.env.SUPABASE_URL ? "✅ Found" : "❌ Missing"
);
console.log(
  "SUPABASE_SERVICE_ROLE_KEY:",
  process.env.SUPABASE_SERVICE_ROLE_KEY ? "✅ Found" : "❌ Missing"
);

if (process.env.SUPABASE_URL) {
  console.log("SUPABASE_URL value:", process.env.SUPABASE_URL);
} else {
  console.log("❌ SUPABASE_URL is undefined");
}
