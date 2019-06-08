import React from 'react';
import '../css/ButtonBar.css';

function ButtonBar(props) {
  console.orange('BUttonBar ----------------')
  console.count('ButtonBar');
  let startClass = 'status-button';
  if (props.gameStarted) {
    startClass += ' game-started';
  }
  let resetClass = 'status-button';
  if (props.closing) {
    resetClass += ' closing';
    startClass += ' inactive';
  }
  let voiceClass = 'status-button';
  if (!props.voiceOn) {
    voiceClass += ' inactive';
  }
  let viewClass = 'status-button';
  if (!props.showOpponentCards) {
    viewClass += ' inactive';
  }
  let storeClass = 'status-button';
  if (!props.storeOpen) {
    storeClass += ' inactive';
  } else {
    storeClass += ' store-open';
  }
  if (props.gameStarted || props.gameInProgress) {
    storeClass += ' unavailable';
  }
  return (
    <div id='button-bar'>
      <div><button id='start-button' onPointerDown={props.onClickStartButton} className={startClass}></button></div>
      <div><button id='voice-button' onPointerDown={props.onClickVoiceButton} className={voiceClass}></button></div>
      <div><button id='view-button' onPointerDown={props.onClickViewButton} className={viewClass}></button></div>
      <div><button id='store-button' onPointerDown={props.onClickStoreButton} className={storeClass}><i className='material-icons'>attach_money</i></button></div>
      <div></div>
      <div><button id='error-button' onPointerDown={props.onClickReloadButton} className='status-button'></button><button id='reset-button' onPointerDown={props.onClickResetButton} className={resetClass}></button></div>
    </div>
  );
}
function areEqual(prevProps, nextProps) {
  let equalTest =
    prevProps.gameStarted == nextProps.gameStarted &&
    prevProps.closing == nextProps.closing &&
    prevProps.storeOpen == nextProps.storeOpen &&
    prevProps.showOpponentCards == nextProps.showOpponentCards &&
    prevProps.voiceOn == nextProps.voiceOn
  ;
  return equalTest;
}

export default React.memo(ButtonBar, areEqual);
// export default ButtonBar;