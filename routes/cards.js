const router = require('express').Router();

const auth = require('../middlewares/auth');

const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

router.get('/', auth, getCards);
router.post('/', auth, createCard);
router.delete('/:id', auth, deleteCard);
router.put('/:id/likes', auth, likeCard);
router.delete('/:id/likes', auth, dislikeCard);

module.exports = router;
