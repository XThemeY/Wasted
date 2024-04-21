import cors from 'cors';

export const corsOptions: cors.CorsOptions = {
  origin: (origin, cb) => {
    process.env.WHITELIST_URL?.split(',').indexOf(origin) !== -1 || !origin
      ? cb(null, true)
      : cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
  optionsSuccessStatus: 200,
};
