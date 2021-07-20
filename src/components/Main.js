import React from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import Card from './Card';

function Main (props) {  
  const currentUser = React.useContext(CurrentUserContext);

  return (
    <main className="content">
      <section className="profile">
        <div className='profile__photo' style={{backgroundImage: `url(${currentUser.avatar})`}}>
          <span className={currentUser.avatar ? "" : "profile__loader"} />
          <button className="profile__edit-avatar" onClick={props.onEditAvatar}/>
        </div>
        <div className="profile__info-container">
          <div className="profile__info">
            <h1 className="profile__name">{currentUser.name}</h1>
            <p className="profile__occupation" >{currentUser.about}</p>
          </div>
          <button className="profile__edit-button" aria-label="Редактировать профиль" type="button" onClick={props.onEditProfile}/>
        </div>
        <button className="profile__add-button" aria-label="Кнопка добавления фото" type="button" onClick={props.onAddPlace}/>
      </section>
      <section className="grid">
      <span className={ props.cards.length > 0  ? '': "grid__loader"}/>
        <ul className="grid__list">{ 
          props.cards.map(card => {
            return (<Card card = {card}
                         key = {card._id}
                         onCardClick = {props.onCardClick}
                         onLikeClick = {props.onLikeClick}
                         onTrashClick = {props.onTrashClick}/>
            )
          })
        }</ul>
      </section>
    </main>
  );
}

export default Main;