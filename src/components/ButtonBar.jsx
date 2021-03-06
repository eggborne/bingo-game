import React from 'react';
import '../css/ButtonBar.css';
import { chipImages } from '../App.js';
import { permanentItems } from './StoreScreen';
let chickenPng = require('../assets/chickenstand.png');
let chickenIconPng = require('../assets/aviaryicon.png');
let cardOptionsIconPng = require('../assets/cardsicon.png');
let blueChickenPng = require('../assets/chickenstandblue.png');
let orangeChickenPng = require('../assets/chickenstandorange.png')
let globeIconPng = require('../assets/globeicon.png');

function ButtonBar(props) {
  let chickenCount = props.chickenCount;
  let startClass = 'status-button';
  let stopClass = 'status-button floating-button';
  let chickensClass = '';
  if (props.gameStarted) {
    startClass += ' game-started';
  } else {
    stopClass += ' showing';
    if (!props.gameInProgress) {
      startClass += ' inactive throbbing';
    }
  }
  let aviaryClass = 'status-button floating-button';
  let markerClass = 'status-button floating-button';
  let cardOptionsClass = 'status-button floating-button';
  let storeClass = 'status-button floating-button';
  let mapClass = 'status-button floating-button';
  if (!props.aviaryOn) {
    aviaryClass += ' inactive';
  } else {
    aviaryClass += ' aviary-on';
    storeClass += ' obscured';
    mapClass += ' obscured';
    cardOptionsClass += ' obscured';
    markerClass += ' obscured';
  }
  if (!props.storeOpen) {
    storeClass += ' inactive';
  } else {
    storeClass += ' store-open';
    mapClass += ' obscured';
    aviaryClass += ' obscured';
    cardOptionsClass += ' obscured';
    markerClass += ' obscured';
  }
  if (props.mapOn) {
    mapClass += ' map-on';
    aviaryClass += ' obscured';
    storeClass += ' obscured';
    cardOptionsClass += ' obscured';
    markerClass += ' obscured';
  }
  if (props.markerOptionsOn) {    
    markerClass += ' marker-options-on';
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
  if (props.cardOptionsOn) {
    cardOptionsClass += ' card-options-on';
  }
  let unavailableItemSlots = 2 -props.itemSlots.filter(slot => slot.item).length;
  let emptyItemSlots = props.itemSlots.filter(slot => slot.item && slot.item.hasOwnProperty('id') && slot.item.id === -1).length;
  return (
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
              if (slot.item && slot.item.hasOwnProperty('id') && slot.item.id > -1) {
                let filledRatio = (slot.item.uses / slot.item.totalUses);
                let meterColor = 'green';
                if (filledRatio < 0.5) {
                  meterColor = 'yellow';
                }
                return (
                  <div key={slot.item.id} onPointerDown={props.gameStarted ? () => props.onClickPowerup(slot.item) : undefined} id={`item-slot-${i + 1}`} className={props.powerupSelected && props.powerupSelected.id === slot.item.id ? 'item-slot selected' : 'item-slot'}>
                    <div style={{ backgroundColor: meterColor, transform: `scaleY(${filledRatio})`}} className='meter'></div>
                    <img src={require(`../assets/${slot.item.imgSrc}`)} />
                    {slot.item.totalUses > 1 && <div className='quantity-label'>{slot.item.uses}</div>}
                  </div>
                );
              } else {
                if (slot.item) {
                  return (
                    <div key={i} id={`empty-slot-${i + 1}`} className={'item-slot empty'}>
                      <div className="label">EMPTY</div>
                    </div>
                  );

                } else {
                  let slotClass = 'item-slot';
                  let slotText = '';
                  slotClass += ' unavailable';
                  slotText = permanentItems['Item Slots'][i].cost;
                  return (
                    <div key={i} id={`${slotClass}-slot-${i+1}`} className={slotClass}>
                      <i className="material-icons">lock</i>
                      <div className="label">{slotText}</div>
                    </div>
                  );
                }
              }
            })}
          </div>
        </div>
        <div id='chickens-area' onPointerDown={!props.gameInProgress ? props.onClickAviaryButton : undefined} className={props.gameStarted ? 'powerup-area' : 'powerup-area game-paused'}>
          <div id='chicken-slots' className='slot-area'>
              <div className='item-slot-label'>CHICKENS</div>
              {props.chickenSlots.map((slot, i) => {
                if (slot.chickenId !== -1) {
                  let chickenData = props.chickens[slot.chickenId];
                  let chickenClass = 'item-slot';
                  if (chickenData.ready) {
                    chickenClass += ' ready';
                  }
                  if (chickenData.activated) {
                    chickenClass += ' activated';
                  }
                  let clickable = chickenData.ready
                  let meterHeight = chickenData.meter / chickenData.rechargeTime || 0;
                  if (chickenData.activated) {
                    meterHeight = 1 - ((chickenData.effectDuration - chickenData.meter) / chickenData.effectDuration);
                  } else {
                    if (props.powerupSelected && props.powerupSelected.displayName === 'Energy Drink') {
                      chickenClass += ' selectable';
                      clickable = true;
                    }
                  }
                  let clickEffect = () => null;
                  if (clickable) {
                    clickEffect = chickenData.ready ? () => props.onActivateChicken(chickenData.chickenId) : () => props.onFillChicken(chickenData.chickenId);
                  }
                  return (
                    <div onPointerDown={clickable ? clickEffect : undefined} key={i} className={chickenClass} >
                      <div style={{transform: `scaleY(${meterHeight})`}} className='meter'></div>
                      <img src={chickenData.color === 'blue' ? blueChickenPng : orangeChickenPng} />
                      <div className='chicken-label'>{chickenData.name.toUpperCase()}</div>
                    </div>
                  );
                } else {
                  return (
                    <div key={i} className='item-slot empty'>
                      <img src={chickenPng} />
                      <div className='chicken-label'>EMPTY</div>
                    </div>
                  );
                }
            })}
          </div>
        </div>
      </div>
      {props.gameInProgress ?
        <div id='stop-button' onClick={props.onClickStopButton} className={stopClass}><i className='material-icons'>stop</i></div>
        :
        <>
          <div id='store-button' onPointerDown={props.onClickStoreButton} className={storeClass}><i className='material-icons'>attach_money</i></div>
          <div id='aviary-button' onPointerDown={props.onClickAviaryButton} className={aviaryClass}><img id='aviary-icon' src={chickenIconPng} />
            <div id='chickens-count'>{props.chickenCount}</div>
          </div>
          <div id='marker-button' onPointerDown={props.onClickChangeMarker} className={markerClass}><img id='marker-button-image' src={chipImages[props.chipImage]} />
            MARKER
          </div>
          <div id='card-options-button' onPointerDown={props.onClickCardOptionsButton} className={cardOptionsClass}><img id='card-options-icon' src={cardOptionsIconPng} />
            CARDS
          </div>
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
    prevProps.cardOptionsOn === nextProps.cardOptionsOn &&
    prevProps.aviaryOn === nextProps.aviaryOn &&
    prevProps.showOpponentCards === nextProps.showOpponentCards &&
    prevProps.powerupSelected === nextProps.powerupSelected &&
    prevProps.mapOn === nextProps.mapOn &&
    prevProps.itemSlots === nextProps.itemSlots &&
    prevProps.itemQuantities === nextProps.itemQuantities &&
    prevProps.activatedChickens === nextProps.activatedChickens &&
    prevProps.chickenSlots === nextProps.chickenSlots &&
    prevProps.chickensEquippedCount === nextProps.chickensEquippedCount &&
    prevProps.chickenSlotIndexes === nextProps.chickenSlotIndexes &&
    prevProps.itemsEquippedCount === nextProps.itemsEquippedCount &&
    prevProps.itemsFullCount === nextProps.itemsFullCount &&
    prevProps.voiceOn === nextProps.voiceOn
  ;
  return equalTest;
}
export default React.memo(ButtonBar, areEqual);
// export default ButtonBar;