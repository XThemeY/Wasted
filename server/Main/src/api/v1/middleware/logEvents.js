import fs from 'fs';
import fsPromises from 'fs/promises';
import path from 'path';
import { nanoid } from 'nanoid';
import { format } from 'date-fns';
import __dirname from 'Main/src/utils/__dirname.js';

const logDirName = 'logs';

export const logEvents = async (msg, logName) => {
  const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`;
  const logItem = `${dateTime}\t${nanoid()}\t${msg}\n`;

  try {
    if (!fs.existsSync(path.join(__dirname, logDirName))) {
      await fsPromises.mkdir(path.join(__dirname, logDirName));
    }
    await fsPromises.appendFile(
      path.join(__dirname, logDirName, logName),
      logItem,
    );
  } catch (err) {
    console.log(err);
  }
};

export const logger = (req, res, next) => {
  logEvents(`${req.method}\t${req.clientIp}\t${req.url}`, 'reqLog.log');
  next();
};
