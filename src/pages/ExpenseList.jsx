import React, { useState } from "react";
import { Search, Filter, Trash2 } from "lucide-react";
import { useExpenses } from "../hooks/useExpenses";
import { useTheme } from "../context/ThemeContext";
import { DEFAULT_CATEGORIES } from "../constants/categories";
import ExpenseItem from "../components/expense/ExpenseItem";
import EditExpenseModal from "../components/expense/EditExpenseModal";
import Modal from "../components/ui/Modal";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import Currency from "../components/ui/Currency";

function ExpenseList() {
  const { expenses, loading, error, updateExpense, deleteExpense } =
    useExpenses();

  const [editingExpense, setEditingExpense] = useState(null);
  const [editLoading, setEditLoading] = useState(false);

  const [deletingExpense, setDeletingExpense] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch = expense.description
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesCategory =
      !categoryFilter || expense.category === categoryFilter;

    const matchesDate = !dateFilter || expense.date.startsWith(dateFilter);

    return matchesSearch && matchesCategory && matchesDate;
  });

  const totalAmount = filteredExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );
  const totalCount = filteredExpenses.length;

  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
  };

  const handleSaveEdit = async (expenseId, formData) => {
    setEditLoading(true);

    const result = await updateExpense(expenseId, formData);

    if (result.success) {
      setEditingExpense(null);
      console.log("? Expense updated successfully!");
    } else {
      alert("? Failed to update expense: " + result.error);
    }

    setEditLoading(false);
  };

  const handleCloseEdit = () => {
    setEditingExpense(null);
  };

  const handleDeleteExpense = (expense) => {
    setDeletingExpense(expense);
  };

  const handleConfirmDelete = async () => {
    if (!deletingExpense) return;

    setDeleteLoading(true);

    const result = await deleteExpense(deletingExpense.id);

    if (result.success) {
      setDeletingExpense(null);
      console.log("? Expense deleted successfully!");
    } else {
      alert("? Failed to delete expense: " + result.error);
    }

    setDeleteLoading(false);
  };

  const handleCancelDelete = () => {
    setDeletingExpense(null);
  };

  if (loading) {
    return <LoadingSpinner text="Loading expenses..." />;
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="error-message">Error loading expenses: {error}</div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">All Expenses</h1>
        <p className="page-subtitle">View and manage your expense history</p>
      </div>

      <div className="expense-summary">
        <div className="summary-card">
          <div className="summary-value">{totalCount}</div>
          <div className="summary-label">Total Expenses</div>
        </div>
        <div className="summary-card">
          <div className="summary-value">
            <Currency amount={totalAmount} />
          </div>
          <div className="summary-label">Total Amount</div>
        </div>
        <div className="summary-card">
          <div className="summary-value">
            <Currency amount={totalCount > 0 ? totalAmount / totalCount : 0} />
          </div>
          <div className="summary-label">Average</div>
        </div>
      </div>

      <div className="expense-filters">
        <div className="filter-item">
          <Input
            label=""
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search expenses..."
          />
        </div>

        <div className="filter-item">
          <select
            className="form-input"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            {DEFAULT_CATEGORIES.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-item">
          <input
            type="month"
            className="form-input"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            placeholder="Filter by month"
          />
        </div>

        {(searchTerm || categoryFilter || dateFilter) && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setSearchTerm("");
              setCategoryFilter("");
              setDateFilter("");
            }}
          >
            Clear Filters
          </Button>
        )}
      </div>

      <div className="expense-list-container">
        {filteredExpenses.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">??</div>
            <h3>No expenses found</h3>
            <p>
              {expenses.length === 0
                ? "You haven't added any expenses yet."
                : "No expenses match your current filters."}
            </p>
          </div>
        ) : (
          <div className="expense-list">
            <div className="expense-list-header">
              <div>Description</div>
              <div>Date</div>
              <div>Amount</div>
              <div>Actions</div>
            </div>

            {filteredExpenses.map((expense) => (
              <ExpenseItem
                key={expense.id}
                expense={expense}
                onEdit={handleEditExpense}
                onDelete={handleDeleteExpense}
              />
            ))}
          </div>
        )}
      </div>

      <EditExpenseModal
        expense={editingExpense}
        isOpen={!!editingExpense}
        onClose={handleCloseEdit}
        onSave={handleSaveEdit}
        loading={editLoading}
      />

      <Modal
        isOpen={!!deletingExpense}
        onClose={handleCancelDelete}
        title="Delete Expense"
        size="sm"
      >
        <div style={{ textAlign: "center", padding: "1rem 0" }}>
          <Trash2 size={48} color="#ef4444" style={{ marginBottom: "1rem" }} />
          <h3 style={{ marginBottom: "1rem", color: "#1f2937" }}>
            Are you sure?
          </h3>
          <p style={{ marginBottom: "2rem", color: "#6b7280" }}>
            Do you want to delete "{deletingExpense?.description}"? This action
            cannot be undone.
          </p>

          <div
            style={{ display: "flex", gap: "1rem", justifyContent: "center" }}
          >
            <Button variant="secondary" onClick={handleCancelDelete}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleConfirmDelete}
              loading={deleteLoading}
            >
              <Trash2 size={16} />
              <span>Delete</span>
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default ExpenseList;
