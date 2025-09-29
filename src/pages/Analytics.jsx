import React, { useState } from "react";
import {
  TrendingUp,
  DollarSign,
  Receipt,
  Target,
  Calendar,
  BarChart3,
} from "lucide-react";
import { useAnalytics } from "../hooks/useAnalytics";
import CategoryPieChart from "../components/analytics/CategoryPieChart";
import MonthlyBarChart from "../components/analytics/MonthlyBarChart";
import MetricCard from "../components/analytics/MetricCard";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import Button from "../components/ui/Button";
import Currency from "../components/ui/Currency"; //

function Analytics() {
  const [timeframe, setTimeframe] = useState("month");
  const analytics = useAnalytics(timeframe);

  if (analytics.loading) {
    return <LoadingSpinner text="Loading analytics..." />;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Analytics</h1>
        <p className="page-subtitle">
          Insights and visualizations of your spending
        </p>
      </div>

      {/* Time Frame Selector */}
      <div className="analytics-filters">
        <div className="filter-buttons">
          <Button
            variant={timeframe === "week" ? "primary" : "secondary"}
            size="sm"
            onClick={() => setTimeframe("week")}
          >
            This Week
          </Button>
          <Button
            variant={timeframe === "month" ? "primary" : "secondary"}
            size="sm"
            onClick={() => setTimeframe("month")}
          >
            This Month
          </Button>
          <Button
            variant={timeframe === "3months" ? "primary" : "secondary"}
            size="sm"
            onClick={() => setTimeframe("3months")}
          >
            Last 3 Months
          </Button>
          <Button
            variant={timeframe === "year" ? "primary" : "secondary"}
            size="sm"
            onClick={() => setTimeframe("year")}
          >
            This Year
          </Button>
          <Button
            variant={timeframe === "all" ? "primary" : "secondary"}
            size="sm"
            onClick={() => setTimeframe("all")}
          >
            All Time
          </Button>
        </div>
      </div>

      {analytics.expenseCount === 0 ? (
        <div className="empty-state">
          <BarChart3 size={64} color="#6b7280" />
          <h3>No Data Available</h3>
          <p>Add some expenses to see your analytics</p>
        </div>
      ) : (
        <>
          {/* Metric Cards
          <div className="metrics-grid">
            <MetricCard
              title="Total Spending"
              value={<Currency amount={analytics.totalExpenses} />}
              subtitle={`${analytics.expenseCount} transactions`}
              icon={<DollarSign size={24} />}
              color="#ef4444"
            />
            <MetricCard
              title="Average Expense"
              value={<Currency amount={analytics.averageExpense} />}
              subtitle="Per transaction"
              icon={<Receipt size={24} />}
              color="#3b82f6"
            />
            <MetricCard
              title="Daily Average"
              value={<Currency amount={analytics.dailyAverage} />}
              subtitle={`Over ${analytics.timeSpanDays} days`}
              icon={<Calendar size={24} />}
              color="#10b981"
            />
            <MetricCard
              title="Top Category"
              value={analytics.categoryBreakdown[0]?.name || "None"}
              subtitle={
                analytics.categoryBreakdown[0]
                  ? `${analytics.categoryBreakdown[0].percentage}% of spending`
                  : ""
              }
              icon={<Target size={24} />}
              color="#f59e0b"
            />
          </div> */}

          {/* Charts */}
          <div className="charts-grid">
            <div className="chart-card">
              <div className="chart-card-header">
                <h3>Spending by Category</h3>
                <p>Breakdown of expenses by category</p>
              </div>
              <CategoryPieChart data={analytics.categoryBreakdown} />
            </div>

            <div className="chart-card">
              <div className="chart-card-header">
                <h3>Monthly Trend</h3>
                <p>Spending over time</p>
              </div>
              <MonthlyBarChart data={analytics.monthlyTrend} />
            </div>
          </div>

          {/* Top Expenses */}
          {analytics.topExpenses.length > 0 && (
            <div className="top-expenses-card">
              <div className="chart-card-header">
                <h3>Top Expenses</h3>
                <p>Your highest spending transactions</p>
              </div>
              <div className="top-expenses-list">
                {analytics.topExpenses.map((expense, index) => (
                  <div key={expense.id} className="top-expense-item">
                    <div className="expense-rank">#{index + 1}</div>
                    <div className="expense-details">
                      <div className="expense-description">
                        {expense.description}
                      </div>
                      <div className="expense-meta">
                        {expense.categoryName} •{" "}
                        {new Date(expense.date).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="expense-amount">
                      <Currency amount={expense.amount} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Insights */}
          {analytics.insights.length > 0 && (
            <div className="insights-card">
              <div className="chart-card-header">
                <h3>Smart Insights</h3>
                <p>Observations about your spending patterns</p>
              </div>
              <div className="insights-list">
                {analytics.insights.map((insight, index) => (
                  <div key={index} className={`insight-item ${insight.type}`}>
                    <div className="insight-icon">{insight.icon}</div>
                    <div className="insight-content">
                      <div className="insight-title">{insight.title}</div>
                      <div className="insight-message">{insight.message}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Analytics;
