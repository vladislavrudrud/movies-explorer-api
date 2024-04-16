const router = require('express').Router();
const usersRouter = require('./users');
const signRouter = require('./sign');
const auth = require('../middlewares/auth');
const movieRouter = require('./movie');

router.use(signRouter);
router.use(auth);
router.use('/users', auth, usersRouter);
router.use('/movies', auth, movieRouter);

module.exports = router;
