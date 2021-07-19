function InfoTooltip (props) {
  const titleText = props.isRegistered ? "Вы успешно зарегистрировались!" : "Что-то пошло не так! Попробуйте еще раз.";
  
  return (
    <div className={`popup popup_type_${props.name} ${props.isOpen ? "popup_opened": ""}`}>
      <div className="popup__container">
        <div className={`popup__status-img ${props.isRegistered ? "popup__status-img_type_accept" : "popup__status-img_type_reject"}`} />
        <h3 className="popup__title popup__title_type_registration-confirm">{titleText}</h3>
        <button className={`popup__cross popup__cross_${props.name}`} aria-label="Закрыть без сохранения" type="button" onClick ={props.onClose}/>
      </div>
    </div>
  );
};

export default InfoTooltip;