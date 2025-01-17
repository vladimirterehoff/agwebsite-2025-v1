import * as React from 'react';
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {TimePicker as TimePickerMaterial} from '@mui/x-date-pickers/TimePicker';
import {Control, Controller, useFormContext} from "react-hook-form";
import { TextField } from '@mui/material';
import moment from 'moment';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';

interface TimePickerProps {
    name: string;
    format?: string;
    defaultValue?: string;
    label?: string;
    error?: boolean;
    helperText?: any;
    convertToUTC?: boolean;
}

const TimePicker = (props: TimePickerProps) => {
    const {
        name,
        defaultValue='',
        error,
        helperText,
        label = 'Time',
        format = 'HH:mm',
        convertToUTC = false
    } = props

    const { control, getValues, clearErrors } = useFormContext()

    const convertToLocalTime = (utcTime: string) => {
        if (!utcTime) return null;
        return moment.utc(utcTime, 'HH:mm:ss').local();
    }

    const convertToUTCTime = (localTime: moment.Moment) => {
        if (!localTime) return '';
        return localTime.utc().format('HH:mm:ss');
    }

    return (
        <Controller
            defaultValue={defaultValue}
            name={name}
            control={control}
            render={({field}) => {
                const localValue = field.value ? convertToLocalTime(field.value) : null;
                
                return (
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                        <TimePickerMaterial
                            label={label}
                            ampm={false}
                            ampmInClock={false}
                            inputFormat={format}
                            value={localValue}
                            onChange={(value: moment.Moment | null) => {
                                const formattedValue = value ? convertToUTCTime(value) : '';
                                field.onChange(formattedValue);
                                if (error) clearErrors(name)
                            }}
                            renderInput={(params:any) => (
                                <TextField
                                    {...params}
                                    error={error}
                                    id={`timepicker__${name}`}
                                    helperText={helperText}
                                    name={name}
                                    fullWidth
                                />
                            )}
                        />
                    </LocalizationProvider>
                )
            }}
        />
    )
}

export default TimePicker;
