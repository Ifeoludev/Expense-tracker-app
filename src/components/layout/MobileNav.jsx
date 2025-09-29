import React, { useEffect } from "react";
import {
  LayoutDashboard,
  PlusCircle,
  Receipt,
  TrendingUp,
  Settings as SettingsIcon,
  User,
  LogOut,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { authService } from "../../services/authService";

function MobileNav({ isOpen, onClose, currentPage, onNavigate }) {
  const { currentUser } = useAuth();

  // ? Prevent body scroll when mobile nav is open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("mobile-nav-open");
    } else {
      document.body.classList.remove("mobile-nav-open");
    }

    return () => {
      document.body.classList.remove("mobile-nav-open");
    };
  }, [isOpen]);

  const handleLogout = async () => {
    await authService.logout();
    onClose();
  };

  const handleNavigate = (page) => {
    onNavigate(page);
    onClose();
  };

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "add-expense", label: "Add Expense", icon: PlusCircle },
    { id: "expenses", label: "All Expenses", icon: Receipt },
    { id: "analytics", label: "Analytics", icon: TrendingUp },
    { id: "settings", label: "Settings", icon: SettingsIcon },
  ];

  return (
    <>
      <div
        className={`mobile-nav-overlay ${isOpen ? "active" : ""}`}
        onClick={onClose}
      />

      <div className={`mobile-nav ${isOpen ? "open" : ""}`}>
        {/* Header */}
        <div className="mobile-nav-header">
          <div className="mobile-nav-brand">
            <div className="brand-icon">
              <span>??</span>
            </div>
            <span className="brand-text">ExpenseTracker</span>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* Profile Section */}
        <div className="mobile-nav-profile">
          <div className="profile-avatar">
            <User size={24} />
          </div>
          <div className="profile-info">
            <div className="profile-name">
              {currentUser?.displayName || "User"}
            </div>
            <div className="profile-email">{currentUser?.email}</div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="mobile-nav-menu">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.id}
                className={`mobile-nav-item ${
                  currentPage === item.id ? "active" : ""
                }`}
                onClick={() => handleNavigate(item.id)}
              >
                <IconComponent size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="mobile-nav-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </>
  );
}

export default MobileNav;
