import React, { MutableRefObject, useEffect, useRef } from 'react';
import { GOOGLE_MAPS_API_KEY } from "@/utils/envirenment";
import { Coordinates } from "@/app-redux/COMMON/model/coordinates";
import {CityZone} from "@/app-redux/cityZones/model";

const polygonOptions = {
  fillOpacity: 0.35,
  strokeWeight: 2,
  clickable: true,
  editable: true,
  zIndex: 1,
};

const secondaryPolygonOptions = {
  fillOpacity: 0.35,
  strokeWeight: 2,
  clickable: false,
  editable: false,
  zIndex: 0,
};

const mapOptions = {
  center: { lat: 52.37374003073595, lng: 4.89571088116175 }, // Default to Amsterdam
  zoom: 12,
};

interface Props {
  setPolygon: (coordinates: Coordinates[] | undefined) => void;
  polygon?: Coordinates[];
  cityName?: string;
  color?: string;
  cityZoneList?: CityZone[];
}

const MapWithPolygon: React.FC<Props> = ({
                                           cityName,
                                           polygon,
                                           setPolygon,
                                           color,
                                           cityZoneList }) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const googleMapsScriptLoaded = useRef(false);
  const currentPolygon = useRef<google.maps.Polygon | null>(null); // Track the current polygon
  const colorRef = useRef(color); // Ref to track the latest color

  useEffect(() => {
    if (currentPolygon.current) {
      return
    }

    const googleScript = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=drawing`;

    // Check if the Google Maps script is already present
    const existingScript = document.querySelector(`script[src^="${googleScript}"]`);

    // If the script exists, remove it
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement('script');
    script.src = googleScript;
    script.async = true;
    script.onload = () => {
      googleMapsScriptLoaded.current = true;
      initializeMap();
    };
    document.head.appendChild(script);
  }, [polygon, cityName, cityZoneList]);

  useEffect(() => {
    colorRef.current = color;

    if (currentPolygon.current && color) {
      setColorToPolygon(currentPolygon.current);
    }
  }, [color]);

  const initializeMap = () => {
    if (!mapRef.current || !window.google) return;

    const map = new window.google.maps.Map(mapRef.current, mapOptions);

    const drawingManager = new window.google.maps.drawing.DrawingManager({
      drawingMode: window.google.maps.drawing.OverlayType.POLYGON,
      drawingControl: true,
      drawingControlOptions: {
        position: window.google.maps.ControlPosition.TOP_CENTER,
        drawingModes: [window.google.maps.drawing.OverlayType.POLYGON],
      },
      polygonOptions: polygonOptions,
    });

    drawingManager.setMap(map);
    setColorToPolygon(drawingManager);

    // If polygon prop is passed, display the polygon
    drawCurrentPolygon(map);
    drawOtherPolygonInCity(map);
    addListeners(currentPolygon, drawingManager);

    if (!polygon && !currentPolygon.current) {
      setCityCenter(map);
    }
  };

  const drawCurrentPolygon = (map: google.maps.Map) => {
    if (polygon && polygon.length > 0) {
      const path = polygon.map(coord => ({
        lat: coord.latitude,
        lng: coord.longitude,
      }));

      currentPolygon.current = new window.google.maps.Polygon({ paths: path, ...polygonOptions });
      currentPolygon.current.setMap(map); // Add the polygon to the map
      setColorToPolygon(currentPolygon.current);

      // Center map to current polygon bounds
      const newBounds = new window.google.maps.LatLngBounds();
      polygon.forEach((coordinates: Coordinates) => {
        newBounds.extend(new window.google.maps.LatLng(coordinates.latitude, coordinates.longitude));
      });

      map.fitBounds(newBounds);
    }
  };
  const drawOtherPolygonInCity = (map: google.maps.Map) => {
    // Draw other polygons from cityZoneList
    cityZoneList?.forEach(cityZone => {
      const zonePath = cityZone.polygon.map((coordinates: Coordinates) => ({
        lat: coordinates.latitude,
        lng: coordinates.longitude,
      }));

      const options = {...secondaryPolygonOptions, ...{fillColor: cityZone.color, strokeColor: cityZone.color}}

      const zonePolygon = new window.google.maps.Polygon({ paths: zonePath, ...options });
      zonePolygon.setMap(map);
    });
  };

  const addListeners = (currentPolygon: MutableRefObject<google.maps.Polygon | null>, drawingManager: google.maps.drawing.DrawingManager) => {
    addUpdatesListeners(currentPolygon);

    // Listener for drawing a new polygon
    google.maps.event.addListener(drawingManager, 'overlaycomplete', (event: any) => {
      if (event.type === window.google.maps.drawing.OverlayType.POLYGON) {
        // Clear any existing polygon
        if (currentPolygon.current) {
          currentPolygon.current.setMap(null);
        }

        // Set the new polygon as the current one
        currentPolygon.current = event.overlay as google.maps.Polygon;
        currentPolygon.current.setMap(drawingManager.getMap()); // Ensure it is visible
        setColorToPolygon(currentPolygon.current);
        addUpdatesListeners(currentPolygon);
        updatePolygon(); // Update coordinates immediately after the polygon is drawn
      }
    });
  };

  const addUpdatesListeners = (currentPolygon: MutableRefObject<google.maps.Polygon | null>) => {
    if (!currentPolygon.current) return;

    // Clear existing listeners if any (to avoid duplicates)
    google.maps.event.clearListeners(currentPolygon.current, 'dragend');
    google.maps.event.clearListeners(currentPolygon.current.getPath(), 'set_at');
    google.maps.event.clearListeners(currentPolygon.current.getPath(), 'insert_at');

    // Add listeners for polygon edit events
    google.maps.event.addListener(currentPolygon.current, 'dragend', updatePolygon);
    google.maps.event.addListener(currentPolygon.current.getPath(), 'set_at', updatePolygon);
    google.maps.event.addListener(currentPolygon.current.getPath(), 'insert_at', updatePolygon);
  }

  const updatePolygon = () => {
    if (currentPolygon.current) {
      const coordinates = currentPolygon.current.getPath().getArray().map((latLng) => ({
        latitude: latLng.lat(),
        longitude: latLng.lng(),
      }));

      // Ensure the polygon is closed by repeating the first coordinate if necessary
      if (coordinates.length > 0 &&
        (coordinates[0].latitude !== coordinates[coordinates.length - 1].latitude ||
          coordinates[0].longitude !== coordinates[coordinates.length - 1].longitude)) {
        coordinates.push(coordinates[0]);
      }

      setPolygon(coordinates); // Update parent state with new coordinates
    }
  };

  const setCityCenter = (map: google.maps.Map) => {
    if (cityName && window.google) {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address: cityName }, (results, status) => {
        if (status === window.google.maps.GeocoderStatus.OK && results && results[0]) {
          const cityLatLng = results[0].geometry.location;
          map.setCenter(cityLatLng); // Center the map to the city's coordinates
        } else {
          console.error('Geocoding failed for the city:', cityName);
        }
      });
    }
  };

  const setColorToPolygon = (polygonObject: any) => {
    polygonObject?.setOptions({
      fillColor: colorRef.current,
      strokeColor: colorRef.current,
    });
  }

  return <div ref={mapRef} style={{ width: '100%', height: '500px' }} />;
};

export default MapWithPolygon;
