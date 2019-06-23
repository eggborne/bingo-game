import React from 'react';
import '../css/ButtonBar.css';
import { permanentItems } from './StoreScreen';
let chickenPng = require('../assets/chickenstand.png');
let blueChickenPng = require('../assets/chickenstandblue.png');
let globeIconPng = require('../assets/globeicon.png');

function ButtonBar(props) {
  console.orange('ButtonBar ----------------')
  console.log(props);
  let chickenCount = props.chickenCount;
  // let chickenCount = 'RESET';
  let startClass = 'status-button';
  let stopClass = 'status-button floating-button';
  let mapClass = 'status-button floating-button';
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
  let storeClass = 'status-button floating-button';
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
    if (!props.gameStarted && props.gameInProgress) {
      barClass += ' game-paused';
    }
  }
  let unavailableItemSlots = 2 - props.itemSlots.length;
  let emptyItemSlots = 2 - props.itemSlots.filter(slot => slot.item).length;
  console.log('empty?', emptyItemSlots)
  console.log('unavailable?', unavailableItemSlots)
  console.log('itemsFullCount?', props.itemsFullCount)
  return (
    // <div id='button-bar' className={props.gameStarted || props.gameInProgress ? 'game-started' : ''}>
    <>
    <div id='button-bar' className={barClass}>
      <div>
        <div id='start-button' onPointerDown={props.onClickStartButton} className={startClass}><i className='material-icons'>
          {props.gameStarted ? 'pause' : 'play_arrow'}</i>
        </div>
      </div>
      <div id='items-area' onPointerDown={!props.gameInProgress ? props.onClickStoreButton : undefined} className={props.gameStarted ? 'powerup-area' : 'powerup-area game-paused'}>
        <div id='item-slots' className='slot-area'>
          <div className='item-slot-label'>ITEMS</div>
          {props.itemSlots.map((slot, i) => {
            console.info(slot, 'itemSlot', i);
            if (slot.item) {
              let filledRatio = (slot.item.uses / slot.item.totalUses);
              let meterColor = 'green';
              if (filledRatio < 0.5) {
                meterColor = 'yellow';
              }
              return (
                <div key={slot.item.description} onPointerDown={props.gameStarted ? () => props.onClickPowerup(slot.item) : undefined} id={`item-slot-${i + 1}`} className={props.powerupSelected && props.powerupSelected.description === slot.item.description ? 'item-slot selected' : 'item-slot'}>
                  <div style={{ backgroundColor: meterColor, transform: `scaleY(${filledRatio})`}} className='meter'></div>
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
              console.log('slots', permanentItems['Item Slots'])
              slotClass += ' unavailable';
              slotText = permanentItems['Item Slots'][props.itemSlots.length + i].cost;
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
      <div id='chickens-area' onPointerDown={!props.gameInProgress ? props.onClickStoreButton : undefined} className={props.gameStarted ? 'powerup-area' : 'powerup-area game-paused'}>
        <div id='chicken-slots' className='slot-area'>
          <div className='item-slot-label'>CHICKENS</div>
          {props.chickenSlots.map((slot, i) => {
            console.log('doing chicken from slot?', slot)
            if (slot.chickenId !== -1) {
              let chickenData = props.chickens[slot.chickenId];
              console.info('chickenData', i, chickenData);
              return (
                <div key={i} className='item-slot'>
                  <div className='meter'></div>
                  <img src={blueChickenPng} />
                  <div className='chicken-label'>{chickenData.name.toUpperCase()}</div>
                </div>
              );
            } else {
              return (
                <div key={i}className='item-slot empty'>
                  <img src={chickenPng} />
                  <div className='chicken-label'>EMPTY</div>
                </div>
              );
            }
          })}
          {/* {props.chickens.map((chickenData, i) => {
            console.info('chickenData', i, chickenData);
            return (
              <div key={i}className='item-slot'>
                <img src={blueChickenPng} />
                <div className='chicken-label'>{chickenData.name.toUpperCase()}</div>
              </div>
            );
          })} */}
        </div>
      </div>
    </div>

    {props.gameInProgress ?
        <div id='stop-button' onClick={props.onClickStopButton} className={stopClass}><i className='material-icons'>stop</i></div>
        :
        <>
        {/* <div id='chickens-container' className={chickensClass}>
          <div id='chickens-button' onPointerDown={props.onClickChickensButton} className={'status-button'}><img alt='' src={chickenPng} />CHICKENS</div>
          <div id='chicken-count'>{chickenCount}</div>
        </div> */}
        <div id='store-button' onPointerDown={props.onClickStoreButton} className={storeClass}><i className='material-icons'>attach_money</i></div>
        <div id='map-button' onPointerDown={props.onClickMapButton} className={mapClass}><img alt='' src={globeIconPng} /></div>
      </>
    }
    </>
  );
}
function areEqual(prevProps, nextProps) {
  let equalTest =
    prevProps.gameStarted === nextProps.gameStarted &&
    prevProps.gameInProgress === nextProps.gameInProgress &&
    prevProps.gameEnded === nextProps.gameEnded &&
    prevProps.storeOpen === nextProps.storeOpen &&
    prevProps.showOpponentCards === nextProps.showOpponentCards &&
    prevProps.powerupSelected === nextProps.powerupSelected &&
    prevProps.mapOn === nextProps.mapOn &&
    prevProps.itemSlots === nextProps.itemSlots &&
    prevProps.itemsEquippedCount === nextProps.itemsEquippedCount &&
    prevProps.itemsFullCount === nextProps.itemsFullCount &&
    prevProps.voiceOn === nextProps.voiceOn
  ;
  // console.orange('equal?', equalTest)
  // console.orange('prevProps.gameStarted === nextProps.gameStarted?', prevProps.gameStarted === nextProps.gameStarted)
  // console.orange('prevProps.gameInProgress === nextProps.gameInProgress?', prevProps.gameInProgress === nextProps.gameInProgress)
  // console.orange('prevProps.gameEnded === nextProps.gameEnded?', prevProps.gameEnded === nextProps.gameEnded)
  // console.orange('prevProps.storeOpen === nextProps.storeOpen?', prevProps.storeOpen === nextProps.storeOpen)
  // console.orange('prevProps.showOpponentCards === nextProps.showOpponentCards?', prevProps.showOpponentCards === nextProps.showOpponentCards)
  // console.orange('prevProps.powerupSelected === nextProps.powerupSelected?', prevProps.powerupSelected === nextProps.powerupSelected)
  // console.orange('prevProps.mapOn === nextProps.mapOn?', prevProps.mapOn === nextProps.mapOn)
  // console.orange('prevProps.itemSlots === nextProps.itemSlots?', prevProps.itemSlots === nextProps.itemSlots)
  // console.orange('prevProps.itemsEquippedCount === nextProps.itemsEquippedCount?', prevProps.itemsEquippedCount === nextProps.itemsEquippedCount)
  return equalTest;
}
export default React.memo(ButtonBar, areEqual);
// export default ButtonBar;