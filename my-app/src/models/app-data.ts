import {Location} from "./location";

export type AppData = {
  location: Location;
  date: Date;
  isDayOff: boolean;
  weathercode?: number;
  temperatureMin?: number;
  temperatureMax?: number;
  precipitationSum?: number;
  precipitationHours?: number;
  windSpeed?: number;
  windDirection?: number;
};