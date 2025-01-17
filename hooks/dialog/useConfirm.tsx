// Libs
import { useState, useCallback, ReactNode } from 'react';
// Components
import Dialog from '@/components/Common/Dialog';
import Button from '@/components/Common/Button';

type DialogHook = (
  title?: ReactNode | ((action: () => void) => ReactNode),
  content?: ReactNode,
  confirmAction?: ()=>void,
  confirmText?: string,
  cancelText?: string,
) => [ReactNode, () => void, () => void];

/**
 * Confirm modal
 * @param title
 * @param content
 * @param confirmAction
 * @param confirmText
 * @param cancelText
 */
export const useConfirm: DialogHook = (title, content, confirmAction, confirmText = 'OK',cancelText = 'Cancel' ) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = useCallback(() => {
    setIsOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const actions = (
    <>
      <Button variant={'text'}  color={'error'} onClick={() => handleClose()}>
        {cancelText}
      </Button>
      <Button variant={'text'}  color={'primary'} onClick={()=>{
        handleClose();
        if(confirmAction) confirmAction();
      }}>
        {confirmText}
      </Button>
    </>
  );

  const slot = (
    <Dialog
      actions={actions}
      content={content}
      handleClose={handleClose}
      maxWidth={'sm'}
      open={isOpen}
      title={title}
    />
  );

  return [slot, handleOpen, handleClose];
};
