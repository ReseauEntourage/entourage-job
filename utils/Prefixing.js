const addPrefix = (path) => {
  if (
    path &&
    !path.includes('http://') &&
    !path.includes('https://') &&
    path.includes('/static')
  ) {
    // TODO remove ../../
    const index = path.indexOf('/static');
    return `${process.env.CDN_URL || ''}${path.substring(index)}`;
  }
  return path;
};

module.exports = {
  addPrefix,
};
