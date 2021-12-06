import {DateRange} from "./models/date-range";
import {TransportLayer} from "./services/transport-layer";
import {Location} from "./models/location";
import {eachDayOfInterval} from "date-fns";
import {formatDate} from "./utils/format-date";
import {isDateRangeValid} from "./utils/validate-dates";
import {AppData} from "./models/app-data";
import {makeAutoObservable} from "mobx";


export class AppStore {
  dateRange?: DateRange;
  locations?: Location[];
  appData?: AppData[];

  constructor(private transportLayer: TransportLayer) {
    makeAutoObservable(this, {}, {autoBind: true});
  }

  setDateRange(dateRange: DateRange) {
    this.dateRange = dateRange;
  }

  setLocations(locations: Location[]) {
    this.locations = locations;
  }

  loadAppData(dateRange: DateRange, locations: Location[]) {
    if (!isDateRangeValid(dateRange)) return;

    const dates = eachDayOfInterval(dateRange);

    const results = locations.map(async (location, index) => {
      const date = dates[index];

      const {daily: {weathercode: weathercodes, time}} = await this.transportLayer.fetchWeatherCodes(location);
      const timeIndex = time.findIndex(t => t === formatDate(date));

      const weathercode = timeIndex !== -1 ? weathercodes[timeIndex] : undefined;
      const isDayOff = await this.transportLayer.fetchDayOff(date) === 1;

      return {date, location, weathercode, isDayOff};
    });

    Promise.all(results).then(appData => this.setAppData(appData));
  }

  private setAppData(appData: AppData[]) {
    this.appData = appData;
  }
}