// Imports
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Theme, useTheme } from '@mui/material/styles';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select as MUISelect,
  SelectChangeEvent,
  OutlinedInput,
  Chip,
  Box,
  FormHelperText,
} from '@mui/material';

// SelectVariant type
export type SelectVariant = {
  id: number | string;
  name: string;
};

// Props interface
interface Props {
  name: string;
  label?: string;
  variants: SelectVariant[];
  disabled?: boolean;
  error?: boolean;
  helperText?: any;
  className?: string;
  defaultValue?: any;
  variant?: 'standard' | 'outlined' | 'filled';
  onChange?: (value: any[]) => void;
  onItemSelect?: (item: SelectVariant, isSelected: boolean) => void; // Добавляем новый пропс
}

// SelectMulti Component
const SelectMulti: React.FC<Props> = (props) => {
  const {
    name,
    label = '',
    variants,
    disabled = false,
    error = false,
    helperText = '',
    className = '',
    variant = 'outlined',
    defaultValue = [],
  } = props;

  const theme = useTheme();
  const { control } = useFormContext();

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  return (
    <FormControl variant={variant} className={className} error={error} fullWidth>
      <InputLabel id={`select-multi-label-${name}`}>{label}</InputLabel>
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        render={({ field }) => {
            return (
          <MUISelect
            labelId={`select-multi-label-${name}`}
            id={`select-multi-${name}`}
            multiple
            disabled={disabled}
            value={field.value || []}
            onChange={(event: SelectChangeEvent<any>) => {
              const newValue = event.target.value;
              field.onChange(newValue);
              
              // Находим какой элемент был добавлен или удален
              if (props.onItemSelect) {
                const prevSelected = field.value || [];
                const currentSelected = newValue;
                
                // Находим добавленный элемент
                const addedValue = currentSelected.find((value: any) => !prevSelected.includes(value));
                if (addedValue) {
                  const selectedItem = variants.find((v) => v.id === addedValue);
                  if (selectedItem) {
                    props.onItemSelect(selectedItem, true);
                  }
                }
                
                // Находим удаленный элемент
                const removedValue = prevSelected.find((value: any) => !currentSelected.includes(value));
                if (removedValue) {
                  const deselectedItem = variants.find((v) => v.id === removedValue);
                  if (deselectedItem) {
                    props.onItemSelect(deselectedItem, false);
                  }
                }
              }

              // Вызываем общий onChange если он предоставлен
              if (props.onChange) {
                props.onChange(newValue);
              }
            }}
            input={<OutlinedInput label={label} />}
            renderValue={(selected: any) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value: any) => {
                  const variantItem = variants.find((v) => v.id === value);
                  return variantItem ? <Chip key={variantItem.id} label={variantItem.name} /> : null;
                })}
              </Box>
            )}
            MenuProps={MenuProps}
          >
            {variants.map((variantItem) => (
              <MenuItem
                key={variantItem.id}
                value={variantItem.id}
                style={{
                  fontWeight:
                    field.value && field.value.indexOf(variantItem.id) > -1
                      ? theme.typography.fontWeightMedium
                      : theme.typography.fontWeightRegular,
                }}
              >
                {variantItem.name}
              </MenuItem>
            ))}
          </MUISelect>
        )}}
      />
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export default SelectMulti;
