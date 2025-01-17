// Libs
import React, { useState } from "react";
import {Control, Controller, useFormContext} from "react-hook-form";
// MUI Components
import MaterialTextField from "@mui/material/TextField";
import { BaseTextFieldProps } from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export interface InputFieldProps extends BaseTextFieldProps {
    name: string;
    defaultValue?: string | number | null;
    onChange?: (e: any) => void;
    InputProps?: any;
    shrink?: boolean;
    maxLength?: number;
}

/**
 * TextField Component
 * @param props
 * @constructor
 */
const ReactHookTextField = (props: InputFieldProps) => {
  const { control } = useFormContext();
  const [focus, setFocus] = useState(false);
  const defaultProps = {variant : props.variant || 'outlined', fullWidth :  true};
  const {shrink, className, maxLength, ...textFieldProps} = {...props, ... defaultProps};
  const [showPassValue, setShowPassValue] = useState(false);
  const [defaultValue, setDefaultValue] = useState(props.defaultValue)
  const handleClickShowPassword = () => setShowPassValue(!showPassValue);
  const {InputProps = {}} = props;
  const [passwordHasValue, setPasswordHasValue] = React.useState(false);

  const InputPropsArray = {...InputProps, ... props.type == 'password'? {
          endAdornment:
              <InputAdornment position="end">
                  <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword}>
                      {showPassValue ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
              </InputAdornment>
      } : {} }

      const makeAnimationStartHandler = (stateSetter: any) => (e: any) => {
        const autofilled = !!e.target?.matches("*:-webkit-autofill");
        if (e.animationName === "mui-auto-fill") {
            stateSetter(autofilled);
        }

        if (e.animationName === "mui-auto-fill-cancel") {
            stateSetter(autofilled);
        }
    };

  return (
      <>
        <Controller
            render={({field}) => (
                <MaterialTextField
                    id={`textfield-${props.name}`}
                    className={`${className ? className : ''}`}
                    InputLabelProps={{
                        shrink: !!(passwordHasValue || shrink || focus || (field?.value && field?.value != '') || (typeof defaultValue != "undefined" && defaultValue != null) || InputProps?.startAdornment)
                    }}
                    {...textFieldProps}
                    // size={textFieldProps.size || 'small'}
                    onFocus={(e: any) => {
                      setFocus(true);
                      if (props.onFocus) props.onFocus(e.target.value);
                  }}
                  inputProps={{
                      maxLength: maxLength,
                      onAnimationStart: makeAnimationStartHandler(setPasswordHasValue)
                  }}
                  onBlur={(e: any) => {
                      setFocus(false);
                      if (props.onBlur) props.onBlur(e.target.value);
                  }}
                  onKeyDown={(evt) => {
                      if (props.type === 'number') ["e", "E", "+", "-"].includes(evt.key) && evt.preventDefault();
                  }}
                  onChange={(e: any) => {
                      field.onChange(e.target.value);
                      setDefaultValue(undefined);
                      if (props.onChange) props.onChange(e.target.value);
                  }}
                    value={field.value}
                    type={props.type == 'password'? showPassValue ? 'text' : 'password' : props.type}
                    InputProps={InputPropsArray}
                />
            )}
            name={props.name}
            defaultValue={defaultValue}
            control={control}
        />
      </>
  )
}

export default ReactHookTextField;
