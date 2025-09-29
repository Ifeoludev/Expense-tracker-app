import { Utensils, Car, ShoppingBag, Film, Zap, FileText } from "lucide-react";

export const DEFAULT_CATEGORIES = [
  {
    id: "food",
    name: "Food & Dining",
    icon: Utensils,
    color: "#f59e0b",
  },
  {
    id: "transport",
    name: "Transportation",
    icon: Car,
    color: "#3b82f6",
  },
  {
    id: "shopping",
    name: "Shopping",
    icon: ShoppingBag,
    color: "#10b981",
  },
  {
    id: "entertainment",
    name: "Entertainment",
    icon: Film,
    color: "#ef4444",
  },
  {
    id: "bills",
    name: "Bills & Utilities",
    icon: Zap,
    color: "#8b5cf6",
  },
  {
    id: "other",
    name: "Other",
    icon: FileText,
    color: "#6b7280",
  },
];

export const CURRENCY = {
  code: "NGN",
  symbol: "\u20A6",
  name: "Nigerian Naira",
};
