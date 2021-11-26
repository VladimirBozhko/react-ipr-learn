import {AppMap} from "./app-map";
import {useController} from "react-hook-form";
import {UseControllerProps} from "react-hook-form/dist/types";
import React from "react";
import {Location} from "../models/location";
import {AppFormFields} from "./app-form";

type AppMapControlProps = {
  center: Location;
  zoom: number;
  max: number;
} & UseControllerProps<AppFormFields, 'markers'>;

export function AppMapControl({center, zoom, max, control, name}: AppMapControlProps) {
  const {field: {onChange, value}} = useController({name, control, defaultValue: [center]});

  const handleMarkersChange = (markers: Location[]) => {
    if (markers.length <= max) {
      onChange(markers);
    }
  }

  return <AppMap center={center} zoom={zoom} markers={value} onMarkersChange={handleMarkersChange} />
}