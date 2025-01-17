// Libs
import React, { ChangeEvent } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
// MUI Components
import TextField, { BaseTextFieldProps } from '@mui/material/TextField';
import Autocomplete from '@mui/lab/Autocomplete';
// Styles
import styles from './styles.module.scss';
import { AutocompleteProps, AutocompleteRenderOptionState, MenuItem } from '@mui/material';
import theme from '@/theme';

export type SelectVariant = {
    id: number | string;
    name: string;
    disabled?: boolean;
};

interface Props extends BaseTextFieldProps {
    name: string;
    variants: SelectVariant[];
    limitShowTags?: number;
    helperText?: any;
    multiple?: boolean;
    limitTags?: number;
    onChange?: (event: ChangeEvent<{}>, newValue: any) => void;
    value?: any;
}

/**
 * Select Component
 * @param props
 * @constructor
 */
const Select: React.FC<Props> = (props) => {
    const {
        name,
        variants,
        disabled = false,
        error = false,
        helperText = '',
        label = '',
        className = '',
        variant = 'outlined',
        limitTags = 2,
        multiple = false,
        onChange,
        value,
        size
    } = props;

    const { control } = useFormContext();

    return (
        <Controller
            control={control}
            name={name}
            defaultValue={props.defaultValue}
            render={({ field }) => {
                return (
                    <Autocomplete
                        multiple={multiple}
                        fullWidth
                        disableClearable
                        disabled={disabled}
                        limitTags={limitTags}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        className={`${styles.selectMaterial} ${className}`}
                        id={`multiselect_${name}`}
                        options={variants}
                        renderOption={(props: React.HTMLAttributes<HTMLLIElement>, option: SelectVariant, state: AutocompleteRenderOptionState) => {
                            return (
                                <MenuItem
                                    {...props}
                                    key={option.id}
                                    value={option.id}
                                    disabled={option.disabled}
                                    style={{
                                        fontWeight: state.selected ? theme.typography.fontWeightMedium : theme.typography.fontWeightRegular,
                                    }}
                                >
                                    {option.name}
                                </MenuItem>
                            );
                        }}
                        getOptionLabel={(option) => option.name}
                        onChange={onChange ? (e: React.ChangeEvent<{}>, newValue: any) => onChange(e, newValue) : (e: React.ChangeEvent<{}>, newValue: any) => field.onChange(newValue)}
                        value={value ? value : field.value ? field.value : multiple? [] : null}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label={label}
                                error={error}
                                variant={variant}
                                helperText={helperText}
                                disabled={disabled}
                                required={props.required}
                                size={size}
                                sx={props.sx}
                            />
                        )}
                    />
                );
            }}
        />
    );
};

export default Select;
