import React from 'react';
import '../css/ButtonBar.css';

function ButtonBar(props) {
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
  return (
    <div id='button-bar'>
      <div><button id='start-button' onPointerDown={props.onClickStartButton} className={startClass}></button></div>
      <div><button id='voice-button' onPointerDown={props.onClickVoiceButton} className={voiceClass}></button></div>
      <div><button id='view-button' onPointerDown={props.onClickViewButton} className={viewClass}></button></div>
      <div><button id='error-button' onPointerDown={props.onClickReloadButton} className='status-button'></button></div>
      <div><button id='reset-button' onPointerDown={props.onClickResetButton} className={resetClass}></button></div>
    </div>
  );
}

export default ButtonBar;