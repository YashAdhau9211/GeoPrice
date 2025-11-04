type LogLevel = 'INFO' | 'ERROR' | 'WARN' | 'DEBUG';

interface LogMeta {
  [key: string]: any;
}

const formatLog = (level: LogLevel, message: string, meta?: LogMeta): string => {
  const timestamp = new Date().toISOString();
  const logObject = {
    timestamp,
    level,
    message,
    ...(meta && { meta }),
  };
  return JSON.stringify(logObject);
};

export const logger = {
  info: (message: string, meta?: LogMeta): void => {
    console.log(formatLog('INFO', message, meta));
  },

  error: (message: string, error?: Error, meta?: LogMeta): void => {
    const errorMeta = {
      ...meta,
      ...(error && {
        error: {
          message: error.message,
          stack: error.stack,
          name: error.name,
        },
      }),
    };
    console.error(formatLog('ERROR', message, errorMeta));
  },

  warn: (message: string, meta?: LogMeta): void => {
    console.warn(formatLog('WARN', message, meta));
  },

  debug: (message: string, meta?: LogMeta): void => {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(formatLog('DEBUG', message, meta));
    }
  },
};
