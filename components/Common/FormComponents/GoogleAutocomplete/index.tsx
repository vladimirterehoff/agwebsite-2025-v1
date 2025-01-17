// Libs
import React, {useEffect, useState} from 'react';
import {usePlacesWidget} from "react-google-autocomplete";
import {useFormContext} from "react-hook-form";
// MUI Components
import {BaseTextFieldProps} from "@mui/material/TextField";
import PinIcon from "@mui/icons-material/Pin";
// Components
import TextField from "@/components/Common/FormComponents/TextField";
// Constants
import {API_URL, GOOGLE_MAPS_API_KEY} from "@/utils/envirenment";
// Stiles
import styles from './style.module.scss'

export interface InputFieldProps extends BaseTextFieldProps {
    name: string;
    defaultValue?: string | number | null;
    onChange?: (e: any) => void;
    setPlaceCallback?: (data: any) => {}
    helperText?: any
}

/**
 * Google Autocomplete Component
 * @param props
 * @constructor
 */
const GoogleAutocomplete = (props: InputFieldProps) => {
    const { setValue } = useFormContext();
    const {ref}: any = usePlacesWidget({
        apiKey: GOOGLE_MAPS_API_KEY,
        onPlaceSelected: (place) => {
            console.log(place);
            if (place.address_components) {
                if(props.setPlaceCallback) props.setPlaceCallback(place.address_components);
            }

            setValue(props.name, place.formatted_address)
        },
    });

    return (
        <TextField {...props}
            inputRef={ref}
            inputProps={{
                endAdornment: <PinIcon />
            }}
        />
    );
};

export default GoogleAutocomplete;
