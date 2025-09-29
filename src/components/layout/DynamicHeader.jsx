import React, { useState, useEffect } from "react";
import {
  Wallet,
  LayoutDashboard,
  PlusCircle,
  Receipt,
  TrendingUp,
  Settings as SettingsIcon,
  LogOut,
  Menu,
  X,
  User,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { authService } from "../../services/authService";
import Button from "../ui/Button";

function DynamicHeader({ currentPage, onNavigate }) {
  const { currentUser } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      setIsScrolled(currentScrollY > 10);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    const handleClickOutside = () => {
      setIsMobileMenuOpen(false);
      setIsProfileMenuOpen(false);
    };

    if (isMobileMenuOpen || isProfileMenuOpen) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => document.removeEventListener("click", handleClickOutside);
  }, [isMobileMenuOpen, isProfileMenuOpen]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const handleLogout = async () => {
    await authService.logout();
  };

  const handleNavigation = (page) => {
    onNavigate(page);
    setIsMobileMenuOpen(false);
    setIsProfileMenuOpen(false);
  };

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "add-expense", label: "Add Expense", icon: PlusCircle },
    { id: "expenses", label: "Expenses", icon: Receipt },
    { id: "analytics", label: "Analytics", icon: TrendingUp },
  ];

  return (
    <>
      <header
        className={`dynamic-header ${isScrolled ? "scrolled" : ""} ${
          isHidden ? "hidden" : ""
        }`}
      >
        <div className="header-container">
          <div className="mobile-controls">
            <button
              className="hamburger-btn"
              onClick={(e) => {
                e.stopPropagation();
                setIsMobileMenuOpen(!isMobileMenuOpen);
              }}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <button
              className="brand-link mobile-brand"
              onClick={() => handleNavigation("dashboard")}
            >
              <Wallet size={24} />
              <span className="brand-text">ExpenseTracker</span>
            </button>
          </div>

          <div className="header-brand desktop-brand">
            <button
              className="brand-link"
              onClick={() => handleNavigation("dashboard")}
            >
              <Wallet size={24} />
              <span className="brand-text">ExpenseTracker</span>
            </button>
          </div>

          <nav className="desktop-nav">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.id}
                  className={`nav-link ${
                    currentPage === item.id ? "active" : ""
                  }`}
                  onClick={() => handleNavigation(item.id)}
                >
                  <IconComponent size={18} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="desktop-actions">
            <div className="profile-section">
              <button
                className="profile-trigger"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsProfileMenuOpen(!isProfileMenuOpen);
                }}
              >
                <div className="profile-avatar">
                  <User size={18} />
                </div>
                <span className="profile-name">
                  {currentUser?.displayName?.split(" ")[0] || "User"}
                </span>
                <ChevronDown size={16} />
              </button>

              {isProfileMenuOpen && (
                <div
                  className="profile-dropdown"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="profile-info">
                    <div className="profile-avatar-large">
                      <User size={24} />
                    </div>
                    <div className="profile-details">
                      <p className="profile-display-name">
                        {currentUser?.displayName || "User"}
                      </p>
                      <p className="profile-email">{currentUser?.email}</p>
                    </div>
                  </div>
                  <div className="profile-actions">
                    <button
                      className="profile-action"
                      onClick={() => handleNavigation("settings")}
                    >
                      <SettingsIcon size={16} />
                      Settings
                    </button>
                    <button
                      className="profile-action logout"
                      onClick={handleLogout}
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Full Screen Overlay */}
      {isMobileMenuOpen && (
        <div
          className="mobile-nav-fullscreen"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mobile-nav-header">
            <div className="mobile-brand">
              <Wallet size={24} />
              <span>ExpenseTracker</span>
            </div>
            <button
              className="close-btn"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X size={24} />
            </button>
          </div>

          <div className="mobile-nav-content">
            {/* Mobile Profile Section - Display Only */}
            <div className="mobile-nav-profile">
              <div className="profile-info">
                <div className="profile-avatar-large">
                  <User size={24} />
                </div>
                <div className="profile-details">
                  <p className="profile-display-name">
                    {currentUser?.displayName || "User"}
                  </p>
                  <p className="profile-email">{currentUser?.email}</p>
                </div>
              </div>
            </div>

            <nav className="mobile-nav-menu">
              {navigationItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.id}
                    className={`mobile-nav-item ${
                      currentPage === item.id ? "active" : ""
                    }`}
                    onClick={() => handleNavigation(item.id)}
                  >
                    <IconComponent size={20} />
                    <span>{item.label}</span>
                  </button>
                );
              })}

              <button
                className={`mobile-nav-item ${
                  currentPage === "settings" ? "active" : ""
                }`}
                onClick={() => handleNavigation("settings")}
              >
                <SettingsIcon size={20} />
                <span>Settings</span>
              </button>

              <button
                className="mobile-nav-item logout-item"
                onClick={handleLogout}
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}

export default DynamicHeader;
