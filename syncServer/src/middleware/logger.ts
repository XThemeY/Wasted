import { pino, TransportTargetOptions, DestinationStream, Logger } from 'pino';
import __dirname from '#utils/__dirname.js';
import path from 'path';

export const logger = (logName: string): Logger => {
  const transports: DestinationStream = getTransports(logName);

  return pino(
    {
      level:
        process.env.NODE_ENV === 'production'
          ? process.env.PINO_LOG_LEVEL
          : 'trace',
      redact: {
        paths: process.env.LOGGER_REDACT_FIELDS?.split(',') || [],
        remove: true,
      },
    },
    transports,
  );
};

const getTransports = (logName: string): DestinationStream => {
  const logDirName = 'logs';
  const logDirPath = path.join(__dirname, logDirName, logName);

  const pinoPretty: TransportTargetOptions = {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:yyyy-mm-dd HH:MM:ss',
    },
  };

  const fileTransport: TransportTargetOptions = {
    target: 'pino/file',
    options: { destination: logDirPath, mkdir: true },
  };

  return pino.transport({
    targets: [pinoPretty, fileTransport],
  });
};
