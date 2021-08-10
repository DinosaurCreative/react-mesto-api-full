const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const {
  badRequest, unauthorized, notFound, defaultErr,
} = require('../utils/constants');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => res.status(defaultErr).send({ message: err.message }));
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.id)
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
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => {
      // if (!password) {
      //   throw new Error('passwordMissing');
      // } else if (password.length < 8) {
      //   throw new Error('shortPassword');
      // }
      User.create({
        name, about, avatar, email, password: hash,
      })
        .then((user) => res.send(user))
        .catch((err) => {
          if (err.message.includes('emailError')) {
            res.status(badRequest).send({ message: 'Введен некорректный имейл' });
          } else if (err.name === 'ValidationError') {
            res.status(badRequest).send({ message: 'Переданы некорректные данные при создании пользователя.' });
          } else if (err.message.includes('E11000')) {
            res.status(badRequest).send({ message: 'Пользователь с таким имейлом уже существует' });
          } else {
            res.status(defaultErr).send({ message: err });
          }
        });
    }).catch((err) => {
      // if (err.message === 'passwordMissing') {
      //   res.status(badRequest).send({ message: 'Пароль отсутствует' });
      // } else if (err.message === 'shortPassword') {
      //   res.status(badRequest).send({ message: 'Пароль должен содержать не менее 8 символов.' });
      // }
      res.status(defaultErr).send({ reason: err.message });
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { runValidators: true, new: true })
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

  User.findByIdAndUpdate(req.user._id, { name, about }, { runValidators: true, new: true })
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

module.exports.login = (req, res) => {
  const { password, email } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'не-понял-зачем-нужен-key', { expiresIn: '7d' });
      res.cookie('_id', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      }).send({ message: token });
    })
    .catch((err) => {
      res.status(unauthorized).send({ message: err.message });
    });
};
