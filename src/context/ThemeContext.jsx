import React, { createContext, useContext, useEffect, useState } from "react";
import { useProfile } from "../hooks/useProfile";
import { currencyService } from "../services/currencyService";

const ThemeContext = createContext();

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }) {
  const { profile, updateProfile } = useProfile();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (profile?.preferences?.darkMode !== undefined) {
      setIsDarkMode(profile.preferences.darkMode);
    }
  }, [profile]);

  useEffect(() => {
    const applyTheme = () => {
      if (isDarkMode) {
        document.documentElement.classList.add("dark-theme");
        document.body.classList.add("dark-theme");
        const rootElement = document.getElementById("root");
        if (rootElement) {
          rootElement.classList.add("dark-theme");
        }
      } else {
        document.documentElement.classList.remove("dark-theme");
        document.body.classList.remove("dark-theme");
        const rootElement = document.getElementById("root");
        if (rootElement) {
          rootElement.classList.remove("dark-theme");
        }
      }
    };

    applyTheme();
    document.body.offsetHeight;
  }, [isDarkMode]);

  const toggleDarkMode = async () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);

    if (profile) {
      await updateProfile({
        preferences: {
          ...profile.preferences,
          darkMode: newDarkMode,
        },
      });
    }
  };

  const value = {
    isDarkMode,
    toggleDarkMode,
    currency: "NGN",
    currencySymbol: "\u20A6",
    formatCurrency: (amount) => currencyService.formatCurrency(amount),
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
