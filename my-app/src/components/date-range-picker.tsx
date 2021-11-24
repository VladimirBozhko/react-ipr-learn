import React, {ChangeEventHandler} from "react";
import {formatDate} from "../utils/format-date";
import {DateRange} from "../models/date-range";

type DateRangePickerProps = {
  onChange: (dateRange: Partial<DateRange>) => void;
};

export function DateRangePicker({onChange}: DateRangePickerProps) {
  const [start, setStart] = React.useState<Date>();
  const [end, setEnd] = React.useState<Date>();

  const handleStartChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const start = new Date(event.target.value);
    setStart(start);

    onChange({start, end});
  };

  const handleEndChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const end = new Date(event.target.value);
    setEnd(end);

    onChange({start, end});
  };

  const startValue = start ? formatDate(start) : '';
  const endValue = end ? formatDate(end) : '';

  return (
    <div>
      <div>
        <label>Start</label>
        <input
          className="form-control"
          type="date"
          onChange={handleStartChange}
          value={startValue}
        />
      </div>
      <div>
        <label>End</label>
        <input
          className="form-control"
          type="date"
          onChange={handleEndChange}
          value={endValue}
        />
      </div>
    </div>
  );
}