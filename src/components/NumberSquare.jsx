import React, { useState, useEffect } from 'react';
import '../css/NumberSquare.css';

function NumberSquare(props) {
  if (!props.isOpponent) {
    // console.log('NumberSquare', props.number)
  }
  const [showing, setShowing] = useState(false);
  const [flashing, setFlashing] = useState(undefined);

  useEffect(() => {
    setShowing(true);
    return (() => {
      setShowing(false);
    });
  }, []);
  useEffect(() => {
    if (props.madeFree) {
      setFlashing('green');
      setTimeout(() => {
        setFlashing(undefined)
      }, 1200);
    }
  }, [props.madeFree]);
  let chipClass = props.isOpponent ? 'mark' : 'chip';
  let displayNumber = props.number;
  let squareClass = 'number-square';
  if (showing) {
    squareClass += ' showing';
  }
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
  if (props.madeFree) {
    squareClass += ' made-free';
  }
  if (props.tinted) {
    squareClass += ' tinted';
  }
  if (flashing) {
    squareClass += ' flashing';
  }
  return (
    !props.isOpponent ?
      <div id={`card-square-${props.number}`}
        className={squareClass + ' ' + props.chipImage}
        onPointerDown={!props.isOpponent ? props.onTouchSquare : null}
        onTouchEnd={!props.isOpponent ? props.onTouchEndSquare : null}
      >
        <div>{displayNumber}</div>
        <div className={chipClass} />
      </div>
      :
        <div id={`card-square-${props.number}`}
          className={squareClass + ' ' + props.chipImage}
        >
        <div className={chipClass} />
      </div>
  );
}

function areEqual(prevProps, nextProps) {
  let equalTest = (
    prevProps.highlighted == nextProps.highlighted &&
    prevProps.madeFree == nextProps.madeFree &&
    prevProps.touched == nextProps.touched &&
    prevProps.canBeMarked == nextProps.canBeMarked &&
    prevProps.marked == nextProps.marked &&
    prevProps.gameStarted == nextProps.gameStarted &&
    !(nextProps.canBeMarked && !nextProps.marked)
  );
  // if (!equalTest && !prevProps.isOpponent) {
  //   console.green('-------------------------------------------');
  //   console.log(prevProps.number);
  //   console.log('highlighted', prevProps.highlighted == nextProps.highlighted);
  //   console.log('madeFree', prevProps.madeFree == nextProps.madeFree);
  //   console.log('touched', prevProps.touched == nextProps.touched);
  //   console.log('canBeMarked', prevProps.canBeMarked == nextProps.canBeMarked);
  //   console.log('marked', prevProps.marked == nextProps.marked);
  //   console.log('nextProps.lastBall !== nextProps.number', nextProps.lastBall !== nextProps.number);
  //   console.green('-------------------------------------------');
  // }
  return equalTest;
}

export default React.memo(NumberSquare, areEqual);
// export default NumberSquare;
