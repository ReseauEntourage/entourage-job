import { useMount } from 'src/hooks/utils';
import { isSSR } from 'src/utils/isSSR';
import { useEffect } from 'react';

export function useModalRoot() {
  const modalRoot = !isSSR ? document.createElement('div') : null;
  if (modalRoot) modalRoot.id = 'modal-root';
  useEffect(() => {
    if (modalRoot) {
      document.body.appendChild(modalRoot);
    }
    return () => {
      if (modalRoot) {
        document.body.removeChild(modalRoot);
      }
    };
  });
}
