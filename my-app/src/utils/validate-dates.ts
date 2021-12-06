import {DateRange} from "../models/date-range";
import {parseISO} from "date-fns";

export function isDateRangeValid(dateRange?: Partial<DateRange>) {
  if (dateRange === undefined) return false;
  if (dateRange.start === undefined) return false;
  if (dateRange.end === undefined) return false;

  if (!isDateValid(dateRange.start)) return false;
  if (!isDateValid(dateRange.end)) return false;

  return dateRange.start.getTime() <= dateRange.end.getTime();
}

export function isDateValid(date: Date) {
  return !isNaN(date.getTime());
}

export function isIsoDate(value: string) {
  return !isNaN(parseISO(value).getTime());
}