import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const corsOptions = {
  origin: (origin, cb) => {
    process.env.WHITELIST_URL.indexOf(origin) !== -1 || !origin
      ? cb(null, true)
      : cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
  optionSuccessStatus: 200,
};
