import {Controller, useForm} from "react-hook-form";
import React from "react";
import {DateRangePicker} from "./date-range-picker";
import {DateRange} from "../models/date-range";

export type AppFormFields = {
  dateRange: DateRange;
};

type AppFormProps = {
  onSubmit: (model: AppFormFields) => void;
}

export function AppForm({onSubmit}: AppFormProps) {
  const {handleSubmit, control, formState: {errors}} = useForm<AppFormFields>();

  const rules = React.useMemo(() => {
    return {
      validate: (dateRange?: any) => {
        return Boolean(dateRange?.start) && Boolean(dateRange?.end) &&
          dateRange.start.getTime() <= dateRange.end.getTime();
      }
    };
  }, []);

  return (
    <form className="m-2" onSubmit={handleSubmit(onSubmit)}>
      {errors.dateRange && <div className="mb-2 alert-danger">Date range is invalid</div>}
      <Controller
        control={control}
        name={'dateRange'}
        rules={rules}
        render={({field: {onChange}}) =>
          <DateRangePicker onChange={onChange}/>}
      />
      <input className="btn btn-primary mt-2" type="submit" value="Submit"/>
    </form>
  );
}