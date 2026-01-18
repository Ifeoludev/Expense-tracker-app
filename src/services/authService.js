import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  sendEmailVerification,
  sendPasswordResetEmail,
  confirmPasswordReset,
  verifyBeforeUpdateEmail,
  reauthenticateWithCredential,
  EmailAuthProvider,
  deleteUser,
  onAuthStateChanged,
  updatePassword,
} from "firebase/auth";
import { auth, db } from "./firebase";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  serverTimestamp,
} from "firebase/firestore";

export const authService = {
  register: async (email, password, displayName) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      const user = userCredential.user;

      await updateProfile(user, {
        displayName: displayName,
      });

      await sendEmailVerification(user, {
        url: `${window.location.origin}/verify-email`,
        handleCodeInApp: true,
      });

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: displayName,
        emailVerified: false,
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
        securitySettings: {
          twoFactorEnabled: false,
          passwordLastChanged: serverTimestamp(),
          loginNotifications: true,
        },
      });

      await authService.logSecurityEvent(user.uid, "ACCOUNT_CREATED", {
        email: user.email,
        method: "email_password",
      });

      return {
        success: true,
        user: user,
        message:
          "Account created! Please check your email to verify your account.",
      };
    } catch (error) {
      console.error("Registration error:", error);
      return {
        success: false,
        error: authService.getErrorMessage(error.code),
        code: error.code,
      };
    }
  },

  login: async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );

      const user = userCredential.user;

      await updateDoc(doc(db, "users", user.uid), {
        lastLoginAt: serverTimestamp(),
      });

      await authService.logSecurityEvent(user.uid, "LOGIN_SUCCESS", {
        email: user.email,
        emailVerified: user.emailVerified,
      });

      return {
        success: true,
        user: user,
        message: "Login successful!",
      };
    } catch (error) {
      console.error("Login error:", error);

      if (email) {
        await authService.logSecurityEvent(null, "LOGIN_FAILED", {
          email: email,
          error: error.code,
          timestamp: new Date().toISOString(),
        });
      }

      return {
        success: false,
        error: authService.getErrorMessage(error.code),
        code: error.code,
      };
    }
  },

  logout: async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        await authService.logSecurityEvent(user.uid, "LOGOUT", {
          email: user.email,
        });
      }

      await signOut(auth);

      await new Promise((resolve) => setTimeout(resolve, 100));

      return { success: true };
    } catch (error) {
      console.error("Logout error:", error);
      return { success: false, error: error.message };
    }
  },

  resetPassword: async (email) => {
    try {
      await sendPasswordResetEmail(auth, email, {
        url: `${window.location.origin}/login`,
        handleCodeInApp: false,
      });

      await authService.logSecurityEvent(null, "PASSWORD_RESET_REQUESTED", {
        email: email,
      });

      return {
        success: true,
        message: "Password reset email sent! Check your inbox.",
      };
    } catch (error) {
      console.error("Password reset error:", error);
      return {
        success: false,
        error: authService.getErrorMessage(error.code),
      };
    }
  },

  confirmPasswordReset: async (code, newPassword) => {
    try {
      await confirmPasswordReset(auth, code, newPassword);

      return {
        success: true,
        message:
          "Password reset successful! You can now login with your new password.",
      };
    } catch (error) {
      console.error("Password reset confirmation error:", error);
      return {
        success: false,
        error: authService.getErrorMessage(error.code),
      };
    }
  },

  resendEmailVerification: async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { success: false, error: "No user logged in" };
      }

      await sendEmailVerification(user, {
        url: `${window.location.origin}/verify-email`, //(IFE-DON'T FORGET TO CHANGE THIS URL TO THE DEPLOYED LINK!!)
        handleCodeInApp: true,
      });

      await authService.logSecurityEvent(
        user.uid,
        "EMAIL_VERIFICATION_RESENT",
        {
          email: user.email,
        },
      );

      return {
        success: true,
        message: "Verification email sent! Check your inbox.",
      };
    } catch (error) {
      console.error("Resend verification error:", error);
      return {
        success: false,
        error: authService.getErrorMessage(error.code),
      };
    }
  },

  updateEmail: async (newEmail, currentPassword) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { success: false, error: "No user logged in" };
      }

      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword,
      );
      await reauthenticateWithCredential(user, credential);

      await verifyBeforeUpdateEmail(user, newEmail, {
        url: `${window.location.origin}/verify-email`,
        handleCodeInApp: true,
      });

      await authService.logSecurityEvent(user.uid, "EMAIL_CHANGE_REQUESTED", {
        oldEmail: user.email,
        newEmail: newEmail,
      });

      return {
        success: true,
        message: "Verification email sent to your new email address.",
      };
    } catch (error) {
      console.error("Email update error:", error);
      return {
        success: false,
        error: authService.getErrorMessage(error.code),
      };
    }
  },

  changePassword: async (currentPassword, newPassword) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { success: false, error: "No user logged in" };
      }

      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword,
      );
      await reauthenticateWithCredential(user, credential);

      await updatePassword(user, newPassword);

      await updateDoc(doc(db, "users", user.uid), {
        "securitySettings.passwordLastChanged": serverTimestamp(),
      });

      await authService.logSecurityEvent(user.uid, "PASSWORD_CHANGED", {
        email: user.email,
      });

      return {
        success: true,
        message: "Password changed successfully!",
      };
    } catch (error) {
      console.error("Password change error:", error);
      return {
        success: false,
        error: authService.getErrorMessage(error.code),
      };
    }
  },

  deleteAccount: async (password) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { success: false, error: "No user logged in" };
      }

      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, credential);

      const userId = user.uid;
      const userEmail = user.email;

      await deleteDoc(doc(db, "users", userId));

      const expensesQuery = query(
        collection(db, "expenses"),
        where("userId", "==", userId),
      );
      const expensesSnapshot = await getDocs(expensesQuery);

      const deletePromises = expensesSnapshot.docs.map((doc) =>
        deleteDoc(doc.ref),
      );
      await Promise.all(deletePromises);

      await authService.logSecurityEvent(userId, "ACCOUNT_DELETED", {
        email: userEmail,
      });

      await deleteUser(user);

      return {
        success: true,
        message: "Account deleted successfully.",
      };
    } catch (error) {
      console.error("Account deletion error:", error);
      return {
        success: false,
        error: authService.getErrorMessage(error.code),
      };
    }
  },

  getCurrentUser: () => {
    return auth.currentUser;
  },

  isAuthenticated: () => {
    const user = auth.currentUser;
    return user && user.emailVerified;
  },

  getUserSecurityInfo: async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        return {
          success: true,
          data: {
            emailVerified: userData.emailVerified,
            lastLoginAt: userData.lastLoginAt,
            passwordLastChanged: userData.securitySettings?.passwordLastChanged,
            twoFactorEnabled:
              userData.securitySettings?.twoFactorEnabled || false,
            loginNotifications:
              userData.securitySettings?.loginNotifications || true,
          },
        };
      }
      return { success: false, error: "User not found" };
    } catch (error) {
      console.error("Get security info error:", error);
      return { success: false, error: error.message };
    }
  },

  getSecurityEvents: async (userId, limitCount = 10) => {
    try {
      const eventsQuery = query(
        collection(db, "securityEvents"),
        where("userId", "==", userId),
        orderBy("timestamp", "desc"),
        limit(limitCount),
      );
      const eventsSnapshot = await getDocs(eventsQuery);
      const events = eventsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return { success: true, events };
    } catch (error) {
      console.warn("Security events unavailable:", error.message);
      return {
        success: true,
        events: [],
        message: "Security events unavailable - check Firestore permissions",
      };
    }
  },

  logSecurityEvent: async (userId, eventType, metadata = {}) => {
    try {
      if (!auth.currentUser && userId) {
        console.log("Security Event (offline):", {
          userId,
          eventType,
          metadata,
          timestamp: new Date().toISOString(),
        });
        return;
      }
      await addDoc(collection(db, "securityEvents"), {
        userId: userId,
        eventType: eventType,
        metadata: metadata,
        timestamp: serverTimestamp(),
        ipAddress: await authService.getClientIP(),
        userAgent: navigator.userAgent,
      });
    } catch (error) {
      if (
        error.code === "permission-denied" ||
        error.code === "unauthenticated"
      ) {
        console.warn(
          "Security logging disabled - Firestore permissions not configured",
        );
        console.log("Security Event (local):", {
          userId,
          eventType,
          metadata,
          timestamp: new Date().toISOString(),
          error: "Firestore permissions not configured",
        });
      } else {
        console.error("Security event logging error:", error);
      }
    }
  },

  getClientIP: async () => {
    try {
      const response = await fetch("https://api.ipify.org?format=json");
      const data = await response.json();
      return data.ip;
    } catch {
      return "unknown";
    }
  },

  getErrorMessage: (errorCode) => {
    const errorMessages = {
      "auth/user-not-found": "No account found with this email address.",
      "auth/wrong-password": "Incorrect password. Please try again.",
      "auth/email-already-in-use": "An account with this email already exists.",
      "auth/weak-password": "Password should be at least 6 characters long.",
      "auth/invalid-email": "Please enter a valid email address.",
      "auth/user-disabled": "This account has been disabled.",
      "auth/too-many-requests":
        "Too many failed attempts. Please try again later.",
      "auth/network-request-failed":
        "Network error. Please check your connection.",
      "auth/requires-recent-login":
        "Please log out and log back in to perform this action.",
      "auth/invalid-action-code": "Invalid or expired verification code.",
      "auth/expired-action-code": "This verification link has expired.",
      "auth/invalid-continue-uri": "Invalid redirect URL.",
      "email-not-verified":
        "Please verify your email address before logging in.",
    };

    return (
      errorMessages[errorCode] ||
      "An unexpected error occurred. Please try again."
    );
  },
  onAuthStateChange: (callback) => {
    return onAuthStateChanged(auth, callback);
  },
};
