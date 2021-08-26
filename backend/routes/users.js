const router = require('express').Router();
const auth = require('../middlewares/auth');
const {
  updateProfileValidation,
  updateAvatarValidation,
  getUserValidation,
} = require('../middlewares/validators');

const {
  getUsers,
  getUser,
  updateAvatar,
  updateProfile,
  getCurrentUser,
} = require('../controllers/users');

router.get('/users/', auth, getUsers);
router.get('/users/me', auth, getCurrentUser);
router.get('/users/:id', auth, getUserValidation, getUser);
router.patch('/users/me', auth, updateProfileValidation, updateProfile);
router.patch('/users/me/avatar', auth, updateAvatarValidation, updateAvatar);

module.exports = router;
