import { Link, useLocation } from 'react-router-dom';
import React from 'react';
function Header({...props}) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  
  const location = useLocation();
  const locationName = location.pathname === "/sign-up" ? "Вход" : "Регистрация";
  const pathLink = location.pathname === "/sign-up" ? "/sign-in" : "/sign-up";

  function menuVisibilityToggle () {
    setIsMenuOpen(!isMenuOpen);
  };

  function signOut() {
    props.onExitClick();
    menuVisibilityToggle();
  };
  
  return (
    <header className="header">
      <div className={`header__container ${isMenuOpen ? "header__container_menu" : ""}`}>
        <Link to="/" href="#" className="header__logo" />
        <div className="header__top-line"></div>
        {props.isLogged && <div  className={`header__menu ${isMenuOpen ? "header__menu_type_opened": ""}`}>
          <p className="header__email">{props.userEmail}</p>
          <Link to="/sign-in" className="header__exit-link" onClick={signOut}>{"Выйти"}</Link>
         </div>}
        {props.isLogged && <button className={`header__menu-btn ${ isMenuOpen ? "header__menu-btn_type_close" : ""}`} onClick={menuVisibilityToggle}/>}
      {!props.isLogged && <Link to={pathLink} className="header__link">{locationName}</Link>}
      </div>
    </header>
  );
};

export default Header;