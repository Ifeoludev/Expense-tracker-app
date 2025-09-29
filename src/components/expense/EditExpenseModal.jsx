import React, { useState, useEffect } from "react";
import { Save } from "lucide-react";
import { DEFAULT_CATEGORIES } from "../../constants/categories";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Button from "../ui/Button";

function EditExpenseModal({ expense, isOpen, onClose, onSave, loading }) {
  const [formData, setFormData] = useState({
    amount: "",
    description: "",
    category: "food",
    date: "",
  });

  // Populate form only when expense changes
  useEffect(() => {
    if (expense) {
      setFormData({
        amount: String(expense.amount ?? ""),
        description: expense.description ?? "",
        category: expense.category ?? "food",
        date: expense.date ?? "",
      });
    }
  }, [expense]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategorySelect = (categoryId) => {
    setFormData((prev) => ({ ...prev, category: categoryId }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!expense?.id) return;
    onSave(expense.id, formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Expense" size="md">
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <Input
            label="Amount ($)"
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

        {/* Description */}
        <Input
          label="Description"
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="What did you spend on?"
          required
        />

        {/* Category Grid */}
        <div className="form-group">
          <label className="form-label">Category</label>
          <div className="category-grid">
            {DEFAULT_CATEGORIES.map(({ id, name, icon: Icon, color }) => (
              <div
                key={id}
                className={`category-option ${
                  formData.category === id ? "selected" : ""
                }`}
                onClick={() => handleCategorySelect(id)}
              >
                <Icon size={24} color={color} strokeWidth={2} />
                <span className="category-name">{name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="form-actions">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={loading}>
            <Save size={18} />
            <span>Save Changes</span>
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default EditExpenseModal;
