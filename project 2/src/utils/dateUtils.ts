export const calculateDaysBetween = (startDate: string, endDate: string): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) || 1;
};

export const calculateDaysPassed = (startDate: string): number => {
  const start = new Date(startDate);
  const today = new Date();
  return Math.ceil((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
};