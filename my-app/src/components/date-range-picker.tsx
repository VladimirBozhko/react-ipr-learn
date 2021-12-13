import React, {ChangeEventHandler} from "react";
import {formatDate} from "../utils/format-date";
import {DateRange} from "../models/date-range";

type DateRangePickerProps = {
  value?: DateRange;
  onChange: (dateRange: Partial<DateRange>) => void;
};

export function DateRangePicker({value, onChange}: DateRangePickerProps) {
  const [start, setStart] = React.useState<Date | undefined>(value?.start);
  const [end, setEnd] = React.useState<Date | undefined>(value?.end);

  React.useEffect(() => {
    setStart(value?.start);
    setEnd(value?.end)
  }, [value]);

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

  return (
    <div className="row">
      <div className="col">
        <label>Start</label>
        <input
          className="form-control"
          type="date"
          onChange={handleStartChange}
          value={start ? formatDate(start) : ''}
        />
      </div>
      <div className="col">
        <label>End</label>
        <input
          className="form-control"
          type="date"
          onChange={handleEndChange}
          value={end ? formatDate(end) : ''}
        />
      </div>
    </div>
  );
}