import React from 'react';
import { Link } from 'react-router-dom';

function Register() {

  return (
    <div className="register">
      <h2 className="register__title">Регистрация</h2>
      <form className="register__form">
        <input className="register__input" type="email" placeholder="Имейл" name="email" id="register-email"  required />
        <input className="register__input" type="password" placeholder="Пароль" name="password" id="register-password" minLength={2} maxLength={40} required />
        <button className="register__submit-btn" type="submit">Зарегистрироваться</button>
      </form>
      <Link className="register__autorization-link">Уже зарегистрированны? Войти</Link>
    </div>
  )
}

export default Register;