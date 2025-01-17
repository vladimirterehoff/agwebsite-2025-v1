// Libs
import React from 'react';
// MUI Components
import SemanticButton, { ButtonProps } from "@mui/material/Button";

interface Props extends ButtonProps{}

/**
 * Button Component
 * @param props
 * @constructor
 */
const Button = (props: Props) => {
  const buttonProps: ButtonProps = {
    disabled : false,
    type : 'button',
    variant : 'contained',
    ...props
  };

  return (
      <SemanticButton
          {...buttonProps}
      >
        {props.children}
      </SemanticButton>
  );
};

export default Button;
