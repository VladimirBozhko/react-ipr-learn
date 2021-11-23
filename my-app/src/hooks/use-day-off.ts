import React from "react";
import {format} from "../helpers/format";

export function useDayOff(date?: Date) {
  const [result, setResult] = React.useState(false);

  React.useEffect(() => {
    if (date) {
      const endpoint = `https://isdayoff.ru/${format(date)}`;
      fetch(endpoint).then(response => response.json()).then(dayOffCode => setResult(dayOffCode === 1));
    }
  }, [date]);

  return result;
}