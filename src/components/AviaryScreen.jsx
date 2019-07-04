import React, { useState, useCallback } from 'react';
import '../css/AviaryScreen.css';
import AviaryModal from './AviaryModal';
import ExperienceBar from './ExperienceBar';
import { chickenEffects, experienceLevels } from '../App';

function AviaryScreen(props) {
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

  return (
    <>
      {props.showing && <AviaryModal chickenSlots={props.chickenSlots} chickens={props.chickens} selectedChicken={selectedChicken} onSelectSlot={handleSelectSlot} onClickCancelButton={handleClickCancelButton} />}
    <div id='aviary-screen' className={aviaryClass}>
      <header><div>AVIARY</div></header>
      <div id='chicken-list'>
        {props.chickens.map((chicken, i) => {
        // {props.chickenSlots.filter(slot => slot.chickenId !== -1).map((slot, i) => {
          // let chicken = props.chickens[slot.chickenId];
          let equipped = props.chickenSlots.filter(slot => slot.chickenId === chicken.chickenId).length;
          let experienceBarWidth = experienceLevels[chicken.level];
          let toNextLevel = experienceBarWidth - chicken.experience;
          let chickenColor = 'blue';
          let nickname = chicken.nickname ? `"${chicken.nickname}"` : '';
          return (<div key={chicken.chickenId} className={equipped ? 'chicken-panel equipped' : 'chicken-panel'}>
            <img src={require(`../assets/chickenstand${chickenColor}.png`)} />
            {/* <div className='chicken-name'><small>"{chicken.nickname}"</small>{chicken.name}{equipped ? <span style={{color: '#aaffaa'}}> - EQUIPPED</span> : ''}</div> */}
            <div className='chicken-name'><small>{nickname}</small> {chicken.name}</div>
            <div className='chicken-experience'>
              <small>Experience:</small> {chicken.experience}
              <ExperienceBar maxLength={experienceBarWidth} currentExperience={chicken.experience} currentLevel={chicken.level} toNextLevel={toNextLevel} />
            </div>
            <div className='duration-label'><small>Effect Duration:</small> {chicken.effectDuration} Balls</div>
            <div className='recharge-label'><small>Recharge Time:</small> {chicken.rechargeTime} Balls</div>
            <div className='chicken-effects'>
              <small>On Activation:</small> <div>{chicken.onActivate ? chickenEffects[chicken.onActivate][chicken.level].displayName : 'none'}</div>
              <small>While activated:</small> <div>{chicken.durationEffect ? chickenEffects[chicken.durationEffect][chicken.level].displayName : 'none'}</div>
            </div>
            <div className='effect-label'>Abilities:</div>
            <div className='chicken-activation'>
              <button className='chicken-activation-button' onClick={() => {equipped ? props.onClickUnequipChicken(chicken.chickenId) : handleClickEquip(chicken.chickenId)}}>{equipped ? 'UNEQUIP' : 'EQUIP'}</button>
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
