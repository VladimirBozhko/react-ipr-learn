import {lightFormat} from "date-fns";

export function formatDate(date: Date) {
  return lightFormat(date, "yyyy-MM-dd");
}