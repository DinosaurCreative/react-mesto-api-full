const Card = require('../models/card');

module.exports.getCards = ( req, res ) => {
  Card.find({})
    .then(cards => res.send({ data: cards }))
    .catch(err => {
      res.status(500).send(`Ошибка при загрузке ${err.message}`)
    });
}

module.exports.createCard = ( req, res ) => {
  const { name , link } = req.body;

  Card.create({ name , link, owner: req.user._id} )
  .then(card => res.send({ data: card }))
  .catch(err => {});
}

module.exports.deleteCard = ( req, res ) => {
  Card.findByIdAndRemove(req.params.id)
  .then(card => res.send(`Фотография "${card.name}" удалена!`))
  .catch(err => {
    res.status(500).send({ message: err.message })
  });
}

module.exports.likeCard = ( req, res ) => {
  Card.findByIdAndUpdate(req.params.id,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
  .populate('likes', 'name _id')
  .then(card => res.send( card ))
  .catch(err => {

    res.status(500).send({ message: err.message })
  });
}

module.exports.dislikeCard = ( req, res ) => {
  Card.findByIdAndUpdate(req.params.id,
    { $pull: { likes: req.user._id } },
    { new: true }
    )
  .populate('likes', 'name _id')
  .then(card => res.send({ data: card }))
  .catch(err => {
    console.log(res);
    res.status(500).send({ message: err.message })
  });
}