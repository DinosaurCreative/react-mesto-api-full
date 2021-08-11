const jwt = require('jsonwebtoken');
const { unauthorized, forbidden } = require('../utils/constants');

function handleAuthError(res) {
  return res.status(forbidden).send({ message: 'Авторизуйтесь' });
}

function extractBearerToken(header) {
  return header.replace('_id=', '');
}

module.exports = (req, res, next) => {
  const authorization = req.headers.cookie;
  if (!authorization || !authorization.startsWith('_id=')) {
    handleAuthError(res);
    return;
  }
  const token = extractBearerToken(authorization);
  let payload;
  try {
    payload = jwt.verify(token, 'не-понял-концепции-key');
  } catch (err) {
    res.status(unauthorized).send({ message: 'Ошибка авторизации' });
  }
  req.user = payload;
  next();
};
