import { useRef } from 'react';

export function useResetForm() {
  const form = useRef(null);

  const resetForm = () => {
    if (form.current) form.current.resetForm();
  };

  return [form, resetForm];
}
