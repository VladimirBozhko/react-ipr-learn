import React from "react";
import {formatDate} from "../utils/format-date";

export function useDayOff(date?: Date) {
  const [result, setResult] = React.useState(false);

  React.useEffect(() => {
    if (date) {
      const endpoint = `https://isdayoff.ru/${formatDate(date)}`;
      fetch(endpoint).then(response => response.json()).then(dayOffCode => setResult(dayOffCode === 1));
    }
  }, [date]);

  return result;
}