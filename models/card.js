const mongoose = require('mongoose');
const { linkRegex } = require('../utils/constants');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    validate(v) {
      if (v.length < 2 || v.length > 30) {
        throw new Error('nameError');
      }
    },
  },
  link: {
    type: String,
    required: true,
    validate(v) {
      if (!linkRegex.test(v)) {
        throw new Error('linkError');
      }
    },
  },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },

  likes: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    default: [],
  },

  createdAt: {
    type: Date,
    default: Date.now(),
  },
}, { versionKey: false });

module.exports = mongoose.model('card', cardSchema);
