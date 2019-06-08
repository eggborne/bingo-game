import React from 'react';
import '../css/StoreModal.css';

function StoreModal(props) {
  let agreeLabel = 'BUY';
  let cancelLabel = 'NEVER MIND';
  let cost = props.selectedItem ? props.selectedItem.cost : undefined;
  return (
    <div id='store-modal' className={props.selectedItem && 'showing'}>
      {props.selectedItem &&
        <>
          <div id='store-modal-message'>
            <div>Buy</div>
            <div style={{color: 'yellow'}}>{props.selectedItem.description}</div>
            <div>for ${cost}?</div>
          </div>
          <div className='button-area'>
            <button id='agree-button' onPointerDown={props.onClickBuyButton} className='modal-button'>{agreeLabel}</button>
            <button id='cancel-button' onPointerDown={props.onClickCancelButton} className='modal-button'>{cancelLabel}</button>
          </div>
        </>
      }
    </div>
  );
}
function areEqual(prevProps, nextProps) {
  return prevProps.selectedItem === nextProps.selectedItem && prevProps.showing === nextProps.showing;
}

export default React.memo(StoreModal, areEqual);
// export default StoreModal;
