import React from "react";
import {Controller, useForm} from "react-hook-form";
import {DateRangePicker} from "./date-range-picker";
import {DateRange} from "../models/date-range";
import {getGeolocation} from "../utils/get-geolocation";
import {eachDayOfInterval} from "date-fns";
import {AppMapControl} from "./app-map-control";
import {isDateRangeValid} from "../utils/validate-dates";
import {TravelRoute} from "../models/travel-route";
import {Location} from "../models/location";

type AppFormProps = {
  model?: Partial<TravelRoute>;
  onSubmit: (model: TravelRoute) => void;
  onBack: () => void;
}

function getMax(dateRange?: DateRange) {
  return isDateRangeValid(dateRange)
    ? eachDayOfInterval(dateRange as DateRange).length
    : undefined;
}

export function AppForm({model, onSubmit, onBack}: AppFormProps) {
  const {register, handleSubmit, control, watch, setValue, reset, formState: {errors}} = useForm<TravelRoute>({
    defaultValues: model
  });

  const [center, setCenter] = React.useState<Location | undefined>(model?.userLocation);
  const [geolocationError, setGeolocationError] = React.useState<any>();

  const [max, setMax] = React.useState<number | undefined>(getMax(model?.dateRange));

  React.useEffect(() => {
    reset(model);
    setCenter(model?.userLocation);
    setMax(getMax(model?.dateRange));
    setGeolocationError(undefined);
  }, [reset, model]);

  React.useEffect(() => {
    const subscription = watch(({dateRange}, {name, type}) => {
      if (name === 'dateRange' && type === 'change') {
        if (isDateRangeValid(dateRange)) {
          setMax(eachDayOfInterval(dateRange as DateRange).length);
        } else {
          setMax(undefined);
        }

        if (center === undefined) {
          getGeolocation()
            .then(({coords: {latitude, longitude}}) => {
              const center = {lat: latitude, lon: longitude};
              setCenter(center);
              setValue('userLocation', center);
            })
            .catch(error => setGeolocationError(error));
        }

        setValue('locations', []);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, setValue, center])

  const markers = model?.locations || [];

  return (
    <form className="m-2" onSubmit={handleSubmit(onSubmit)}>
      {errors.dateRange && <div className="mb-2 alert-danger">Date range is invalid</div>}
      {errors.startTitle && <div className="mb-2 alert-danger">Start Title is required</div>}
      {errors.endTitle && <div className="mb-2 alert-danger">End Title is required</div>}
      {geolocationError && <div>Unable to determine user location</div>}

      <Controller control={control} name={'dateRange'} rules={{validate: isDateRangeValid}}
                  render={({field: {onChange, value}}) => <DateRangePicker value={value} onChange={onChange}/>}
      />
      <div className="row my-2">
        <div className="col">
          <input className="form-control" type="text" placeholder="Start Title"
                 {...register('startTitle', {required: true})}
          />
        </div>
        <div className="col">
          <input className="form-control" type="text" placeholder="End Title"
                 {...register('endTitle', {required: true})}
          />
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

      {(center && max) && (
        <AppMapControl center={center} zoom={6} markers={markers} max={max} name="locations" control={control}/>
      )}
      <div className="d-flex mt-2 justify-content-between">
        <input className="btn btn-primary" type="submit" value="Submit"/>
        <input className="btn btn-secondary" type="button" value="Back" onClick={onBack}/>
      </div>
    </form>
  );
}