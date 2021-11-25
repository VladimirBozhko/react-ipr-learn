import {AppMap, AppMapProps} from "./app-map";
import {useController} from "react-hook-form";
import {UseControllerProps} from "react-hook-form/dist/types";
import React from "react";

type AppMapControlProps<TFieldValues> = Omit<AppMapProps, 'onMarkerSet'> & UseControllerProps<TFieldValues>;

export function AppMapControl<TFieldValues>(props: AppMapControlProps<TFieldValues>) {
  const {name, control} = props;
  const {field: {onChange}} = useController({name, control});

  return <AppMap {...props} onMarkerSet={onChange} />
}