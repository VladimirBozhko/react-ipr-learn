import {lightFormat} from "date-fns";

export function format(date: Date) {
  return lightFormat(date, "yyyy-MM-dd");
}