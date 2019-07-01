import React from 'react';
import '../css/BingoIndicator.css';

const bingoMessages = [
  undefined,
  'BINGO!',
  'DOUBLE BINGO!',
  'TRIPLE BINGO!',
  'QUAD BINGO!',
  '5X BINGO!!',
  '6X BINGO!!',
  '7X BINGO!!',
  '8X BINGO!!!',
  '9X BINGO!!!',
  '10X BINGO!!!',
  '11X BINGO!!!',
  '12X BINGO!!!',
  'MAX BINGO!!!',
];

function BingoIndicator(props) {
  console.pink('BingoIndicator ------------------');
  console.log(props)
  let bingoDisplay = bingoMessages[props.bingoCount];
  bingoDisplay = 'BINGO!'
  let prefix = props.prefix;
  let suffix = props.suffix;
  // let bingoRank = (props.opponentCardCount - props.remainingPlayers + 5);
  // let rankBonus = (props.remainingPlayers / props.opponentCardCount) * 1000;
  // let prefix = bingoRankings[bingoRank] || bingoRank <= 4 ? `${bingoRank}th` : ``;
  // rankBonus = (props.opponentCardCount / bingoRank) * 15;
  // if (rankBonus < 50) {
  //   rankBonus = 0;
  // }
  // let suffix = bingoRank <= 4 ? `+$${rankBonus}` : '';
  let bingoClass = 'bingo-indicator';
  if (props.showing) {
    bingoClass += ' showing';
  }
  return (
    <div className={bingoClass}>
      <div className='prefix'>
        {prefix}
      </div>
      <div className='main-message'>
        {bingoDisplay}
      </div>
      <div className='suffix'>
        {suffix}
      </div>
    </div>
  );
}

function areEqual(prevProps, nextProps) {
  return (
    prevProps.showing === nextProps.showing

  );
}

export default React.memo(BingoIndicator, areEqual);
// export default BingoIndicator;