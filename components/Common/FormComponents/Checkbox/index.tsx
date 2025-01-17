// Libs
import React, { ChangeEvent, ReactNode } from 'react';
import {Controller, useFormContext} from 'react-hook-form';
// MUI Components
import MaterialCheckbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";

interface CheckboxProps{
  defaultValue?: boolean
  disabled?: boolean
  error?: boolean
  helperText?: any
  label: string
  labelPlacement?: 'end' | 'start' | 'top' | 'bottom'
  name: string
  className?: string
}

/**
 * Checkbox Component
 * @param props
 * @constructor
 */
const Checkbox = (props: CheckboxProps) => {
  const {
    name,
    error,
    helperText,
    className,
    label,
    labelPlacement = 'end',
    disabled = false,
    defaultValue = false
  } = props;

  const { control } = useFormContext()

  return (
      <>
        <Controller
            name={name}
            control={control}
            defaultValue={defaultValue}
            render={({field}) => (
                <FormControlLabel
                    className={className}
                    disabled={disabled}
                    control={
                      <MaterialCheckbox
                          color="primary"
                          onChange={(e: ChangeEvent<HTMLInputElement>) => field.onChange(e.target.checked)}
                          checked={Boolean(field.value)}
                      />
                    }
                    label={label}
                    labelPlacement={labelPlacement}
                />
            )}
        />

        <FormHelperText error={error}>
          {helperText}
        </FormHelperText>
      </>
  );
};

export default Checkbox;
