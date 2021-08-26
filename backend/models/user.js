const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const { isEmail } = require('validator');
const { linkRegex } = require('../utils/constants');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    validate(v) {
      if (v.length < 2 || v.length > 30) {
        throw new Error('nameError');
      }
    },
  },
  about: {
    type: String,
    default: 'Исследователь',
    validate(v) {
      if (v.length < 2 || v.length > 30) {
        throw new Error('aboutError');
      }
    },
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate(v) {
      if (!linkRegex.test(v)) {
        throw new Error('linkError');
      }
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate(value) {
      if (!isEmail(value)) {
        throw new Error('emailError');
      }
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
}, { versionKey: false });

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('invailidEmailOrPassword'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('invailidEmailOrPassword'));
          }
          return user;
        });
    });
};

function toJSON() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
}

userSchema.methods.toJSON = toJSON;

module.exports = mongoose.model('user', userSchema);
