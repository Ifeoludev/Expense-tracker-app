# 💰 Xpense Tracker App

> **Financial Clarity in a Glance.**
> A modern, privacy-focused Personal Finance Manager customized for the Nigerian context (₦).

Built with **React**, **Vite**, and **Firebase**.

---

## 🌟 Key Features

### 📊 Smart Dashboard

- **Fair Comparison**: Dynamically compares your spending "Month-to-Date" vs "Last Month Total" so you know exactly where you stand.
- **Visual Patterns**: Interactive Bar and Pie charts powered by `Recharts` to visualize where your money goes.
- **Currency Support**: Native support for **Nigerian Naira (₦)**.

### 💰 Expense Management

- **Real-Time Sync**: Add an expense on your phone, and it appears instantly on your laptop (powered by Firestore).
- **Detailed Analytics**: Drill down by category (Food, Housing, Transport) or timeframe (Week, Month, Year).
- **Export**: Download your data to CSV for Excel analysis.

### 🔒 Bank-Grade Security

- **Audit Logs**: View a complete history of every login, password change, and security event in `Settings`.
- **Account Control**: Change your email, password, or permanently delete your account (GDPR compliant).
- **Authentication**: Secure Email/Password login. _Email verification is optional for quick access._

---

## 🛠️ Tech Stack

### Frontend

- **React 18**: Function components & Hooks (`useAuth`, `useExpenses`).
- **Vite**: Lightning-fast build tool.
- **CSS Modules**: Custom "Blue/Gray" design system with Dark Mode support (via `ThemeContext`).

### Backend (Serverless)

- **Firebase Auth**: Identity management.
- **Firestore**: NoSQL Real-time database.

---

## 🚀 Getting Started

1.  **Clone the repo**

    ```bash
    git clone https://github.com/yourusername/expense-tracker.git
    cd expense-tracker
    ```

2.  **Install Dependencies**

    ```bash
    npm install
    ```

3.  **Run Locally**

    ```bash
    npm run dev
    ```

4.  **Build for Production**
    ```bash
    npm run build
    ```

---

## 📂 Project Structure

```
src/
├── components/      # Reusable UI (Modals, Cards, Buttons)
├── context/         # Global State (Auth, Theme)
├── hooks/           # Business Logic (e.g., useAnalytics.js)
├── pages/           # Main Views (Dashboard, Settings)
├── services/        # Firebase Integrations (The only files that touch the DB)
└── styles/          # Global Design Tokens
```

## 📝 Usage Guide

- **Dark Mode**: Toggle via the moon icon in the navigation bar.
- **Recurring Expenses**: Currently supported via manual entry (Feature coming soon).
- **Budget Alerts**: Configure your monthly limit in `Settings`.

---

## 📜 License

MIT License. Free to use and modify.
