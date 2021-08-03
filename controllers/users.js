const User = require('../models/user');

const { badRequest, notFound, defaultErr } = require('../utils/constants');

module.exports.getUsers = (req, res) => {
  User.find({}).select('-__v')
    .then((users) => res.send(users))
    .catch((err) => res.status(defaultErr).send({ message: err.message }));
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.id).select('-__v')
    .orFail(new Error('UnknownId'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.message === 'UnknownId') {
        res.status(notFound).send({ message: 'Пользователь по указанному _id не найден.' });
      } else if (err.name === 'CastError') {
        res.status(badRequest).send({ message: 'Переданы некорректные данные при запросе пользователя.' });
      } else {
        res.status(defaultErr).send({ message: err.message });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(badRequest).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      } else {
        res.status(defaultErr).send({ message: err.message });
      }
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { runValidators: true, new: true }).select('-__v')
    .orFail(new Error('UnknownId'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.message === 'UnknownId') {
        res.status(notFound).send({ message: 'Пользователь с указанным _id не найден.' });
      } else if (err.name === 'CastError') {
        res.status(badRequest).send({ message: 'Переданы некорректные данные при обновлении аватара.' });
      } else {
        res.status(defaultErr).send({ message: 'ошибочка вышла' });
      }
    });
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { runValidators: true, new: true }).select('-__v')
    .orFail(new Error('UnknownId'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.message === 'UnknownId') {
        res.status(notFound).send({ message: 'Пользователь с указанным _id не найден.' });
      } else if (err.name === 'CastError') {
        res.status(badRequest).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      } else {
        res.status(defaultErr).send({ message: err.message });
      }
    });
};
