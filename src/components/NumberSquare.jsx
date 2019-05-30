import React, { useState, useEffect } from 'react';
import '../css/NumberSquare.css';
import { randomInt, limits } from '../App';


function NumberSquare(props) {
  const [marked, setMarked] = useState(props.marked);
  useEffect(() => {
    setMarked(props.marked);
  }, [props.marked, marked])
  let displayNumber = props.number;
  let squareClass = 'number-square';
  let chipClass = 'chip';
  if (marked) {
    squareClass += ' marked';
  }
  if (props.number === 99) {
    displayNumber = 'FREE';
    squareClass += '  free';
  }
  return (
    <div id={`card-square-${props.number}`} className={squareClass} onTouchStart={event => props.onTouchSquare(event)} onTouchEnd={props.onTouchEndSquare}>
      <div>{displayNumber}</div>
      <div className={chipClass}></div>
    </div>
  );
}

// function areEqual(prevProps, nextProps) {
//   return prevProps.marked == nextProps.marked;
// }

// export default React.memo(NumberSquare, areEqual);
export default NumberSquare;
