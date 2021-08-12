const Card = require('../models/card');
const BadRequestError = require('../errors/BadRequestError');
const DefaultError = require('../errors/DefaultError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => {
      next(new DefaultError(err.message));
    });
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании карточки.'));
      } else {
        next(new DefaultError(err.message));
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.id)
    .then((pic) => {
      if (String(pic.owner) !== req.user._id) {
        next(new ForbiddenError('Недостаточно прав для удаления карточки.'));
        return;
      }
      Card.findByIdAndRemove(req.params.id)
        .orFail(new Error('UnknownId'))
        .then((card) => {
          res.send({ message: `Фотография "${card.name}" удалена!` });
        })
        .catch((err) => {
          if (err.message === 'UnknownId') {
            next(new NotFoundError('Карточка с указанным _id не найдена.'));
          } else if (err.name === 'CastError') {
            next(new BadRequestError('Переданы некорректные данные для удаления фото'));
          } else {
            next(new DefaultError(err.message));
          }
        });
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.id,
    { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail(new Error('UnknownId'))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные для постановки лайка'));
      } else if (err.message === 'UnknownId') {
        next(new NotFoundError('Карточка с указанным _id не найдена.'));
      } else {
        next(new DefaultError(err.message));
      }
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.id,
    { $pull: { likes: req.user._id } }, { new: true })
    .orFail(new Error('UnknownId'))
    .populate('likes', 'name')
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные для снятия лайка'));
      } else if (err.message === 'UnknownId') {
        next(new NotFoundError('Карточка с указанным _id не найдена.'));
      } else {
        next(new DefaultError(err.message));
      }
    });
};
