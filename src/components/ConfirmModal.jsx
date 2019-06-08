import React from 'react';
import '../css/ConfirmModal.css';

function ConfirmModal(props) {
  let modalClass = 'status-button';
  let agreeLabel = 'OKAY';
  let cancelLabel = 'NEVER MIND';
  if (props.urgent) {
    modalClass += ' urgent';
    agreeLabel = 'YES, QUIT';
    cancelLabel = 'SHIT, NO';
  }
  if (props.reload) {
    modalClass += ' reload';
    agreeLabel = 'YES';
  }
  if (!props.showing) {
    modalClass += ' hidden';
  }
  if (props.loggingOut) {
    agreeLabel = 'LOG OUT';
    cancelLabel = 'NEVER MIND';
  }
  return (
    <div id='confirm-modal' className={modalClass}>
      {props.reload &&
        <div id='reload-pic'></div>
      }
      <div id='confirm-message'>{props.message}</div>
      <button id='agree-button' onPointerDown={props.onClickAgreeButton} className='modal-button'>{agreeLabel}</button>
      <button id='cancel-button' onPointerDown={props.onClickCancelButton} className='modal-button'>{cancelLabel}</button>
    </div>
  );
}
function areEqual(prevProps, nextProps) {
  return prevProps.message === nextProps.message && prevProps.showing === nextProps.showing;
}

export default React.memo(ConfirmModal, areEqual);
// export default ConfirmModal;
