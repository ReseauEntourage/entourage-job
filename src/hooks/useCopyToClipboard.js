import { useCallback, useState } from 'react';

export function useCopyToClipboard() {
  const [hasBeenCopied, setHasBeenCopied] = useState(false);
  const copyToClipboard = useCallback((value) => {
    const tempInput = document.createElement('input');
    document.body.appendChild(tempInput);
    tempInput.value = value;
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    setHasBeenCopied(true);
  }, []);

  return {
    hasBeenCopied,
    setHasBeenCopied,
    copyToClipboard,
  };
}
