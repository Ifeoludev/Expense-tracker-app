import { useMemo } from "react";
import { useExpenses } from "./useExpenses";
import { DEFAULT_CATEGORIES } from "../constants/categories";

export function useAnalytics(timeframe = "all") {
  const { expenses, loading } = useExpenses();

  const analytics = useMemo(() => {
    if (!expenses.length) {
      return {
        totalExpenses: 0,
        expenseCount: 0,
        averageExpense: 0,
        categoryBreakdown: [],
        monthlyTrend: [],
        dailyAverage: 0,
        topExpenses: [],
        insights: [],
      };
    }

    // Filter expenses by timeframe
    const now = new Date();
    const filteredExpenses = expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);

      switch (timeframe) {
        case "week":
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return expenseDate >= weekAgo;
        case "month":
          const monthAgo = new Date(now.getFullYear(), now.getMonth(), 1);
          return expenseDate >= monthAgo;
        case "3months":
          const threeMonthsAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 3,
            1
          );
          return expenseDate >= threeMonthsAgo;
        case "year":
          const yearAgo = new Date(now.getFullYear(), 0, 1);
          return expenseDate >= yearAgo;
        default:
          return true;
      }
    });

    // Calculate basic metrics
    const totalExpenses = filteredExpenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );
    const expenseCount = filteredExpenses.length;
    const averageExpense = expenseCount > 0 ? totalExpenses / expenseCount : 0;

    // Calculate category breakdown for pie chart
    const categoryTotals = filteredExpenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {});

    const categoryBreakdown = Object.entries(categoryTotals)
      .map(([categoryId, amount]) => {
        const categoryInfo = DEFAULT_CATEGORIES.find(
          (cat) => cat.id === categoryId
        );
        return {
          name: categoryInfo?.name || "Unknown",
          value: amount,
          color: categoryInfo?.color || "#6b7280",
          percentage: ((amount / totalExpenses) * 100).toFixed(1),
        };
      })
      .sort((a, b) => b.value - a.value);

    // Calculate monthly trend for line/bar chart
    const monthlyTotals = filteredExpenses.reduce((acc, expense) => {
      const month = new Date(expense.date).toISOString().slice(0, 7);
      acc[month] = (acc[month] || 0) + expense.amount;
      return acc;
    }, {});

    const monthlyTrend = Object.entries(monthlyTotals)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, amount]) => ({
        month: new Date(month + "-01").toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        }),
        amount: amount,
        expenses: filteredExpenses.filter((e) => e.date.startsWith(month))
          .length,
      }));

    // Calculate daily average
    const timeSpanDays = (() => {
      switch (timeframe) {
        case "week":
          return 7;
        case "month":
          return 30;
        case "3months":
          return 90;
        case "year":
          return 365;
        default:
          if (filteredExpenses.length === 0) return 1;
          const oldestDate = new Date(
            Math.min(...filteredExpenses.map((e) => new Date(e.date)))
          );
          const daysDiff = Math.ceil(
            (now - oldestDate) / (1000 * 60 * 60 * 24)
          );
          return Math.max(daysDiff, 1);
      }
    })();
    const dailyAverage = totalExpenses / timeSpanDays;

    // Get top 5 expenses
    const topExpenses = [...filteredExpenses]
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5)
      .map((expense) => ({
        ...expense,
        categoryName:
          DEFAULT_CATEGORIES.find((cat) => cat.id === expense.category)?.name ||
          "Unknown",
      }));

    // Generate insights
    const insights = generateInsights(
      filteredExpenses,
      categoryBreakdown,
      timeframe
    );

    return {
      totalExpenses,
      expenseCount,
      averageExpense,
      categoryBreakdown,
      monthlyTrend,
      dailyAverage,
      topExpenses,
      insights,
      timeSpanDays,
    };
  }, [expenses, timeframe]);

  return { ...analytics, loading };
}

function generateInsights(expenses, categoryBreakdown, timeframe) {
  const insights = [];

  if (expenses.length === 0) return insights;

  // Top spending category
  if (categoryBreakdown.length > 0) {
    const topCategory = categoryBreakdown[0];
    insights.push({
      type: "category",
      title: "Top Spending Category",
      message: `You spend the most on ${topCategory.name} (${topCategory.percentage}% of total)`,
      icon: "📉",
    });
  }

  // High spending days
  const dayTotals = expenses.reduce((acc, expense) => {
    const day = expense.date;
    acc[day] = (acc[day] || 0) + expense.amount;
    return acc;
  }, {});

  const avgDailySpending =
    Object.values(dayTotals).reduce((sum, amount) => sum + amount, 0) /
    Object.keys(dayTotals).length;
  const highSpendingDays = Object.entries(dayTotals).filter(
    ([, amount]) => amount > avgDailySpending * 2
  );

  if (highSpendingDays.length > 0) {
    insights.push({
      type: "warning",
      title: "High Spending Days",
      message: `You had ${highSpendingDays.length} days with unusually high spending`,
      icon: "",
    });
  }

  // Spending consistency
  const dailyAmounts = Object.values(dayTotals);
  if (dailyAmounts.length > 1) {
    const maxDaily = Math.max(...dailyAmounts);
    const minDaily = Math.min(...dailyAmounts);
    const variance = maxDaily - minDaily;

    if (variance < avgDailySpending * 0.5) {
      insights.push({
        type: "positive",
        title: "Consistent Spending",
        message: "Your daily spending is fairly consistent",
        icon: "✅",
      });
    }
  }

  return insights;
}
