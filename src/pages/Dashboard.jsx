import React, { useState } from "react";
import {
  TrendingUp,
  DollarSign,
  Receipt,
  Target,
  Calendar,
  ArrowUp,
  ArrowDown,
  Plus,
  Eye,
  PieChart,
  Activity,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useExpenses } from "../hooks/useExpenses";
import { useAnalytics } from "../hooks/useAnalytics";
import { DEFAULT_CATEGORIES } from "../constants/categories";
import Button from "../components/ui/Button";
import Currency from "../components/ui/Currency";

function Dashboard({ onNavigate }) {
  const { isDarkMode } = useTheme();
  const { expenses, loading } = useExpenses();
  const [selectedTimeframe, setSelectedTimeframe] = useState("month");
  const analytics = useAnalytics(selectedTimeframe);

  // Calculate comparison with previous period
  const getPreviousPeriodComparison = () => {
    const now = new Date();
    let currentStart, previousStart, previousEnd;

    if (selectedTimeframe === "month") {
      currentStart = new Date(now.getFullYear(), now.getMonth(), 1);
      previousStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      previousEnd = new Date(now.getFullYear(), now.getMonth(), 0);
    } else if (selectedTimeframe === "week") {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      currentStart = weekAgo;
      previousStart = new Date(weekAgo.getTime() - 7 * 24 * 60 * 60 * 1000);
      previousEnd = weekAgo;
    }

    if (!previousStart) return { change: 0, isIncrease: false };

    const previousExpenses = expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= previousStart && expenseDate <= previousEnd;
    });

    const previousTotal = previousExpenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );
    const change =
      previousTotal > 0
        ? ((analytics.totalExpenses - previousTotal) / previousTotal) * 100
        : 0;

    return {
      change: Math.abs(change).toFixed(1),
      isIncrease: change > 0,
      previousTotal,
    };
  };

  const comparison = getPreviousPeriodComparison();

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-container">
          <div className="spinner spinner-lg"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Header with Time Filter */}
      <div className="dashboard-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">
            Overview of your expenses and spending patterns
          </p>
        </div>

        <div className="timeframe-selector">
          {[
            { key: "week", label: "This Week" },
            { key: "month", label: "This Month" },
            { key: "3months", label: "3 Months" },
            { key: "year", label: "This Year" },
            { key: "all", label: "All Time" },
          ].map((timeframe) => (
            <button
              key={timeframe.key}
              className={`timeframe-btn ${
                selectedTimeframe === timeframe.key ? "active" : ""
              }`}
              onClick={() => setSelectedTimeframe(timeframe.key)}
            >
              {timeframe.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="dashboard-stats">
        <div className="stat-card primary">
          <div className="stat-header">
            <div className="stat-icon">
              <DollarSign size={28} />
            </div>
            <div className="stat-trend">
              {comparison.change > 0 && (
                <span
                  className={`trend ${comparison.isIncrease ? "up" : "down"}`}
                >
                  {comparison.isIncrease ? (
                    <ArrowUp size={16} />
                  ) : (
                    <ArrowDown size={16} />
                  )}
                  {comparison.change}%
                </span>
              )}
            </div>
          </div>
          <div className="stat-content">
            <h3>Total Expenses</h3>
            <div className="stat-value">
              <Currency amount={analytics.totalExpenses} />
            </div>
            <p className="stat-subtitle">
              {selectedTimeframe === "all"
                ? "All time"
                : `This ${selectedTimeframe}`}
            </p>
          </div>
        </div>

        <div className="stat-card success">
          <div className="stat-header">
            <div className="stat-icon">
              <Receipt size={28} />
            </div>
          </div>
          <div className="stat-content">
            <h3>Transactions</h3>
            <div className="stat-value">{analytics.expenseCount}</div>
            <p className="stat-subtitle">
              <Currency amount={analytics.averageExpense} /> average
            </p>
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-header">
            <div className="stat-icon">
              <Activity size={28} />
            </div>
          </div>
          <div className="stat-content">
            <h3>Daily Average</h3>
            <div className="stat-value">
              <Currency amount={analytics.dailyAverage} />
            </div>
            <p className="stat-subtitle">Over {analytics.timeSpanDays} days</p>
          </div>
        </div>

        <div className="stat-card info">
          <div className="stat-header">
            <div className="stat-icon">
              <PieChart size={28} />
            </div>
          </div>
          <div className="stat-content">
            <h3>Top Category</h3>
            <div className="stat-value">
              {analytics.categoryBreakdown[0]?.name || "None"}
            </div>
            <p className="stat-subtitle">
              {analytics.categoryBreakdown[0]?.percentage || 0}% of total
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-grid">
        {/* Category Breakdown */}
        <div className="dashboard-card category-breakdown">
          <div className="card-header">
            <h3 className="card-title">Spending by Category</h3>
            <PieChart size={20} />
          </div>
          <div className="category-list">
            {analytics.categoryBreakdown.length > 0 ? (
              analytics.categoryBreakdown.map((category, index) => {
                const categoryInfo = DEFAULT_CATEGORIES.find(
                  (cat) => cat.name === category.name
                );
                const IconComponent = categoryInfo?.icon;

                return (
                  <div key={index} className="category-item">
                    <div className="category-info">
                      <div
                        className="category-icon-wrapper"
                        style={{ background: `${category.color}20` }}
                      >
                        {IconComponent && (
                          <IconComponent size={20} color={category.color} />
                        )}
                      </div>
                      <div className="category-details">
                        <span className="category-name">{category.name}</span>
                        <span className="category-percentage">
                          {category.percentage}%
                        </span>
                      </div>
                    </div>
                    <div className="category-amount">
                      <Currency amount={category.value} />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="empty-state">
                <PieChart size={48} color="#d1d5db" />
                <p>No expenses to categorize yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Expenses */}
        <div className="dashboard-card recent-expenses">
          <div className="card-header">
            <h3 className="card-title">Recent Expenses</h3>
          </div>
          <div className="expense-list">
            {analytics.topExpenses.length > 0 ? (
              analytics.topExpenses.slice(0, 5).map((expense, index) => {
                const categoryInfo = DEFAULT_CATEGORIES.find(
                  (cat) => cat.id === expense.category
                );
                const IconComponent = categoryInfo?.icon;

                return (
                  <div key={index} className="expense-item">
                    <div
                      className="expense-icon-wrapper"
                      style={{ background: `${categoryInfo?.color}20` }}
                    >
                      {IconComponent && (
                        <IconComponent size={18} color={categoryInfo?.color} />
                      )}
                    </div>
                    <div className="expense-details">
                      <span className="expense-description">
                        {expense.description}
                      </span>
                      <span className="expense-date">
                        {new Date(expense.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="expense-amount">
                      <Currency amount={expense.amount} />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="empty-state">
                <Receipt size={48} color="#d1d5db" />
                <p>No recent expenses</p>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onNavigate("add-expense")}
                >
                  <Plus size={16} />
                  Add First Expense
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Monthly Trend */}
        <div className="dashboard-card monthly-trend">
          <div className="card-header">
            <h3 className="card-title">Spending Trend</h3>
            <TrendingUp size={20} />
          </div>
          <div className="trend-chart">
            {analytics.monthlyTrend.length > 0 ? (
              <div className="trend-bars">
                {analytics.monthlyTrend.map((month, index) => {
                  const maxAmount = Math.max(
                    ...analytics.monthlyTrend.map((m) => m.amount)
                  );
                  const height =
                    maxAmount > 0 ? (month.amount / maxAmount) * 100 : 0;

                  return (
                    <div key={index} className="trend-bar-container">
                      <div
                        className="trend-bar"
                        style={{ height: `${height}%` }}
                        title={`${month.month}: $${month.amount.toFixed(2)}`}
                      ></div>
                      <span className="trend-label">
                        {month.month.slice(0, 3)}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="empty-state">
                <TrendingUp size={48} color="#d1d5db" />
                <p>Not enough data for trends</p>
              </div>
            )}
          </div>
        </div>

        {/* Insights */}
        <div className="dashboard-card insights">
          <div className="card-header">
            <h3 className="card-title">Smart Insights</h3>
            <Target size={20} />
          </div>
          <div className="insight-list">
            {analytics.insights.length > 0 ? (
              analytics.insights.map((insight, index) => (
                <div key={index} className={`insight-item ${insight.type}`}>
                  <div className="insight-icon">{insight.icon}</div>
                  <div className="insight-content">
                    <h4>{insight.title}</h4>
                    <p>{insight.message}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="insight-item positive">
                <div className="insight-icon">💡</div>
                <div className="insight-content">
                  <h4>Getting Started</h4>
                  <p>
                    Add more expenses to see personalized insights about your
                    spending patterns!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
