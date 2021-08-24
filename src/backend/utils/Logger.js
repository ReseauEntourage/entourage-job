const loggerMiddleware = () => {
  return (req, res, next) => {
    const infoString = (requestId, userId, requestOrigin) => {
      return `[ request_path=${req.originalUrl} | request_id=${
        requestId || 'unknown'
      } | user_id=${userId || 'unknown'} ${
        requestOrigin ? `| request_origin=${requestOrigin} ` : ''
      }] `;
    };

    if (req && res) {
      const infos = infoString(
        req.header('X-Request-ID'),
        req.payload && req.payload.id,
        req.header('X-Request-Origin')
      );

      console.log(infos, 'Received request');
      res.locals.logger = {
        error: (error) => {
          return console.error(infos, error);
        },
        log: (log) => {
          return console.log(infos, log);
        },
      };
    }

    next();
  };
};

const logger = (res) => {
  return res.locals.logger;
};

export { logger, loggerMiddleware };
