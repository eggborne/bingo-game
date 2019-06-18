import React, { useState, useEffect } from 'react';
import '../css/GameEndModal.css';
import { hotShotsVideo } from '../App.js';

const getSuffix = (num) => {
  if (num === 1) { return 'st' }
  if (num === 2) { return 'nd' }
  if (num === 3) { return 'rd' }
  if (num >= 4) { return 'th' }
}


function GameEndModal(props) {
  console.count('GameEndModal')
  console.info(props)
  const [playingVideo, setPlayingVideo] = useState(false);
  useEffect(() => {
    if (playingVideo) {
      document.getElementById('hot-shots-2').play();
      document.getElementById('hot-shots-2').addEventListener('ended', onVideoEnd, false);
      function onVideoEnd(event) {
        console.log('VIDEO ENDED! ----------------------------------------------')
        setPlayingVideo(false);
        document.getElementById('video-message').classList.add('showing');
      }
    } else {

    }
  }, [playingVideo])
  useEffect(() => {
    if (props.showing) {
      setPlayingVideo(props.recordsBroken);
    }
  }, [props.showing])
  let lost = props.lost;
  let title = 'BINGO!';
  let rank = '';
  let message = `Prize: $${props.prizeMoney}`;
  let agreeLabel = 'OK';
  let modalClass = '';
  let videoClass = '';
  let videoMessage = '';
  let videoMessageClass = '';
  if (!props.showing) {
    modalClass += ' hidden';
  }
  if (props.gameMode.name === 'Ranked' || props.gameMode.name === 'Bonanza') {
    modalClass += ' ranked';
    rank = `${props.rank}${getSuffix(props.rank)} place`;
    if (lost) {
      modalClass += ' lost';
      title = 'GAME OVER';
      rank = ':('
      message = `${props.winnerLimit} of ${props.totalOpponents} players got Bingos.`
    } else if (props.recordsBroken) {
      // modalClass += ' first-place';
      modalClass += ' playing-video';
      videoClass += ' showing';
      videoMessage = 'NEW RECORD!';
      rank = props.recordsBroken.type + ': ' + props.recordsBroken.value;
    } else if (props.rank === 1) {
      modalClass += ' first-place';
      // videoClass += ' showing';
      // videoMessage = 'FIRST PLACE!';
      rank += '!';
    } else if (props.rank === 2) {
      modalClass += ' second-place';
    } else if (props.rank === 3) {
      modalClass += ' third-place';
    }
  }

  if (props.gameMode.name === 'Limited Balls') {
    modalClass += ' limited-balls';
    title = 'Round Over';
    rank = `${props.currentBingos.length} BINGOS`;
    message = `Prize: $${props.prizeMoney}`
  }
  return (
    <div id='game-end-modal' className={modalClass}>
      {props.showing &&
        <>

          <div id='video-message' className={videoMessageClass}>{videoMessage}</div>
          {!playingVideo &&
            <>
              {!props.recordsBroken && <div id='game-end-title'>{title}</div>}
          <div style={{ fontSize: `${props.recordsBroken ? 'var(--font-size)' : 'initial'}` }} id='game-end-rank'>{rank}</div>
              <div id='game-end-message'>{message}</div>
              <div id='button-area'>
                <button id='agree-button' onPointerDown={props.onClickOkayButton} className='modal-button'>{agreeLabel}</button>
                {/* <button id='visit-store-button' onPointerDown={props.onClickVisitStoreButton} className='modal-button'>VISIT STORE</button> */}
              </div>
            </>
          }
          <video id='hot-shots-2' className={videoClass}>
            <source src={hotShotsVideo} type='video/webm' />
            <div>cocks</div>
          </video>
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
