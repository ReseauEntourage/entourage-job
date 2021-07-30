import { useEffect } from 'react';

export function useRemoveModal(id) {
  useEffect(() => {
    const modals = document.querySelectorAll(`#${id}`);
    if (modals.length > 1) {
      modals[1].remove();
    }
  }, [id]);
}
