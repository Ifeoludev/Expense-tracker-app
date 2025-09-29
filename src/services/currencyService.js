import { CURRENCY } from "../constants/categories";

export const currencyService = {
  getCurrencySymbol: () => {
    return CURRENCY.symbol; // ?
  },

  formatCurrency: (amount) => {
    if (typeof amount !== "number" || isNaN(amount)) {
      return `${CURRENCY.symbol}0.00`;
    }

    return `${CURRENCY.symbol}${amount.toLocaleString("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  },

  getCurrencyCode: () => {
    return CURRENCY.code;
  },

  getCurrencyName: () => {
    return CURRENCY.name;
  },
};
