import { pino } from 'pino';
import __dirname from '#utils/__dirname.js';
import fs from 'fs';
import fsPromises from 'fs/promises';
import path from 'path';
const logDirName = 'logs';
const logDirPath = path.join(__dirname, logDirName, 'app.log');
if (!fs.existsSync(path.join(__dirname, logDirName))) {
    await fsPromises.mkdir(path.join(__dirname, logDirName));
}
const pinoPretty = {
    target: 'pino-pretty',
    options: {
        colorize: true,
        translateTime: 'SYS:yyyy-mm-dd HH:MM:ss',
    },
};
const fileTransport = {
    target: 'pino/file',
    options: { destination: logDirPath },
};
const transports = pino.transport({
    targets: [pinoPretty, fileTransport],
});
export const logger = pino({
    level: process.env.NODE_ENV === 'production'
        ? process.env.PINO_LOG_LEVEL
        : 'trace',
    redact: {
        paths: ['user.name', 'address', 'passport'],
        remove: true,
    },
}, transports);
//# sourceMappingURL=logger.js.map