import React from 'react';
import '../css/ConfirmModal.css';

function ConfirmModal(props) {
  let modalClass = 'status-button';
  if (!props.showing) {
    modalClass += ' hidden';
  }
  return (
    <div id='confirm-modal' className={modalClass}>
      <div id='confirm-message'>{props.message}</div>
      <button id='agree-button' onTouchStart={props.onClickAgreeButton} className='modal-button'>DO IT</button>
      <button id='cancel-button' onTouchStart={props.onClickCancelButton} className='modal-button'>SHIT, NO</button>
    </div>
  );
}

export default ConfirmModal;
