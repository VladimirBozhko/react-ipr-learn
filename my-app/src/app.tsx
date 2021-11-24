import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import {useDaysOff} from "./hooks/use-days-off";
import {useWeatherForecast} from "./hooks/use-weather-forecast";
import {getGeolocation} from "./utils/get-geolocation";
import {Location} from "./models/location";
import {compareDates} from "./utils/compare-dates";
import {AppForm, AppFormFields} from "./components/app-form";
import {AppResults} from "./components/app-results";
import {DateRange} from "./models/date-range";
import {eachDayOfInterval} from "date-fns";

function App() {
  const [dateRange, setDateRange] = React.useState<DateRange>();
  const [position, setPosition] = React.useState<Location>();
  const [error, setError] = React.useState<any>();

  const daysOff = useDaysOff(dateRange);
  const weatherForecast = useWeatherForecast(position);

  const handleSubmit = ({dateRange}: AppFormFields) => {
    setDateRange(dateRange);

    getGeolocation()
      .then(geolocation => {
        const {latitude, longitude} = geolocation.coords;
        setPosition({lat: latitude, lon: longitude});
      })
      .catch(error => setError(error));
  }

  const results = (dateRange && daysOff && weatherForecast) &&
    eachDayOfInterval(dateRange).map((date, index) => {
      return {
        date: date,
        isDayOff: daysOff[index],
        weathercode: weatherForecast.find(x => compareDates(x.date, date))?.weathercode
      };
    });

  return (
    <div className="row">
      <div className="col-3">
        <AppForm onSubmit={handleSubmit}/>
      </div>
      {results && (
        <div className="col-4">
          <AppResults results={results}/>
        </div>
      )}
      {error && <div className="col-1">Unable to determine user location</div>}
    </div>
  );
}

export default App;
