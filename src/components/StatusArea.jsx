import React from 'react';
import '../css/StatusArea.css';

function StatusArea(props) {
  let startClass = 'status-button';
  if (props.gameStarted) {
    startClass += ' game-started';
  }
  return (
    <div id='status-area'>
      <button id='start-button' onTouchStart={props.onClickStartButton} className={startClass}></button>
      {/* <button onTouchStart={props.onClickResetButton} className='status-button'>VOICE</button> */}
      <button id='error-button' onTouchStart={() => window.location.reload()} className='status-button'></button>
      <button id='reset-button' onTouchStart={props.onClickResetButton} className='status-button'>RESET</button>
    </div>
  );
}

export default StatusArea;