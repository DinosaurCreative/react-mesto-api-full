import React, { useEffect, useState } from 'react';
import '../index.css';
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import ImagePopup from './ImagePopup';
import AddPlacePopup from './AddPlacePopup';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import api from '../utils/api';
import { CurrentUserContext }  from '../contexts/CurrentUserContext';

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
  const [isAddPlacePopupOpen,    setIsAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen,  setIsEditAvatarPopupOpen] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState({isOpen: false});
  const [currentUser, setCurrentUser] = React.useState({ name: '', about: '', _id: '', avatar: ''});
  const [cards, setCards] = React.useState([]);

  React.useEffect(()=> {
    api.getProfileData()
    .then(userInfo => setCurrentUser(userInfo))
    .catch(err => console.log(`Ошибка при получении данных профиля: ${err}`))
  },[]);

  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setSelectedCard({ isOpen: false });
  };
 
  function handleUpdateUser(userInfo) {
    api.setNewProfileData(userInfo)
    .then(res => setCurrentUser(res))
    .then(() => closeAllPopups())
    .catch(err => console.log(`Ошибка при обновлении данных профиля: ${err}`))
  };

  function handleUpdateAvatar(avatarLink) {
    api.changeAvatar(avatarLink)
    .then(res => setCurrentUser(res))
    .then(() => closeAllPopups())
    .catch(err => console.log(`Ошибка при обновлении аватара: ${err}`))
  }

  function handleAddPlaceSubmit(newCard) {
    api.postImage(newCard)
    .then(res => {
      cards.splice(cards.length - 1);
      setCards([res, ...cards])
    })
    .then(() => closeAllPopups())
    .catch(err => console.log(`Ошибка при добавлении нового фото: ${err}`))
  }

  useEffect(() => {
    api.getImages()
    .then(imagesData =>  setCards(imagesData))
    .catch(err => console.log(`Ошибка: ${err}`))
  }, []);

  function handleCardLike(card) {
    const isLiked = card.likes.some(i => i._id === currentUser._id);

    api.changeLikeCardStatus(card._id, isLiked)
    .then(newCard => {
      const updatedCards = cards.map(c => c._id === card._id ? newCard : c);
      setCards(updatedCards);
    })
    .catch(err => console.log(`Ошибка: ${err}`))
  };

  function handleCardDelete(card) {
    api.deleteImage(card._id)
    .then(() => {
      const updatedCards = cards.filter(c => c._id !== card._id);
      setCards(updatedCards);
    })
    .catch(err => console.log(`Ошибка при удалении фото: ${err}`))
  };

  function handleCardClick(data) {
    setSelectedCard(data);
  };
  
  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(!isEditProfilePopupOpen);
  };
  
  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(!isAddPlacePopupOpen);
  };

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(!isEditAvatarPopupOpen);
  };

  return (
    <div className="page">
      <div className="page__container">
        <CurrentUserContext.Provider value = {currentUser}>
          <Header />
          <Main onEditProfile = {handleEditProfileClick}
                onAddPlace = {handleAddPlaceClick}
                onEditAvatar = {handleEditAvatarClick}
                onCardClick = {handleCardClick}
                cards = {cards}
                onLikeClick = {handleCardLike}
                onTrashClick = {handleCardDelete}

                />     
          <Footer />
          <AddPlacePopup isOpen = {isAddPlacePopupOpen}
                         onClose = {closeAllPopups}
                         onUpdateCards = {handleAddPlaceSubmit}
                         buttonText = {"Сохранить"}
                         />
          <EditProfilePopup isOpen = {isEditProfilePopupOpen}
                            onClose = {closeAllPopups}
                            onUpdateUser = {handleUpdateUser}
                            buttonText = {"Сохранить"}
                            />
          {isEditAvatarPopupOpen && <EditAvatarPopup isOpen = {isEditAvatarPopupOpen}
                           onClose = {closeAllPopups}
                           onUpdateAvatar = {handleUpdateAvatar}
                           buttonText = {"Сохранить"}
                           />}
          <ImagePopup card = {selectedCard}
                      onClose = {closeAllPopups}
                      />
        </CurrentUserContext.Provider>
      </div>
    </div>  
  );
};

export default App;