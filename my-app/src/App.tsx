import React, {ChangeEventHandler, useState} from 'react';
import {useDayOff} from "./hooks";
import './App.css';

function App() {
  const [date, setDate] = useState<Date | null>(null);
  const isDayOff = useDayOff(date);

  const onDateChange: ChangeEventHandler<HTMLInputElement> = (event) => {
      setDate(new Date(event.target.value));
  }

  return (
    <main>
      <input type={"date"} onChange={onDateChange} />
      <pre>
          - Можна отдохнуть?
          <br />
          - {
              isDayOff !== null
                  ? isDayOff
                      ? "Ага"
                      : "Неа"
                  : "...ХЗ"
          }
      </pre>
    </main>
  );
}

export default App;
