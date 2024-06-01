import {
  usernameExceptions,
  sortOptions,
  mediaReactions,
  commentReactions,
} from '#config/index.js';
import { celebrate, Segments, Joi } from 'celebrate';
import type { RequestHandler } from 'express';

export const registerValidMiddleware = (): RequestHandler => {
  return celebrate({
    [Segments.BODY]: Joi.object().keys({
      username: Joi.string()
        .required()
        .min(3)
        .max(15)
        .regex(/^[\w\-А-яЁё]+$/)
        .not(...usernameExceptions),
      email: Joi.string().email().required(),
      password: Joi.string()
        .required()
        .min(8)
        .max(32)
        .regex(/^[a-zA-Z0-9]+$/),
      passwordConfirmation: Joi.ref('password'),
    }),
  });
};

export const loginValidMiddleware = (): RequestHandler => {
  return celebrate({
    [Segments.BODY]: Joi.object().keys({
      login: Joi.string().required().min(3).max(15),
      password: Joi.string().required().min(8).max(32),
    }),
  });
};

export const tokenValidMiddleware = (): RequestHandler => {
  return celebrate({
    [Segments.COOKIES]: Joi.object().keys({
      refreshToken: Joi.string().required(),
    }),
  });
};

export const exploreValidMiddleware = (): RequestHandler => {
  return celebrate({
    [Segments.QUERY]: Joi.object().keys({
      sort_by: Joi.string()
        .valid(...sortOptions)
        .default(sortOptions[0]),
      genre: Joi.string().allow(''),
      country: Joi.string().allow(''),
      start_year: Joi.number(),
      end_year: Joi.number(),
      page: Joi.number().min(1).default(1),
      limit: Joi.number().min(10).max(50).default(10),
      title: Joi.string().default(''),
      watched: Joi.boolean().default(false),
      tvplatform: Joi.string().allow(''),
    }),
  });
};

export const updateValidMiddleware = (): RequestHandler => {
  return celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.number().min(1).required(),
    }),
    [Segments.BODY]: Joi.object().keys({
      title: Joi.string(),
      title_original: Joi.string(),
      images: Joi.object().keys({
        poster_url: Joi.string(),
        logo_url: Joi.string(),
        backdrop_url: Joi.string(),
      }),
      release_date: Joi.date(),
      genres: Joi.array().items(Joi.number()),
      countries: Joi.array().items(Joi.number()),
      tags: Joi.array().items(Joi.number()),
      description: Joi.string().allow(''),
      description_original: Joi.string().allow(''),
      duration: Joi.number().min(0),
      production_companies: Joi.array().items(Joi.number()),
      external_ids: Joi.object().keys({
        tmdb: Joi.number().allow(''),
        imdb: Joi.string().allow(''),
        kinopoisk: Joi.number().allow(''),
      }),
      poster_url: Joi.string().allow(''),
      episode_type: Joi.string(),
      type: Joi.string().valid('movie', 'show', 'game'),
      platforms: Joi.array().items(Joi.number()),
    }),
  });
};

export const ratingValidMiddleware = (): RequestHandler => {
  return celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.number().min(1).required(),
    }),
    [Segments.BODY]: Joi.object().keys({
      rating: Joi.number().min(1).max(5).required(),
    }),
  });
};

export const favValidMiddleware = (): RequestHandler => {
  return celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.number().min(1).required(),
    }),
  });
};

export const reactionsValidMiddleware = (): RequestHandler => {
  return celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.number().min(1).required(),
    }),
    [Segments.BODY]: Joi.object().keys({
      reactions: Joi.array()
        .items(...Object.keys(mediaReactions))
        .unique()
        .required(),
    }),
  });
};

export const wastedValidMiddleware = (): RequestHandler => {
  return celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.number().min(1).required(),
    }),
    [Segments.BODY]: Joi.object().keys({
      mediaType: Joi.string().valid('show', 'movie'),
      status: Joi.string().valid(
        'watched',
        'willWatch',
        'dropped',
        'notWatched',
        'watching',
      ),
    }),
  });
};

export const allCommentsValidMiddleware = (): RequestHandler => {
  return celebrate({
    [Segments.QUERY]: Joi.object().keys({
      media_id: Joi.number().min(1).required(),
      type: Joi.string()
        .valid('movie', 'tvshow', 'season', 'episode')
        .required(),
    }),
  });
};

export const commentsValidMiddleware = (): RequestHandler => {
  return celebrate({
    [Segments.BODY]: Joi.object().keys({
      comment_id: Joi.number().min(1),
      comment_body: Joi.string(),
      images_url: Joi.array().items(Joi.string()),
      type: Joi.string()
        .valid('movie', 'tvshow', 'season', 'episode')
        .required(),
      media_id: Joi.number().min(1).required(),
      parent_comments_id: Joi.number().min(1),
    }),
  });
};

export const editCommentValidMiddleware = (): RequestHandler => {
  return celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.number().min(1).required(),
    }),
    [Segments.BODY]: Joi.object().keys({
      comment_body: Joi.string().required(),
      images_url: Joi.array().items(Joi.string()),
    }),
  });
};

export const delResCommentValidMiddleware = (): RequestHandler => {
  return celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.number().min(1).required(),
    }),
  });
};

export const commentReactionsValidMiddleware = (): RequestHandler => {
  return celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.number().min(1).required(),
    }),
    [Segments.BODY]: Joi.object().keys({
      reactions: Joi.array()
        .items(...commentReactions)
        .unique()
        .required(),
    }),
  });
};
