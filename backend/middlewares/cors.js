const allowedMethods = 'GET,HEAD,PUT,PATCH,POST,DELETE';
const allowedUrl = [
  'https://look-around-two.vercel.app',
  'http://look-around-two.vercel.app',
  'https://localhost:3000',
  'http://localhost:3000',
];

module.exports = (req, res, next) => {
  const { method } = req;
  const requestHeaders = req.headers['access-control-request-headers'];
  const { origin } = req.headers;

  if (allowedUrl.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
  }

  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', allowedMethods);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    return res.end();
  }

  return next();
};
