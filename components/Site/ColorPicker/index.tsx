// Libs
import React, {useEffect, useState} from 'react';
import {ChromePicker} from 'react-color';

// Styles
import styles from './style.module.scss';

type AddCustomHtmlProps = {
  color?: string;
  handleColorChange: any;
};

const ColorPicker = ({color, handleColorChange}: AddCustomHtmlProps) => {
  const [isOpenColorPicker, setOpenColorPicker] = useState<boolean>(false);

  return <div className={styles.colorPickerContainer}>
    {isOpenColorPicker ? <div className={styles.popover}>
        <div className={styles.cover} onClick={() => setOpenColorPicker(false)}/>
        <ChromePicker color={color}
                      disableAlpha={true}
                      onChangeComplete={(color) => handleColorChange(color.hex)}/></div>
      : null}
    <div className={styles.colorPickerResult}>
      <div className={styles.colorPickerResultHex} onClick={() => setOpenColorPicker(!isOpenColorPicker)}>{color}</div>
      <div className={styles.colorPickerResultEl} style={{backgroundColor: color}}></div>
    </div>
  </div>
};

export default ColorPicker;
