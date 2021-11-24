import React from "react";
import {Location} from "../models/location";
import * as ol from "ol";
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import {Icon, Style} from "ol/style";
import {fromLonLat, transform} from "ol/proj";
import {Point} from "ol/geom";

export type AppMapProps = {
  center: Location;
  zoom: number;
  markersCount: number;
  onMarkerSet: (markers: Location[]) => void;
}

export function AppMap({center, zoom, onMarkerSet, markersCount}: AppMapProps) {
  const mapRef = React.useRef<HTMLDivElement>(null);
  const [map, setMap] = React.useState<ol.Map>();
  const [markers, setMarkers] = React.useState<Location[]>([]);

  // init map
  React.useEffect(() => {
    if (!mapRef.current) return;

    const map = new ol.Map({
      view: new ol.View(),
      target: mapRef.current,
      layers: [
        new TileLayer({source: new OSM()}),
        new VectorLayer({
          source: new VectorSource(),
          style: new Style({image: new Icon({src: 'marker.svg'})})
        })
      ]
    });

    setMap(map);

    return () => map.setTarget(undefined);
  }, []);

  // set center
  React.useEffect(() => map?.getView()?.setCenter(fromLonLat([center.lon, center.lat])), [map, center]);

  // set zoom
  React.useEffect(() => map?.getView()?.setZoom(zoom), [map, zoom]);

  const setMarker = React.useCallback((marker: Location) => {
    if (markers?.length >= markersCount) return;

    const markersLayer = map?.getLayers()?.item(1);
    if (!(markersLayer instanceof VectorLayer)) return;

    const markerFeature = new ol.Feature(new Point(fromLonLat([marker.lon, marker.lat])));
    markersLayer.getSource().addFeature(markerFeature);

    const newMarkers = [...markers, marker];
    setMarkers(newMarkers);
    onMarkerSet(newMarkers);
  }, [map, markers, markersCount, onMarkerSet]);

  // keep subscription to map click event
  React.useEffect(() => {
    const handleOnClick = (event: ol.MapBrowserEvent<any>) => {
      const [lon, lat] = transform(event.coordinate, 'EPSG:3857', 'EPSG:4326');
      setMarker({lon, lat});
    };

    map?.on('click', handleOnClick);
    // @ts-ignore
    return () => map?.removeEventListener('click', handleOnClick);
  }, [map, setMarker]);

  return <div style={{height: '500px'}} ref={mapRef}>Map</div>;
}