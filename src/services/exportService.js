import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  deleteDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import { DEFAULT_CATEGORIES } from "../constants/categories";

export const exportService = {
  exportToCSV: async (userId) => {
    try {
      const q = query(
        collection(db, "expenses"),
        where("userId", "==", userId),
        orderBy("date", "desc")
      );

      const snapshot = await getDocs(q);
      const expenses = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      if (expenses.length === 0) {
        throw new Error("No expenses to export");
      }

      const headers = ["Date", "Description", "Category", "Amount"];
      const csvContent = [
        headers.join(","),
        ...expenses.map((expense) => {
          const category = DEFAULT_CATEGORIES.find(
            (cat) => cat.id === expense.category
          );
          return [
            expense.date,
            `"${expense.description}"`,
            category ? category.name : expense.category,
            expense.amount,
          ].join(",");
        }),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `expenses_${new Date().toISOString().split("T")[0]}.csv`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      return { success: true, count: expenses.length };
    } catch (error) {
      console.error("Export error:", error);
      return { success: false, error: error.message };
    }
  },

  clearAllData: async (userId) => {
    try {
      const q = query(
        collection(db, "expenses"),
        where("userId", "==", userId)
      );
      const querySnapshot = await getDocs(q);

      // Use for...of instead of map + async (map won’t wait for promises)
      for (const document of querySnapshot.docs) {
        await deleteDoc(document.ref);
      }

      console.log("All data cleared");
      return { success: true, count: querySnapshot.docs.length };
    } catch (error) {
      console.error("Clear data error:", error);
      return { success: false, error: error.message };
    }
  },
};
