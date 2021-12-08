import axios from "axios";
import {formatDate} from "../utils/format-date";
import {Location} from "../models/location";
import {OpenMeteoOptions, OpenMeteoResponse} from "../models/open-meteo";

export class TransportLayer {
  fetchDayOff(date: Date) {
    const endpoint = `https://isdayoff.ru/${formatDate(date)}`;
    return axios.get<number>(endpoint).then(response => response.data);
  }

  fetchWeatherForecast(location: Location, options: OpenMeteoOptions) {
    const endpoint = 'https://api.open-meteo.com/v1/forecast'

    return axios.get<OpenMeteoResponse>(endpoint, {
      params: {
        latitude: location.lat,
        longitude: location.lon,
        daily: getDailyParams(options),
        timezone: 'UTC'
      }
    })
      .then(response => response.data);
  }
}

function getDailyParams(options: OpenMeteoOptions) {
  const daily = ['weathercode'];
  if (options.temperatureMin) {
    daily.push('temperature_2m_min')
  }

  if (options.temperatureMax) {
    daily.push('temperature_2m_max')
  }

  if (options.precipitationSum) {
    daily.push('precipitation_sum')
  }

  if (options.precipitationHours) {
    daily.push('precipitation_hours')
  }

  if (options.windSpeed) {
    daily.push('windspeed_10m_max')
  }

  if (options.windDirection) {
    daily.push('winddirection_10m_dominant')
  }

  return daily;
}
