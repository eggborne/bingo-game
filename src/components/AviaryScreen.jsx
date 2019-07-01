import React, { useState, useCallback } from 'react';
import AviaryModal from './AviaryModal';
import '../css/AviaryScreen.css';
import { chickenEffects } from '../App';
let chickenPng = require('../assets/chickenstand.png');
let blueChickenPng = require('../assets/chickenstandblue.png');

function AviaryScreen(props) {
  console.pink('AviaryScreen ------------------');
  console.info('aviary props', props)
  const [selectedChicken, setSelectedChicken] = useState(undefined);

  const handleSelectSlot = (slot) => {
    console.warn('selected chicken slot', slot);
    props.onClickEquipChicken(selectedChicken, slot);
    setTimeout(() => {
      setSelectedChicken(undefined);
    }, 250)
  }
  const handleClickEquip = (chickenId) => {
    console.log('selecting chicken', chickenId)
    setSelectedChicken(chickenId)
  }
  const handleClickCancelButton = () => {
    setSelectedChicken(undefined);
  }

  let aviaryClass = props.showing ? 'showing' : '';
  // let cash = props.userCash;
  return (
    <>
      {props.showing && <AviaryModal chickenSlots={props.chickenSlots} chickens={props.chickens} selectedChicken={selectedChicken} onSelectSlot={handleSelectSlot} onClickCancelButton={handleClickCancelButton} />}
    <div id='aviary-screen' className={aviaryClass}>
      <header><div>AVIARY</div></header>
      <div id='chicken-list'>
        {props.chickens.map((chicken, i) => {
        // {props.chickenSlots.filter(slot => slot.chickenId !== -1).map((slot, i) => {
          // let chicken = props.chickens[slot.chickenId];
          console.log('chicken?', chicken);
          console.log('props.chickenSlots.filter(slot => slot.chickenId === chicken.chickenId)?', props.chickenSlots.filter(slot => slot.chickenId === chicken.chickenId));
          let equipped = props.chickenSlots.filter(slot => slot.chickenId === chicken.chickenId).length;
          return (<div key={chicken.chickenId} className={equipped ? 'chicken-panel equipped' : 'chicken-panel'}>
            <img src={blueChickenPng} />
            <div className='chicken-name'>{chicken.name}{equipped ? <span style={{color: '#aaffaa'}}> EQUIPPED</span> : ''}</div>

            <div className='chicken-level'>Level {chicken.level}</div>
            <div className='effect-label'>Abilities:</div>
            <div className='chicken-effects'>
              <small>On Activation:</small> <div>{chicken.onActivate ? chickenEffects[chicken.onActivate][chicken.level].displayName : 'none'}</div>
              <small>While activated:</small> <div>{chicken.durationEffect ? chickenEffects[chicken.durationEffect][chicken.level].displayName : 'none'}</div>
            </div>
            <div className='chicken-activation'>
              <button className='chicken-activation-button' onPointerDown={() => {equipped ? props.onClickUnequipChicken(chicken.chickenId) : handleClickEquip(chicken.chickenId)}}>{equipped ? 'UNEQUIP' : 'EQUIP'}</button>
            </div>
          </div>);
        })}
      </div>
    </div>
    </>
  );
}

const isEqual = (prevProps, nextProps) => {
  return (prevProps.showing === nextProps.showing
    // && prevProps.userPrizes.length === nextProps.userPrizes.length
    && prevProps.itemSlots === nextProps.itemSlots
    && prevProps.chickenSlotIndexes === nextProps.chickenSlotIndexes
    && prevProps.chickens === nextProps.chickens
  );
};

export default React.memo(AviaryScreen, isEqual);
// export default AviaryScreen;
