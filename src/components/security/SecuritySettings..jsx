import React, { useState, useEffect } from "react";
import {
  Shield,
  Key,
  Mail,
  AlertTriangle,
  Eye,
  Clock,
  Smartphone,
  CheckCircle,
  XCircle,
  RefreshCw,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { authService } from "../../services/authService";
import Input from "../ui/Input";
import Button from "../ui/Button";
import Modal from "../ui/Modal";

function SecuritySettings() {
  const { currentUser } = useAuth();
  const [securityInfo, setSecurityInfo] = useState(null);
  const [securityEvents, setSecurityEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showChangeEmail, setShowChangeEmail] = useState(false);
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);

  // Password change form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  // Email change form
  const [emailForm, setEmailForm] = useState({
    newEmail: "",
    currentPassword: "",
  });
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailError, setEmailError] = useState("");

  // Delete account form
  const [deleteForm, setDeleteForm] = useState({
    password: "",
    confirmation: "",
  });
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    loadSecurityData();
  }, [currentUser]);

  const loadSecurityData = async () => {
    if (!currentUser) return;

    setLoading(true);

    const [securityResult, eventsResult] = await Promise.all([
      authService.getUserSecurityInfo(currentUser.uid),
      authService.getSecurityEvents(currentUser.uid, 10),
    ]);

    if (securityResult.success) {
      setSecurityInfo(securityResult.data);
    }

    if (eventsResult.success) {
      setSecurityEvents(eventsResult.events);
    }

    setLoading(false);
  };

  const handleResendVerification = async () => {
    const result = await authService.resendEmailVerification();
    if (result.success) {
      alert("Verification email sent!");
    } else {
      alert("Error: " + result.error);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError("");

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return;
    }

    setPasswordLoading(true);

    const result = await authService.changePassword(
      passwordForm.currentPassword,
      passwordForm.newPassword
    );

    if (result.success) {
      setShowChangePassword(false);
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      alert("Password changed successfully!");
      loadSecurityData();
    } else {
      setPasswordError(result.error);
    }

    setPasswordLoading(false);
  };

  const handleChangeEmail = async (e) => {
    e.preventDefault();
    setEmailError("");

    setEmailLoading(true);

    const result = await authService.updateEmail(
      emailForm.newEmail,
      emailForm.currentPassword
    );

    if (result.success) {
      setShowChangeEmail(false);
      setEmailForm({ newEmail: "", currentPassword: "" });
      alert("Verification email sent to your new email address!");
    } else {
      setEmailError(result.error);
    }

    setEmailLoading(false);
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    setDeleteError("");

    if (deleteForm.confirmation !== "DELETE") {
      setDeleteError("Please type 'DELETE' to confirm");
      return;
    }

    setDeleteLoading(true);

    const result = await authService.deleteAccount(deleteForm.password);

    if (result.success) {
      alert("Account deleted successfully");
      // User will be automatically logged out
    } else {
      setDeleteError(result.error);
    }

    setDeleteLoading(false);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "Never";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  const getEventIcon = (eventType) => {
    switch (eventType) {
      case "LOGIN_SUCCESS":
        return <CheckCircle size={16} color="#10b981" />;
      case "LOGIN_FAILED":
        return <XCircle size={16} color="#ef4444" />;
      case "PASSWORD_CHANGED":
        return <Key size={16} color="#3b82f6" />;
      case "EMAIL_VERIFICATION_RESENT":
        return <Mail size={16} color="#f59e0b" />;
      default:
        return <Shield size={16} color="#6b7280" />;
    }
  };

  if (loading) {
    return (
      <div className="security-settings">
        <div className="loading-container">
          <div className="spinner spinner-md"></div>
          <p>Loading security settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="security-settings">
      <div className="security-header">
        <Shield size={24} />
        <h2>Security Settings</h2>
        <p>Manage your account security and privacy</p>
      </div>

      {/* Account Status */}
      <div className="security-section">
        <h3>Account Status</h3>
        <div className="security-status">
          <div className="status-item">
            <div className="status-icon">
              {currentUser?.emailVerified ? (
                <CheckCircle size={20} color="#10b981" />
              ) : (
                <AlertTriangle size={20} color="#f59e0b" />
              )}
            </div>
            <div className="status-info">
              <h4>Email Verification</h4>
              <p>
                {currentUser?.emailVerified
                  ? "Your email is verified"
                  : "Your email is not verified"}
              </p>
            </div>
            {!currentUser?.emailVerified && (
              <Button
                variant="primary"
                size="sm"
                onClick={handleResendVerification}
              >
                Verify Now
              </Button>
            )}
          </div>

          <div className="status-item">
            <div className="status-icon">
              <Clock size={20} color="#6b7280" />
            </div>
            <div className="status-info">
              <h4>Last Login</h4>
              <p>{formatDate(securityInfo?.lastLoginAt)}</p>
            </div>
          </div>

          <div className="status-item">
            <div className="status-icon">
              <Key size={20} color="#6b7280" />
            </div>
            <div className="status-info">
              <h4>Password Last Changed</h4>
              <p>{formatDate(securityInfo?.passwordLastChanged)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Security Actions */}
      <div className="security-section">
        <h3>Security Actions</h3>
        <div className="security-actions">
          <Button variant="primary" onClick={() => setShowChangePassword(true)}>
            <Key size={18} />
            Change Password
          </Button>

          <Button variant="secondary" onClick={() => setShowChangeEmail(true)}>
            <Mail size={18} />
            Change Email
          </Button>

          <Button variant="danger" onClick={() => setShowDeleteAccount(true)}>
            <AlertTriangle size={18} />
            Delete Account
          </Button>
        </div>
      </div>

      {/* Recent Security Events */}
      <div className="security-section">
        <div className="section-header">
          <h3>Recent Security Activity</h3>
          <Button variant="secondary" size="sm" onClick={loadSecurityData}>
            <RefreshCw size={16} />
            Refresh
          </Button>
        </div>

        <div className="security-events">
          {securityEvents.length === 0 ? (
            <p>No recent security events</p>
          ) : (
            securityEvents.map((event) => (
              <div key={event.id} className="event-item">
                <div className="event-icon">
                  {getEventIcon(event.eventType)}
                </div>
                <div className="event-info">
                  <h4>{event.eventType.replace(/_/g, " ").toLowerCase()}</h4>
                  <p>{formatDate(event.timestamp)}</p>
                  {event.metadata?.email && (
                    <p className="event-detail">
                      Email: {event.metadata.email}
                    </p>
                  )}
                  {event.ipAddress && event.ipAddress !== "unknown" && (
                    <p className="event-detail">IP: {event.ipAddress}</p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Change Password Modal */}
      <Modal
        isOpen={showChangePassword}
        onClose={() => setShowChangePassword(false)}
        title="Change Password"
        size="md"
      >
        <form onSubmit={handleChangePassword}>
          {passwordError && (
            <div className="error-message">{passwordError}</div>
          )}

          <Input
            label="Current Password"
            type="password"
            value={passwordForm.currentPassword}
            onChange={(e) =>
              setPasswordForm({
                ...passwordForm,
                currentPassword: e.target.value,
              })
            }
            required
          />

          <Input
            label="New Password"
            type="password"
            value={passwordForm.newPassword}
            onChange={(e) =>
              setPasswordForm({
                ...passwordForm,
                newPassword: e.target.value,
              })
            }
            required
          />

          <Input
            label="Confirm New Password"
            type="password"
            value={passwordForm.confirmPassword}
            onChange={(e) =>
              setPasswordForm({
                ...passwordForm,
                confirmPassword: e.target.value,
              })
            }
            required
          />

          <div className="modal-actions">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowChangePassword(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={passwordLoading}>
              Change Password
            </Button>
          </div>
        </form>
      </Modal>

      {/* Change Email Modal */}
      <Modal
        isOpen={showChangeEmail}
        onClose={() => setShowChangeEmail(false)}
        title="Change Email Address"
        size="md"
      >
        <form onSubmit={handleChangeEmail}>
          {emailError && <div className="error-message">{emailError}</div>}

          <div className="current-email">
            <p>
              <strong>Current Email:</strong> {currentUser?.email}
            </p>
          </div>

          <Input
            label="New Email Address"
            type="email"
            value={emailForm.newEmail}
            onChange={(e) =>
              setEmailForm({
                ...emailForm,
                newEmail: e.target.value,
              })
            }
            required
          />

          <Input
            label="Current Password"
            type="password"
            value={emailForm.currentPassword}
            onChange={(e) =>
              setEmailForm({
                ...emailForm,
                currentPassword: e.target.value,
              })
            }
            required
          />

          <div className="modal-actions">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowChangeEmail(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={emailLoading}>
              Change Email
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Account Modal */}
      <Modal
        isOpen={showDeleteAccount}
        onClose={() => setShowDeleteAccount(false)}
        title="Delete Account"
        size="md"
      >
        <div className="delete-warning">
          <AlertTriangle size={48} color="#ef4444" />
          <h3>This action cannot be undone!</h3>
          <p>
            Deleting your account will permanently remove all your data,
            including expenses, settings, and account information.
          </p>
        </div>

        <form onSubmit={handleDeleteAccount}>
          {deleteError && <div className="error-message">{deleteError}</div>}

          <Input
            label="Current Password"
            type="password"
            value={deleteForm.password}
            onChange={(e) =>
              setDeleteForm({
                ...deleteForm,
                password: e.target.value,
              })
            }
            required
          />

          <Input
            label="Type 'DELETE' to confirm"
            type="text"
            value={deleteForm.confirmation}
            onChange={(e) =>
              setDeleteForm({
                ...deleteForm,
                confirmation: e.target.value,
              })
            }
            placeholder="DELETE"
            required
          />

          <div className="modal-actions">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowDeleteAccount(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="danger"
              loading={deleteLoading}
              disabled={deleteForm.confirmation !== "DELETE"}
            >
              Delete Account
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default SecuritySettings;
