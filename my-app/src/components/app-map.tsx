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
  markersCount: number;
  onMarkerSet: (markers: Location[]) => void;
}

export function AppMap({center, zoom, markersCount, onMarkerSet}: AppMapProps) {
  const mapRef = React.useRef<HTMLDivElement>(null);
  const [map, setMap] = React.useState<ol.Map>();
  const [markersLayer, setMarkersLayer] = React.useState<VectorLayer<VectorSource<Geometry>>>();
  const [markers, setMarkers] = React.useState<Location[]>([center]);

  // init map
  React.useEffect(() => {
    if (!mapRef.current) return;

    const mapLayer = new TileLayer({source: new OSM()});
    const markersLayer = new VectorLayer({
      source: new VectorSource(),
      style: new Style({image: new Icon({src: 'marker.svg'})})
    });

    const map = new ol.Map({
      view: new ol.View(),
      target: mapRef.current,
      layers: [mapLayer, markersLayer]
    });

    setMap(map);
    setMarkersLayer(markersLayer);

    return () => map.setTarget(undefined);
  }, []);

  React.useEffect(() => {
    const handleClick = (event: ol.MapBrowserEvent<any>) => {
      const [lon, lat] = transform(event.coordinate, 'EPSG:3857', 'EPSG:4326');
      const result = markers.length < markersCount ? [...markers, {lon, lat}] : markers;
      setMarkers(result);
      onMarkerSet(result);
    }
    map?.on('click', handleClick);

    return () => map?.removeEventListener('click', handleClick as ((event: Event | BaseEvent) => void));
  }, [map, markers, markersCount, onMarkerSet])

  // set center
  React.useEffect(() => map?.getView()?.setCenter(fromLonLat([center.lon, center.lat])), [map, center]);

  // set zoom
  React.useEffect(() => map?.getView()?.setZoom(zoom), [map, zoom]);

  // draw markers
  React.useEffect(() => {
    const layer = markersLayer?.getSource();
    layer?.clear();
    markers.forEach(({lon, lat}) => layer?.addFeature(new ol.Feature(new Point(fromLonLat([lon, lat])))));
  }, [markers, markersLayer]);

  // clear markers
  React.useEffect(() => setMarkers([center]), [center, markersCount]);

  return <div style={{height: '500px', padding: '25px'}} ref={mapRef}>Map</div>;
}