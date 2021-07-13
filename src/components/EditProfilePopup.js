import React from 'react';
import PopupWithForm from './PopupWithForm';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

function EditProfilePopup (props) {
  const currentUser = React.useContext(CurrentUserContext);
  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');

  React.useEffect(()=>{
    setName(currentUser.name);
    setDescription(currentUser.about);
  },[props.isOpen]);

  function handleSubmit(e) {
    e.preventDefault();

    props.onUpdateUser({
      name,
      about: description,
    });
  };

  function handleNameChange(e) {
    setName(e.target.value);
  };
  
  function handleDescriptionChange(e) {
    setDescription(e.target.value);
  };

  return (
    <PopupWithForm isOpen = {props.isOpen}
                   onClose = {props.onClose}
                   name = {'edit'}
                   title = {'Редактировать профиль'}
                   onSubmit = {handleSubmit}
                   buttonText = {props.buttonText}
                   >
      <input type="text" placeholder="Имя" name="name" id="popup-name" onChange={handleNameChange} value={name} className="popup__input popup__input_type_name" minLength={2} maxLength={40} required />
      <span className="popup__input-error popup-name-error" />
      <input type="text" placeholder="Професиия" name="about" id="popup-occupation" onChange={handleDescriptionChange} value={description} className="popup__input popup__input_type_occupation" minLength={2} maxLength={200} required />
      <span className="popup__input-error popup-occupation-error" />
    </PopupWithForm>       
  );
}

export default EditProfilePopup;