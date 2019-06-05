import React from 'react';
import '../css/GameEndModal.css';

function GameEndModal(props) {
  let modalClass = 'status-button';
  let agreeLabel = 'OKAY';
  if (!props.showing) {
    modalClass += ' hidden';
  }
  return (
    <div id='game-end-modal' className={modalClass}>
      <div id='game-end-title'></div>
      <div id='game-end-message'>{props.message}</div>
      <><button id='agree-button' onPointerDown={props.onClickOkayButton} className='modal-button'>{agreeLabel}</button></>
    </div>
  );
}
function areEqual(prevProps, nextProps) {
  return prevProps.message === nextProps.message && prevProps.showing === nextProps.showing;
}

export default React.memo(GameEndModal, areEqual);
// export default GameEndModal;
