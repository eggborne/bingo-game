import React, { useState, useEffect } from 'react';
import '../css/PreGameModal.css';

function PreGameModal(props) {
  console.count('PreGameModal');
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (props.showing) {
      setTimeout(() => {
        setReady(true);
      }, 200);
    } else {
      setReady(false);
    }
  }, [props.showing]);
  let modalClass = '';
  let buttonsClass = '';
  if (!props.showing) {
    modalClass += ' hidden';
  } else {
    if (!ready) {
      buttonsClass = 'unavailable';
    }
  }
  let opponentCount = props.opponentCount;
  let gameName = props.gameMode.name;
  let stat1Name = '';
  let stat1Value = '';
  let stat2Name = '';
  let stat2Value = '';
  if (gameName === 'Limited Balls') {
    opponentCount = 0;
    modalClass += ' limited-balls';
    stat1Name = 'Number of balls:'
    stat1Value = props.ballLimit;
  } else if (gameName === 'Ranked') {
    modalClass += ' ranked';
    stat1Name = 'Places awarded:'
    stat1Value = props.winnerLimit;
  } else if (gameName === 'Classic') {
    modalClass += ' classic';
    stat1Name = 'Winning Pattern:'
    stat1Value = props.winPattern;
  } else if (gameName === 'Lightning') {
    opponentCount = 0;
    modalClass += ' lightning';
    stat1Name = 'Time limit:'
    stat1Value = props.timeLimit;
  } else if (gameName === 'Standoff') {
    modalClass += ' standoff';
    stat1Name = 'Places awarded:'
    stat1Value = props.winnerLimit;
  } else if (gameName === 'Danger Zones') {
    modalClass += ' danger-zones';
  }
  return (
    <div id='pre-game-modal' className={modalClass}>
      {props.showing &&
        <>
          <header>NEW GAME</header>
          <div id='pre-game-body'>
            <div id='pre-game-mode'>
              <div>{gameName}</div>
              {/* <small>Game mode:</small> */}
              <div><div onPointerDown={() => props.onClickChangeMode('previous')}>{'<'}</div><div onPointerDown={() => props.onClickChangeMode('next')}>{'>'}</div></div>
            </div>
            <div id='pre-game-description'>
              <small>Opponents:</small>
              <div>{opponentCount}</div>
              <div>
                <small>{stat1Name}</small>
                <div>{stat1Value}</div>
              </div>

            </div>
          </div>
          <div id='button-area' className={buttonsClass}>
            <button id='begin-button' onPointerDown={props.onClickBeginGame} className='modal-button'>START</button>
            <button id='cancel-button' onPointerDown={props.onClickCancelButton} className='modal-button'>NEVER MIND</button>
          </div>
        </>
      }
    </div>
  );
}
function areEqual(prevProps, nextProps) {
  return (
    prevProps.winnerLimit === nextProps.winnerLimit &&
    prevProps.ballLimit === nextProps.ballLimit &&
    prevProps.showing === nextProps.showing &&
    prevProps.gameMode.name === nextProps.gameMode.name &&
    prevProps.opponentCount === nextProps.opponentCount
  );
}

export default React.memo(PreGameModal, areEqual);
// export default PreGameModal;
