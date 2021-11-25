import {Location} from "../models/location";
import React from "react";

type OpenMeteoResponse = {
  daily: {
    weathercode: number[];
    time: string[];
  }
};

type UseWeatherForecastResult = {
  location: Location;
  date: Date;
  weathercode: number;
};

export function useWeatherForecast(locations?: Location[]) {
  const [results, setResults] = React.useState<UseWeatherForecastResult[]>();

  React.useEffect(() => {
    if (locations?.length) {
      const results = locations.map(({lat, lon}) => {
        const endpoint = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weathercode&timezone=UTC`;
        return fetch(endpoint)
          .then(response => response.json())
          .then(({daily: {weathercode, time}}: OpenMeteoResponse) =>
            time.map((date, index) => ({
              location: {lat, lon},
              date: new Date(date),
              weathercode: weathercode[index]
            }))
          );
      });

      Promise.all(results).then(results => setResults(results.flat()));
    }
  }, [locations]);

  return results;
}
