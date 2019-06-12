import React from 'react';
import '../css/ButtonBar.css';
let globeIconPng = require('../assets/globeicon.png');
let chickenPng = require('../assets/chicken.png');

function ButtonBar(props) {
  console.orange('ButtonBar ----------------')
  console.count('ButtonBar');
  // let chickenCount = props.chickenCount;
  let chickenCount = 'RESET';
  let startClass = 'status-button';
  let stopClass = 'status-button';
  let mapClass = 'status-button';
  let chickensClass = '';
  if (props.gameStarted) {
    startClass += ' game-started';
    stopClass += ' game-paused'
  } else {
    if (!props.gameInProgress) {
      stopClass += ' unavailable';
      startClass += ' inactive';
    }
  }
  let resetClass = 'status-button closing';
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
  if (props.gameInProgress && !props.gameStarted) {

  }
  return (
    <div id='button-bar' className={props.gameStarted || props.gameInProgress ? 'game-started' : ''}>
      <div><button id='start-button' onPointerDown={props.onClickStartButton} className={startClass}><i className='material-icons'>
        {props.gameStarted ? 'pause' : 'play_arrow'}</i></button></div>
      <div><button id='stop-button' onPointerDown={props.onClickStopButton} className={stopClass}><i className='material-icons'>stop</i></button></div>
      <div><button id='voice-button' onPointerDown={props.onClickVoiceButton} className={voiceClass}></button></div>
      {props.gameStarted || props.gameInProgress ?
        <>
          <div id='powerup-area'>

          </div>
        </>
        :
        <>
          <div><button id='store-button' onPointerDown={props.onClickStoreButton} className={storeClass}><i className='material-icons'>attach_money</i></button></div>
          <div><button id='map-button' onPointerDown={props.onClickMapButton} className={mapClass}><img alt='' src={globeIconPng} /></button></div>
          <div id='chickens-container' className={chickensClass}>
            <button id='chickens-button' onPointerDown={props.onClickChickensButton} className={'status-button'}><img alt='' src={chickenPng} /></button>
            <div id='chicken-count'>{chickenCount}</div>
          </div>
        </>
      }
    </div>
  );
}
function areEqual(prevProps, nextProps) {
  let equalTest =
    prevProps.gameStarted == nextProps.gameStarted &&
    prevProps.gameInProgress == nextProps.gameInProgress &&
    prevProps.closing == nextProps.closing &&
    prevProps.storeOpen == nextProps.storeOpen &&
    prevProps.showOpponentCards == nextProps.showOpponentCards &&
    prevProps.mapOn == nextProps.mapOn &&
    prevProps.queueLength > 0 && nextProps.queueLength > 0 &&
    prevProps.voiceOn == nextProps.voiceOn
  ;
  return equalTest;
}

export default React.memo(ButtonBar, areEqual);
// export default ButtonBar;