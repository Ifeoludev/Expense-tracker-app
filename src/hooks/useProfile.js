// hooks/useProfile.js - Updated for Naira only
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { doc, setDoc, onSnapshot } from "firebase/firestore";
import {
  updateProfile as updateAuthProfile,
  updatePassword,
} from "firebase/auth";
import { db } from "../services/firebase";

export function useProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();
  const unsubscribeRef = useRef(null);

  useEffect(() => {
    // Clean up previous listener if it exists
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }

    if (!currentUser) {
      setProfile(null);
      setLoading(false);
      return;
    }

    const profileRef = doc(db, "profiles", currentUser.uid);

    const unsubscribe = onSnapshot(
      profileRef,
      async (docSnap) => {
        if (docSnap.exists()) {
          setProfile({ id: docSnap.id, ...docSnap.data() });
        } else {
          const defaultProfile = {
            displayName: currentUser.displayName || "",
            email: currentUser.email || "",
            currency: "\u20A6",
            monthlyBudget: 150000,
            budgetAlert: 80,
            categoryBudgets: {
              food: 40000,
              transport: 30000,
              shopping: 25000,
              entertainment: 15000,
              bills: 20000,
              other: 10000,
            },
            preferences: {
              darkMode: false,
              notifications: true,
              autoCategories: true,
            },
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          setProfile(defaultProfile);

          try {
            await setDoc(profileRef, defaultProfile);
          } catch (err) {
            console.error("Error creating default profile:", err);
            setError(err.message);
          }
        }
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching profile:", err);
        setError(err.message);
        setLoading(false);
      }
    );

    unsubscribeRef.current = unsubscribe;

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [currentUser]);

  // Update profile
  const updateProfile = async (updates) => {
    if (!currentUser) return { success: false, error: "Not authenticated" };

    try {
      setError(null);

      // Remove undefined values from updates
      const cleanUpdates = {};
      Object.keys(updates).forEach((key) => {
        if (updates[key] !== undefined) {
          cleanUpdates[key] = updates[key];
        }
      });

      if (cleanUpdates.currency && cleanUpdates.currency !== "NGN") {
        cleanUpdates.currency = "NGN";
      }

      const profileRef = doc(db, "profiles", currentUser.uid);

      const updatedProfile = {
        ...profile,
        ...cleanUpdates,
        currency: "\u20A6",
        updatedAt: new Date(),
      };

      await setDoc(profileRef, updatedProfile, { merge: true });

      // Update Firebase Auth displayName if changed
      if (
        cleanUpdates.displayName &&
        cleanUpdates.displayName !== currentUser.displayName
      ) {
        await updateAuthProfile(currentUser, {
          displayName: cleanUpdates.displayName,
        });
      }

      console.log("Profile updated successfully");
      return { success: true };
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  // Change password
  const changePassword = async (newPassword) => {
    if (!currentUser) return { success: false, error: "Not authenticated" };

    try {
      setError(null);
      await updatePassword(currentUser, newPassword);
      return { success: true };
    } catch (err) {
      console.error("Error changing password:", err);
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  return {
    profile,
    loading,
    error,
    updateProfile,
    changePassword,
  };
}
