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

const bounce = (event) => {
  if (document.querySelector('.ball:nth-last-child(2)') === event.target && event.propertyName === 'transform') {
    let ball = event.target;
    ball.classList.add('bouncing');
    setTimeout(() => {
      ball.classList.remove('bouncing');
    }, 250);
  }
}

const CallerArea = React.forwardRef((props, ref) => {
  console.count('CallerArea');
  const callerRef = ref;
  const [eggsWide, setEggsWide] = useState(0);
  useEffect(() => {
    if (!eggsWide && props.calledBalls.length) {
      setEggsWide(Math.floor(document.querySelector('#caller-area').offsetWidth / document.querySelectorAll('.ball')[0].offsetWidth) - 1);
    }
  }, [props.calledBalls])
  useEffect(() => {
    if (!callerRef.current.onTransitionEnd) {
      callerRef.current.addEventListener('transitionend', (event) => {
        bounce(event);
      });
    }
  }, []);
  return (
    <div id='caller-area' className={!props.gameStarted ? 'game-paused' : undefined}>
      <div ref={ref} id='ball-row'>
        {props.calledBalls.map((ball, i, arr) => {
          let letter = getBingoLetter(ball);
          return (
            <Ball index={i} obscured={i < props.calledBalls.length - eggsWide} calledCount={props.calledBalls.length} letter={letter} number={ball} key={letter + ball} />
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
