const User = require('../models/user');

const serverResponse = {
  badRequest: 400,
  notFound: 404,
  defaultErr: 500,
};

module.exports.getUsers = (req, res) => {
  User.find({}).select('-__v')
    .then((users) => res.send(users))
    .catch((err) => res.status(serverResponse.defaultErr).send({ message: err.message }));
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.id).select('-__v')
    .orFail(new Error('NotValidId'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.message === 'NotValidId' || err.name === 'CastError') {
        res.status(serverResponse.notFound).send({ message: 'Пользователь по указанному _id не найден.' });
      } else {
        res.status(serverResponse.defaultErr).send({ message: err.message });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(serverResponse.badRequest).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      } else {
        res.status(serverResponse.defaultErr).send({ message: err.message });
      }
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { runValidators: true, new: true }).select('-__v')
    .orFail(new Error('NotValidId'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.message === 'NotValidId' || err.name === 'CastError') {
        res.status(serverResponse.notFound).send({ message: 'Пользователь с указанным _id не найден.' });
      } else if (err.name === 'ValidationError') {
        res.status(serverResponse.badRequest).send({ message: 'Переданы некорректные данные при обновлении аватара.' });
      } else {
        res.status(serverResponse.defaultErr).send({ message: err.message });
      }
    });
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { runValidators: true, new: true }).select('-__v')
    .orFail(new Error('NotValidId'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.message === 'NotValidId' || err.name === 'CastError') {
        res.status(serverResponse.notFound).send({ message: 'Пользователь с указанным _id не найден.' });
      } else if (err.name === 'ValidationError') {
        res.status(serverResponse.badRequest).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      } else {
        res.status(serverResponse.defaultErr).send({ message: err.message });
      }
    });
};
