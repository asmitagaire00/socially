const path = require('path');
const DailyRotateFile = require('winston-daily-rotate-file');
const { format, createLogger, transports } = require('winston');

const accessEnv = require('./accessEnv');

const NODE_ENV = accessEnv('NODE_ENV');

function createDevLogger() {
  const logFormat = format.printf(({ level, message, timestamp, stack }) => {
    if (typeof message === 'object') {
      // eslint-disable-next-line no-param-reassign
      message = JSON.stringify(message, null, 4);
    }

    return `${timestamp} ${level}: ${stack || message}`;
  });

  return createLogger({
    level: 'debug',
    format: format.combine(
      format.colorize(),
      format.prettyPrint(),
      format.splat(),
      format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      format.errors({ stack: true }),
      logFormat,
    ),
    transports: [new transports.Console()],
  });
}

function createProdLogger() {
  const optsDailyError = {
    level: 'error',
    filename: path.join(
      __dirname,
      '..',
      '..',
      'logs',
      'socially-api-%DATE%.error.log',
    ),
    maxSize: '20m',
    maxFiles: '14d',
    prepend: true,
  };

  const optsDailyCombined = {
    level: 'info',
    filename: path.join(
      __dirname,
      '..',
      '..',
      'logs',
      'socially-api-%DATE%.combined.log',
    ),
    maxSize: '20m',
    maxFiles: '14d',
    prepend: true,
  };

  return createLogger({
    level: 'info',
    format: format.combine(
      format.timestamp(),
      format.errors({ stack: true }),
      format.json(),
    ),
    defaultMeta: { service: 'socially-api' },
    transports: [
      new transports.Console(),
      new DailyRotateFile(optsDailyError),
      new DailyRotateFile(optsDailyCombined),
    ],
  });
}

module.exports =
  NODE_ENV !== 'production' ? createDevLogger() : createProdLogger();
