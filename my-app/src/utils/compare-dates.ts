import {formatDate} from "./format-date";

export function compareDates(a: Date, b: Date) {
  return formatDate(a) === formatDate(b);
}