const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestError = require('../errors/BadRequestError');
const DefaultError = require('../errors/DefaultError');
const NotFoundError = require('../errors/NotFoundError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const ConflictError = require('../errors/ConflictError');

const { JWT_SECRET = 'super-strong-secret' } = process.env;

const {
  usersIdMissing,
  badValue,
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
        return next(new NotFoundError(usersIdMissing));
      } if (err.name === 'CastError') {
        return next(new BadRequestError(badValue));
      }
      return next(new DefaultError(err.message));
    });
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user)
    .orFail(new Error('UnknownId'))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.message === 'UnknownId') {
        return next(new NotFoundError(usersIdMissing));
      } if (err.name === 'CastError') {
        return next(new BadRequestError(badValue));
      }
      return next(new DefaultError(err.message));
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name, about, avatar, email, password: hash,
      })
        .then((user) => res.send(user))
        .catch((err) => {
          if (err.message.includes('emailError')) {
            return next(new BadRequestError(wrongEmail));
          } if (err.message.includes('linkError')) {
            return next(new BadRequestError(badValue));
          } if (err.code === 11000 && err.name === 'MongoError') {
            return next(new ConflictError(emailTaken));
          } if (err.message.includes('nameError')) {
            return next(new BadRequestError(nameLengthErr));
          } if (err.message.includes('aboutError')) {
            return next(new BadRequestError(aboutLengthErr));
          }
          return next(new DefaultError(err.message));
        });
    }).catch((err) => next(new DefaultError(err.message)));
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { runValidators: true, new: true })
    .orFail(new Error('UnknownId'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.message === 'UnknownId') {
        return next(new NotFoundError(usersIdMissing));
      } if (err.message.includes('linkError')) {
        return next(new BadRequestError(badValue));
      }
      return next(new DefaultError(err.message));
    });
};

module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { runValidators: true, new: true })
    .orFail(new Error('UnknownId'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.message === 'UnknownId') {
        return next(new NotFoundError(usersIdMissing));
      } if (err.message.includes('nameError')) {
        return next(new BadRequestError(nameLengthErr));
      } if (err.message.includes('aboutError')) {
        return next(new BadRequestError(aboutLengthErr));
      }
      return next(new DefaultError(err.message));
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
        sameSite: 'None',
        secure: true,
      }).send({ message: 'Авторизация успешна' });
    })
    .catch((err) => {
      if (err.message === 'invailidEmailOrPassword') {
        return next(new UnauthorizedError(badEmailOrPass));
      } if (err.message.includes('emailError')) {
        return next(new BadRequestError(badEmailOrPass));
      }
      return next(new DefaultError(err.message));
    });
};

module.exports.signOut = (req, res, next) => {
  res.clearCookie('_id').send({ message: 'Куки удалены' });
  next();
};
