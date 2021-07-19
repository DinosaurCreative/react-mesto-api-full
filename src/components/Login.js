import React from "react";

function Login(props) {
  const [userAutorizationData, setUserAutorizationData] = React.useState({password: "", email: ""});
  
  function handleChange (e) {
    setUserAutorizationData({...userAutorizationData, [e.target.name]: e.target.value});
  }

  function handleSubmit(e) {
    e.preventDefault();
    props.onSubmit(userAutorizationData);
  }

  return (
    <div className="login">
      <h2 className="login__title">Вход</h2>
      <form className="login__form" onSubmit = {handleSubmit}>
        <input className="login__input" type="email" placeholder="Имейл" value={userAutorizationData.email} name="email" id="login-email" onChange = {handleChange} required />
        <input className="login__input" type="password" placeholder="Пароль" value={userAutorizationData.password} name="password" id="login-password" onChange = {handleChange} minLength={2} maxLength={40} required />
        <button className="login__submit-btn" type="submit">Войти</button>
      </form>
    </div>
  )
};

export default Login;