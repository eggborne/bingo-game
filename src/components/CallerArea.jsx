import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import Ball from './Ball';
import { limits, randomInt } from '../App';
import '../css/CallerArea.css';

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
  const callerRef = ref;
  useEffect(() => {
    callerRef.current.addEventListener('transitionstart', (event) => {
      if (document.querySelector('.ball:nth-last-child(2)') === event.target && event.propertyName === 'transform') {
        let ball = event.target;
        ball.classList.add('bouncing');
        setTimeout(() => {
          ball.classList.remove('bouncing');
        }, 210);
      }
    })
  }, [callerRef]);
  let callerClass = props.gameStarted ? 'game-started' : '';
  return (
    <div id='caller-area' className={callerClass}>
      <div ref={ref} id='ball-row'>
        {props.ballQueue.map((ball, i) => {
          let letter = getBingoLetter(ball);
          return <Ball letter={letter} number={ball} key={letter + ball} />
        })}
        <div id='ball-space'></div>
      </div>
      {/* <div id='call-progress'></div> */}
    </div>
  );
});

// function areEqual(prevProps, nextProps) {
//   return prevProps.gameStarted === nextProps.gameStarted && prevProps.ballQueue === nextProps.ballQueue
// }

// export default React.memo(CallerArea, areEqual);

export default CallerArea;
