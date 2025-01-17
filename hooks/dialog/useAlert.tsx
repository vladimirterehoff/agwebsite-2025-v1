// Libs
import { useState, useCallback, ReactNode } from 'react';
// Components
import Dialog from '@/components/Common/Dialog';

type DialogHook = (
  title?: ReactNode | ((action: () => void) => ReactNode),
  content?: ReactNode,
) => [ReactNode, () => void, () => void];

/**
 * Alert modal
 * @param title
 * @param content
 */
export const useAlert: DialogHook = (title, content) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = useCallback(() => {
    setIsOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const slot = (
    <Dialog
      content={content}
      handleClose={handleClose}
      maxWidth={'sm'}
      open={isOpen}
      title={title}
    />
  );

  return [slot, handleOpen, handleClose];
};
