export const formatCurrency = (amount: number | null | undefined) => {
  if (amount === null || amount === undefined || amount === 0) return '';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2
  }).format(amount);
};