import { Subject } from 'rxjs';
import React, { useState, useEffect, useMemo } from 'react';
import { v4 as uuid } from 'uuid';
import { ModalContext } from 'src/components/modals/Modal/ModalContext';

const modalsSubject = new Subject();

export function openModal(modal) {
  modalsSubject.next(modal);
}

export function ModalsListener() {
  const [modals, setModals] = useState({});

  const subscription = useMemo(() => {
    // @ts-ignore
    return modalsSubject.subscribe((modal) => {
      const modalKey = uuid();
      setModals((prevModals) => {
        return {
          ...prevModals,
          [modalKey]: modal,
        };
      });
    });
  }, []);

  useEffect(() => {
    return () => {
      return subscription.unsubscribe();
    };
  }, [subscription]);

  return (
    <>
      {Object.entries(modals)
        .filter(([, value]) => {
          return value;
        })
        .map(([key, modal]) => {
          const modalContextValue = {
            onClose: () => {
              return setModals((prevModals) => {
                return {
                  ...prevModals,
                  [key]: null,
                };
              });
            },
          };

          return (
            <ModalContext.Provider key={key} value={modalContextValue}>
              {modal}
            </ModalContext.Provider>
          );
        })}
    </>
  );
}
