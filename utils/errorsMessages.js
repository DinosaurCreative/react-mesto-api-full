const nameLengthErr = 'Длина имени должна быть не менее двух и не более тридцати символов.';
const aboutLengthErr = 'Длина описания должна быть не менее двух и не более тридцати символов.';
const badUrlErr = 'Передана некорректная URL ссылка.';
const ownerRigthsErr = 'Недостаточно прав для удаления карточки.';
const cardsIdMissing = 'Карточка с указанным id не найдена.';
const badValue = 'Переданы некорректные данные.';
const usersIdMissing = 'Пользователь с указанным id не найдена.';
const shortPassErr = 'Пароль не должен быть менее восьми символов.';
const wrongEmail = 'Введен неверный имейл.';
const emailTaken = 'Пользовател с таким имейлом уже существует.';
const badEmailOrPass = 'Неверная почта или пароль.';

module.exports = {
  nameLengthErr,
  badUrlErr,
  ownerRigthsErr,
  cardsIdMissing,
  badValue,
  usersIdMissing,
  shortPassErr,
  wrongEmail,
  emailTaken,
  aboutLengthErr,
  badEmailOrPass,
};
