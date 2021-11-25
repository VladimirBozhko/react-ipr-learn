import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import {useDaysOff} from "./hooks/use-days-off";
import {useWeatherForecast} from "./hooks/use-weather-forecast";
import {compareDates} from "./utils/compare-dates";
import {AppForm, AppFormFields} from "./components/app-form";
import {AppResults} from "./components/app-results";
import {eachDayOfInterval} from "date-fns";
import {Location} from "./models/location";

function App() {
  const [dates, setDates] = React.useState<Date[]>();
  const [markers, setMarkers] = React.useState<Location[]>();

  const daysOff = useDaysOff(dates);
  const weatherForecast = useWeatherForecast(markers);

  const handleSubmit = ({dateRange, markers}: AppFormFields) => {
    const dates = eachDayOfInterval(dateRange).slice(0, markers.length);

    setDates(dates);
    setMarkers(markers)
  }

  const results = (markers && dates && daysOff && weatherForecast) &&
    markers.map((location, index) => {
      const date = dates[index];
      const isDayOff = daysOff[index];
      const weathercode = weatherForecast.find(x => compareDates(x.date, date))?.weathercode;

      return { location, date, isDayOff, weathercode};
    });

  return (
    <div className="m-2">
      <div className="row">
        <div className="col-4">
          <AppForm onSubmit={handleSubmit}/>
        </div>
        {results && (
          <div className="col">
            <AppResults results={results}/>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
