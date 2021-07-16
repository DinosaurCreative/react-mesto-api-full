import { Link } from 'react-router-dom';
import React from 'react';
function Header() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)

  function menuVisibilityToggle () {
    setIsMenuOpen(!isMenuOpen);
  }

  return (
    <header className="header">
      <div className={`header__container ${isMenuOpen ? "header__container_menu" : ""}`}>
        <a href="#" className="header__logo" target="_self" />
        <div className="header__top-line"></div>
        {/* <div  className={`header__menu ${isMenuOpen ? "header__menu_type_opened": ""}`}>
          <p className="header__email_menu">{'Fuees-88@mail.ru'}</p>
          <Link className="header__link_menu">{"Выйти"}</Link>
         </div>
        <button className={`${ !isMenuOpen ? "header__menu-btn" : "header__menu-btn_type_close"}`} onClick={menuVisibilityToggle}/> */}
      <Link className="header__link">{"Зарегистрироваться"}</Link>
      </div>
    </header>
  );
}

export default Header;