const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestError = require('../errors/BadRequestError');
const DefaultError = require('../errors/DefaultError');
const NotFoundError = require('../errors/NotFoundError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const ConflictError = require('../errors/ConflictError');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => next(new DefaultError(err.message)));
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.id)
    .orFail(new Error('UnknownId'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.message === 'UnknownId') {
        next(new NotFoundError('Пользователь по указанному _id не найден.'));
      } else if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные при запросе пользователя.'));
      } else {
        next(new DefaultError(err.message));
      }
    });
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user)
    .orFail(new Error('UnknownId'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.message === 'UnknownId') {
        next(new NotFoundError('Пользователь по указанному _id не найден.'));
      } else if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные при запросе пользователя.'));
      } else {
        next(new DefaultError(err.message));
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => {
      // if (!password) {  //проверка длинны пароля
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
            next(new BadRequestError('Введен некорректный имейл'));
          } else if (err.name === 'ValidationError') {
            next(new BadRequestError('Переданы некорректные данные при создании пользователя.'));
          } else if (err.code === 11000 && err.name === 'MongoError') {
            next(new ConflictError('Пользователь с таким имейлом уже существует'));
          } else {
            next(new DefaultError(err.message));
          }
        });
    }).catch((err) => {
      // if (err.message === 'passwordMissing') {
      //   res.status(badRequest).send({ message: 'Пароль отсутствует' });
      // } else if (err.message === 'shortPassword') {
      //   res.status(badRequest).send({ message: 'Пароль должен содержать не менее 8 символов.' });
      // }
      next(new DefaultError(err.message));
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { runValidators: true, new: true })
    .orFail(new Error('UnknownId'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.message === 'UnknownId') {
        next(new NotFoundError('Пользователь по указанному _id не найден.'));
      } else if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные при создании пользователя.'));
      } else {
        next(new DefaultError(err.message));
      }
    });
};

module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { runValidators: true, new: true })
    .orFail(new Error('UnknownId'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.message === 'UnknownId') {
        next(new NotFoundError('Пользователь по указанному _id не найден.'));
      } else if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные при создании пользователя.'));
      } else {
        next(new DefaultError(err.message));
      }
    });
};

module.exports.login = (req, res, next) => {
  const { password, email } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'не-понял-концепции-key', { expiresIn: '7d' });
      res.cookie('_id', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      }).send({ token });
    })
    .catch((err) => {
      if (err.message === 'invailidEmailOrPassword') {
        next(new UnauthorizedError('Неправильные почта или пароль'));
      } else {
        next(new DefaultError(err.message));
      }
    });
};
