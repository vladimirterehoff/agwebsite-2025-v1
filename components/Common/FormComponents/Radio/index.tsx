// Libs
import {ChangeEvent, FC, ReactNode, useEffect, useState} from 'react';
import {Controller, useFormContext} from 'react-hook-form';
// MUI Components
import {
    FormControlLabel,
    FormHelperText,
    FormControl,
    FormLabel,
    RadioGroup,
    Radio
} from '@mui/material';
// Styles
import styles from './style.module.scss';

interface Variant {
    value: string;
    name: string;
    is_disabled?: boolean;
}

interface Props{
    name: any;
    label?: string;
    variants: Variant[];
    disabled?: boolean;
    error?: boolean;
    helperText?: any;
    defaultValue?: string | number;
    labelPlacement?: 'top' | 'bottom' | 'start' | 'end';
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
};

/**
 * Radio Buttons Component
 * @param props
 * @constructor
 */
const Radiobutton: FC<Props> = (props) => {
    const{
        defaultValue,
        name,
        label,
        variants = [],
        labelPlacement = 'end',
    } = props;
    const { control } = useFormContext()

    return (
        <>
            <Controller
                name={props.name}
                control={control}
                defaultValue={defaultValue}
                render={({field}) => (
                    <FormControl fullWidth={true} component="fieldset" >
                        {label && <FormLabel component="legend">{label}</FormLabel>}
                        <RadioGroup aria-label={name}
                                    name={name}
                                    value={field.value}
                                    onChange={(e : any)=>{
                                        field.onChange(e.target.value);
                                        if(props.onChange) props.onChange(e.target.value);
                                    }}>
                            {variants.map((item: Variant) => (
                                <div key={`radio-item-${props.name}-${item.name}-${item.value}`}>
                                    <FormControlLabel
                                        labelPlacement={labelPlacement}
                                        value={item.value}
                                        disabled={props.disabled || item.is_disabled}
                                        control={<Radio color="primary" checked={field.value == item.value} />}
                                        label={item.name} />
                                </div>
                            ))}
                        </RadioGroup>

                        <FormHelperText error={props.error}>
                            {props.helperText}
                        </FormHelperText>
                    </FormControl>
                )}
            />
        </>
    );
};

export default Radiobutton;
