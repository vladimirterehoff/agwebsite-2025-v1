import { useEffect, useState } from 'react';
import {
  GoogleMap as GoogleMapComponent,
  GoogleMapProps,
  Marker,
  Autocomplete,
  LoadScript,
  useJsApiLoader,
} from '@react-google-maps/api';
import { useFormContext, Controller } from 'react-hook-form';
import FormHelperText from '@mui/material/FormHelperText';
// import { GOOGLE_API_KEY } from 'utils/envirenment';
import { Box, TextField } from '@mui/material';
import axios from 'axios';
import { GOOGLE_MAPS_API_KEY } from '@/utils/envirenment';

type GoogleMapCoordinates = { latitude: number; longitude: number };
interface Props extends GoogleMapProps {
  name: string;
  label: string;
  mapName: string;
  defaultValue?: GoogleMapCoordinates;
  error?: boolean;
  helperText?: string;
  mapError?: boolean;
  mapHelperText?: string;
  onSetMarkerCallback?: (coordinates: GoogleMapCoordinates) => void;
}

const defaultCenter = { lat: 52.132633, lng: 5.291266 }; // Координаты центра Нидерландов

const GoogleMapAutocomplete = (props: Props) => {
  const {
    name,
    label,
    mapName,
    defaultValue = [],
    error = false,
    helperText = '',
    mapError = false,
    mapHelperText = '',
  } = props;

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
    language: 'en',
});

  const [autocomplete, setAutocomplete] = useState<any>();

  const { control, setValue, clearErrors } = useFormContext();

  const onAutocompleteChange = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();

      const latitude = place?.geometry?.location?.lat();
      const longitude = place?.geometry?.location?.lng();

      if (latitude && longitude) {
        setValue(mapName, { latitude, longitude });
      }

      if (error || mapError) clearErrors([name, mapName]);
    }
  };

  const onSaveChange = (test: string) => {
    setValue(name, test);
  };

  const getAddressFromLatLng = async (coordinates: GoogleMapCoordinates) => {
    const resp = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coordinates.latitude},${coordinates.longitude}&language=en&key=${GOOGLE_MAPS_API_KEY}`,
    );
    const newAddress = resp?.data?.results?.[0]?.formatted_address;

    if (newAddress) setValue(name, `${newAddress}`);

    if (error || mapError) clearErrors([name, mapName]);
  };

  // useEffect(() => {
  //   if (!error) clearErrors('coordinates');
  // }, [error, mapError])

  return isLoaded ? (
    <>
      <Box mb={1}>
        <Controller
          name={name}
          control={control}
          defaultValue={defaultValue}
          render={({field}) => (
            <Autocomplete onLoad={(a) => setAutocomplete(a)} onPlaceChanged={onAutocompleteChange}>
              <TextField
                fullWidth
                value={field.value}
                onChange={field.onChange}
                label={label}
                error={error}
                helperText={helperText}
                onBlur={(e) => {
                  if (error || mapError) clearErrors([name, 'coordinates'])
                  onSaveChange(e.target.value);
                }}
              />
            </Autocomplete>
          )}
        />
      </Box>

      <Controller
        name={mapName}
        control={control}
        defaultValue={defaultValue}
        render={({field}) => {
          return (
            <GoogleMapComponent
              {...props}
              center={props.center ||
                field.value?.latitude && field.value?.longitude ? 
                { lat: field.value.latitude, lng: field.value.longitude } : defaultCenter
              }
              options={{
                ...props.options,
                disableDefaultUI: true,
                disableDoubleClickZoom: true,
                zoomControl: true,
              }}
              zoom={7}
              onDblClick={(e) => {
                if (
                  e.latLng &&
                  typeof e.latLng.lat() === 'number' &&
                  typeof e.latLng.lat() === 'number'
                ) {
                  const lat = e.latLng.lat();
                  const lng = e.latLng.lng();

                  const coordinates: GoogleMapCoordinates = { latitude: lat, longitude: lng };

                  field.onChange(coordinates);
                  getAddressFromLatLng(coordinates);

                  if (error || mapError) clearErrors([name, 'coordinates'])

                  if (props.onSetMarkerCallback) {
                    props.onSetMarkerCallback(coordinates);
                  }
                }
              }}
            >
              {field.value && Boolean(field.value.latitude) && Boolean(field.value.longitude) && (
                <Marker
                  position={{ lat: field.value.latitude, lng: field.value.longitude }}
                  animation={google.maps.Animation.DROP}
                />
              )}
            </GoogleMapComponent>
          );
        }}
      />

      {mapError && <FormHelperText error={mapError}>{mapHelperText}</FormHelperText>}
    </>
    
  ): <></>;
};

export default GoogleMapAutocomplete;
