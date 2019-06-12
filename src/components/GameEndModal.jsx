import React from 'react';
import '../css/GameEndModal.css';

const getSuffix = (num) => {
  if (num === 1) { return 'st' }
  if (num === 2) { return 'nd' }
  if (num === 3) { return 'rd' }
  if (num >= 4) { return 'th' }
}

function GameEndModal(props) {
  console.count('GameEndModal')
  let lost = props.lost;
  let title = 'BINGO!';
  let rank = '';
  let message = `Prize: $${props.prizeMoney}`;
  let agreeLabel = 'OKAY';
  let modalClass = 'status-button';
  if (!props.showing) {
    modalClass += ' hidden';
  }
  if (props.gameMode.name === 'Ranked') {
    modalClass += ' ranked';
    rank = `${props.rank}${getSuffix(props.rank)} place`;
    if (lost) {
      modalClass += ' lost';
      title = 'GAME OVER';
      rank = ':('
      message = `${props.winnerLimit} of ${props.totalOpponents} players got Bingos.`
    } else if (props.rank === 1) {
      modalClass += ' first-place';
      rank += '!';
    } else if (props.rank === 2) {
      modalClass += ' second-place';
    } else if (props.rank === 3) {
      modalClass += ' third-place';
    }
  }
  if (props.gameMode.name === 'Limited Balls') {
    modalClass += ' limited-balls';
    title = 'Results';
    rank = `${props.currentBingos.length} BINGOS`;
  }
  return (
    <div id='game-end-modal' className={modalClass}>
      {props.showing &&
        <>
          <div id='game-end-title'>{title}</div>
          <div id='game-end-rank'>{rank}</div>
          <div id='game-end-message'>{message}</div>
          <div id='button-area'>
            <button id='agree-button' onPointerDown={props.onClickOkayButton} className='modal-button'>{agreeLabel}</button>
            {/* <button id='visit-store-button' onPointerDown={props.onClickVisitStoreButton} className='modal-button'>VISIT STORE</button> */}
          </div>
        </>
      }
    </div>
  );
}
function areEqual(prevProps, nextProps) {
  return prevProps.message === nextProps.message && prevProps.showing === nextProps.showing;
}

export default React.memo(GameEndModal, areEqual);
// export default GameEndModal;
