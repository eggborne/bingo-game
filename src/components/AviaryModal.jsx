import React, { useState, useEffect, useRef, useCallback } from 'react';
import '../css/AviaryModal.css';

let blueChickenPng = require('../assets/chickenstandblue.png');

function AviaryModal(props) {
  console.info('storemodal props', props);
  const slotRef = useRef();
  const [slotSelected, setSlotSelected] = useState(undefined);
  let agreeLabel = 'BUY';
  let cancelLabel = 'NEVER MIND';
  let cost = props.selectedChicken ? props.selectedChicken.cost : undefined;
  useEffect(() => {
    setSlotSelected(undefined);
  }, [props.selectedChicken])
  const flashSlotSelect = useCallback(() => {
    console.log(slotRef)
    slotRef.current.style.transform = 'scale(1.05)';
    setTimeout(() => {
      slotRef.current.style.transform = 'scale(1)';
    }, 200);
    setTimeout(() => {
      slotRef.current.style.transform = 'scale(1.05)';
    }, 400);
    setTimeout(() => {
      slotRef.current.style.transform = 'scale(1)';
    }, 600);
  }, [slotRef, slotSelected])
  const selectSlot = (newSlot) => {
    setSlotSelected(newSlot);
    props.onSelectSlot(newSlot);
  }
  const clickCancel = () => {
    setSlotSelected(undefined);
    props.onClickCancelButton();

  }
  return (
    <div id='aviary-modal' className={props.selectedChicken !== undefined ? 'showing' : undefined}>
      {props.selectedChicken !== undefined &&
        <>
          <div ref={slotRef} id='slot-select'>
            Choose slot:
            <div>
            {props.chickenSlots.map((slot, i) => {
              console.info(slot, i, 'slot');
              if (slot.chickenId !== -1) {
                let chicken = props.chickens.filter(chicken => slot.chickenId === chicken.chickenId)[0];
                return (
                  <div key={chicken.chickenId} id={`item-slot-${i + 1}`} onPointerDown={() => selectSlot(i)} className={i !== slotSelected ? 'item-slot' : 'item-slot selected'}>
                    <img src={blueChickenPng} />
                    <div className='chicken-label'>{chicken.name.toUpperCase()}</div>
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
          <div className='button-area'>
            <button id='cancel-button' onPointerDown={clickCancel} className='modal-button'>NEVER MIND</button>
          </div>
        </>
      }
    </div>
  );
}
function areEqual(prevProps, nextProps) {
  // return prevProps.selectedChicken === nextProps.selectedChicken && prevProps.showing === nextProps.showing && prevProps.chickenSlots === nextProps.chickenSlots;
}

// export default React.memo(AviaryModal, areEqual);
export default AviaryModal;
