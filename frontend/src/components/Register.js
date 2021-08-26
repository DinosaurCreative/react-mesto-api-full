import React from 'react';
import { Link } from 'react-router-dom';

function Register(props) {
  const [userRegistrationData, setUserRegistrationData] = React.useState({password: "", email: ""});
  
  function handleChange(e) {
    setUserRegistrationData({...userRegistrationData, [e.target.name]: e.target.value});
  }

  function handleSubmit(e) {
    e.preventDefault();
    props.onSubmit(userRegistrationData);
  }
  
  return (
    <div className="register">
      <h2 className="register__title">Регистрация</h2>
      <form className="register__form" onSubmit = {handleSubmit}>
        <input className="register__input" type="email" placeholder="Имейл" value = {userRegistrationData.email} name="email" id="register-email" onChange = {handleChange} required />
        <input className="register__input" type="password" placeholder="Пароль" value = {userRegistrationData.password} name="password" id="register-password" onChange = {handleChange} minLength={2} maxLength={40} required />
        <button className="register__submit-btn" type="submit">Зарегистрироваться</button>
      </form>
      <Link to="/sign-in" className="register__autorization-link">Уже зарегистрированны? Войти</Link>
    </div>
  )
}

export default Register;