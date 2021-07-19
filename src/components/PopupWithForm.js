function PopupWithForm(props) {
  return (
    <div className={`popup popup_type_${props.name} ${props.isOpen ? 'popup_opened': ''}`}>
      <div className="popup__container">
        <h3 className="popup__title">{props.title}</h3>
        <form className={`popup__form popup__form_type_${props.name}`} name={`form-${props.name}`} onSubmit={props.onSubmit}>
          {props.children}
          <button className="popup__save-btn" type="submit">{props.buttonText}</button>
        </form>
        <button className={`popup__cross popup__cross_${props.name}`} aria-label="Закрыть без сохранения" type="button" onClick ={props.onClose}/>
      </div>
    </div>
  );
};

export default PopupWithForm;