// Libs
import React, { ReactNode } from 'react';
// MUI Components
import DialogTitle from "@mui/material/DialogTitle";
import MaterialDialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
// Styles
import styles from './style.module.scss';

interface Props {
    actions?: ReactNode;
    content?: ReactNode;
    handleClose: () => void;
    open: boolean;
    fullScreen?: boolean;
    className?: string;
    title?: ReactNode | ((action: () => void) => ReactNode);
    maxWidth?: 'lg' | 'md' | 'sm' | 'xl' | 'xs' | false;
}

/**
 * Modal Component
 * @param props
 * @constructor
 */
const Dialog = (props: Props) => {
    const { actions, content, title, maxWidth, className = '', fullScreen = false } = props;

    return (
        <MaterialDialog open={props.open}
                        keepMounted
                        onClose={props.handleClose}
                        maxWidth={maxWidth}
                        fullScreen={fullScreen}
                        className={className} >
            {title && (
                <DialogTitle display={'flex'} justifyContent={'space-between'}>
                    {typeof title === 'function' ? title(props.handleClose) : title}
                    <IconButton onClick={props.handleClose}>
                        <CloseIcon />   
                    </IconButton>
                </DialogTitle>
            )}

            {content && <DialogContent className={styles.dialog_content}>{content}</DialogContent>}

            {actions && <DialogActions>{actions}</DialogActions>}
        </MaterialDialog>
    );
};

export default Dialog;
