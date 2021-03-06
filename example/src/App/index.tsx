import React, { useEffect, useState, useRef } from 'react';
import { Map } from 'mapbox-gl';
import * as test from 'mapbox-promoted-js';
// import { promoted as MapboxPromoted } from 'mapbox-promoted-js/lib/core/promoted';
import { STYLES, BUILDINGS_LAYER_STYLE, TERRAIN_SOURCE_STYLE } from './helpers';
import { Container, PromotionPanel, Select, Option, DebugPanel, Button } from './styles';
// import { daysInWeek } from 'date-fns';
// import { has } from 'lodash-es';

mapboxgl.accessToken = process.env.MAPBOX_ACCESS_TOKEN;
(mapboxgl as unknown as { workerClass: string }).workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;

const initialMapState = {
  lng: 139.70133999999996,
  lat: 35.65903999999999,
  zoom: 16,
  pitch: 50,
  bearing: -10,
  antialias: true
};

const PROMOTION_TYPES = {
  POPUP: 'popup',
  CARD: 'card',
  SIDE_CARD: 'sidecard',
} as const;
export declare type PromotionTypes = typeof PROMOTION_TYPES[keyof typeof PROMOTION_TYPES];

const App: React.FC = () => {
  console.log(test);
  const mapRef = useRef(null);
  const [isPitched, setIsPitched] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isBuildings, setIsBuildings] = useState(false);
  const [isSatellite, setIsSatellite] = useState(false);
  const [isTerrain, setIsTerrain] = useState(false);
  // const [promoted, setPromoted] = useState<MapboxPromoted>();
  const [map, setMap] = useState<mapboxgl.Map>();

  // console.log(PromotedPopup);
  // console.log(daysInWeek);
  // console.log(has);

  // const handleSelectPromotionType = (event: React.ChangeEvent<HTMLSelectElement>) => {
  //   if (!promoted) { return; }
  //   const value = event.target.value;
  //   if (value === PROMOTION_TYPES.POPUP) {
  //     promoted.enablePromotionPopup = true;
  //   } else if (value === PROMOTION_TYPES.CARD) {
  //     promoted.enablePromotionCard = true;
  //   } else if (value === PROMOTION_TYPES.SIDE_CARD) {
  //     promoted.enablePromotionSideCard = true;
  //   }
  // };
  const handleToggle3D = () => {
    if (!map) { return; }
    if (isPitched) {
      map.easeTo({ pitch: 0, bearing: 0 });
      setIsPitched(false);
    } else {
      const { pitch, bearing} = initialMapState;
      map.easeTo({ pitch, bearing });
      setIsPitched(true);
    }
  };
  const handleToggleDark = () => {
    if (!map) { return; }
    if (isDark) {
      map.setStyle(STYLES.STREET);
      setIsDark(false);
    } else {
      map.setStyle(STYLES.DARK);
      setIsDark(true);
    }
  };
  const handleToggleSatellite = () => {
    if (!map) { return; }
    if (isSatellite) {
      map.setStyle(STYLES.STREET);
      setIsTerrain(false);
      setIsSatellite(false);
    } else {
      map.setStyle(STYLES.SATELLITE);
      setIsBuildings(false);
      setIsSatellite(true);
    }
  };
  const handleToggleBuildings = () => {
    if (!map) { return; }
    if (isBuildings) {
      map.removeLayer('buildings');
      setIsBuildings(false);
    } else {
      const layers = map.getStyle().layers;
      if (!layers || !layers.length) { return; }
      const textLayer = layers.find(layer => layer.type === 'symbol' && layer.layout && layer.layout['text-field']);
      map.addLayer(BUILDINGS_LAYER_STYLE, textLayer && textLayer.id);
      setIsBuildings(true);
    }
  };
  const handleToggleTerrain = () => {
    if (!map) { return; }
    if (isTerrain) {
      map.setTerrain();
      map.removeSource('mapbox-dem');
      setIsTerrain(false);
    } else {
      map.addSource('mapbox-dem', TERRAIN_SOURCE_STYLE);
      map.setTerrain({
        'source': 'mapbox-dem',
        'exaggeration': 1.5
      });
      setIsTerrain(true);
    }
  };

  useEffect(() => {
    const map = new Map({
      container: mapRef.current as any,
      style: STYLES.STREET,
      center: [initialMapState.lng, initialMapState.lat],
      zoom: initialMapState.zoom,
    });
    // const promoted = new MapboxPromoted(
    //   map,
    //   process.env.MAPBOX_ACCESS_TOKEN,
    //   {
    //     baseUrl: process.env.MAPBOX_BASE_URL,
    //     sourceUrl: process.env.MAPBOX_SOURCE_URL,
    //     telemetryUrl: process.env.MAPBOX_TELEMETRY_URL,
    //     layerSourceId: process.env.MAPBOX_LAYER_SOURCE_ID,
    //     debug: true,
    //   }
    // );
    // promoted.addHandler(new PromotedCard());
    
    // promoted.on('load', (type: any, event: any) => console.log(type, event));
    // promoted.on('move', (type: any, event: any) => console.log(type, event));
    // promoted.on('click_pin', (type: any, event: any) => console.log(type, event));
    
    // promoted.on('click_side_card', (type: any, event: any) => console.log(type, event));
    // promoted.on('show_side_card', (type: any, event: any) => console.log(type, event));
    // promoted.on('close_side_card', (type: any, event: any) => console.log(type, event));
    // promoted.on('update_side_card', (type: any, event: any) => console.log(type, event));
    // promoted.on('hide_side_card', (type: any, event: any) => console.log(type, event));

    // promoted.on('click_card', (type: any, event: any) => console.log(type, event));
    // promoted.on('show_card', (type: any, event: any) => console.log(type, event));
    // promoted.on('update_card', (type: any, event: any) => console.log(type, event));
    // promoted.on('close_card', (type: any, event: any) => console.log(type, event));

    // promoted.on('click_popup', (type: any, event: any) => console.log(type, event));
    // promoted.on('show_popup', (type: any, event: any) => console.log(type, event));
    // promoted.on('close_popup', (type: any, event: any) => console.log(type, event));
    
    map.on('load', () => {
      map.addControl(new mapboxgl.NavigationControl({
        visualizePitch: true,
      }));
      map.addControl(new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true,
      }));
    });
    setMap(map);
    // setPromoted(promoted);

    return () => {
      map.remove();
    }
  }, []);

  return (
    <>
      <Container ref={mapRef} />
      {/* <PromotionPanel>
        <Select onChange={handleSelectPromotionType}>
          <Option value='popup'>Popup</Option>
          <Option value='sidecard'>SideCard</Option>
          <Option value='card'>Card</Option>
        </Select>
      </PromotionPanel> */}
      <DebugPanel>
        <Button onClick={handleToggle3D}>
          {isPitched ? '2D' : '3D'}
        </Button>
        <Button onClick={handleToggleDark}>
          {isDark ? 'Light' : 'Dark'}
        </Button>
        <Button onClick={handleToggleBuildings}>
          {isBuildings ? 'Non Buildings' : 'Buildings'}
        </Button>
        <Button onClick={handleToggleSatellite}>
          {isSatellite ? 'Non Satellite' : 'Satellite'}
        </Button>
        <Button onClick={handleToggleTerrain}>
          {isTerrain ? 'Non Terrain' : 'Terrain'}
        </Button>
      </DebugPanel>
    </>
  );
};

export default App;
