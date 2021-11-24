import {formatDate} from "../utils/format-date";

type AppResultsProps = {
  results: {date: Date, isDayOff: boolean, weathercode?: number}[]
};

export function AppResults({results}: AppResultsProps) {
  return (
    <table className="table table-sm">
      <thead>
      <tr>
        <th>Date</th>
        <th>DayOff</th>
        <th>WeatherCode</th>
      </tr>
      </thead>
      <tbody>
      {results.map(({date, isDayOff, weathercode}, index) => {
        return (
          <tr key={index}>
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