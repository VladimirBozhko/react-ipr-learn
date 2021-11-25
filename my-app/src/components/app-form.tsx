import {Controller, useForm} from "react-hook-form";
import React from "react";
import {DateRangePicker} from "./date-range-picker";
import {DateRange} from "../models/date-range";
import {getGeolocation} from "../utils/get-geolocation";
import {eachDayOfInterval} from "date-fns";
import {Location} from "../models/location";
import {AppMapControl} from "./app-map-control";

export type AppFormFields = {
  dateRange: DateRange;
  markers: Location[];
};

type AppFormProps = {
  onSubmit: (model: AppFormFields) => void;
}

export function AppForm({onSubmit}: AppFormProps) {
  const {handleSubmit, control, watch, formState: {errors}} = useForm<AppFormFields>();

  const [dates, setDates] = React.useState<Date[]>();
  const [location, setLocation] = React.useState<Location>();
  const [geolocationError, setGeolocationError] = React.useState<any>();

  const validateDateRange = React.useCallback((dateRange?: any) => {
    return Boolean(dateRange?.start) && Boolean(dateRange?.end) &&
      dateRange.start.getTime() <= dateRange.end.getTime();
  }, []);

  React.useEffect(() => {
    const subscription = watch(({dateRange}, {name, type}) => {
      if (name === 'dateRange' && type === 'change') {
        const start = dateRange?.start;
        const end = dateRange?.end;

        if (start && end && validateDateRange(dateRange)) {
          setDates(eachDayOfInterval({start, end}));
          getGeolocation().then(geolocation => {
            const {latitude, longitude} = geolocation.coords;
            setLocation({lat: latitude, lon: longitude});
          })
            .catch(error => setGeolocationError(error));
        } else {
          setDates(undefined);
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, validateDateRange])

  return (
    <form className="m-2 " onSubmit={handleSubmit(onSubmit)}>
      {errors.dateRange && <div className="mb-2 alert-danger">Date range is invalid</div>}
      {geolocationError && <div className="col">Unable to determine user location</div>}
      <Controller
        control={control}
        name={'dateRange'}
        rules={{validate: validateDateRange}}
        render={({field: {onChange}}) =>
          <DateRangePicker onChange={onChange}/>}
      />
      {(location && dates?.length) && (
        <AppMapControl
          center={location}
          zoom={6}
          markersCount={dates.length}
          name="markers"
          control={control}
        />
      )}
      <input className="btn btn-primary mt-2" type="submit" value="Submit"/>
    </form>
  );
}