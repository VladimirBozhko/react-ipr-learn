import {formatDate} from "../utils/format-date";
import {TravelRouteData} from "../models/travel-route";

type AppRouteDataProps = {
  data: TravelRouteData[];
}

export function AppRouteData({data}: AppRouteDataProps) {
  if (!data?.length) return null;

  return (
    <table className="table table-sm">
      <thead>
      <tr>
        <th>Location</th>
        <th>Date</th>
        <th>DayOff</th>
        <th>WeatherCode</th>
        <th>Temperature Min</th>
        <th>Temperature Max</th>
        <th>Precipitation Sum</th>
        <th>Precipitation Hours</th>
        <th>Wind Speed</th>
        <th>Wind Direction</th>
      </tr>
      </thead>
      <tbody>
      {data.map((data, index) => {
        return (
          <tr key={index}>
            <td>Lat: {data.location.lat.toFixed(2)}, Lon: {data.location.lon.toFixed(2)}</td>
            <td>{formatDate(data.date)}</td>
            <td>{data.isDayOff ? 'Yes' : 'No'}</td>
            <td>{data.weathercode || 'Forecast is not available'}</td>
            <td>{data.temperatureMin}</td>
            <td>{data.temperatureMax}</td>
            <td>{data.precipitationSum}</td>
            <td>{data.precipitationHours}</td>
            <td>{data.windSpeed}</td>
            <td>{data.windDirection}</td>
          </tr>
        );
      })}
      </tbody>
    </table>
  );
}