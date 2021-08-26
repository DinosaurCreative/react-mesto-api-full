const linkRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)/i;
const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/i;
module.exports = {
  linkRegex,
  emailRegex,
};
