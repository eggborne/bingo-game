import React, { useState, useEffect } from 'react';
import '../css/NumberSquare.css';

function NumberSquare(props) {
  let displayNumber = props.number;
  let squareClass = 'number-square';
  let chipClass = props.isOpponent ? 'mark' : 'chip';
  if (props.marked) {
    squareClass += ' marked';
  }
  if (props.highlighted) {
    squareClass += ' highlighted';
  }
  if (props.number === 99) {
    displayNumber = 'FREE';
    squareClass += ' free';
  }
  return (
    <div id={`card-square-${props.number}`}
      className={squareClass + ' ' + props.chipImage}
      onPointerDown={event => (!props.isOpponent ? props.onTouchSquare(event) : null)}
      onTouchEnd={props.onTouchEndSquare}
    >
      <div>{!props.isOpponent && displayNumber}</div>
      <div className={chipClass} />
    </div>
  );
}

// function areEqual(prevProps, nextProps) {
//   return prevProps.marked === nextProps.marked && prevProps.highlighted === nextProps.highlighted && prevProps.queueLength === nextProps.queueLength;
// }

// export default React.memo(NumberSquare);
export default NumberSquare;
