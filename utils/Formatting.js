import React from 'react';

export const formatParagraph = (text, condense) => {
  if(text) {
    let formattedText = text;
    if(condense) formattedText = text.replace(/\n\n/g, '\n');
    return formattedText.split('\n').reduce((acc, item, key, arr) => {
      if (key < arr.length && key > 0) {
        return [...acc, <br />, item];
      }
      return [...acc, item];
    }, [])
  }
  return text;
};
