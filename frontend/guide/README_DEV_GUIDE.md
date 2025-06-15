# 🛠️ README_DEV_GUIDE.md – Kurzora Developer Guide

This guide is for developers working on the **Kurzora** project. It outlines file structure, backend logic rules, and how to use Cursor effectively.

---

## 📁 Folder Structure Overview

| Folder                      | Description                          | Managed By |
|-----------------------------|--------------------------------------|------------|
| `/src/components/`          | Reusable UI components               | Lovable    |
| `/src/pages/`               | Route-level UI views                 | Lovable    |
| `/src/backend-functions/`   | Firebase Cloud Functions and logic   | Cursor     |
| `/public/`                  | Static files                         | Shared     |

---

## 🧠 Cursor Usage Instructions

When writing backend logic with Cursor, always follow these rules:

### ✅ What to Do

- Save all backend logic in:
  - `/src/backend-functions/`
- Use modular, clean TypeScript
- Each function should have one purpose
- Use descriptive filenames:
  - `scoreSignal.ts`
  - `fetchIndicators.ts`
  - `sendTelegramAlert.ts`

### ❌ What Not to Do

- Do **not** modify:
  - `/src/pages/`
  - `/src/components/`
- Those folders are controlled by **Lovable**

---

## 🔧 Cursor Prompt Template

```
Please write a Firebase Cloud Function that [describe task].

Save the file in:
/src/backend-functions/[filename].ts
```

---

## 💡 Tech Stack Reminder

- React + Vite + Tailwind CSS
- Supabase (PostgreSQL)
- Firebase Cloud Functions
- Telegram API + Stripe + Make.com
