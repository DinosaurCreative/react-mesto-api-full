const Card = require('../models/card');
const BadRequestError = require('../errors/BadRequestError');
const DefaultError = require('../errors/DefaultError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const {
  nameLengthErr,
  badUrlErr,
  ownerRigthsErr,
  cardsIdMissing,
  badValue,
} = require('../utils/errorsMessages');

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
      if (err.message.includes('nameError')) {
        next(new BadRequestError(nameLengthErr));
      } else if (err.message.includes('linkError')) {
        next(new UnauthorizedError(badUrlErr));
      } else {
        next(new DefaultError(err.message));
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.id)
    .orFail(new Error('UnknownId'))
    // .then((pic) => {
    //   if (String(pic.owner) !== req.user._id) {
    .then(() => {
      if (false) {
        next(new ForbiddenError(ownerRigthsErr));
        return;
      }
      Card.findByIdAndRemove(req.params.id)
        .orFail(new Error('UnknownId'))
        .then((card) => {
          res.send({ message: `Фотография "${card.name}" удалена!` });
        })
        .catch((err) => {
          if (err.message === 'UnknownId') {
            next(new NotFoundError(cardsIdMissing));
          } else if (err.name === 'CastError') {
            next(new BadRequestError(badValue));
          } else {
            next(new DefaultError(err.message));
          }
        });
    })
    .catch((err) => {
      if (err.message === 'UnknownId') {
        next(new NotFoundError(cardsIdMissing));
      } else {
        next(new DefaultError(err.message));
      }
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.id,
    { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail(new Error('UnknownId'))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(badValue));
      } else if (err.message === 'UnknownId') {
        next(new NotFoundError(cardsIdMissing));
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
        next(new BadRequestError(badValue));
      } else if (err.message === 'UnknownId') {
        next(new NotFoundError(cardsIdMissing));
      } else {
        next(new DefaultError(err.message));
      }
    });
};
