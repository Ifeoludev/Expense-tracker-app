import React, { useState } from "react";
import {
  User,
  DollarSign,
  Bell,
  Download,
  Settings as SettingsIcon,
  Save,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useProfile } from "../hooks/useProfile";
import { exportService } from "../services/exportService";
import { DEFAULT_CATEGORIES } from "../constants/categories";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";

function Settings() {
  const { currentUser } = useAuth();
  const { profile, loading, updateProfile } = useProfile();
  const [activeTab, setActiveTab] = useState("profile");
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Form states - Initialize with empty strings to avoid undefined
  const [profileForm, setProfileForm] = useState({
    displayName: "",
    email: "",
  });
  const [budgetForm, setBudgetForm] = useState({
    monthlyBudget: "",
    budgetAlert: "80",
    categoryBudgets: {},
  });
  const [preferencesForm, setPreferencesForm] = useState({
    darkMode: false,
    notifications: true,
    autoCategories: true,
  });

  // Update forms when profile loads
  React.useEffect(() => {
    if (profile) {
      setProfileForm({
        displayName: profile.displayName || "",
        email: profile.email || "",
      });
      setBudgetForm({
        monthlyBudget: profile.monthlyBudget?.toString() || "150000",
        budgetAlert: profile.budgetAlert?.toString() || "80",
        categoryBudgets: profile.categoryBudgets || {
          food: 40000,
          transport: 30000,
          shopping: 25000,
          entertainment: 15000,
          bills: 20000,
          other: 10000,
        },
      });
      setPreferencesForm({
        darkMode: profile.preferences?.darkMode || false,
        notifications: profile.preferences?.notifications !== false,
        autoCategories: profile.preferences?.autoCategories !== false,
      });
    }
  }, [profile]);

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    const result = await updateProfile({
      displayName: profileForm.displayName.trim(),
      email: profileForm.email.trim(),
    });

    if (result.success) {
      showSuccess("Profile updated successfully!");
    } else {
      alert("Error: " + result.error);
    }
    setSaving(false);
  };

  const handleSaveBudget = async () => {
    setSaving(true);
    const result = await updateProfile({
      monthlyBudget: parseFloat(budgetForm.monthlyBudget) || 150000,
      budgetAlert: parseInt(budgetForm.budgetAlert) || 80,
      categoryBudgets: budgetForm.categoryBudgets,
    });

    if (result.success) {
      showSuccess("Budget settings saved!");
    } else {
      alert("Error: " + result.error);
    }
    setSaving(false);
  };

  const handleSavePreferences = async () => {
    setSaving(true);
    const result = await updateProfile({
      preferences: {
        darkMode: preferencesForm.darkMode,
        notifications: preferencesForm.notifications,
        autoCategories: preferencesForm.autoCategories,
      },
    });

    if (result.success) {
      showSuccess("Preferences saved!");
    } else {
      alert("Error: " + result.error);
    }
    setSaving(false);
  };

  const handleExport = async () => {
    setExporting(true);
    const result = await exportService.exportToCSV(currentUser.uid);

    if (result.success) {
      showSuccess(`Exported ${result.count} expenses to CSV!`);
    } else {
      alert("Export failed: " + result.error);
    }
    setExporting(false);
  };

  const handleClearData = async () => {
    const result = await exportService.clearAllData(currentUser.uid);
    setShowClearModal(false);

    if (result.success) {
      showSuccess(`Cleared ${result.count} expenses!`);
    } else {
      alert("Clear failed: " + result.error);
    }
  };

  const updateCategoryBudget = (categoryId, value) => {
    setBudgetForm({
      ...budgetForm,
      categoryBudgets: {
        ...budgetForm.categoryBudgets,
        [categoryId]: parseFloat(value) || 0,
      },
    });
  };

  const tabs = [
    { id: "profile", name: "Profile", icon: User },
    { id: "budget", name: "Budget", icon: DollarSign },
    { id: "preferences", name: "Preferences", icon: Bell },
    { id: "data", name: "Data", icon: Download },
  ];

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-container">
          <div className="spinner spinner-lg"></div>
          <p>Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Manage your account and app preferences</p>
      </div>

      {successMessage && <div className="success-banner">{successMessage}</div>}

      <div className="settings-layout">
        {/* Sidebar Navigation */}
        <div className="settings-sidebar">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                className={`settings-tab ${
                  activeTab === tab.id ? "active" : ""
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                <IconComponent size={18} />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="settings-content">
          {/* Profile Settings */}
          {activeTab === "profile" && (
            <div className="settings-panel">
              <div className="panel-header">
                <User size={24} />
                <h2>Profile Settings</h2>
              </div>

              <div className="panel-content">
                <Input
                  label="Display Name"
                  value={profileForm.displayName}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      displayName: e.target.value,
                    })
                  }
                  placeholder="Your full name"
                />

                <Input
                  label="Email"
                  type="email"
                  value={profileForm.email}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      email: e.target.value,
                    })
                  }
                  placeholder="your.email@example.com"
                  disabled
                />

                <div className="panel-actions">
                  <Button
                    variant="primary"
                    onClick={handleSaveProfile}
                    loading={saving}
                  >
                    <Save size={16} />
                    <span>Save Profile</span>
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Budget Settings */}
          {activeTab === "budget" && (
            <div className="settings-panel">
              <div className="panel-header">
                <DollarSign size={24} />
                <h2>Budget Settings</h2>
              </div>

              <div className="panel-content">
                <div className="budget-main">
                  <Input
                    label="Monthly Budget (?)"
                    type="number"
                    value={budgetForm.monthlyBudget}
                    onChange={(e) =>
                      setBudgetForm({
                        ...budgetForm,
                        monthlyBudget: e.target.value,
                      })
                    }
                    placeholder="150000"
                  />

                  <div className="form-group">
                    <label className="form-label">Budget Alert (%)</label>
                    <select
                      className="form-input"
                      value={budgetForm.budgetAlert}
                      onChange={(e) =>
                        setBudgetForm({
                          ...budgetForm,
                          budgetAlert: e.target.value,
                        })
                      }
                    >
                      <option value="70">70%</option>
                      <option value="80">80%</option>
                      <option value="90">90%</option>
                      <option value="95">95%</option>
                    </select>
                  </div>
                </div>

                <div className="category-budgets">
                  <h3>Category Budgets</h3>
                  <div className="budget-grid">
                    {DEFAULT_CATEGORIES.map((category) => {
                      const IconComponent = category.icon;
                      return (
                        <div key={category.id} className="budget-item">
                          <div className="budget-category-info">
                            <IconComponent size={18} color={category.color} />
                            <span>{category.name}</span>
                          </div>
                          <input
                            type="number"
                            className="budget-input"
                            value={
                              budgetForm.categoryBudgets?.[category.id] || 0
                            }
                            onChange={(e) =>
                              updateCategoryBudget(category.id, e.target.value)
                            }
                            placeholder="0"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="panel-actions">
                  <Button
                    variant="primary"
                    onClick={handleSaveBudget}
                    loading={saving}
                  >
                    <Save size={16} />
                    <span>Save Budget</span>
                  </Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "preferences" && (
            <div className="settings-panel">
              <div className="panel-header">
                <Bell size={24} />
                <h2>App Preferences</h2>
              </div>

              <div className="panel-content">
                <div className="form-group">
                  <label className="form-label">Currency</label>
                  <div
                    className="currency-display"
                    style={{
                      padding: "0.75rem 1rem",
                      background: "#f3f4f6",
                      borderRadius: "8px",
                      color: "#374151",
                      fontWeight: "500",
                    }}
                  >
                    &#8358; Nigerian Naira (NGN)
                  </div>
                  <p
                    style={{
                      fontSize: "0.875rem",
                      color: "#6b7280",
                      marginTop: "0.5rem",
                    }}
                  >
                    This app uses Naira as the default currency.
                  </p>
                </div>

                <div className="toggle-settings">
                  <div className="toggle-item">
                    <div className="toggle-info">
                      <h4>Dark Mode</h4>
                      <p>Use dark theme throughout the app</p>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={preferencesForm.darkMode}
                        onChange={(e) =>
                          setPreferencesForm({
                            ...preferencesForm,
                            darkMode: e.target.checked,
                          })
                        }
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="toggle-item">
                    <div className="toggle-info">
                      <h4>Notifications</h4>
                      <p>Get notified about budget alerts</p>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={preferencesForm.notifications}
                        onChange={(e) =>
                          setPreferencesForm({
                            ...preferencesForm,
                            notifications: e.target.checked,
                          })
                        }
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="toggle-item">
                    <div className="toggle-info">
                      <h4>Auto-categorize</h4>
                      <p>Automatically suggest expense categories</p>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={preferencesForm.autoCategories}
                        onChange={(e) =>
                          setPreferencesForm({
                            ...preferencesForm,
                            autoCategories: e.target.checked,
                          })
                        }
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>

                <div className="panel-actions">
                  <Button
                    variant="primary"
                    onClick={handleSavePreferences}
                    loading={saving}
                  >
                    <Save size={16} />
                    <span>Save Preferences</span>
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Data Management */}
          {activeTab === "data" && (
            <div className="settings-panel">
              <div className="panel-header">
                <Download size={24} />
                <h2>Data Management</h2>
              </div>

              <div className="panel-content">
                <div className="data-actions">
                  <Button
                    variant="success"
                    onClick={handleExport}
                    loading={exporting}
                  >
                    <Download size={16} />
                    <span>Export to CSV</span>
                  </Button>

                  <Button
                    variant="danger"
                    onClick={() => setShowClearModal(true)}
                  >
                    <Trash2 size={16} />
                    <span>Clear All Data</span>
                  </Button>
                </div>

                <div className="data-info">
                  <p>
                    <strong>Export to CSV:</strong> Download all your expenses
                    as a spreadsheet file for backup or analysis.
                  </p>
                  <p>
                    <strong>Clear All Data:</strong> Permanently delete all your
                    expenses. This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={showClearModal}
        onClose={() => setShowClearModal(false)}
        title="Confirm Data Deletion"
        size="sm"
      >
        <div style={{ textAlign: "center" }}>
          <AlertTriangle
            size={48}
            color="#ef4444"
            style={{ marginBottom: "1rem" }}
          />
          <p style={{ marginBottom: "1rem" }}>
            This will permanently delete ALL your expenses. This action cannot
            be undone.
          </p>
          <div style={{ display: "flex", gap: "1rem" }}>
            <Button
              variant="secondary"
              onClick={() => setShowClearModal(false)}
              style={{ flex: 1 }}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleClearData}
              style={{ flex: 1 }}
            >
              <Trash2 size={16} />
              <span>Delete All</span>
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Settings;
