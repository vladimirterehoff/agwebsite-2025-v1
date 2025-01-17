import { useEffect, useState } from "react";
import {
  GoogleMap as GoogleMapComponent,
  GoogleMapProps,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import { useFormContext, Controller } from "react-hook-form";
import FormHelperText from "@mui/material/FormHelperText";
import { Box, Grid, TextField, Typography } from "@mui/material";
import axios from "axios";
import { GOOGLE_MAPS_API_KEY } from "@/utils/envirenment";

type GoogleMapCoordinates = { latitude: number; longitude: number };
interface Props extends GoogleMapProps {
  name: string;
  defaultValue?: GoogleMapCoordinates;
  onSetMarkerCallback?: (coordinates: GoogleMapCoordinates) => void;
  label?: string;
}

const nameAddress = "address";

const GoogleMapField = (props: Props) => {
  const {
    name: mapName,
    defaultValue = [],
    label = "Address",
  } = props;

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
    language: "en",
  });

  const { control, setValue, clearErrors, watch, getValues, formState } = useFormContext();
  const errors: any = {...formState.errors};
  const [watchAddress] = watch([nameAddress]);

  const getAddressFromLatLng = async (coordinates: GoogleMapCoordinates) => {
    const resp = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coordinates.latitude},${coordinates.longitude}&language=en&key=${GOOGLE_MAPS_API_KEY}`
    );
    const addressComponents = resp?.data?.results?.[0]?.address_components;

    if (addressComponents) {
      let city = "";
      let street = "";
      let zip_code = "";

      addressComponents.forEach((component: any) => {
        if (component.types.includes("locality")) {
          city = component.long_name;
        }
        if (component.types.includes("route")) {
          street = component.long_name;
        }
        if (component.types.includes("postal_code")) {
          zip_code = component.long_name;
        }
      });

      setValue(`${nameAddress}.city`, city);
      setValue(`${nameAddress}.street`, street);
      setValue(`${nameAddress}.zip_code`, zip_code);
    }

    if (errors?.[nameAddress] || errors?.[mapName]) clearErrors([nameAddress, mapName]);
  };

  const updateCoordinatesFromAddress = async () => {
    const city = getValues(`${nameAddress}.city`);
    const street = getValues(`${nameAddress}.street`);
    const zip_code = getValues(`${nameAddress}.zip_code`);
    const address = `${street}, ${city}, ${zip_code}`;

    if (city && street) {
      const resp = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&language=en&key=${GOOGLE_MAPS_API_KEY}`
      );
      const location = resp?.data?.results?.[0]?.geometry?.location;

      if (location) {
        setValue(mapName, { latitude: location.lat, longitude: location.lng });
      }
    }
  };

  return isLoaded ? (
    <>
      <Typography color="#7e898c" mb={1}>
        {label}
      </Typography>
      <Controller
        name={mapName}
        control={control}
        defaultValue={defaultValue}
        render={({ field }) => (
          <GoogleMapComponent
            {...props}
            center={
              props.center ||
              (field.value?.latitude && field.value?.longitude
                ? { lat: field.value.latitude, lng: field.value.longitude }
                : { lat: 0, lng: 0 })
            }
            options={{
              ...props.options,
              disableDefaultUI: true,
              disableDoubleClickZoom: true,
              zoomControl: true,
            }}
            zoom={1}
            onDblClick={(e) => {
              if (e.latLng) {
                const lat = e.latLng.lat();
                const lng = e.latLng.lng();
                const coordinates: GoogleMapCoordinates = {
                  latitude: lat,
                  longitude: lng,
                };

                field.onChange(coordinates);
                getAddressFromLatLng(coordinates);

                if (errors?.[mapName])
                  clearErrors(mapName);

                if (props.onSetMarkerCallback) {
                  props.onSetMarkerCallback(coordinates);
                }
              }
            }}
          >
            {field.value &&
              Boolean(field.value.latitude) &&
              Boolean(field.value.longitude) && (
                <Marker
                  position={{
                    lat: field.value.latitude,
                    lng: field.value.longitude,
                  }}
                  animation={google.maps.Animation.DROP}
                />
              )}
          </GoogleMapComponent>
        )}
      />
            {errors?.[mapName] && (
        <FormHelperText error={Boolean(errors?.[mapName])}>{
          [errors?.[mapName]?.latitude?.message, errors?.[mapName]?.longitude?.message].filter(i => i).join(" ")
        }</FormHelperText>
      )}

      <Box mt={2} mb={1}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="City"
              value={watchAddress?.city || ""}
              onChange={(e) => setValue(`${nameAddress}.city`, e.target.value)}
              onBlur={() => {
                updateCoordinatesFromAddress()
                clearErrors(`${nameAddress}.city`)
              }}
              error={Boolean(errors?.[nameAddress]?.city?.message)}
              helperText={Boolean(errors?.[nameAddress]?.city?.message)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Street"
              value={watchAddress?.street || ""}
              onChange={(e) =>
                setValue(`${nameAddress}.street`, e.target.value)
              }
              onBlur={() => {
                updateCoordinatesFromAddress()
                clearErrors(`${nameAddress}.street`)
              }}
              error={Boolean(errors?.[nameAddress]?.street?.message)}
              helperText={Boolean(errors?.[nameAddress]?.street?.message)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Zip Code"
              // error={error}
              value={watchAddress?.zip_code || ""}
              onChange={(e) =>
                setValue(`${nameAddress}.zip_code`, e.target.value)
              }
              onBlur={() => {
                updateCoordinatesFromAddress()
                clearErrors(`${nameAddress}.zip_code`)
              }}
              error={Boolean(errors?.[nameAddress]?.zip_code?.message)}
              helperText={Boolean(errors?.[nameAddress]?.zip_code?.message)}
            />
          </Grid>
        </Grid>
      </Box>
    </>
  ) : null;
};

export default GoogleMapField;
