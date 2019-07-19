import React, { useState, useEffect } from 'react';
import '../css/GameEndModal.css';
import { hotShotsVideo, bonusAmounts, experienceLevels } from '../App.js';
import ExperienceBar from './ExperienceBar';
import NewRecordModal from './NewRecordModal';
let blueChickenPng = require('../assets/chickenstandblue.png');
let orangeChickenPng = require('../assets/chickenstandorange.png')

const getSuffix = (num) => {
  if (num === 1) { return 'st' }
  if (num === 2) { return 'nd' }
  if (num === 3) { return 'rd' }
  if (num >= 4) { return 'th' }
}

function GameEndModal(props) {
  const [showingRecordsModal, setShowingRecordsModal] = useState(false);
  const [conserveHeight, setConserveHeight] = useState(false);
  useEffect(() => {
    if (props.recordsBroken) {
     setShowingRecordsModal(true);
    }
  }, [])
  useEffect(() => {
    if (props.userCardCount > 2) {
      setConserveHeight(true);
    }
  }, [props.userCardCount]);
  let lost = props.lost;
  let title = 'ROUND OVER';
  let subTitle = '';
  let prizeMessage = `Prize: $${props.prizeMoney}`;
  let agreeLabel = 'OK';
  let modalClass = '';
  let resultsGridClass = conserveHeight ? 'conserve-height' : '';
  let videoClass = '';
  let totalPrize = props.roundResults.totalPrize;
  if (!props.showing) {
    modalClass += ' hidden';
  }
  if (props.gameMode.name === 'Bonanza') {
    modalClass += ' bonanza';
    title = 'ROUND OVER';
    subTitle = `You got ${props.currentBingos} Bingos`;
    prizeMessage = `Total Prize: $${totalPrize}`;
    if (showingRecordsModal) {
     modalClass += ' records-broken';
    }
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
      modalClass += ' records-broken';
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
  return (
    <div id='game-end-modal' className={modalClass}>
      {props.showing &&
        <>
        {showingRecordsModal && <NewRecordModal
          // showing={gameEnded}
          recordsBroken={props.recordsBroken}
          onClickOkayButton={() => setShowingRecordsModal(false)}
        />}
              {!props.recordsBroken && <div className='game-end-title'>{title}</div>}
              {/* <div style={{ fontSize: `${props.recordsBroken ? 'var(--font-size)' : 'initial'}` }} id='game-end-rank'>{subTitle}</div> */}

              <div className='game-end-message'>
                <div id='results-grid' className={resultsGridClass}>
              {props.roundResults.cards.map((card, i) => {
                let bonusList = card.bonuses;
                console.warn('card', i, 'bonuses', card.bonuses)
                let multiple = [];
                bonusList.map((bonus, i, arr) => {
                  let copies = arr.filter(b => b.name === bonus.name).length;
                  arr[i].copies = copies;
                  if (copies > 1 && !multiple.includes(bonus.name)) {
                    multiple.push(bonus.name)
                  }
                });
                return (
                  <div key={card.cardIndex} className='card-result-container'>
                    <div className='card-label'>CARD {i + 1}</div>
                    <div className='card-analysis'>
                      <div className='analysis-row card-bingos'>
                        <div>Bingos: <span style={{ color: 'yellow', fontSize: 'calc(var(--font-size) / 1.25)' }}>{card.bingoCount}</span></div>
                        <div><span style={{ color: 'var(--money-green', fontSize: 'calc(var(--font-size) / 1.25)' }}>${card.currentPrize}</span></div>
                      </div>
                      {bonusList.sort((a, b) => bonusAmounts[b] - bonusAmounts[a]).map(bonus => {
                        let multipleDisplay = bonus.copies;
                        return (
                          <div key={bonus.name + '-' + multipleDisplay} className='analysis-row card-bonuses'>
                            <div style={{ fontSize: 'calc(var(--font-size) / 2)' }}>{bonus.name}{multiple.includes(bonus.name) && ' x' + multipleDisplay}</div>
                            <div><span style={{ color: 'var(--money-green', fontSize: 'calc(var(--font-size) / 1.5)' }}>${bonus.amount}</span></div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
                </div>
              </div>
              <div id='bonuses' className='game-end-message'>
              {/* <div id='speed-results'>
                <div><small>Average Daub Speed</small><br />{daubSpeedSeconds} seconds</div>
                <div id='daub-bonus'>Daub Speed Bonus: <span style={{color: 'var(--money-green)'}}>${daubBonus}</span></div>
              </div> */}
              {props.equippedChickens.map(chicken => {
                let newExperience = chicken.experience + props.chickenExperiencePrizes[chicken.chickenId];
                return (
                  <div className='chicken-exp-display' key={chicken.chickenId}>
                    <img src={chicken.color === 'blue' ? blueChickenPng : orangeChickenPng} />
                    <div>"{chicken.nickname}" {chicken.name} gained {props.chickenExperiencePrizes[chicken.chickenId]} experience!</div>
                    <ExperienceBar currentExperience={newExperience} currentLevel={chicken.level} toNextLevel={experienceLevels[chicken.level] - newExperience} />
                  </div>)
                  ;
              })}
              </div>
              <div className='button-area'>
                <div id='prize-display' className='game-end-message'>{prizeMessage}</div>
                <button id='agree-button' onPointerDown={props.onClickOkayButton} className='modal-button'>{agreeLabel}</button>
                {/* <button id='visit-store-button' onPointerDown={props.onClickVisitStoreButton} className='modal-button'>VISIT STORE</button> */}
              </div>
            </>
      }
    </div>
  );
}
function areEqual(prevProps, nextProps) {
    return prevProps.showing === nextProps.showing
    && prevProps.roundResults === nextProps.roundResults
    && prevProps.userCardCount === nextProps.userCardCount
    && prevProps.lost === nextProps.lost;
}

export default React.memo(GameEndModal, areEqual);
// export default GameEndModal;
