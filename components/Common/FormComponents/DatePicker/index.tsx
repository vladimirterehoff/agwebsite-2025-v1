// Libs
import * as React from 'react';
import {Controller, useFormContext} from "react-hook-form";
import InputMask from "react-input-mask";
import moment from 'moment';
// MUI Components
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {DesktopDatePicker} from '@mui/x-date-pickers/DesktopDatePicker';
import {TextField, TextFieldProps} from '@mui/material';


interface DatePickerProps {
  name: string;
  format?: string;
  defaultValue?: string;
  label?: string;
  error?: boolean;
  helperText?: any;
  onChange?: (e:any) => void;
  disablePast?: boolean;
  disableFuture?: boolean;
  disabled?: boolean;
  size?: 'small' | 'medium';
  minDate?: string;
  maxDate?: string;
}

/**
 * Date Picker Component
 * @param props
 * @constructor
 */
const DatePicker = (props: DatePickerProps) => {
  const {
    name,
    defaultValue = '',
    error,
    helperText,
    disablePast,
    disableFuture,
    disabled,
    label = 'Date',
    format = 'yyyy-MM-dd',
    size = 'medium',
    minDate,
    maxDate
  } = props;

  const { control } = useFormContext();
  const [debounceTimeout, setDebounceTimeout] = React.useState<NodeJS.Timeout | null>(null);

  // Helper function for rendering TextField
  // to avoid bloating the code inside renderInput
  const renderTextField = (params: TextFieldProps, inputProps: any) => (
    <TextField
      {...inputProps}
      label={label}
      error={error}
      helperText={helperText}
      fullWidth
      size={size}
      InputProps={{
        ...params.InputProps,
        // add calendar icon and other stuff
        endAdornment: params.InputProps?.endAdornment
      }}
    />
  );

  return (
    <Controller
      defaultValue={defaultValue}
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => {
        // Convert RHF string to Date for DesktopDatePicker
        const dateValue = value ? new Date(value) : null;
        
        return (
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DesktopDatePicker
              label={label}
              inputFormat={format}
              disabled={disabled}
              disablePast={disablePast}
              disableFuture={disableFuture}
              minDate={minDate ? new Date(minDate) : undefined}
              maxDate={maxDate ? new Date(maxDate) : undefined} 
              value={dateValue}
              onChange={(newValue: Date | null) => {
                // Save to store string in the right format
                const formattedDate = newValue
                  ? moment(newValue).format('YYYY-MM-DD')
                  : '';
                onChange(formattedDate);

                // If needed callback in parent:
                props.onChange?.(newValue);
              }}
              renderInput={(params: TextFieldProps) => (
                <InputMask
                  mask="9999-99-99"
                  maskChar="_"
                  disabled={disabled}
                  value={value || ''}
                  // Remove check for '_' - otherwise nothing is written until the mask is incomplete
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    onChange(e.target.value);

                    // Debounce the onChange callback with 1 second delay if needed callback in parent:
                    if (debounceTimeout) {
                      clearTimeout(debounceTimeout);
                    }
                    const timeout = setTimeout(() => {
                      props.onChange?.(e.target.value);
                    }, 1000);
                    setDebounceTimeout(timeout);
                  }}
                >
                  {(inputProps: any) => renderTextField(params, inputProps)}
                </InputMask>
              )}
            />
          </LocalizationProvider>
        );
      }}
    />
  );
};

export default DatePicker;
