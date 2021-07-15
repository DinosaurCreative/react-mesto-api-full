import React from 'react';


function Login() {

  return (
    <div className="login">
      <h2 className="login__title">Вход</h2>
      <form className="login__form">
        <input className="login__input" type="email" placeholder="Имейл" name="email" id="login-email"  required />
        <input className="login__input" type="password" placeholder="Пароль" name="password" id="login-password" minLength={2} maxLength={40} required />
        <button className="login__submit-btn" type="submit">Войти</button>
      </form>
    </div>
  )
}

export default Login;