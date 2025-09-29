import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import EnhancedLogin from "../components/auth/EnhancedLogin";
import EnhancedRegister from "../components/auth/EnhancedRegister";
import EmailVerification from "../components/auth/EmailVerification";

function EnhancedAuthPage() {
  const { currentUser } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showVerification, setShowVerification] = useState(false);

  // Check if user needs email verification
  useEffect(() => {
    if (currentUser && !currentUser.emailVerified) {
      setShowVerification(true);
    } else {
      setShowVerification(false);
    }
  }, [currentUser]);

  const toggleMode = () => {
    setIsLogin(!isLogin);
  };

  const handleVerificationComplete = () => {
    setShowVerification(false);
  };

  //If user skips verification, he will be logged in but for a short while
  const handleSkipVerification = () => {
    setShowVerification(false);
  };

  // If user is logged in but email not verified
  if (currentUser && showVerification) {
    return (
      <EmailVerification
        onVerified={handleVerificationComplete}
        onSkip={handleSkipVerification}
      />
    );
  }

  return (
    <>
      {isLogin ? (
        <EnhancedLogin onToggleMode={toggleMode} />
      ) : (
        <EnhancedRegister onToggleMode={toggleMode} />
      )}
    </>
  );
}

export default EnhancedAuthPage;
