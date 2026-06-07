# Pino Logger Configuration
import pino from 'pino';

const logLevel = process.env.LOG_LEVEL || 'info';

const isDevelopment = process.env.NODE_ENV === 'development';

export const logger = pino(
  {
    level: logLevel,
    formatters: {
      level: (label) => {
        return { level: label.toUpperCase() };
      },
      bindings: (bindings) => {
        return {
          pid: bindings.pid,
          hostname: bindings.hostname,
        };
      },
    },
    timestamp: pino.stdTimeFunctions.isoTime,
  },
  isDevelopment ? pino.transport({
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname',
    },
  }) : undefined
);

export default logger;
