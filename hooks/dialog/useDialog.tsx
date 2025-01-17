import { useState, useCallback, ReactNode } from 'react';
import Dialog from '@/components/Common/Dialog';

type DialogHook = (params: {
    title?: ReactNode | ((action: () => void) => ReactNode),
    content?: ReactNode,
    actions?: ReactNode,
    maxWidth?: 'lg' | 'md' | 'sm' | 'xl' | 'xs' | false,
    className?: string,
    fullScreen?: boolean,
    onCloseCallback?:()=>void
}) => [ReactNode, () => void, () => void];

export const useDialog: DialogHook = (params) => {
    const { title, content, actions, maxWidth = 'lg', className = '', fullScreen = false, onCloseCallback } = params;
    const [isOpen, setIsOpen] = useState(false);

    const handleOpen = useCallback(() => {
        setIsOpen(true);
    }, []);

    const handleClose = useCallback(() => {
        setIsOpen(false);
        if(onCloseCallback) onCloseCallback();
    }, []);

    const slot = (
        <Dialog
            actions={actions}
            content={content}
            handleClose={handleClose}
            maxWidth={maxWidth}
            open={isOpen}
            title={title}
            className={className}
            fullScreen={fullScreen}
        />
    );

    return [slot, handleOpen, handleClose];
};
