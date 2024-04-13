import { rateLimit } from 'express-rate-limit';
export const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  limit: 900, // Limit each IP to 900 requests per `window`
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  // store: ... , // Redis, Memcached, etc. See below.
});
