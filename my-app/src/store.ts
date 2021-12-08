import {DateRange} from "./models/date-range";
import {TransportLayer} from "./services/transport-layer";
import {Location} from "./models/location";
import {eachDayOfInterval} from "date-fns";
import {formatDate} from "./utils/format-date";
import {isDateRangeValid} from "./utils/validate-dates";
import {AppData} from "./models/app-data";
import {makeAutoObservable} from "mobx";
import {OpenMeteoOptions} from "./models/open-meteo";
import {AppFormFields} from "./components/app-form";


export class AppStore {
  appFormFields?: AppFormFields;
  appData?: AppData[];

  constructor(private transportLayer: TransportLayer) {
    makeAutoObservable(this, {}, {autoBind: true});
  }

  loadAppData(dateRange: DateRange, locations: Location[], options: OpenMeteoOptions) {
    if (!isDateRangeValid(dateRange)) return;

    const dates = eachDayOfInterval(dateRange);

    const results = locations.map(async (location, index) => {
      const date = dates[index];

      const {daily} = await this.transportLayer.fetchWeatherForecast(location, options);
      const isDayOff = await this.transportLayer.fetchDayOff(date) === 1;

      const appData: AppData = {date, location, isDayOff};

      const timeIndex = daily.time.findIndex(t => t === formatDate(date));
      if (timeIndex !== -1) {
        appData.weathercode = daily.weathercode[timeIndex];
        appData.temperatureMin = daily.temperature_2m_min && daily.temperature_2m_min[timeIndex];
        appData.temperatureMax = daily.temperature_2m_max && daily.temperature_2m_max[timeIndex];
        appData.precipitationSum = daily.precipitation_sum && daily.precipitation_sum[timeIndex];
        appData.precipitationHours = daily.precipitation_hours && daily.precipitation_hours[timeIndex];
        appData.windSpeed = daily.windspeed_10m_max && daily.windspeed_10m_max[timeIndex];
        appData.windDirection = daily.winddirection_10m_dominant && daily.winddirection_10m_dominant[timeIndex];
      }

      return appData;
    });

    Promise.all(results).then(appData => this.setAppData(appData));
  }

  private setAppData(appData: AppData[]) {
    this.appData = appData;
  }
}
