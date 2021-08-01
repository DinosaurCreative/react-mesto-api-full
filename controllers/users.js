const User = require('../models/user');

module.exports.getUsers = ( req, res ) => {
  User.find({})
  .orFail( new Error(''))
  .then(users => res.send({ data: users }))
  .catch(err => {
    err.message === 'Not Vailid Request'
    ? res.status(404).send({ message: 'Ошибка в запрашиваемых данных' })
    : res.status(500).send({ message: 'Произошла ошибка на сервере' })
  });
}

module.exports.getUser = ( req, res ) => {
  User.findById(req.params.id)
  .orFail( new Error('Not Vailid Id'))
  .then(user => res.send({ data: user }))
  .catch(err => {
    err.message === 'Not Vailid Id'
    ? res.status(404).send({ message: 'Ошибка в запрашиваемых данных' })
    : res.status(500).send({ message: 'Произошла ошибка на сервере' })
  });
}

module.exports.createUser = ( req, res ) => {
  const { name , about, avatar } = req.body;

  User.create({ name , about, avatar })
  .orFail( new Error(''))
  .then(user => res.send( { data: user } ))
  .catch(err => {
    err.message === 'Not Vailid Request'
    ? res.status(404).send({ message: 'Ошибка в запрашиваемых данных' })
    : res.status(500).send({ message: 'Произошла ошибка на сервере' })
  });
}



module.exports.updateAvatar = ( req, res ) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar })
  .orFail( new Error(''))
  .then(user => res.send({ data: user }))
  .catch(err => {
    err.message === 'Not Vailid Request'
    ? res.status(404).send({ message: 'Ошибка в запрашиваемых данных' })
    : res.status(500).send({ message: 'Произошла ошибка на сервере' })
  });
}

module.exports.updateProfile = ( req, res ) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about })
  .orFail( new Error(''))
  .then(user => res.send({ data: user }))
  .catch(err => {
    err.message === 'Not Vailid Request'
    ? res.status(404).send({ message: 'Ошибка в запрашиваемых данных' })
    : res.status(500).send({ message: 'Произошла ошибка на сервере' })
  });
}