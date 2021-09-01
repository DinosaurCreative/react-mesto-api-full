const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const { errors } = require('celebrate');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const corsHandler = require('./middlewares/cors');

const { PORT = 3000 } = process.env;
const app = express();
const errorHandler = require('./middlewares/errorHandler');
const { createUserValidation, loginValidation } = require('./middlewares/validators');
const cardRoutes = require('./routes/cards');
const userRoutes = require('./routes/users');
const { createUser, login, signOut } = require('./controllers/users');
const { requestLogger, errorLogger } = require('./middlewares/logger');

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(corsHandler());
app.use(cookieParser());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});
app.post('/signup', createUserValidation, createUser);
app.post('/signin', loginValidation, login);
app.delete('/signout', signOut);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use('/', cardRoutes);
app.use('/', userRoutes);

app.use(errorLogger);

app.use((req, res) => {
  res.status(404).send({ message: 'Не смотри, я не накрашена!' });
});

app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Подключено к порту ${PORT}.`);
});
