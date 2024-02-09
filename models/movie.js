const mongoose = require('mongoose');
const validator = require('validator');

const movieShema = new mongoose.Schema(
  {
    country: {
      type: Number,
      required: [true, 'Поле должно быть заполнено'],
    },
    director: {
      type: Number,
      required: [true, 'Поле должно быть заполнено'],
    },
    duration: {
      type: Number,
      required: [true, 'Поле должно быть заполнено'],
    },
    year: {
      type: Number,
      required: [true, 'Поле должно быть заполнено'],
    },
    description: {
      type: Number,
      required: [true, 'Поле должно быть заполнено'],
    },
    image: {
      type: String,
      required: [true, 'Поле должно быть заполнено'],
      validate: [validator.isURL, 'Некорректный URL'],
    },
    trailerLink: {
      type: String,
      required: [true, 'Поле должно быть заполнено'],
      validate: [validator.isURL, 'Некорректный URL'],
    },
    thumbnail: {
      type: String,
      required: [true, 'Поле должно быть заполнено'],
      validate: [validator.isURL, 'Некорректный URL'],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: [true, 'Поле должно быть заполнено'],
    },
    movieId: {
      type: Number,
      required: [true, 'Поле должно быть заполнено'],
    },
    nameRU: {
      type: String,
      required: [true, 'Поле должно быть заполнено'],
    },
    nameEN: {
      type: String,
      required: [true, 'Поле должно быть заполнено'],
    },
    // createdAt: {
    //   type: Date,
    //   default: Date.now,
    // },
  },
  { versionKey: false }
);

module.exports = mongoose.model('movie', movieShema);
