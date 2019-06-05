import React, { useState, useEffect } from 'react';
import '../css/NumberSquare.css';

function NumberSquare(props) {
  const [marked, setMarked] = useState(props.marked);
  const [highlighted, setHighlighted] = useState(props.highlighted);
  useEffect(() => {
    setMarked(props.marked);
  }, [props.marked]);
  useEffect(() => {
    setHighlighted(props.highlighted);
  }, [props.highlighted]);
  let displayNumber = props.number;
  let squareClass = 'number-square';
  let chipClass = props.isOpponent ? 'mark' : 'chip';
  if (marked) {
    squareClass += ' marked';
  }
  if (highlighted) {
    squareClass += ' highlighted';
  }
  if (props.number === 99) {
    displayNumber = 'FREE';
    squareClass += ' free';
  }
  return (
    <div id={`card-square-${props.number}`}
      className={squareClass}
      onPointerDown={event => (!props.isOpponent ? props.onTouchSquare(event) : null)}
      onTouchEnd={props.onTouchEndSquare}
    >
      <div>{!props.isOpponent && displayNumber}</div>
      <div className={chipClass} />
    </div>
  );
}

function areEqual(prevProps, nextProps) {
  // return prevProps.marked === nextProps.marked && prevProps.highlighted === nextProps.highlighted;
}

// export default React.memo(NumberSquare, areEqual);
export default NumberSquare;
