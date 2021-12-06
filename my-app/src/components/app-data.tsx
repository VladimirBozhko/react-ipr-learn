import {formatDate} from "../utils/format-date";
import {useAppStore} from "../hooks/use-app-store";
import {observer} from "mobx-react-lite";

export const AppData = observer(() => {
  const store = useAppStore();
  const appData = store.appData;

  if (appData === undefined) return null;

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
      {appData.map(({location, date, isDayOff, weathercode}, index) => {
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
})