const forceGC = () => {
  if (global.gc) {
    global.gc();
  } else {
    console.warn(
      'No GC hook! Start your program as `node --expose-gc file.js`.'
    );
  }
};

export { forceGC };
