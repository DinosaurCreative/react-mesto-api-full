const router = require('express').Router();
const auth = require('../middlewares/auth');
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');
const {
  getCardsValidation,
  createCardValidation,
  cardIdValidation,
} = require('../middlewares/validators');

router.get('/cards', auth, getCardsValidation, getCards);
router.post('/cards', auth, createCardValidation, createCard);
router.delete('/cards/:id', auth, cardIdValidation, deleteCard);
router.put('/cards/:id/likes', auth, cardIdValidation, likeCard);
router.delete('/cards/:id/likes', auth, cardIdValidation, dislikeCard);
module.exports = router;
