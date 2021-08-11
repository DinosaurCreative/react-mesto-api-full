// const jwt = require('jsonwebtoken');

const Card = require('../models/card');

const {
  badRequest, notFound, defaultErr, forbidden,
} = require('../utils/constants');

function checkRightsHandler(res) {
  return res.status(forbidden).send({ message: 'Недостаточно прав для удаления карточки.' });
}

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => res.status(defaultErr).send({ message: err.message }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(badRequest).send({ message: 'Переданы некорректные данные при создании карточки.' });
      } else {
        res.status(defaultErr).send({ message: err.message });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findById(req.params.id)
    .then((pic) => {
      if (String(pic.owner) !== req.user._id) {
        checkRightsHandler(res);
        return;
      }
      Card.findByIdAndRemove(req.params.id)
        .orFail(new Error('UnknownId'))
        .then((card) => {
          console.log(card);
          res.send({ message: `Фотография "${card.name}" удалена!` });
        })
        .catch((err) => {
          if (err.message === 'UnknownId') {
            res.status(notFound).send({ message: 'Карточка с указанным _id не найдена.' });
          } else if (err.name === 'CastError') {
            res.status(badRequest).send({ message: 'Переданы некорректные данные для удаления фото' });
          } else {
            res.status(defaultErr).send({ message: err.message });
          }
        });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.id,
    { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail(new Error('UnknownId'))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(badRequest).send({ message: 'Переданы некорректные данные для постановки лайка' });
      } else if (err.message === 'UnknownId') {
        res.status(notFound).send({ message: 'Карточка с указанным _id не найдена.' });
      } else {
        res.status(defaultErr).send({ message: err.message });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.id,
    { $pull: { likes: req.user._id } }, { new: true })
    .orFail(new Error('UnknownId'))
    .populate('likes', 'name')
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(badRequest).send({ message: 'Переданы некорректные данные для снятия лайка' });
      } else if (err.message === 'UnknownId') {
        res.status(notFound).send({ message: 'Карточка с указанным _id не найдена.' });
      } else {
        res.status(defaultErr).send({ message: err.message });
      }
    });
};
