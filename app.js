const express = require('express');
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  req.user = { _id: '61047fda8275a7f9203352a3' };
  next();
});

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use('/cards', require('./routes/cards'));

app.use('/users', require('./routes/users'));

app.listen(PORT, () => {
  console.log(`Подключено к порту ${PORT}.`);
});
