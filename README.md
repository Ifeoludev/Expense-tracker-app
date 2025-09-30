**ExpenseTracker - Personal Finance Management App**
A modern, full-featured expense tracking application built with React, Vite, and Firebase. Track your spending, visualize patterns, and manage your budget with an intuitive interface and robust security features.

**Features**
_Core Functionality_
-Expense Management: Add, edit, and delete expenses with detailed categorization
-Real-time Sync: All data syncs instantly across devices using Firebase Firestore
-Smart Analytics: View spending patterns with interactive charts (Pie & Bar charts)
-Budget Tracking: Set monthly and category-specific budgets with alerts
-Data Export: Export expenses to CSV for external analysis

_Security & Authentication_
-Email/Password Authentication: Secure Firebase authentication
-Email Verification: Required verification before account access
-Password Recovery: Self-service password reset via email
-Account Management: Change email, update password, delete account
-Security Events Logging: Track login history and security-related activities
-Session Management: Automatic logout and session handling

_User Experience_
-Dark Mode: Full dark theme support with persistent preferences
-Responsive Design: Optimized for desktop, tablet, and mobile devices
-Mobile Navigation: Slide-out menu with smooth animations
-Loading States: Proper loading indicators throughout the app
-Error Handling: User-friendly error messages with recovery suggestions
-Empty States: Helpful guidance when no data is available

_Analytics & Insights_
-Category Breakdown: Visualize spending by category with pie charts
-Monthly Trends: Track spending patterns over time with bar charts
-Top Expenses: Quick view of your largest transactions
-Smart Insights: AI-generated observations about spending habits
-Time Filters: Analyze data by week, month, quarter, year, or all-time
-Comparison Metrics: See changes from previous periods

_Currency Support_
-Nigerian Naira: Default and only supported currency
-Proper Formatting: Locale-aware number formatting

_Tech Stack_
-Frontend
-React 19.1.1: Modern UI with hooks and functional components
-Vite 7.1.7: Lightning-fast build tool and dev server
-React Router DOM 7.9.1: Client-side routing
-Recharts 3.2.1: Data visualization with charts
-Lucide React 0.544.0: Beautiful icon system

_Backend & Services_
-Firebase 12.3.0:
-Authentication (Email/Password)
-Firestore (Real-time database)
-Security Rules
-Cloud Functions Ready: Architecture supports serverless functions

_State Management_
-Context API: Global state with AuthContext and ThemeContext
-Custom Hooks: Reusable logic with useExpenses, useProfile, useAnalytics
-Real-time Subscriptions: Live data updates with Firestore listeners

**Project Structure**
expense-tracker/
+-- public/ # Static assets
+-- src/
¦ +-- components/ # Reusable components
¦ ¦ +-- analytics/ # Chart components
¦ ¦ +-- auth/ # Authentication components
¦ ¦ +-- expense/ # Expense-related components
¦ ¦ +-- layout/ # Layout components (Header, Nav)
¦ ¦ +-- ui/ # UI primitives (Button, Input, Modal)
¦ +-- constants/ # App constants and configurations
¦ +-- context/ # React Context providers
¦ +-- hooks/ # Custom React hooks
¦ +-- pages/ # Page components
¦ +-- services/ # Firebase and API services
¦ +-- styles/ # CSS files
¦ +-- App.jsx # Main app component
¦ +-- main.jsx # Entry point
¦ +-- index.css # Global styles
+-- .env.local # Environment variables (not in repo)
+-- .gitignore
+-- package.json
+-- vite.config.js
+-- README.md

**Usage Guide**
_Adding Your First Expense_
-Sign up or log in to your account
-Verify your email address
-Navigate to "Add Expense"
-Fill in amount, description, category, and date
-Click "Add Expense"

_Viewing Analytics_
-Go to the "Analytics" page
-Select a timeframe (week, month, year, etc.)
-View charts showing spending by category and over time
-Check "Smart Insights" for spending observations

_Managing Budget_
-Navigate to Settings -> Budget
-Set your monthly budget limit
-Configure category-specific budgets
-Set budget alert threshold (70%, 80%, 90%, 95%)

_Exporting Data_
-Go to Settings -> Data
-Click "Export to CSV"
-Your expenses will download as a spreadsheet

**API Services**
_Authentication Service (authService.js)_
-register(email, password, displayName) - Create new account
-login(email, password) - Sign in user
-logout() - Sign out user
-resetPassword(email) - Send password reset email
-resendEmailVerification() - Resend verification email
-changePassword(current, new) - Update password
-updateEmail(newEmail, password) - Change email address
-deleteAccount(password) - Permanently delete account

_Expense Service (expenseService.js)_
-addExpense(userId, data) - Create expense
-updateExpense(id, updates) - Modify expense
-deleteExpense(id) - Remove expense
-getUserExpenses(userId, callback) - Real-time expense subscription

_Export Service (exportService.js)_
-exportToCSV(userId) - Download expenses as CSV
-clearAllData(userId) - Delete all user expenses

**Custom Hooks**
_useExpenses()_
-Returns expense data and CRUD operations
-javascriptconst { expenses, loading, error, addExpense, updateExpense, deleteExpense } = useExpenses();

_useProfile()_
-Manages user profile and preferences
-javascriptconst { profile, loading, updateProfile, changePassword } = useProfile();

_useAnalytics(timeframe)_
-Provides spending analytics
-javascriptconst analytics = useAnalytics('month');

**Styling**
The app uses a custom CSS design system with:
-CSS Variables for theming
-Component-scoped CSS files
-Dark mode support
-Mobile-first responsive design
