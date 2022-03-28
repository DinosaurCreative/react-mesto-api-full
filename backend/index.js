const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const { errors } = require('celebrate');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const cors = require('./middlewares/cors');

const { PORT = 3000 } = process.env;
const app = express();
const errorHandler = require('./middlewares/errorHandler');
const { createUserValidation, loginValidation } = require('./middlewares/validators');
const cardRoutes = require('./routes/cards');
const userRoutes = require('./routes/users');
const { createUser, login, signOut } = require('./controllers/users');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const NotFoundError = require('./errors/NotFoundError');
const { dataBaseAddress } = require('./utils/config');

mongoose.connect(dataBaseAddress, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
}).then(() => console.log('connected')).catch((err) => console.log(`Ошибка подключения: ${err}`));

app.use(cors);
app.use(cookieParser());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);
app.post('/signup', createUserValidation, createUser);
app.post('/signin', loginValidation, login);
app.delete('/signout', signOut);

app.use('/', cardRoutes);
app.use('/', userRoutes);

app.use(errorLogger);

app.use('*', () => {
  throw new NotFoundError('Не смотри, я не накрашена!');
});

app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => console.log(`Подключено к порту ${PORT}.`));
