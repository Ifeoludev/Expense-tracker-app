import React from "react";

function Currency({
  amount,
  className = "",
  showSymbol = true,
  precision = 2,
}) {
  const formatAmount = (value) => {
    if (typeof value !== "number" || isNaN(value)) {
      return showSymbol ? "<span>&#8358;0.00</span>" : "0.00";
    }

    if (showSymbol) {
      return `${"\u20A6"}${value.toLocaleString("en-NG", {
        minimumFractionDigits: precision,
        maximumFractionDigits: precision,
      })}`;
    } else {
      return value.toLocaleString("en-NG", {
        minimumFractionDigits: precision,
        maximumFractionDigits: precision,
      });
    }
  };

  return (
    <span className={`currency-display ${className}`} title={`\u20A6${amount}`}>
      {formatAmount(amount)}
    </span>
  );
}

export default Currency;
