import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import {useDayOff} from "./hooks/use-day-off";
import {useWeatherForecast} from "./hooks/use-weather-forecast";
import {getGeolocation} from "./utils/get-geolocation";
import {Location} from "./models/location";
import {compareDates} from "./utils/compare-dates";
import {AppForm, AppFormFields} from "./components/app-form";

function App() {
  const [date, setDate] = React.useState<Date>();
  const [position, setPosition] = React.useState<Location>();
  const [error, setError] = React.useState<any>();

  const dayOff = useDayOff(date);
  const weatherForecast = useWeatherForecast(position);

  const handleSubmit = ({date}: AppFormFields) => {
    setDate(date);

    getGeolocation()
      .then(geolocation => {
        const {latitude, longitude} = geolocation.coords;
        setPosition({lat: latitude, lon: longitude});
      })
      .catch(error => setError(error));
  }

  const forecast = (date && weatherForecast)
    ? weatherForecast.find(x => compareDates(x.date, date))
    : undefined;

  return (
    <div className="row align-items-center">
      <div className="col-3">
        <AppForm onSubmit={handleSubmit} />
      </div>
      {date && <div className="col-1">{dayOff ? 'Day off' : 'Not day off'}</div>}
      {forecast && <div className="col-1">{forecast.weathercode}</div>}
      {error && <div className="col-1">Unable to determine user location</div>}
    </div>
  );
}

export default App;
