// Libs
import React, { ChangeEvent, ReactNode } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
// MUI Components
import MaterialSwitch, { SwitchProps as MaterialSwitchProps } from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import {FormHelperText} from "@mui/material";
// Styles
import styles from './style.module.scss';


interface CheckboxProps extends MaterialSwitchProps {
  error?: boolean;
  helperText?: ReactNode | string;
  label: string;
  labelPlacement?: 'end' | 'start' | 'top' | 'bottom';
  name: string;
  className?: string
}

const Switch = (props: CheckboxProps) => {
  const {
    name,
    error,
    helperText,
    className,
    label,
    labelPlacement = 'end',
    disabled,
    size = 'small',
    required,
    ...restProps
  } = props;

  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={false}
      render={({field}) => {
        return (
          <div>
            <div className={styles.switchWrap}>
              <FormControlLabel
                className={className}
                label={label? `${label} ${required ? ' *' : ''}` : undefined}
                labelPlacement={labelPlacement}
                disabled={disabled}
                control={
                  <MaterialSwitch
                    color="primary"
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        field.onChange(e.target.checked)
                    }
                    checked={Boolean(field.value)}
                    size={size}
                    required={required}
                    {...restProps}
                  />
                }
              />

                <FormHelperText error={!!error}>
                    {helperText}
                </FormHelperText>
            </div>
          </div>
        );
      }}
    />
  );
};

export default Switch;
