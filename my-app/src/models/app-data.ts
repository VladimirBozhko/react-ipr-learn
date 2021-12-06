import {Location} from "./location";

export type AppData = {
  location: Location;
  date: Date,
  isDayOff: boolean,
  weathercode?: number
};