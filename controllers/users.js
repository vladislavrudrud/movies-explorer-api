require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const UnauthorizedError = require('../errors/unauthorizederror');
const NotFoundError = require('../errors/notfounderror');
const ConflictError = require('../errors/conflicterror');
const BadRequestError = require('../errors/badrequesterror');
const { CREATED } = require('../utils/constants');

const { NODE_ENV, JWT_SECRET } = process.env;

const createUser = (req, res, next) => {
  const {
    email, password, name
  } = req.body;
  bcrypt.hash(password, 10).then((hash) => {
    User.create({
      email, name, password: hash
    })
      .then((newUser) => res.status(CREATED).send({
        name: newUser.name,
        email: newUser.email
      }))
      .catch((err) => {
        if (err.code === 11000) {
          next(
            new ConflictError('Ошибка! Данные уже используются!')
          );
        } else if (err.name === 'ValidationError') {
          next(
            new BadRequestError('Неверные данные!')
          );
        } else {
          next(err);
        }
      });
  })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Пользователь не найден!');
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return next(new UnauthorizedError('Неверные данные'));
          }

          const token = jwt.sign(
            { _id: user._id },

            NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
            { expiresIn: '7d' }
          );
          return res.send({ token });
        });
    })
    .catch(next);
};

const getUserById = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден!');
      }
      return res.send(user);
    })
    .catch(next);
};

const editProfile = (req, res, next) => {
  const { name, email } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден!');
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          new BadRequestError('Неверные данные!')
        );
      } else if (err.code === 11000) {
        next(
          new ConflictError('Данный email уже используется!')
        );
      } else {
        next(err);
      }
    });
};

module.exports = {
  getUserById,
  editProfile,
  createUser,
  login,
};
