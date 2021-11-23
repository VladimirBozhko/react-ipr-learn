import {Location} from "../models/location";
import React from "react";

type OpenMeteoResponse = {
  daily: {
    weathercode: number[];
    time: string[];
  }
};

type UseWeatherForecastResult = {
  date: Date;
  weathercode: number;
};

export function useWeatherForecast(position?: Location) {
  const [result , setResult] = React.useState<UseWeatherForecastResult[]>();

  React.useEffect(() => {
    if (position) {
      const {lat, lon} = position;
      const endpoint = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weathercode&timezone=UTC`;
      fetch(endpoint)
        .then(response => response.json())
        .then(({daily: {weathercode, time}}: OpenMeteoResponse) => {
          const result = time.map((date, index) => ({date: new Date(date), weathercode: weathercode[index]}));
          setResult(result);
        });
    }
  }, [position]);

  return result;
}
