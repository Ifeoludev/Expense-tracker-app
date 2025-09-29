import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { expenseService } from "../services/expenseService";

export function useExpenses() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();
  const unsubscribeRef = useRef(null);

  useEffect(() => {
    // Clean up previous listener
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }

    if (!currentUser) {
      setExpenses([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const unsubscribe = expenseService.getUserExpenses(
      currentUser.uid,
      (expensesData) => {
        setExpenses(expensesData);
        setLoading(false);
        setError(null);
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

  const addExpense = async (expenseData) => {
    setError(null);
    const result = await expenseService.addExpense(
      currentUser.uid,
      expenseData
    );

    if (!result.success) {
      setError(result.error);
    }

    return result;
  };

  const updateExpense = async (expenseId, updates) => {
    setError(null);
    const result = await expenseService.updateExpense(expenseId, updates);

    if (!result.success) {
      setError(result.error);
    }

    return result;
  };

  const deleteExpense = async (expenseId) => {
    setError(null);
    const result = await expenseService.deleteExpense(expenseId);

    if (!result.success) {
      setError(result.error);
    }

    return result;
  };

  return {
    expenses,
    loading,
    error,
    addExpense,
    updateExpense,
    deleteExpense,
  };
}
