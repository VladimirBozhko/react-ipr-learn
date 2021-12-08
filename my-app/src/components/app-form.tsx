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
import {OpenMeteoOptions} from "../models/open-meteo";

export type AppFormFields = {
  dateRange: DateRange;
  markers: Location[];
  options: OpenMeteoOptions;
  startTitle?: string;
  endTitle?: string;
};

type AppFormProps = {
  onSubmit: (model: AppFormFields) => void;
}

export function AppForm({onSubmit}: AppFormProps) {
  const [appFormFields, setAppFormFields] = useLocalStorage<AppFormFields>('app-form-fields');
  const {register, handleSubmit, control, watch, setValue, getValues, formState: {errors}} = useForm<AppFormFields>({
    defaultValues: appFormFields
  });

  const [center, setCenter] = useLocalStorage<Location>('geolocation');
  const [geolocationError, setGeolocationError] = React.useState<any>();

  const initialLength = isDateRangeValid(appFormFields?.dateRange)
    ? eachDayOfInterval(appFormFields.dateRange).length
    : undefined;

  const [intervalLength, setIntervalLength] = React.useState<number | undefined>(initialLength);

  React.useEffect(() => {
    const subscription = watch(({dateRange}, {name, type}) => {
      if (name === 'dateRange' && type === 'change') {
        if (isDateRangeValid(dateRange)) {
          setIntervalLength(eachDayOfInterval(dateRange as DateRange).length);
        } else {
          setIntervalLength(undefined);
        }

        setValue('markers', []);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, setValue])

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
      {geolocationError && <div>Unable to determine user location</div>}
      <Controller control={control} name={'dateRange'} rules={{validate: isDateRangeValid}}
                  render={({field: {onChange, value}}) => <DateRangePicker value={value} onChange={onChange}/>}
      />
      <div className="row my-2">
        <div className="col">
          <input className="form-control" type="text" placeholder="Start Title" {...register('startTitle')} />
        </div>
        <div className="col">
          <input className="form-control" type="text" placeholder="End Title"  {...register('endTitle')} />
        </div>
      </div>

      <div className="form-check">
        <input className="form-check-input" type="checkbox" {...register('options.temperatureMin')}/>
        <label className="form-check-label">Temperature min</label>
      </div>

      <div className="form-check">
        <input className="form-check-input" type="checkbox" {...register('options.temperatureMax')}/>
        <label className="form-check-label">Temperature Max</label>
      </div>

      <div className="form-check">
        <input className="form-check-input" type="checkbox" {...register('options.precipitationSum')}/>
        <label className="form-check-label">Precipitation Sum</label>
      </div>

      <div className="form-check">
        <input className="form-check-input" type="checkbox" {...register('options.precipitationHours')}/>
        <label className="form-check-label">Precipitation Hours</label>
      </div>

      <div className="form-check">
        <input className="form-check-input" type="checkbox" {...register('options.windSpeed')}/>
        <label className="form-check-label">Wind Speed</label>
      </div>

      <div className="form-check">
        <input className="form-check-input" type="checkbox" {...register('options.windDirection')}/>
        <label className="form-check-label">Wind Direction</label>
      </div>

      {(center && intervalLength) && (
        <AppMapControl center={center} zoom={6} markers={appFormFields?.markers || [center]} max={intervalLength}
                       name="markers"
                       control={control}/>
      )}


      <div className="d-flex mt-2 justify-content-between">
        <input className="btn btn-primary" type="submit" value="Submit"/>
        <input className="btn btn-secondary" type="button" value="Save" onClick={() => setAppFormFields(getValues())}/>
      </div>
    </form>
  );
}