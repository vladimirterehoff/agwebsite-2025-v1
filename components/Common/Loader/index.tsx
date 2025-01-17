// Libs
import React from 'react';
// MUI Components
import CircularProgress from "@mui/material/CircularProgress";
// Styles
import styles from './style.module.scss';

interface HeaderProps {
  isLoading: boolean;
  inline?: boolean;
}

/**
 * Loader Component
 * @param props
 * @constructor
 */
const Loader = (props: HeaderProps) => {
  return (
    props.isLoading ? (
      <div className={`${styles.loader} ${props.inline? styles.inline: ''}`}>
        <CircularProgress/>
      </div>
    ) : (
      <> </>
    )
  );
};

export default Loader;
