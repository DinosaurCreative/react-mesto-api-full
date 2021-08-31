import React from 'react';
import '../index.css';
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import ImagePopup from './ImagePopup';
import AddPlacePopup from './AddPlacePopup';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import Login from './Login';
import Register from './Register';
import api from '../utils/api';
import { CurrentUserContext }  from '../contexts/CurrentUserContext';
import { Route, Switch, Redirect, useHistory} from 'react-router-dom';
import PopupWithForm from './PopupWithForm';
import InfoTooltip from './InfoTooltip';
import ProtectedRoute from './ProtectedRoute';
import {signUp, signIn, checkToken} from '../utils/auth';

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
  const [isAddPlacePopupOpen,    setIsAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen,  setIsEditAvatarPopupOpen] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState({isOpen: false});
  const [currentUser, setCurrentUser] = React.useState({ name: '', about: '', _id: '', avatar: ''});
  const [cards, setCards] = React.useState([]);
  const [isInfoTooltipPopupOpen, setIsInfoTooltipPopupOpen] = React.useState(false);
  const [isLogged, setIsLogged] = React.useState(false);
  const [isRegistered, setIsRegistered] = React.useState(false);
  const [userEmail, setUserEmail] = React.useState('');
  const history = useHistory();
  const[isLoading, setIsloading] = React.useState(true);
  
  React.useEffect(() => {

        Promise.all([api.getProfileData(), api.getImages()])
            .then(([userInfo, cards]) => {
              setCurrentUser(userInfo);
              console.log(cards)
            })
            .then(() => setIsloading(false))
            .catch((err) => console.log(err));

}, [isLogged]);


  function handleCheckToken() {
      checkToken()
      .then(res => {
        console.log(res)
        setUserEmail(res.data.email);
        history.push('/');
        setIsLogged(true);
      })
      .catch(err => console.log(`Ошибка при проверке токена: ${err}`))
      .finally(()=> {
        setIsloading(false)
      })
  }

  React.useEffect(()=> {
    handleCheckToken();
  },[]);

  function hadleSignUp({password, email}) {
    signUp({password, email})
    .then(() => {
      setIsRegistered(true);
      setIsInfoTooltipPopupOpen(true);
      history.push('sign-in');
    })
    .catch(err => {
      setIsInfoTooltipPopupOpen(true);
      console.log(`Ошибка в отправляемых данных: ${err}`);
    })
  }

  function handleSignIn({password, email}) {
    signIn({password, email})
    .then(res => {
      setIsLogged(true);
      setUserEmail(email);
      history.push('/');
    })
    .catch(err => console.log(`Ошибка при авторизации: ${err}`))
  }

  function handleSignOut() {
    setIsLogged(false);
  }

  // React.useEffect(()=> {
  //   api.getProfileData()
  //   .then(userInfo => setCurrentUser(userInfo))
  //   .catch(err => console.log(`Ошибка при получении данных профиля: ${err}`))
  // },[]);

  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setSelectedCard({ isOpen: false });
    setIsInfoTooltipPopupOpen(false);
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

  // React.useEffect(() => {
  //   api.getImages()
  //   .then(imagesData =>  setCards(imagesData))
  //   .catch(err => console.log(`Ошибка: ${err}`))
  // }, []);

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
  
  return ( isLoading 
    ? <div className="page">
        <div className="page__container" />
      </div>  
    : <div className="page">
        <div className="page__container">
         <CurrentUserContext.Provider value={currentUser}>
            <Header path={{register: "sign-up", login: "sign-in"}}
                    text={{register: "Регистрация", login: "Войти"}}
                    isLogged={isLogged}
                    onExitClick={handleSignOut}
                    userEmail={userEmail}
            />
          
            <Switch>
              <ProtectedRoute component={Main}
                              onEditProfile={handleEditProfileClick}
                              onAddPlace={handleAddPlaceClick}
                              onCardClick={handleCardClick}
                              onEditAvatar={handleEditAvatarClick}
                              cards={cards}
                              onLikeClick={handleCardLike}
                              onTrashClick={handleCardDelete}
                              loggedIn={isLogged}
                              exact path = "/"
                              />

              {!isLogged && <Route path = "/sign-in">
                <Login onSubmit={handleSignIn} />
              </Route>}
       
              {!isLogged && <Route path = "/sign-up">
                <Register onSubmit={hadleSignUp} />
              </Route>}

              <Route>
                { isLogged ? <Redirect to = "/" /> : <Redirect to = "/sign-in" /> }
              </Route>
            </Switch>
            <InfoTooltip  isOpen={isInfoTooltipPopupOpen}  
                          onClose={closeAllPopups}  
                          isRegistered={isRegistered}
                          />
                          
            {isLogged && <Footer />}
            <PopupWithForm />
            <AddPlacePopup isOpen={isAddPlacePopupOpen}
                            onClose={closeAllPopups}
                            onUpdateCards={handleAddPlaceSubmit}
                            buttonText={"Сохранить"}
                            />
            <EditProfilePopup isOpen={isEditProfilePopupOpen}
                              onClose={closeAllPopups}
                              onUpdateUser={handleUpdateUser}
                              buttonText={"Сохранить"}
                              />
            <EditAvatarPopup isOpen={isEditAvatarPopupOpen}
                            onClose={closeAllPopups}
                            onUpdateAvatar={handleUpdateAvatar}
                            buttonText={"Сохранить"}
                            />
            <ImagePopup card={selectedCard}
                        onClose={closeAllPopups}
                        />
          </CurrentUserContext.Provider>
        </div>
      </div>  
  );
};

export default App;