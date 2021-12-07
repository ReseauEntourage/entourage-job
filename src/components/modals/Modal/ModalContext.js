import { createContext, useContext } from 'react';

export const ModalContext = createContext({});

export function useModalContext() {
  const modalContext = useContext(ModalContext);

  if (!modalContext) {
    throw new Error("You can't use useModalContext() outside modal");
  }

  return modalContext;
}
