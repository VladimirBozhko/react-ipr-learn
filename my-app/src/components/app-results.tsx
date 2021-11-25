import {formatDate} from "../utils/format-date";
import {Location} from "../models/location";

type AppResult = {
  location: Location;
  date: Date,
  isDayOff: boolean,
  weathercode?: number
};

type AppResultsProps = {
  results: AppResult[]
};

export function AppResults({results}: AppResultsProps) {
  return (
    <table className="table table-sm">
      <thead>
      <tr>
        <th>Location</th>
        <th>Date</th>
        <th>DayOff</th>
        <th>WeatherCode</th>
      </tr>
      </thead>
      <tbody>
      {results.map(({location, date, isDayOff, weathercode}, index) => {
        return (
          <tr key={index}>
            <td>Lat: {location.lat.toFixed(2)}, Lon: {location.lon.toFixed(2)}</td>
            <td>{formatDate(date)}</td>
            <td>{isDayOff ? 'Yes' : 'No'}</td>
            <td>{weathercode || 'Forecast is not available'}</td>
          </tr>
        );
      })}
      </tbody>
    </table>
  );
}