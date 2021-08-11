const router = require('express').Router();

const auth = require('../middlewares/auth');

const {
  getUsers,
  getUser,
  createUser,
  updateAvatar,
  updateProfile,
  login,
  getCurrentUser,
} = require('../controllers/users');

router.get('/', auth, getUsers);
router.get('/me', auth, getCurrentUser);
router.get('/:id', auth, getUser);
router.post('/signup', createUser);
router.post('/signin', login);
router.patch('/me', auth, updateProfile);
router.patch('/me/avatar', auth, updateAvatar);

module.exports = router;
