// Libs
import React from 'react';
import classNames from 'classnames';
import MuiPhoneNumber, { MuiPhoneNumberProps } from 'material-ui-phone-number';
import { Controller, useFormContext } from 'react-hook-form';
// Styles
import style from './style.module.scss';

interface Props extends Omit<MuiPhoneNumberProps, 'name' | 'onChange'> {
  name: string;
  onChange?: (value: string) => void;
}

const PhoneNumber: React.FC<Props> = (props) => {
  const {
    name,
    defaultValue = '',
    label = '',
    className = '',
    helperText = '',
    error = false,
    required = false,
    fullWidth = true,
    disabled = false,
    variant = 'outlined',
    defaultCountry = 'nl',
    onChange: onChangeField = undefined,
    ...defaultProps
  } = props;

  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      defaultValue={defaultValue}
      control={control}
      render={({ field }) => {
        return (
          <MuiPhoneNumber
            {...defaultProps}
            name={name}
            id={`input-phone-${name}`}
            label={label}
            className={classNames(className, style.textField)}
            onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | string) => {
                field.onChange(e);

              if (onChangeField) {
                onChangeField(e as string);
              }
            }}
            value={field.value}
            variant={variant}
            error={error}
            helperText={helperText}
            required={required}
            disabled={disabled}
            fullWidth={fullWidth}
            defaultCountry={defaultCountry}
          />
        );
      }}
    />
  );
};

export default PhoneNumber;
