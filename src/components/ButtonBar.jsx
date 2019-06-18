import React from 'react';
import '../css/ButtonBar.css';
import { prizes } from './StoreScreen';
let chickenPng = require('../assets/chickenstand.png');
let globeIconPng = require('../assets/globeicon.png');

function ButtonBar(props) {
  console.orange('ButtonBar ----------------')
  console.log(props);
  let chickenCount = props.chickenCount;
  // let chickenCount = 'RESET';
  let startClass = 'status-button';
  let stopClass = 'status-button';
  let mapClass = 'status-button';
  let chickensClass = '';
  if (props.gameStarted) {
    startClass += ' game-started';
  } else {
    stopClass += ' showing';
    if (!props.gameInProgress) {
      // stopClass += ' unavailable';
      startClass += ' inactive throbbing';
      // stopClass += ' hidden';
    }
  }
  let voiceClass = 'status-button';
  if (!props.voiceOn) {
    voiceClass += ' inactive';
  }
  let storeClass = 'status-button';
  if (!props.storeOpen) {
    storeClass += ' inactive';
  } else {
    storeClass += ' store-open';
  }
  if (props.gameStarted || props.gameInProgress) {
    // storeClass += ' unavailable';
    // mapClass += ' unavailable';
    // chickensClass = 'unavailable';
  }
  if (props.mapOn) {
    mapClass += ' map-on';
  }
  if (props.gameInProgress) {
    voiceClass += ' hidden';
  }
  let barClass = '';
  if (props.gameStarted) {
    barClass += 'game-started'
  }
  if (props.gameInProgress) {
    barClass += ' game-in-progress';
    if (!props.gameStarted) {
      barClass += ' game-paused';
    }
  }
  let unavailableItemSlots = 3 - props.itemSlots.length;
  let emptyItemSlots = 3 - props.itemSlots.filter(slot => slot.item).length;
  console.log('empty?', emptyItemSlots)
  console.log('unavailable?', unavailableItemSlots)
  return (
    // <div id='button-bar' className={props.gameStarted || props.gameInProgress ? 'game-started' : ''}>
    <div id='button-bar' className={barClass}>
      <div><div id='start-button' onPointerDown={props.onClickStartButton} className={startClass}><i className='material-icons'>
      {props.gameStarted ? 'pause' : 'play_arrow'}</i></div></div>
      {/* {props.gameStarted || props.gameInProgress ? */}
      {/* {props.gameStarted || props.gameInProgress ? */}
      <div id='powerup-area' onPointerDown={!props.gameInProgress ? props.onClickStoreButton : undefined} className={props.gameStarted ? '' : ' game-paused'}>
          <div id='item-slots' className='slot-area'>
            <div className='item-slot-label'>ITEMS</div>
            {props.itemSlots.map((slot, i) => {
              console.info(slot, 'slot');
              if (slot.item) {
                return (
                  <div key={slot.item.description} onPointerDown={props.gameStarted ? () => props.onClickPowerup(slot.item) : undefined} id={`item-slot-${i+1}`} className={props.powerupSelected && props.powerupSelected.description === slot.item.description ? 'item-slot selected' : 'item-slot'}>
                    <img src={slot.item.imgSrc} />
                    <div className='quantity-label'>{slot.item.uses}</div>
                  </div>
                );
              } else {
                return (
                  <div key={i} id={`empty-slot-${i + 1}`} className={'item-slot empty'}>
                    <div className="label">EMPTY</div>
                  </div>
                );
              }
            })}
          {Array(unavailableItemSlots).fill().map((item, i, arr) => {
              let slotClass = 'item-slot';
              let slotText = '';
              if (i > emptyItemSlots) {
                slotClass += ' empty';
                slotText = 'EMPTY';
              } else {
                console.log('slots', prizes['Item Slots'])
                slotClass += ' unavailable';
                slotText = prizes['Item Slots'][props.itemSlots.length + i].cost;
              }
              return (
                <div key={i} id={`${slotClass}-slot-${i+1}`} className={slotClass}>
                  <i className="material-icons">lock</i>
                  <div className="label">{slotText}</div>
                </div>
              );
            })}
          </div>
        </div>
      {/* : */}
      {!props.gameInProgress &&
        <>
          <div id='chickens-container' className={chickensClass}>
            <div id='chickens-button' onPointerDown={props.onClickChickensButton} className={'status-button'}><img alt='' src={chickenPng} />CHICKENS</div>
            <div id='chicken-count'>{chickenCount}</div>
          </div>
          <div><div id='store-button' onPointerDown={props.onClickStoreButton} className={storeClass}><i className='material-icons'>attach_money</i></div></div>
          <div><div id='map-button' onPointerDown={props.onClickMapButton} className={mapClass}><img alt='' src={globeIconPng} /></div></div>
        </>
      }
      {/* } */}
      {props.gameInProgress && <div><div id='stop-button' onClick={props.onClickStopButton} className={stopClass}><i className='material-icons'>stop</i></div></div>}
    </div>
  );
}
function areEqual(prevProps, nextProps) {
  let equalTest =
    prevProps.gameStarted === nextProps.gameStarted &&
    prevProps.gameInProgress === nextProps.gameInProgress &&
    prevProps.storeOpen === nextProps.storeOpen &&
    prevProps.showOpponentCards === nextProps.showOpponentCards &&
    prevProps.powerupSelected === nextProps.powerupSelected &&
    prevProps.mapOn === nextProps.mapOn &&
    prevProps.itemUses === nextProps.itemUses &&
    prevProps.itemSlots === nextProps.itemSlots &&
    prevProps.itemsEquippedCount === nextProps.itemsEquippedCount &&
    prevProps.voiceOn === nextProps.voiceOn
  ;
  return equalTest;
}

export default React.memo(ButtonBar, areEqual);
// export default ButtonBar;