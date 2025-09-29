import React from "react";
import { Edit2, Trash2 } from "lucide-react";
import { DEFAULT_CATEGORIES } from "../../constants/categories";
import Button from "../ui/Button";
import Currency from "../ui/Currency";

function ExpenseItem({ expense, onEdit, onDelete }) {
  // Find the category info for this expense
  const categoryInfo = DEFAULT_CATEGORIES.find(
    (cat) => cat.id === expense.category
  );
  const IconComponent = categoryInfo?.icon;

  // Format the date nicely
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="expense-item">
      <div className="expense-icon">
        {IconComponent && (
          <IconComponent size={24} color={categoryInfo.color} strokeWidth={2} />
        )}
      </div>

      <div className="expense-details">
        <div className="expense-description">{expense.description}</div>
        <div className="expense-category">
          {categoryInfo?.name || "Unknown"}
        </div>
      </div>

      <div className="expense-date">{formatDate(expense.date)}</div>

      <div className="expense-amount">
        <Currency amount={expense.amount} />
      </div>

      <div className="expense-actions">
        <Button variant="secondary" size="sm" onClick={() => onEdit(expense)}>
          <Edit2 size={14} />
        </Button>
        <Button variant="danger" size="sm" onClick={() => onDelete(expense)}>
          <Trash2 size={14} />
        </Button>
      </div>
    </div>
  );
}

export default ExpenseItem;
