import React from 'react';

export const formatParagraph = (text) => {
  if(text) {
    return text.split('\n').reduce((acc, item, key, arr) => {
      if (key < arr.length && key > 0) {
        return [...acc, <br />, item];
      }
      return [...acc, item];
    }, [])
  }
  return text;
};
