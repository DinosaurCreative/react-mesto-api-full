import React from 'react';
import PopupWithForm from './PopupWithForm';

function AddPlacePopup(props) {
  const [placeLink, setPlaceLink] = React.useState('');
  const [placeName, setPlaceName] = React.useState('');

  function onSubmit(e) {
    e.preventDefault();
    props.onUpdateCards({
      name: placeName,
      link: placeLink,
    });
    setTimeout(()=> {
      setPlaceLink('');
      setPlaceName('');
    }, 2000);
  }

  function handleLinkChange(e) {
    setPlaceLink(e.target.value);
  };

  function handleNameChange(e) {
    setPlaceName(e.target.value);
  };

  function onClose() {
    props.onClose();
    setPlaceLink('');
    setPlaceName('');
  }

  return (
    <PopupWithForm isOpen = {props.isOpen}
                   onClose = {onClose}
                   name = {'image'}
                   title = {'Новое место'}
                   onSubmit = {onSubmit}
                   buttonText = {props.buttonText}
                   >
      <input type="text" placeholder="Название" onChange={handleNameChange} name="name" value={placeName} id="popup-title"  className="popup__input popup__input_type_image-title" minLength={2} maxLength={30} required />
      <span className="popup__input-error popup-title-error" />
      <input type="url" placeholder="Ссылка на картинку" onChange={handleLinkChange} name="link" value={placeLink} id="popup-link" className="popup__input popup__input_type_image-link" required />
      <span className="popup__input-error popup-link-error" />
    </PopupWithForm>
  );
};

export default AddPlacePopup;