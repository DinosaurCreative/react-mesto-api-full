import { Link } from 'react-router-dom';
import React from 'react';
function Header() {
  const [isMenuOpened, setIsMenuOpened] = React.useState('false')

  function menuVisibilityToggle () {
    setIsMenuOpened(!isMenuOpened);
  }

  return (
    <header className="header">
      <div  className={`header__menu ${isMenuOpened ? "header__meny_type_opened": ""}`}>
        <p className="header__email_menu">{'Fuees-88@mail.ru'}</p>
        <Link className="header__link_menu">{"Выйти"}</Link>
      </div>
      <div className="header__container">
        <a href="#" className="header__logo" target="_self" />
        <p className="header__email">{'Fuees-88@mail.ru'}</p>
        <Link className="header__link header__link_registration">{"Регистрация"}</Link>
        <Link className="header__link header__link_login">{"Войти"}</Link>
        <Link className="header__link header__link_exit">{"Выйти"}</Link>
        <button className={`${ isMenuOpened ? "header__menu-btn" : "header__menu-btn_type_close "}`} onClick={menuVisibilityToggle}/>
      </div>
    </header>
  );
}

export default Header;