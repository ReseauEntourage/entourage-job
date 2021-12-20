import { useCallback, useEffect, useState } from 'react';

export function useCopyToClipboard() {
  const [hasBeenCopied, setHasBeenCopied] = useState(false);
  const [fade, setFade] = useState(false);

  const copyToClipboard = useCallback(
    (value) => {
      const tempInput = document.createElement('input');
      document.body.appendChild(tempInput);
      tempInput.value = value;
      tempInput.select();
      document.execCommand('copy');
      document.body.removeChild(tempInput);
      if (!hasBeenCopied) {
        setHasBeenCopied(true);
        setTimeout(() => {
          setFade(true);
        }, 2000);
      }
    },
    [hasBeenCopied]
  );

  useEffect(() => {
    if (fade) {
      setTimeout(() => {
        setHasBeenCopied(false);
        setFade(false);
      }, 2000);
    }
  }, [fade]);

  return {
    fade,
    hasBeenCopied,
    setHasBeenCopied,
    copyToClipboard,
  };
}
