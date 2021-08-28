function cors(req, res, next) {
  const allowedCors = [
    'http://api.lookaround.nomoredomains.club/',
    'http://lookaround.students.nomoredomains.club/',
    'localhost:3000',
    'https://api.lookaround.nomoredomains.club/',
    'https://lookaround.students.nomoredomains.club/',
  ];
  const allowedMethods = 'GET,PUT,PATCH,DELETE,POST,HEAD';
  const { method } = req;
  const requestHeaders = req.headers['access-control-request-headers'];
  const { origin } = req.headers;
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
  }

  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', allowedMethods);
    res.header('Access-Control-Allow-', requestHeaders);
    res.end();
  }

  next();
}

module.exports = cors;
