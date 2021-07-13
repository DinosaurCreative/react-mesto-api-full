function ImagePopup({card, onClose}) {
  return (
    <div className={`popup popup_type_viewer ${card.isOpen ? "popup_opened" : ''}`}>
      <div className="popup__photo-wrapper">
        <figure className="popup__photo-container">
          <img className="popup__image" src={card.link} alt={card.name} />
          <figcaption className="popup__image-title">{card.name}</figcaption>
        </figure>
        <button className="popup__cross popup__cross_type_viewer" aria-label="Закрыть окно" type="button"  onClick={onClose} />
      </div>
    </div>
  );
}

export default ImagePopup;