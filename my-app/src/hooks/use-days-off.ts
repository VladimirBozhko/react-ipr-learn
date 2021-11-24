import React from "react";
import {formatDate} from "../utils/format-date";
import {DateRange} from "../models/date-range";
import {eachDayOfInterval} from "date-fns";

export function useDaysOff(dateRange?: DateRange) {
  const [results, setResults] = React.useState<boolean[]>();

  const fetchData = React.useCallback(() => {
    if (dateRange) {
      const requests = eachDayOfInterval(dateRange).map((date) => {
        const endpoint = `https://isdayoff.ru/${formatDate(date)}`;
        return fetch(endpoint, {window: null})
          .then(response => response.json())
          .then(result => result === 1);
      });

      Promise.all(requests).then(results => setResults(results));
    }
  }, [dateRange])

  React.useEffect(fetchData, [fetchData]);

  return results;
}