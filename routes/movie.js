const movieRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getMovie, addMovie, deleteMovie } = require('../controllers/movies');
const { REGEX } = require('../utils/constants');

movieRouter.get('/', getMovie);
movieRouter.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(REGEX),
    trailerLink: Joi.string().required().pattern(REGEX),
    thumbnail: Joi.string().required().pattern(REGEX),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), addMovie);
movieRouter.delete('/:moviesId', celebrate({
  params: Joi.object().keys({
    moviesId: Joi.string().length(24).hex().required(),
  }),
}), deleteMovie);

module.exports = movieRouter;
