export const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);

export const formatDate = (timestamp: number) =>
  new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(timestamp));

export const formatDateShort = (timestamp: number) =>
  new Intl.DateTimeFormat('id-ID', { dateStyle: 'short' }).format(new Date(timestamp));

export const generateInvoiceNo = () => {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `INV${now.getFullYear()}${pad(now.getMonth()+1)}${pad(now.getDate())}-${Math.random().toString(36).substring(2,6).toUpperCase()}`;
};
