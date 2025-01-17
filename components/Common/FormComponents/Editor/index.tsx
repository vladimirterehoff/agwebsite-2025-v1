// Libs
import React from 'react'
import dynamic from "next/dynamic";
import {Controller, useFormContext} from "react-hook-form";
const importJodit = () => import('jodit-react');
// MUI Components
import FormHelperText from "@mui/material/FormHelperText";
import FormLabel from "@mui/material/FormLabel";
// Styles
import styles from './style.module.scss' 

const JoditEditor = dynamic(importJodit, {
  ssr: false,
});

interface EditorProps {
  defaultValue?: string
  name: string
  config?: any
  label?: string
  error?: boolean
  helperText?: any
  limitChars?: number;
  disabled?: boolean
}

/**
 * Editor Component
 * @param props
 * @constructor
 */
const Editor = (props: EditorProps) => {
  const {
    defaultValue,
    name,
    config,
    label,
    error,
    helperText,
    limitChars, 
    disabled
  } = props;

  const configState = {
    ...config,
    allowResizeY: false,
    height: 450,
    // uploader: {
    //   insertImageAsBase64URI: true
    // }
    timeout: 0,
    limitChars: limitChars,
    // statusbar: false,
    // disablePlugins: "media,mobile,paste",
    buttons: 'bold,italic,underline,strikethrough,eraser,ul,ol,fontsize,paragraph,link',
    disablePlugins: 'media,mobile,fullsize,video,print,file',
    readonly: disabled,
    // disablePlugins: 'media,mobile,fullsize,video,print,file,backspace,clipboard,dtd,enter,focus,hotkeys,indent,inline-popup,key-arrow-outside,placeholder,powered-by-jodit,source,speech-recognize,sticky,table-keyboard-navigation,wrap-nodes,tooltip',

  }

  const { control } = useFormContext()

  return (
      <div className="jodit-editor-wrap">
        <FormLabel>{label}</FormLabel>
        <Controller
            defaultValue={defaultValue}
            name={name}
            render={({field}) => {
              return (
                  <JoditEditor
                      value={field.value}
                      config={configState}
                      onChange={field.onChange}
                  />
              )
            }}
            control={control}
        />
        <FormHelperText error={error}>
          {helperText}
        </FormHelperText>
      </div>
  )
}

export default Editor