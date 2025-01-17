import React from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { GOOGLE_MAPS_API_KEY } from "@/utils/envirenment";

interface GoogleMapViewProps {
  markerPosition?: {
    lat: number;
    lng: number;
  };
}

const containerStyle = {
  width: "100%",
  height: "400px",
};

const GoogleMapView: React.FC<GoogleMapViewProps> = ({ markerPosition }) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={markerPosition || { lat: 52.37374003073595, lng: 4.89571088116175 }}
      zoom={10}
    >
      {markerPosition && <Marker position={markerPosition} />}
    </GoogleMap>
  ) : <></>;
};

export default GoogleMapView; 