export interface DayMonthFilterValue {
  month: number;
  day: number;
}

export function getMonthDayCount(month?: number): number {
  // Recurring dates have no year, so February 29 is valid.
  return month === undefined ? 31 : [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1];
}

export function isDayMonthFilterValue(value: unknown): value is DayMonthFilterValue {
  if (!value || typeof value !== 'object') return false;
  const { month, day } = value as DayMonthFilterValue;
  return Number.isInteger(month) && month >= 1 && month <= 12 &&
    Number.isInteger(day) && day >= 1 && day <= getMonthDayCount(month);
}

