import axios from "axios";
import {formatDate} from "../utils/format-date";
import {Location} from "../models/location";

type OpenMeteoResponse = {
  daily: {
    weathercode: number[];
    time: string[];
  }
};

export class TransportLayer {
  fetchDayOff(date: Date) {
    const endpoint = `https://isdayoff.ru/${formatDate(date)}`;
    return axios.get<number>(endpoint).then(response => response.data);
  }

  fetchWeatherCodes({lat, lon}: Location) {
    const endpoint = 'https://api.open-meteo.com/v1/forecast'

    return axios.get<OpenMeteoResponse>(endpoint, {
      params: {
        latitude: lat,
        longitude: lon,
        daily: 'weathercode',
        timezone: 'UTC'
      }
    })
      .then(response => response.data);
  }
}
