import React from 'react';
import PopupWithForm from './PopupWithForm';

function EditAvatarPopup(props) {
  const ref = React.useRef('');

  function handleSubmit(e) {
    e.preventDefault();
    props.onUpdateAvatar(ref.current.value);
  };

  return (  
    <PopupWithForm isOpen = {props.isOpen}
                   onClose = {props.onClose}
                   name = {'avatar'}
                   title = {'Обновить аватар'}
                   onSubmit = {handleSubmit}
                   buttonText = {props.buttonText}
                   >
      <input type="url" placeholder="Ссылка на аватар" ref={ref} name="link" id="popup-avatar-link" className="popup__input popup__input_type_avatar-link" required />
      <span className="popup__input-error popup-avatar-link-error" />    
    </PopupWithForm>
  );
}

export default EditAvatarPopup;