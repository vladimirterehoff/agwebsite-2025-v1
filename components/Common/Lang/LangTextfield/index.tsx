// Libs
import React from 'react';
// Components
import TextField, { InputFieldProps } from "@/components/Common/FormComponents/TextField";
// Constants
import { LOCALES } from "@/utils/i18n";

interface LocaleFieldProps extends InputFieldProps {
  errors?:any;
  langRequired?: string | string[];
}

/**
 * Lang Textfield Component - textfield component for each lang
 * @param props
 * @constructor
 */
const LangTextfield = (props: LocaleFieldProps) => {
  const errors: any = props.errors || {};
  const { langRequired, required, ...otherProps } = props;

  return (
    <>
      {LOCALES.map((lang, index) => (
        <div key={props.name + lang.code}>
          <TextField
              {...otherProps}
            error={Boolean(errors[`${lang.code}`]?.message)}
            helperText={errors[`${lang.code}`]?.message}
            name={`${props.name}.${lang.code}`}
            label={props.label? `${props.label} (${lang.name})` : undefined}
            placeholder={props.placeholder? `${props.placeholder} (${lang.name})` : undefined}
            required={langRequired ? langRequired.includes(lang.code) : required}
          />

          {(LOCALES.length - 1) != index && (<><br/><br/></>)}
        </div>
      ))}
    </>
  )
};

export default LangTextfield;
