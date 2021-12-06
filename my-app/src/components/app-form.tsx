import {Controller, useForm} from "react-hook-form";
import React from "react";
import {DateRangePicker} from "./date-range-picker";
import {DateRange} from "../models/date-range";
import {getGeolocation} from "../utils/get-geolocation";
import {eachDayOfInterval} from "date-fns";
import {Location} from "../models/location";
import {AppMapControl} from "./app-map-control";
import {isDateRangeValid} from "../utils/validate-dates";
import {useLocalStorage} from "../hooks/use-local-storage";

export type AppFormFields = {
  dateRange: DateRange;
  markers: Location[];
};

type AppFormProps = {
  onSubmit: (model: AppFormFields) => void;
}

export function AppForm({onSubmit}: AppFormProps) {
  const [appFormFields, setAppFormFields] = useLocalStorage<AppFormFields>('app-form-fields');
  const {handleSubmit, control, watch, setValue, getValues, formState: {errors}} = useForm<AppFormFields>({
    defaultValues: appFormFields
  });

  const [center, setCenter] = useLocalStorage<Location>('geolocation');
  const [geolocationError, setGeolocationError] = React.useState<any>();

  const [intervalLength, setIntervalLength] = React.useState<number>();

  React.useEffect(() => {
    const subscription = watch(({dateRange}, {name}) => {
      if (name === 'dateRange') {
        if (isDateRangeValid(dateRange)) {
          setIntervalLength(eachDayOfInterval(dateRange as DateRange).length);
        } else {
          setIntervalLength(undefined);
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [watch])

  // reset dateRange to trigger watch
  React.useEffect(() => {
    if (appFormFields?.dateRange) {
      setValue('dateRange', appFormFields.dateRange)
    }
  }, [appFormFields, setValue]);

  // get geolocation if dates changed
  React.useEffect(() => {
    if (center) return;

    if (intervalLength) {
      getGeolocation()
        .then(({coords: {latitude, longitude}}) => setCenter({lat: latitude, lon: longitude}))
        .catch(error => setGeolocationError(error));
    }
  }, [center, setCenter, intervalLength]);

  return (
    <form className="m-2 " onSubmit={handleSubmit(onSubmit)}>
      {errors.dateRange && <div className="mb-2 alert-danger">Date range is invalid</div>}
      {geolocationError && <div className="col">Unable to determine user location</div>}
      <Controller control={control} name={'dateRange'} rules={{validate: isDateRangeValid}}
                  render={({field: {onChange, value}}) => <DateRangePicker value={value} onChange={onChange}/>}
      />
      {(center && intervalLength) && (
        <AppMapControl center={center} zoom={6} markers={appFormFields?.markers || [center]} max={intervalLength} name="markers"
                       control={control}/>
      )}
      <div className="d-flex mt-2 justify-content-between">
        <input className="btn btn-primary" type="submit" value="Submit"/>
        <input className="btn btn-secondary" type="button" value="Save" onClick={() => setAppFormFields(getValues())}/>
      </div>
    </form>
  );
}