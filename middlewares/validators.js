const { celebrate, Joi } = require('celebrate');

const getCardsValidation = celebrate({
  body: Joi.object(),
});

const createCardValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required(),
    link: Joi.string().required(),
  }),
});

const cardIdValidation = celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24),
  }),
});

const getUserValidation = celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24),
  }),
});

const createUserValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string(),
    about: Joi.string(),
    avatar: Joi.string(),
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
});

const loginValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string(),
    password: Joi.string(),
  }),
});

const updateProfileValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required(),
    about: Joi.string(),
  }),
});

const updateAvatarValidation = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required(),
  }),
});

module.exports = {
  getCardsValidation,
  createCardValidation,
  createUserValidation,
  loginValidation,
  updateProfileValidation,
  updateAvatarValidation,
  getUserValidation,
  cardIdValidation,
};
