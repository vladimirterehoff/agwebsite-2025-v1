// Libs
import React from 'react';
// Components
import { Box } from '@mui/material';
import Editor from "@/components/Common/FormComponents/Editor";
// Constants
import { LOCALES } from "@/utils/i18n";

type Props = {
  errors: any;
  name: string;
  data?: boolean;
  options?: any;
  disabled?: boolean;
};

/**
 * Lang Editor Component - editor component for each lang
 * @param props
 * @constructor
 */
const LangEditor = (props : Props) => {
  const errors = props.errors || {};

  return (
  <>
    {LOCALES.map((lang, index) => (
      <Box key={props.name + lang.code} mb={2}>
        <div style={{ textTransform: 'capitalize', paddingBottom: 8, }}>{`${props.name} (${lang.name})`}</div>
        <Editor name={`${props.name}.${lang.code}`}
                error={Boolean(errors[`${lang.code}`]?.message)}
                helperText={errors[`${lang.code}`]?.message}
                disabled={props.disabled}/>
      </Box>
    ))}
  </>
  )
};

export default LangEditor;
