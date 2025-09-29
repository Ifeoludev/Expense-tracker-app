import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

export const expenseService = {
  addExpense: async (userId, expenseData) => {
    try {
      const docRef = await addDoc(collection(db, "expenses"), {
        ...expenseData,
        userId,
        amount: parseFloat(expenseData.amount),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      console.log("? Expense added with ID:", docRef.id);
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error("? Error adding expense:", error);
      return { success: false, error: error.message };
    }
  },

  updateExpense: async (expenseId, updates) => {
    try {
      const expenseRef = doc(db, "expenses", expenseId);
      await updateDoc(expenseRef, {
        ...updates,
        amount: parseFloat(updates.amount),
        updatedAt: serverTimestamp(),
      });

      console.log("? Expense updated:", expenseId);
      return { success: true };
    } catch (error) {
      console.error("? Error updating expense:", error);
      return { success: false, error: error.message };
    }
  },

  deleteExpense: async (expenseId) => {
    try {
      await deleteDoc(doc(db, "expenses", expenseId));
      console.log("? Expense deleted:", expenseId);
      return { success: true };
    } catch (error) {
      console.error("? Error deleting expense:", error);
      return { success: false, error: error.message };
    }
  },

  getUserExpenses: (userId, callback) => {
    const q = query(
      collection(db, "expenses"),
      where("userId", "==", userId),
      orderBy("date", "desc"),
      orderBy("createdAt", "desc")
    );

    return onSnapshot(
      q,
      (snapshot) => {
        const expenses = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        callback(expenses);
      },
      (error) => {
        console.error("? Error getting expenses:", error);
        callback([]);
      }
    );
  },
};
