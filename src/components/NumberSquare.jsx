import React, { useState, useEffect } from 'react';
import '../css/NumberSquare.css';

function NumberSquare(props) {
  // if (!props.isOpponent && props.blocked) {
  //   console.log('NumberSquare', props.number, 'of card', props.ownerIndex)
  // }
  const [showing, setShowing] = useState(false);
  const [flashing, setFlashing] = useState(undefined);

  useEffect(() => {
    setShowing(true);
    if (props.madeFree) {
      setFlashing('green');
      setTimeout(() => {
        setFlashing(undefined)
      }, 1800);
    }
    if (props.blocked) {
      setFlashing('red');
      setTimeout(() => {
        setFlashing(undefined)
      }, 1800);
    }
    return (() => {
      setShowing(false);
    });
  }, []);
  useEffect(() => {
    if (props.madeFree) {
      setFlashing('green');
      setTimeout(() => {
        setFlashing(undefined)
      }, 900);
    }
    if (props.blocked) {
      setFlashing('red');
      setTimeout(() => {
        setFlashing(undefined)
      }, 900);
    }
  }, [props.madeFree, props.blocked]);
  let chipClass = props.isOpponent ? 'mark' : 'chip';

  let displayNumber = props.number;
  let squareClass = !props.isOpponent ? 'number-square' : 'number-square opponent';
  if (showing) {
    squareClass += ' showing';
  }
  if (props.blocked) {
    squareClass += ' blocked';
  }
  if (props.endangered) {
    squareClass += ' endangered';
  }
  if (!props.blocked && props.marked) {
    squareClass += ' marked';
  }
  if (props.highlighted) {
    squareClass += ' highlighted';
  }

  if (!props.blocked && (props.number === 99 || props.madeFree)) {
    displayNumber = 'FREE';
    squareClass += ' free';
  }
  if (props.tinted) {
    squareClass += ' tinted';
  }
  if (flashing) {
    chipClass += ' ' + flashing;
    squareClass += ' flashing';
    // squareClass += ' highlighted';
  }
  if (props.canBeMarked || flashing) {
    chipClass += ' markable';
    squareClass += ' markable';
  }

  if (props.madeFree || props.blocked) {
    squareClass += ' made-free';
  }

  return (
    !props.isOpponent ?
      <div
        className={squareClass + ' ' + props.chipImage}
        id={`${props.ownerIndex}-${props.number}`}
        onPointerDown={props.onTouchSquare}
        onTouchEnd={props.onTouchEndSquare}
      >
        <div>{displayNumber}</div>
        <div className={chipClass} />
      </div>
      :
      <div id={`card-square-${props.number}`} className={squareClass + ' ' + props.chipImage} >
        <div className={chipClass} />
      </div>
  );
}

function areEqual(prevProps, nextProps) {
  let equalTest = (
    // nextProps.marked &&
    // !(prevProps.canBeMarked && !nextProps.touched) &&
    prevProps.highlighted === nextProps.highlighted &&
    prevProps.number === nextProps.number &&
    prevProps.powerupId === nextProps.powerupId &&
    prevProps.madeFree === nextProps.madeFree &&
    prevProps.touched === nextProps.touched &&
    prevProps.blocked === nextProps.blocked &&
    prevProps.canBeMarked === nextProps.canBeMarked &&
    prevProps.marked === nextProps.marked &&
    prevProps.chipImage === nextProps.chipImage &&
    prevProps.number === nextProps.number &&
    prevProps.ownerIndex === nextProps.ownerIndex &&
    prevProps.gameStarted === nextProps.gameStarted
  );
  // if (!equalTest && !prevProps.isOpponent) {
  //   // console.green('-------------------------------------------');
  //   // console.log(prevProps.number);
  //   // console.log('highlighted', prevProps.highlighted === nextProps.highlighted);
  //   // console.log('madeFree', prevProps.madeFree === nextProps.madeFree);
  //   // console.log('touched', prevProps.touched === nextProps.touched);
  //   // console.log('canBeMarked', prevProps.canBeMarked === nextProps.canBeMarked);
  //   // console.log('marked', prevProps.marked === nextProps.marked);
  //   // console.log('nextProps.lastBall !== nextProps.number', nextProps.lastBall !== nextProps.number);
  //   // console.green('-------------------------------------------');
  // }
  return equalTest;
}

export default React.memo(NumberSquare, areEqual);
// export default NumberSquare;