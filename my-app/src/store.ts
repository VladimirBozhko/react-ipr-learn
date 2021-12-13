import {TransportLayer} from "./services/transport-layer";
import {eachDayOfInterval} from "date-fns";
import {formatDate} from "./utils/format-date";
import {isDateRangeValid} from "./utils/validate-dates";
import {makeAutoObservable} from "mobx";
import {TravelRoute, TravelRouteData} from "./models/travel-route";
import {getFromLocalStorage, saveToLocalStorage} from "./utils/local-storage";

const routesKey = 'app-routes';

export class AppStore {
  routes: TravelRoute[] = [];

  constructor(private transportLayer: TransportLayer) {
    makeAutoObservable(this, {}, {autoBind: true});
    this.restoreRoutes();
  }

  getRoute(uuid: string) {
    return this.routes.find(r => r.uuid === uuid);
  }

  addOrUpdateRoute(route: TravelRoute) {
    if (this.routes === undefined) return;

    const index = this.routes.findIndex(r => r.uuid === route.uuid);

    if (index === -1)
      this.routes.push(route);
    else
      this.routes.splice(index, 1, route);
  }

  deleteRoute(uuid: string) {
    this.routes = this.routes.filter(r => r.uuid !== uuid);
  }

  loadData(uuid: string) {
    const route = this.getRoute(uuid);
    if (route === undefined) return;

    const {dateRange, locations, options} = route;
    if (!isDateRangeValid(dateRange)) return;

    const dates = eachDayOfInterval(dateRange);

    const results = locations.map(async (location, index) => {
      const date = dates[index];

      const {daily} = await this.transportLayer.fetchWeatherForecast(location, options);
      const isDayOff = await this.transportLayer.fetchDayOff(date) === 1;

      const data: TravelRouteData = {date, location, isDayOff};

      const timeIndex = daily.time.findIndex(t => t === formatDate(date));
      if (timeIndex !== -1) {
        data.weathercode = daily.weathercode[timeIndex];
        data.temperatureMin = daily.temperature_2m_min && daily.temperature_2m_min[timeIndex];
        data.temperatureMax = daily.temperature_2m_max && daily.temperature_2m_max[timeIndex];
        data.precipitationSum = daily.precipitation_sum && daily.precipitation_sum[timeIndex];
        data.precipitationHours = daily.precipitation_hours && daily.precipitation_hours[timeIndex];
        data.windSpeed = daily.windspeed_10m_max && daily.windspeed_10m_max[timeIndex];
        data.windDirection = daily.winddirection_10m_dominant && daily.winddirection_10m_dominant[timeIndex];
      }

      return data;
    });

    Promise.all(results).then(results => this.setData(uuid, results));
  }

  private setData(uuid: string, data: TravelRouteData[]) {
    const route = this.getRoute(uuid);
    if (route === undefined) return;

    route.data = data;
  }

  saveRoutes() {
    saveToLocalStorage(routesKey, this.routes);
  }

  restoreRoutes() {
    this.routes = getFromLocalStorage(routesKey) || [];
  }
}
