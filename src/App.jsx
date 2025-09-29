// src/App.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "./context/AuthContext";
import EnhancedAuthPage from "./pages/EnhancedAuthPage";
import Dashboard from "./pages/Dashboard";
import AddExpense from "./pages/AddExpense";
import ExpenseList from "./pages/ExpenseList";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import DynamicHeader from "./components/layout/DynamicHeader";
import EmailVerification from "./components/auth/EmailVerification";
import "./App.css";

function App() {
  const { currentUser, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [showEmailVerification, setShowEmailVerification] = useState(false);

  // Reset page when user logs out
  useEffect(() => {
    if (!currentUser) {
      setCurrentPage("dashboard");
    }
  }, [currentUser]);

  // Check if logged-in user needs email verification
  useEffect(() => {
    if (currentUser && !currentUser.emailVerified) {
      setShowEmailVerification(true);
    } else {
      setShowEmailVerification(false);
    }
  }, [currentUser]);

  const handleNavigation = (page) => {
    setCurrentPage(page);
  };

  const handleVerificationComplete = async () => {
    setShowEmailVerification(false);
    if (currentUser) {
      await currentUser.reload(); // Refresh user status from Firebase
    }
  };

  const handleSkipVerification = () => {
    // Allow user to continue but maybe restrict access in pages
    setShowEmailVerification(false);
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div className="spinner spinner-lg"></div>
          <p style={{ marginTop: "1rem", color: "#6b7280" }}>Loading...</p>
        </div>
      </div>
    );
  }

  // Not logged in ? show login/register
  if (!currentUser) {
    return <EnhancedAuthPage />;
  }

  // Logged in but not verified ? show verification page
  if (showEmailVerification) {
    return (
      <EmailVerification
        onVerified={handleVerificationComplete}
        onSkip={handleSkipVerification}
      />
    );
  }

  // Logged in and verified ? render main app
  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard onNavigate={handleNavigation} />;
      case "add-expense":
        return <AddExpense />;
      case "expenses":
        return <ExpenseList />;
      case "analytics":
        return <Analytics />;
      case "settings":
        return <Settings />;
      default:
        return <Dashboard onNavigate={handleNavigation} />;
    }
  };

  return (
    <div className="layout">
      <DynamicHeader currentPage={currentPage} onNavigate={handleNavigation} />
      <main className="main-content">{renderPage()}</main>
    </div>
  );
}

export default App;
