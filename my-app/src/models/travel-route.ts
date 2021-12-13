import {DateRange} from "./date-range";
import {Location} from "./location";
import {OpenMeteoOptions} from "./open-meteo";

export type TravelRoute = {
  uuid: string;
  dateRange: DateRange;
  locations: Location[];
  userLocation: Location;
  options: OpenMeteoOptions;
  startTitle: string;
  endTitle: string;
  data?: TravelRouteData[];
};

export type TravelRouteData = {
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