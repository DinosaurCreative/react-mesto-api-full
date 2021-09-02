const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');
const ForbiddenError = require('../errors/ForbiddenError');

const { JWT_SECRET, NODE_ENV } = process.env;

function extractBearerToken(header) {
  return header.replace('_id=', '');
}

module.exports = (req, res, next) => {
  console.log(`Вот что приходит в запросе на проверку токена: ${req}`);
  const authorization = req.headers.cookie;
  if (!authorization || !authorization.startsWith('_id=')) {
    next(new ForbiddenError('Авторизуйтесь'));
    return;
  }
  const token = extractBearerToken(authorization);
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'super-strong-secret');
  } catch (err) {
    next(new UnauthorizedError('Ошибка авторизации'));
  }
  req.user = payload;
  next();
};
