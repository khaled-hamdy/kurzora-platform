# 📘 Kurzora Project – Comprehensive README

Welcome to the **Kurzora** project — an AI-powered trading signal platform. This document includes the complete tech stack, developer instructions, syncing protocol, and best practices for using **Lovable**, **Cursor**, and **GitHub** together.

---

## 🔧 Tech Stack Overview

| Area                   | Tool(s) Used                                     | Purpose |
|------------------------|--------------------------------------------------|---------|
| Frontend               | React + Vite + Tailwind CSS + TypeScript         | Fast, modular UI |
| UI Framework           | shadcn/ui (built on Radix)                       | Reusable, accessible components |
| Charting               | TradingView Widget                               | Real-time stock charts |
| Backend Runtime        | Node.js                                           | Runs Firebase Cloud Functions |
| Business Logic         | Firebase Cloud Functions                         | Signal scoring, alerts, scheduling |
| Database               | PostgreSQL via Supabase                          | Structured user, trade, and signal data |
| Auth & Payments        | Firebase Auth + Stripe                           | User login and subscription management |
| APIs                   | Finnhub, Polygon.io, Tiingo, Alpha Vantage       | Market data & indicators |
| Automation & Alerts    | Make.com + Telegram Bot API + SendGrid           | Send signal notifications via email/Telegram |
| AI Assistant Tools     | Cursor, GPT-4 Turbo, Claude                      | Code generation and explanation |
| Deployment             | Vercel                                           | Frontend hosting optimized for Vite |

---

## 👨‍💻 Developer Guide for Cursor (Backend Logic)

Please follow this structure when writing backend logic using Cursor:

### Folder Structure

| Folder                  | Role                    |
|-------------------------|-------------------------|
| `/src/pages/`           | Page routes (Lovable)   |
| `/src/components/`      | Reusable UI components  |
| `/src/backend-functions/` | Firebase Cloud Functions and backend logic (Cursor only) |

### Cursor Prompt Template

```
Please write a Firebase Cloud Function that [your task here].

Save the code in:
/src/backend-functions/[yourFileName].ts
```

✅ Example files:
- `/src/backend-functions/fetchRSI.ts`
- `/src/backend-functions/scoreSignal.ts`
- `/src/backend-functions/sendTelegramAlert.ts`

❗ Do NOT modify:
- `/src/components/`
- `/src/pages/`
(Lovable controls those)

---

## 🖌️ Lovable Instructions (Frontend UI)

When using Lovable to design or update the UI:

### ✅ Only Modify:
- `/src/pages/`
- `/src/components/`
- Basic layout and styling

### ❌ Do NOT Touch:
- `/src/backend-functions/`
- Firebase or Supabase logic
- Custom backend scripts

If backend logic is needed, insert a placeholder and say:
> “This should be implemented in `/src/backend-functions/` by Cursor.”

---

## 🔁 Syncing Protocol (Lovable + Cursor + GitHub)

To avoid overwriting each other’s code:

### Before Using Lovable:
1. In Cursor:
   - `Git: Commit`
   - `Git: Push`
2. In Lovable:
   - Make UI changes
   - Click “Push to GitHub”

### Before Using Cursor:
1. In Cursor:
   - `Git: Pull` (to fetch Lovable updates)
2. Do your logic work
3. When finished:
   - `Git: Commit`
   - `Git: Push`

---

## 🧠 Summary

| Tool     | Use For                          |
|----------|----------------------------------|
| Lovable  | UI design and layout only        |
| Cursor   | Backend logic, data fetching     |
| GitHub   | Central sync for all changes     |

> Always treat **GitHub as your source of truth** and separate backend logic from UI components.

---

Happy building!
