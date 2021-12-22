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

  const modalContextValue = useMemo((key) => {
    return {
      onClose: () => {
        return setModals((prevModals) => {
          return {
            ...prevModals,
            [key]: null,
          };
        });
      },
    };
  }, []);

  return (
    <>
      {Object.entries(modals)
        .filter(([, value]) => {
          return value;
        })
        .map(([key, modal]) => {
          return (
            <ModalContext.Provider key={key} value={modalContextValue(key)}>
              {modal}
            </ModalContext.Provider>
          );
        })}
    </>
  );
}
