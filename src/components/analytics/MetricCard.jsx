import React from "react";

function MetricCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  color = "#3b82f6",
}) {
  return (
    <div className="metric-card">
      <div className="metric-header">
        <div
          className="metric-icon"
          style={{ backgroundColor: `${color}20`, color: color }}
        >
          {icon}
        </div>
        {trend && (
          <div className={`metric-trend ${trend.direction}`}>
            <span className="trend-icon">
              {trend.direction === "up"
                ? "↗"
                : trend.direction === "down"
                ? "↘"
                : "➡"}
            </span>
            <span>{trend.value}</span>
          </div>
        )}
      </div>
      <div className="metric-content">
        <div className="metric-value">{value}</div>
        <div className="metric-title">{title}</div>
        {subtitle && <div className="metric-subtitle">{subtitle}</div>}
      </div>
    </div>
  );
}

export default MetricCard;
