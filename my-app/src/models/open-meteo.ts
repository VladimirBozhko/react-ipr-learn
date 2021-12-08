export type OpenMeteoOptions = {
  temperatureMin?: boolean,
  temperatureMax?: boolean,
  precipitationSum?: boolean,
  precipitationHours?: boolean,
  windSpeed?: boolean;
  windDirection?: boolean;
}

export type OpenMeteoResponse = {
  daily: {
    time: string[];
    weathercode: number[];
    temperature_2m_min?: number[];
    temperature_2m_max?: number[];
    precipitation_sum?: number[];
    precipitation_hours?: number[];
    windspeed_10m_max?: number[];
    winddirection_10m_dominant?: number[];
  }
};