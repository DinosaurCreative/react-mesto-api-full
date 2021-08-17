const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestError = require('../errors/BadRequestError');
const DefaultError = require('../errors/DefaultError');
const NotFoundError = require('../errors/NotFoundError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const ConflictError = require('../errors/ConflictError');

const { JWT_SECRET } = process.env;
const {
  usersIdMissing,
  badValue,
  shortPassErr,
  wrongEmail,
  emailTaken,
  nameLengthErr,
  aboutLengthErr,
  badEmailOrPass,
} = require('../utils/errorsMessages');

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
        next(new NotFoundError(usersIdMissing));
      } else if (err.name === 'CastError') {
        next(new BadRequestError(badValue));
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
        next(new NotFoundError(usersIdMissing));
      } else if (err.name === 'CastError') {
        next(new BadRequestError(badValue));
      } else {
        next(new DefaultError(err.message));
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  if (password.length < 8) {
    next(new BadRequestError(shortPassErr));
    return;
  }

  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name, about, avatar, email, password: hash,
      })
        .then((user) => res.send(user))
        .catch((err) => {
          console.log(err.message);
          if (err.message.includes('emailError')) {
            next(new BadRequestError(wrongEmail));
          } else if (err.message.includes('linkError')) {
            next(new BadRequestError(badValue));
          } else if (err.code === 11000 && err.name === 'MongoError') {
            next(new ConflictError(emailTaken));
          } else if (err.message.includes('nameError')) {
            next(new BadRequestError(nameLengthErr));
          } else if (err.message.includes('aboutError')) {
            next(new BadRequestError(aboutLengthErr));
          } else {
            next(new DefaultError(err.message));
          }
        });
    }).catch((err) => {
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
        next(new NotFoundError(usersIdMissing));
      } else if (err.message.includes('linkError')) {
        next(new BadRequestError(badValue));
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
        next(new NotFoundError(usersIdMissing));
      } else if (err.message.includes('nameError')) {
        next(new BadRequestError(nameLengthErr));
      } else if (err.message.includes('aboutError')) {
        next(new BadRequestError(aboutLengthErr));
      } else {
        next(new DefaultError(err.message));
      }
    });
};

module.exports.login = (req, res, next) => {
  const { password, email } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      res.cookie('_id', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      }).send({ message: 'Авторизация успешна' });
    })
    .catch((err) => {
      if (err.message === 'invailidEmailOrPassword') {
        next(new UnauthorizedError(badEmailOrPass));
      } else if (err.message.includes('emailError')) {
        next(new BadRequestError(badEmailOrPass));
      } else {
        next(new DefaultError(err.message));
      }
    });
};
