import 'bootstrap/dist/css/bootstrap.min.css';
import React, {ChangeEventHandler} from 'react';
import {useDayOff} from "./hooks/use-day-off";
import {formatDate} from "./helpers/format-date";
import {useWeatherForecast} from "./hooks/use-weather-forecast";
import {getGeolocation} from "./helpers/get-geolocation";
import {Location} from "./models/location";
import {compareDates} from "./helpers/compare-dates";

function App() {
  const [date, setDate] = React.useState<Date>();
  const [position, setPosition] = React.useState<Location>();
  const [error, setError] = React.useState<any>();

  const dayOff = useDayOff(date);
  const weatherForecast = useWeatherForecast(position);

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const date = new Date(event.target.value);
    setDate(date);

    getGeolocation()
      .then(geolocation => {
        const {latitude, longitude} = geolocation.coords;
        setPosition({lat: latitude, lon: longitude});
      })
      .catch(error => setError(error));
  }

  const value = date ? formatDate(date) : '';
  const forecast = (date && weatherForecast) ? weatherForecast.find(x => compareDates(x.date, date)) : '';

  return (
    <div className="m-2 row align-items-center">
      <div className="col-auto">
        <input className="form-control" type="date" onChange={handleChange} value={value}/>
      </div>
      {date && <div className="col-1">{dayOff ? 'Day off' : 'Not day off'}</div>}
      {forecast && <div className="col-1">{forecast.weathercode}</div>}
      {error && <div className="col-1">Unable to determine user location</div>}
    </div>
  );
}

export default App;
