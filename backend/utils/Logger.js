const logger = () => (req, res, next) => {
  const infoString = (requestId, userId) => {
    return `[ request_id=${requestId || 'unknown'} | user_id=${
      userId || 'unknown'
    } ] `;
  };

  if (req && res) {
    res.locals.logger = {
      error: (error) =>
        console.error(
          infoString(req.header('X-Request-ID'), req.payload && req.payload.id),
          error
        ),
      log: (log) =>
        console.log(
          infoString(req.header('X-Request-ID'), req.payload && req.payload.id),
          log
        ),
    };
  }

  next();
};

module.exports = logger;
