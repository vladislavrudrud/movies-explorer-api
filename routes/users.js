const usersRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUserById,
  editProfile,
} = require('../controllers/users');

usersRouter.get('/me', getUserById);
usersRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).required().max(30),
    email: Joi.string().required().email(),
  }),
}), editProfile);

module.exports = usersRouter;
