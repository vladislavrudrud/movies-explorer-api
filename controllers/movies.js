const BadRequestError = require('../errors/badrequesterror');
const ForbiddenError = require('../errors/forbiddenerror');
const NotFoundError = require('../errors/notfounderror');
const Movie = require('../models/movie');
const { OK, CREATED } = require('../utils/constants');

const getMovie = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movie) => res.status(OK).send(movie))
    .catch(next);
};

const addMovie = (req, res, next) => {
  Movie.create({ ...req.body, owner: req.user._id })
    .then((movie) => {
      res.status(CREATED).send(movie);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Неверные данные!'));
      } else {
        next(err);
      }
    });
};

const deleteMovie = (req, res, next) => {
  Movie.findById({ _id: req.params.moviesId })
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Ошибка! Идентификатор недопустим!');
      } else if (movie.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Фильм удалить невозможно!');
      } else {
        return Movie.deleteOne({ _id: req.params.moviesId })
          .then((data) => {
            res.status(OK).send(data);
          });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Неверные данные!'));
      }
      return next(err);
    });
};

module.exports = {
  getMovie,
  addMovie,
  deleteMovie,
};
