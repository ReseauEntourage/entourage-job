import React from 'react';

export function formatParagraph(text) {
  return text.split('\n').reduce((acc, item, key, arr) => {
    if (key < arr.length && key > 0) {
      return [...acc, <br />, item];
    }
    return [...acc, item];
  }, [])
}
