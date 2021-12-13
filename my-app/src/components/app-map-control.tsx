import React from "react";
import {AppMap} from "./app-map";
import {useController} from "react-hook-form";
import {UseControllerProps} from "react-hook-form/dist/types";
import {Location} from "../models/location";
import {TravelRoute} from "../models/travel-route";

type AppMapControlProps = {
  center: Location;
  markers: Location[];
  zoom: number;
  max: number;
} & UseControllerProps<TravelRoute, 'locations'>;

export function AppMapControl({center, markers, zoom, max, control, name}: AppMapControlProps) {
  const {field: {onChange, value}} = useController({name, control, defaultValue: markers});


  const handleMarkersChange = (markers: Location[]) => {
    if (markers.length <= max) {
      onChange(markers);
    }
  }

  return <AppMap center={center} zoom={zoom} markers={value} onMarkersChange={handleMarkersChange} />
}