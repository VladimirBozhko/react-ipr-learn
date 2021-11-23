import {useForm} from "react-hook-form";
import React from "react";

export type AppFormFields = {
  date: Date;
};

type AppFormProps = {
  onSubmit: (model: AppFormFields) => void;
}

export function AppForm({onSubmit}: AppFormProps) {
  const {register, handleSubmit} = useForm<AppFormFields>();

  return (
    <form className="m-2" onSubmit={handleSubmit(onSubmit)}>
      <div className="row">
        <div className="col">
          <input className="form-control" type="date" {...register('date', {valueAsDate: true})} required/>
        </div>
        <div className="col-auto">
          <input className="btn btn-primary" type="submit" value="Submit"/>
        </div>
      </div>
    </form>
  );
}