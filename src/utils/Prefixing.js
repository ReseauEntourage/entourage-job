const dev = process.env.NODE_ENV !== 'production';

const addPrefix = (path) => {
  if (
    !dev &&
    path &&
    !path.includes('http://') &&
    !path.includes('https://') &&
    path.includes('/static')
  ) {
    const index = path.indexOf('/static');
    return `${process.env.CDN_URL || ''}${path.substring(index)}`;
  }
  return path;
};

export { addPrefix };
