import React from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext';


function Card({card,_ ,onCardClick, onLikeClick, onTrashClick}) {

  const user = React.useContext(CurrentUserContext);

  function handleClick() {
    card.isOpen = true;
    onCardClick(card);
  };

  function handleLikeClick() {
    onLikeClick(card);
  };
  
  function handleTrashClick(){
    onTrashClick(card);
  };

  function checkIsLiked(card) {
    return card._id === user._id;
  };

  return (
    <li className="grid__item" >
      <img className="grid__image" alt={card.name}  src={card.link } onClick={handleClick}/>
      <button className={`grid__delete-btn ${card.owner === user._id ? "grid__delete-btn_type_visible" : ''}`} onClick={handleTrashClick}></button>
      <div className="grid__city-box">
        <h2 className="grid__city-name">{card.name}</h2>
        <div className="grid__like-container">
          <button aria-label="Кнопка лайк" className={`grid__like ${card.likes.some(checkIsLiked) ? 'grid__like_type_dark' : ''}`} type="button" onClick={handleLikeClick}></button>
          <p className="grid__like-counter">{card.likes.length}</p>
        </div>
      </div>
    </li>
  );
};

export default Card;