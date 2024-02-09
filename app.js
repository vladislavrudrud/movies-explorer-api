require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const { errors } = require('celebrate');
const router = require('./routes');
const defaultError = require('./errors/defaulterror');
const NotFoundError = require('./errors/notfounderror');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/newdb' } = process.env;

const app = express();

app.use(cors());

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(DB_URL);

app.use(requestLogger);

app.use(router);

app.use(errors());

app.use((req, res, next) => {
  next(new NotFoundError('Такого адреса не существует.'));
});

app.use(errorLogger);
app.use(defaultError);

app.listen(PORT, () => {
  console.log('Сервер запущен');
});

// проверка
