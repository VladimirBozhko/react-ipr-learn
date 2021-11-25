import React from "react";
import {formatDate} from "../utils/format-date";

export function useDaysOff(dates?: Date[]) {
  const [results, setResults] = React.useState<boolean[]>();

  const fetchData = React.useCallback(() => {
    if (dates?.length) {
      const requests = dates.map((date) => {
        const endpoint = `https://isdayoff.ru/${formatDate(date)}`;
        return fetch(endpoint, {window: null})
          .then(response => response.json())
          .then(result => result === 1);
      });

      Promise.all(requests).then(results => setResults(results));
    }
  }, [dates])

  React.useEffect(fetchData, [fetchData]);

  return results;
}