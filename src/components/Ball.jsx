import React, { useState, useEffect } from 'react';
import '../css/Ball.css';

function Ball(props) {
  // const [showing, changeShowing] = useState(false);

  // useEffect(() => {
  //   changeShowing(true);
  // }, []);
  let ballClass = `ball ${props.letter.toLowerCase()}`;
  // if (!showing) {
  //   ballClass += ' hidden'
  // }
  if (props.obscured) {
    ballClass += ' obscured';
  }
  return (
    <div className={ballClass}>
      <div>{props.letter}</div>
      <div>{props.number}</div>
    </div>
  );
}

function areEqual(prevProps, nextProps) {
  return (
    prevProps.number === nextProps.number
    && prevProps.obscured === nextProps.obscured
  );
}

export default React.memo(Ball, areEqual);
// export default Ball;
