// 🎯 PURPOSE: Vite configuration for Kurzora Trading Platform
// 🔧 SESSION #144: Added build target fix for deployment (preserving all Lovable setup)
// 🛡️ PRESERVATION: CRITICAL - Lovable-specific configs must remain intact
// 📝 HANDOVER: This file contains working Lovable setup + deployment fix

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8081, // 🛡️ PRESERVE: Working port from Lovable setup - DO NOT CHANGE
  },

  // 🛡️ PRESERVE: Lovable-specific plugin configuration - CRITICAL for development
  plugins: [
    react(), // 🛡️ PRESERVE: @vitejs/plugin-react-swc for faster builds
    mode === "development" && componentTagger(), // 🛡️ PRESERVE: Lovable tagger for development
  ].filter(Boolean),

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // 🛡️ PRESERVE: Path alias from Lovable
    },
  },

  // 🔧 SESSION #144: Added build configuration to fix Vercel deployment error
  // 🚨 ISSUE FIXED: "Top-level await is not available in chrome87" deployment error
  // 📝 SOLUTION: Updated target to es2022 to support modern JavaScript features
  build: {
    target: "es2022", // 🎯 FIX: Enables top-level await support for deployment
    // 📝 NOTE: This fixes Vercel build error without breaking existing functionality
  },
}));
