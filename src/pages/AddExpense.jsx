import React, { useState } from "react";
import { useExpenses } from "../hooks/useExpenses";
import { DEFAULT_CATEGORIES } from "../constants/categories";
import { Save } from "lucide-react";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { useProfile } from "../hooks/useProfile";

function AddExpense() {
  const { addExpense } = useExpenses();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { profile } = useProfile();

  const [formData, setFormData] = useState({
    amount: "",
    description: "",
    category: "food",
    date: new Date().toISOString().split("T")[0],
  });

  const currencySymbol = "\u20A6";

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCategorySelect = (categoryId) => {
    setFormData({
      ...formData,
      category: categoryId,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    setLoading(true);

    const result = await addExpense(formData);

    if (result.success) {
      console.log(" Expense added successfully!");
      setFormData({
        amount: "",
        description: "",
        category: "food",
        date: new Date().toISOString().split("T")[0],
      });
      alert(" Expense added successfully!");
    } else {
      setError(result.error || "Failed to add expense");
    }

    setLoading(false);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Add Expense</h1>
        <p className="page-subtitle">Record a new expense transaction</p>
      </div>

      <div className="expense-form-container">
        <form onSubmit={handleSubmit} className="expense-form-card">
          {error && <div className="error-message">{error}</div>}

          <div className="form-row">
            <Input
              label={`Amount (${currencySymbol})`}
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              required
            />

            <Input
              label="Date"
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          <Input
            label="Description"
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="What did you spend on?"
            required
          />

          <div className="form-group">
            <label className="form-label">Category</label>
            <div className="category-grid">
              {DEFAULT_CATEGORIES.map((category) => {
                const IconComponent = category.icon;
                return (
                  <div
                    key={category.id}
                    className={`category-option ${
                      formData.category === category.id ? "selected" : ""
                    }`}
                    onClick={() => handleCategorySelect(category.id)}
                  >
                    <IconComponent
                      size={28}
                      color={category.color}
                      strokeWidth={2}
                    />
                    <span className="category-name">{category.name}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="form-actions">
            <Button type="submit" variant="primary" size="lg" loading={loading}>
              <Save size={20} />
              <span>Add Expense</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddExpense;
