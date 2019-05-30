import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import '../css/Ball.css';

function Ball(props) {
  const [showing, changeShowing] = useState(false);
  useEffect(() => {
    changeShowing(true);
  }, []);
  let ballClass = `ball ${props.letter.toLowerCase()}`;
  if (!showing) {
    ballClass += ' hidden'
  }
  return (
    <div className={ballClass}>
      <div>{props.letter}</div>
      <div>{props.number}</div>
    </div>
  );
}

export default Ball;
