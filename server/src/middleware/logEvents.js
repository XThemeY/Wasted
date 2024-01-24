import fs from 'fs';
import fsPromises from 'fs/promises';
import path from 'path';
import { format } from 'date-fns';
import { nanoid } from 'nanoid';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logDirName = 'logs';

const logEvents = async (msg, logName) => {
  const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`;
  const logItem = `${dateTime}\t${nanoid()}\t${msg}\n`;

  try {
    if (!fs.existsSync(path.join(__dirname, '..', logDirName))) {
      await fsPromises.mkdir(path.join(__dirname, '..', logDirName));
    }
    await fsPromises.appendFile(
      path.join(__dirname, '..', logDirName, logName),
      logItem,
    );
  } catch (err) {
    console.log(err);
  }
};

export const logger = (req, res, next) => {
  logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, 'reqLog.log');
  next();
};

export default logEvents;
