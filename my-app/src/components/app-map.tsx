import React from "react";
import {Location} from "../models/location";
import * as ol from "ol";
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import {Icon, Style} from "ol/style";
import {fromLonLat, transform} from "ol/proj";
import {Geometry, Point} from "ol/geom";
import BaseEvent from "ol/events/Event";

export type AppMapProps = {
  center: Location;
  zoom: number;
  markers: Location[];
  onMarkersChange: (markers: Location[]) => void;
}

export function AppMap({center, zoom, markers, onMarkersChange}: AppMapProps) {
  const mapRef = React.useRef<HTMLDivElement>(null);
  const [map, setMap] = React.useState<ol.Map>();
  const [vectorSource, setVectorSource] = React.useState<VectorSource<Geometry>>();

  // init map
  React.useEffect(() => {
    if (!mapRef.current) return;

    const vectorSource = new VectorSource();
    setVectorSource(vectorSource);

    const map = new ol.Map({
      view: new ol.View(),
      target: mapRef.current,
      layers: [
        new TileLayer({source: new OSM()}),
        new VectorLayer({
          source: vectorSource,
          style: new Style({image: new Icon({src: 'marker.svg'})})
        })]
    });
    setMap(map);

    return () => map.setTarget(undefined);
  }, []);

  React.useEffect(() => {
    const handleClick = (event: ol.MapBrowserEvent<any>) => {
      const [lon, lat] = transform(event.coordinate, 'EPSG:3857', 'EPSG:4326');
      onMarkersChange([...markers, {lon, lat}]);
    }
    map?.on('click', handleClick);

    return () => map?.removeEventListener('click', handleClick as ((event: Event | BaseEvent) => void));
  }, [map, markers, onMarkersChange])

  // set center
  React.useEffect(() => map?.getView()?.setCenter(fromLonLat([center.lon, center.lat])), [map, center]);

  // set zoom
  React.useEffect(() => map?.getView()?.setZoom(zoom), [map, zoom]);

  // draw markers
  React.useEffect(() => {
    vectorSource?.clear();
    markers.forEach(({lon, lat}) => vectorSource?.addFeature(new ol.Feature(new Point(fromLonLat([lon, lat])))));
  }, [markers, vectorSource]);

  return <div style={{height: '500px', padding: '25px'}} ref={mapRef}>Map</div>;
}