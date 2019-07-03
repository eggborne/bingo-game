import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import Ball from './Ball';
import '../css/CallerArea.css';
import { arrayExpression } from '@babel/types';

const getBingoLetter = num => {
  if (num > 60) {
    return 'O';
  }
  if (num > 45) {
    return 'G';
  }
  if (num > 30) {
    return 'N';
  }
  if (num > 15) {
    return 'I';
  }
  return 'B';
}

const CallerArea = React.forwardRef((props, ref) => {
  console.count('CallerArea');
  const callerRef = ref;
  // const [eggsWide, setEggsWide] = useState(Math.floor(document.querySelector('#caller-area').offsetWidth / document.querySelectorAll('.ball')[0].offsetWidth) - 1);
  // useEffect(() => {
  //   if (!eggsWide && props.calledBalls.length) {
  //     setEggsWide(Math.floor(document.querySelector('#caller-area').offsetWidth / document.querySelectorAll('.ball')[0].offsetWidth) - 1);
  //   }
  // }, [props.calledBalls])
  // let eggsWide = window.innerWidth > window.innerHeight ? 8 : 6;
  let eggsWide = 8;
  return (
    <div id='caller-area' className={!props.gameStarted ? 'game-paused' : undefined}>
      <div ref={ref} id='ball-row'>
        {props.calledBalls.map((ball, i, arr) => {
          let letter = getBingoLetter(ball);
          return (
            // <Ball index={i} obscured={i < props.calledBalls.length - eggsWide} calledCount={props.calledBalls.length} letter={letter} number={ball} key={letter + ball} />
            <Ball index={i} obscured={false} calledCount={props.calledBalls.length} letter={letter} number={ball} key={letter + ball} />
          );
        })}
        <div id='ball-space'></div>
      </div>
      {/* <div id='call-progress'></div> */}
    </div>
  );
});

function areEqual(prevProps, nextProps) {
  return prevProps.gameStarted === nextProps.gameStarted && prevProps.calledBalls.length === nextProps.calledBalls.length
}

export default React.memo(CallerArea, areEqual);
// export default CallerArea;
