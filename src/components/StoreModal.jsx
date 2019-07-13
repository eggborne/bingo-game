import React, { useState, useEffect, useRef, useCallback } from 'react';
import '../css/StoreScreen.css';
import '../css/StoreModal.css';

function StoreModal(props) {
  const slotRef = useRef();
  const [slotSelected, setSlotSelected] = useState(undefined);
  let agreeLabel = 'BUY';
  let cancelLabel = 'NEVER MIND';
  let cost = props.selectedItem ? props.selectedItem.cost : undefined;
  useEffect(() => {
    setSlotSelected(undefined);
  }, [props.selectedItem])
  const selectSlot = (newSlot) => {
    setSlotSelected(newSlot);
    props.onSelectSlot(newSlot);

  }
  return (
    <div id='store-modal' className={props.selectedItem && 'showing'}>
      {props.selectedItem &&
        <>
          <div id='store-modal-message'>
            <div>Buy</div>
            <div style={{ color: 'yellow' }}>{props.selectedItem.displayName}</div>
            <div>for ${cost}?</div>
          </div>
          {props.selectedItem.consumable &&
            <div ref={slotRef} id='slot-select'>
              Choose slot:
              <div>
              {props.itemSlots.map((slot, i) => {
                if (slot.item && slot.item.hasOwnProperty('id') && slot.item.id > -1) {
                  return (
                    <div key={slot.item.description} id={`item-slot-${i + 1}`} onPointerDown={() => selectSlot(i)} className={i !== slotSelected ? 'item-slot' : 'item-slot selected'}>
                      <img src={require(`../assets/${slot.item.imgSrc}`)} />
                      <div className='quantity-label'>{slot.item.uses}</div>
                    </div>
                  );
                } else {
                  return (
                    <div key={i} id={`empty-slot-${i + 1}`} onPointerDown={() => selectSlot(i)} className={i !== slotSelected ?  'item-slot empty' : 'item-slot empty  selected'}>
                      <div className="label">EMPTY</div>
                    </div>
                  );
                }
              })}
            </div>
            </div>
          }
        {props.selectedItem.consumable ?
          <div className='button-area'>
            {/* <button id='agree-button' onClick={slotSelected > -1 ? props.onClickBuyButton : flashSlotSelect} className={`modal-button${slotSelected > -1 ? '' : ' unavailable'}`}>{agreeLabel}</button> */}
            <button id='cancel-button' onPointerDown={props.onClickCancelButton} className='modal-button'>{cancelLabel}</button>
          </div>
          :
          <div className='button-area'>
            <button id='agree-button' onClick={props.onClickBuyButton} className={`modal-button`}>{agreeLabel}</button>
            <button id='cancel-button' onPointerDown={props.onClickCancelButton} className='modal-button'>{cancelLabel}</button>
          </div>
        }
        </>
      }
    </div>
  );
}
function areEqual(prevProps, nextProps) {
  return prevProps.selectedItem === nextProps.selectedItem && prevProps.showing === nextProps.showing && prevProps.itemSlots === nextProps.itemSlots;
}

// export default React.memo(StoreModal, areEqual);
export default StoreModal;
