import 'bootstrap/dist/css/bootstrap.min.css';
import React, {ChangeEventHandler} from 'react';
import {useDayOff} from "./hooks/use-day-off";
import {format} from "./helpers/format";

function App() {
  const [date, setDate] = React.useState<Date>();
  const dayOff = useDayOff(date);

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const date = new Date(event.target.value);
    setDate(date);
  }

  const value = date ? format(date) : '';

  return (
    <div className="m-2 row align-items-center">
      <div className="col-2">
        <input className="form-control" type="date" onChange={handleChange} value={value}/>
      </div>
      <div className="col-1">{dayOff ? 'Day off' : 'Not day off'}</div>
    </div>
  );
}

export default App;
