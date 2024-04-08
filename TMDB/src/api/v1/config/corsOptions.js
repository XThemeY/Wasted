export const corsOptions = {
  origin: (origin, cb) => {
    process.env.WHITELIST_URL.indexOf(origin) !== -1 || !origin
      ? cb(null, true)
      : cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
  optionSuccessStatus: 200,
};
