const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
// const BASE_PATH = "mongodb://localhost:27017/mestodb";
const { PORT = 3000 ,BASE_PATH } = process.env;

const app = express();

app.listen(PORT, () => {
  console.log(`Ссылка на сервер: ${PORT}`);
});