import * as React from 'react';
// import TextField from 'components/common/formComponents/textField';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {DateTimePicker as MaterialDateTimePicker} from '@mui/x-date-pickers/DateTimePicker';
import styles from './style.module.scss'
import {Controller, useFormContext} from "react-hook-form";
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import { TextField } from '@mui/material';
import { Moment } from 'moment';

interface DatePickerProps {
    name: string
    format?: string
    defaultValue?: string | number | null | Date | Moment
    label?: string
    error?: boolean
    required?: boolean
    shrink?: boolean
    disabledFuture?: boolean
    disablePast?: boolean
    helperText?: any
    disabled?: boolean;
    minDateTime?: string | number | null | Date
    maxDateTime?: string | number | null | Date
    size?: 'small' | 'medium'
}

const DateTimePicker = (props: DatePickerProps) => {
    const {
        name,
        required,
        defaultValue = '',
        error,
        helperText,
        label = 'Date',
        format = 'dd.MM.yyyy HH:mm',
        shrink = false,
        disabledFuture = false,
        disablePast = false,
        disabled = false,
        minDateTime, 
        maxDateTime,
        size
    } = props

    const {control} = useFormContext()

    return (
        <Controller
            name={name}
            control={control}
            defaultValue={defaultValue}
            render={({field}) => {
                return (
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <MaterialDateTimePicker label={`${label}${required ? '*' : ''}`}
                                        disabled={disabled}
                                        inputFormat={format}
                                        value={field.value}
                                        ampm={true}
                                        hideTabs={false}
                                        disableFuture={disabledFuture}
                                        disablePast={disablePast}
                                        minDateTime={minDateTime}
                                        maxDateTime={maxDateTime}
                                        PopperProps={{
                                            className: ""
                                        }}
                                        dayOfWeekFormatter={(day: any) => day}
                                        onChange={field.onChange}
                                        renderInput={(params: any) => <TextField {...params}
                                                                                 id={`datetimepicker__${name}`}
                                                                                 error={error}
                                                                                 helperText={helperText}
                                                                                 name={name}
                                                                                 InputProps={{
                                                                                     ...params.InputProps,
                                                                                     shrink: shrink.toString(),
                                                                                 }}
                                                                                 fullWidth
                                                                                 size={size}/>
                                        }
                        />
                    </LocalizationProvider>
                )
            }}
        />
    )
}

export default DateTimePicker
