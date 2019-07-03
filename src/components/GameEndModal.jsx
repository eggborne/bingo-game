import React, { useState, useEffect } from 'react';
import '../css/GameEndModal.css';
import { hotShotsVideo, experienceLevels } from '../App.js';
import ExperienceBar from './ExperienceBar';
let blueChickenPng = require('../assets/chickenstandblue.png');

const getSuffix = (num) => {
  if (num === 1) { return 'st' }
  if (num === 2) { return 'nd' }
  if (num === 3) { return 'rd' }
  if (num >= 4) { return 'th' }
}

const bonusAmounts = {
  'First Bingo': 250,
  'Letter X': 500,
  'No Bees': 300
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
  }, [props.showing]);
  let lost = props.lost;
  let title = 'ROUND OVER';
  let subTitle = '';
  let prizeMessage = `Prize: $${props.prizeMoney}`;
  let agreeLabel = 'OK';
  let modalClass = '';
  let videoClass = '';
  let videoMessage = '';
  let videoMessageClass = '';
  let totalPrize = 0;
  // props.roundResults.cards.map(card => {
  //   totalPrize += card.currentPrize;
  // })
  // totalPrize += props.roundResults.speedBonus;
  totalPrize = props.roundResults.totalPrize;
  if (!props.showing) {
    modalClass += ' hidden';
  }
  if (props.gameMode.name === 'Bonanza') {
    modalClass += ' bonanza';
    title = 'ROUND OVER';
    subTitle = `You got ${props.currentBingos} Bingos`;
    prizeMessage = `Total Prize: $${totalPrize}`
  }
  if (props.gameMode.name === 'Ranked') {
    modalClass += ' ranked';
    let rankEarned = `${props.rank}${getSuffix(props.rank)} place`;
    if (lost) {
      modalClass += ' lost';
      title = 'ROUND OVER';
      subTitle = ':('
      prizeMessage = `${props.winnerLimit} of ${props.totalOpponents} players got Bingos.`
    } else if (props.recordsBroken) {
      // modalClass += ' first-place';
      modalClass += ' playing-video';
      videoClass += ' showing';
      videoMessage = 'NEW RECORD!';
      subTitle = props.recordsBroken.type + ': ' + props.recordsBroken.value;
    } else if (props.rank === 1) {
      rankEarned += '!';
    } else if (props.rank === 2) {
      modalClass += ' second-place';
    } else if (props.rank === 3) {
      modalClass += ' third-place';
    }
    subTitle = <div>You outranked <span style={{ fontSize: 'calc(var(--header-height) / 1.5)' }}>{props.totalOpponents}</span> opponents.</div>;
    title = rankEarned;
  }

  if (props.gameMode.name === 'Countdown') {
    modalClass += ' countdown';
    title = 'Round Over';
    subTitle = `${props.currentBingos} BINGOS`;
    prizeMessage = `Prize: $${totalPrize}`
  }
  if (props.gameMode.name === 'Classic') {
    modalClass += ' classic';
  }
  let daubBonus = props.roundResults.speedBonus;
  let daubSpeedSeconds = (props.roundResults.averageDaubSpeed / 1000).toPrecision(2);
  if (daubSpeedSeconds.split('.')[1] === '0') {
    daubSpeedSeconds = daubSpeedSeconds.split('.')[0];
  }
  console.error('props.equippedChickens', props.equippedChickens)
  return (
    <div id='game-end-modal' className={modalClass}>
      {props.showing &&
        <>
          <div id='video-message' className={videoMessageClass}>{videoMessage}</div>
          {!playingVideo &&
            <>
              {!props.recordsBroken && <div id='game-end-title'>{title}</div>}
              {/* <div style={{ fontSize: `${props.recordsBroken ? 'var(--font-size)' : 'initial'}` }} id='game-end-rank'>{subTitle}</div> */}

              <div className='game-end-message'>
                <div id='results-grid'>
              {props.roundResults.cards.map((card, i) =>
                    <>
                    <div className='card-label'>CARD {i + 1}</div>
                    <div key={card.cardIndex} className='card-analysis'>
                      <div className='analysis-row card-bingos'>
                        <div>Bingos: <span style={{color: 'yellow', fontSize: 'calc(var(--font-size) / 1.25)'}}>{card.bingoCount}</span></div>
                        <div><span style={{ color: 'var(--money-green', fontSize: 'calc(var(--font-size) / 1.25)' }}>${card.currentPrize}</span></div>
                      </div>
                      {card.bonuses.sort((a, b) => bonusAmounts[b] - bonusAmounts[a]).map(bonus =>
                        <>
                          <div className='analysis-row card-bonuses'>
                            <div>{bonus}</div>
                            <div><span style={{ color: 'var(--money-green', fontSize: 'calc(var(--font-size) / 1.5)' }}>${bonusAmounts[bonus] * props.totalOpponents}</span></div>
                          </div>
                        </>
                      )}
                    </div>
                    </>
                  )}
                </div>
              </div>
              <div id='bonuses' className='game-end-message'>
                <div id='speed-results'>
                  <div><small>Average Daub Speed</small><br />{daubSpeedSeconds} seconds</div>
                  <div id='daub-bonus'>Daub Speed Bonus: <span style={{color: 'var(--money-green)'}}>${daubBonus}</span></div>
                </div>
              {props.equippedChickens.map(chicken => {
                let newExperience = chicken.experience + props.chickenExperiencePrizes[chicken.chickenId];
                return (
                  <div className='chicken-exp-display' key={chicken.chickenId}>
                    <img src={blueChickenPng} />
                    <div>{chicken.name} gained &nbsp;{props.chickenExperiencePrizes[chicken.chickenId]}&nbsp; experience!</div>
                    <ExperienceBar maxLength={experienceLevels[chicken.level]} currentExperience={newExperience} currentLevel={chicken.level} toNextLevel={experienceLevels[chicken.level] - newExperience} />
                  </div>)
                  ;
              })}
              </div>
              <div id='button-area'>
                <div id='prize-display' className='game-end-message'>{prizeMessage}</div>
                <button id='agree-button' onPointerDown={props.onClickOkayButton} className='modal-button'>{agreeLabel}</button>
                {/* <button id='visit-store-button' onPointerDown={props.onClickVisitStoreButton} className='modal-button'>VISIT STORE</button> */}
              </div>
            </>
          }
          <video id='hot-shots-2' className={videoClass}>
            <source src={hotShotsVideo} type='video/webm' />
            <div></div>
          </video>
        </>
      }
    </div>
  );
}
function areEqual(prevProps, nextProps) {
    return prevProps.showing === nextProps.showing
    && prevProps.roundResults === nextProps.roundResults
    && prevProps.lost === nextProps.lost;
}

export default React.memo(GameEndModal, areEqual);
// export default GameEndModal;
