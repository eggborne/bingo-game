import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import Ball from './Ball';
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

const bounce = (event) => {
  if (document.querySelector('.ball:nth-last-child(2)') === event.target && event.propertyName === 'transform') {
    let ball = event.target;
    ball.classList.add('bouncing');
    setTimeout(() => {
      ball.classList.remove('bouncing');
    }, 500);
  }
}

const CallerArea = React.forwardRef((props, ref) => {
  console.count('CallerArea');
  const callerRef = ref;
  useEffect(() => {
    console.log('cock', ref.current)
    if (!callerRef.current.onTransitionStart) {
      callerRef.current.addEventListener('transitionstart', (event) => {
        bounce(event);
      });
    }
  }, [ref]);
  return (
    <div id='caller-area'>
      <div ref={ref} id='ball-row'>
        {props.calledBalls.map((ball, i) => {
          let letter = getBingoLetter(ball);
          return <Ball letter={letter} number={ball} key={letter + ball} />
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
