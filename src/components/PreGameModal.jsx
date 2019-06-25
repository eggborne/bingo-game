import React, { useState, useEffect } from 'react';
import { winPatterns } from '../App';
import '../css/PreGameModal.css';

function PreGameModal(props) {
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
  let patternName = Object.keys(winPatterns)[Object.values(winPatterns).indexOf(props.winPattern)];
  if (gameName === 'Countdown') {
    opponentCount = 0;
    modalClass += ' countdown';
    stat1Name = 'Balls'
    stat1Value = props.ballLimit;
  } else if (gameName === 'Ranked') {
    modalClass += ' ranked';
    stat1Name = 'Places'
    stat1Value = props.winnerLimit;
  } else if (gameName === 'Bonanza') {
    modalClass += ' bonanza';
    stat1Name = 'Bingos'
    stat1Value = props.bingoLimit;
  } else if (gameName === 'Bonanza') {
    modalClass += ' ranked';
    stat1Name = 'Places'
    stat1Value = props.winnerLimit;
  } else if (gameName === 'Classic') {
    modalClass += ' classic';
    stat1Name = 'Pattern'
    stat1Value = patternName;
  } else if (gameName === 'Lightning') {
    opponentCount = 0;
    modalClass += ' lightning';
    stat1Name = 'Time limit'
    stat1Value = props.timeLimit;
  } else if (gameName === 'Standoff') {
    modalClass += ' standoff';
    stat1Name = 'Places'
    stat1Value = props.winnerLimit;
  } else if (gameName === 'Danger Zones') {
    modalClass += ' danger-zones';
  }
  let modeFontSize = '6vmin';
  let portrait = (window.innerWidth < window.innerHeight);
  if (portrait) {
    modeFontSize = '5.5vmin';
  }
  return (
    <div id='pre-game-modal' className={modalClass}>
      {props.showing &&
        <>
          <header>NEW GAME</header>
          {/* <div id='pre-game-body'> */}
            <div id='pre-game-mode'>
              <div id='mode-arrows'>
                <div className='mode-arrow' onPointerDown={() => props.onClickChangeMode('previous')}>{'<'}</div>
              {portrait ?
                <small>Mode</small>
                :
                <div id='mode-name' style={{ fontSize: modeFontSize }}>{gameName}</div>
              }
                <div  className='mode-arrow' onPointerDown={() => props.onClickChangeMode('next')}>{'>'}</div>
              </div>
                {portrait && <div id='mode-name' style={{ fontSize: modeFontSize }}>{gameName}</div>}
              <div id='pre-game-rules'>
                <small>Object:</small><div>{props.gameMode.description.object}</div>
                <small>Game Ends:</small><div>{props.gameMode.description.gameEnds}</div>
              </div>
            </div>
          {props.gameMode.name === 'Countdown' ?
            <div id='pre-game-description'>
              <div>
                <small>{stat1Name}</small>
                <div>{stat1Value}</div>
              </div>
              <div>
                <small>Pattern</small>
                <div className='pattern-display'>{patternName}</div>
              </div>
            </div>
            :
          <div id='pre-game-description'>
            <div>
              <small>Opponents</small>
              <div>{opponentCount}</div>
            </div>
            <div>
              <small>{stat1Name}</small>
              <div className={gameName === 'Classic' ? 'pattern-display' : ''}>{stat1Value}</div>
            </div>
          </div>
          }
          {/* </div> */}
          {/* <div id='button-area' className={buttonsClass}> */}
            <div id='pre-game-stats'>
              {props.loggedIn && props.stats[props.gameMode.name] && Object.values(props.stats[props.gameMode.name]).map((stat, i) => {
                let recordName = Object.keys(props.stats[props.gameMode.name])[i];
                return (
                  <div key={i} className='stat-row'>
                    <div>{recordName}</div>
                    <div>{stat + ((recordName === 'Quickest Bingo') && ' balls')}</div>
                  </div>
                );
              })}
              {!props.loggedIn &&
                <div id='log-in-nagger'><a style={{textDecoration: 'underline', fontSize: 'var(--font-size)'}}onClick={props.onClickLoginButton}>LOG IN</a><br />to save your stats and progress!</div>
              }
            </div>
            <div id='pre-game-buttons'>
              <button id='begin-button' onPointerDown={props.onClickBeginGame} className={`modal-button${(!props.gameMode.unlocked) ? ' disabled' : ''}`}>START</button>
              <button id='cancel-button' onPointerDown={props.onClickCancelButton} className='modal-button'>NEVER MIND</button>
            </div>
          {/* </div> */}
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
