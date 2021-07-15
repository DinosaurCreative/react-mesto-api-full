function InfoTooltip (props) {
  return (
    <div className={`popup popup_type_${props.name} ${props.isOpen ? 'popup_opened': ''}`}>
      <div className="popup__container">
        <div className="popup__status-img" />
        <h3 className="popup__title popup__title_type_registration-confirm">{props.title}</h3>
        <button className={`popup__cross popup__cross_${props.name}`} aria-label="Закрыть без сохранения" type="button" onClick ={props.onClose}/>
      </div>
    </div>
  );
}

export default InfoTooltip;