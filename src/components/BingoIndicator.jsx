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
]

function BingoIndicator(props) {
  // console.pink('BingoIndicator ------------------');
  // console.log(props)
  let bingoDisplay = bingoMessages[props.bingoCount];
  let bingoClass = 'bingo-indicator';
  if (props.showing) {
    bingoClass += ' showing';
  }
  return (
    <div className={bingoClass}>
      {bingoDisplay}
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