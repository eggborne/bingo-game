import React, { useState, useEffect } from 'react';
import '../css/NumberSquare.css';

function NumberSquare(props) {
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
  if (props.highlightMarkable) {
    squareClass += ' highlight-markable';
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
    prevProps.highlighted === nextProps.highlighted &&
    prevProps.number === nextProps.number &&
    prevProps.powerupId === nextProps.powerupId &&
    prevProps.madeFree === nextProps.madeFree &&
    prevProps.touched === nextProps.touched &&
    prevProps.blocked === nextProps.blocked &&
    prevProps.canBeMarked === nextProps.canBeMarked &&
    prevProps.highlightMarkable === nextProps.highlightMarkable &&
    prevProps.marked === nextProps.marked &&
    prevProps.chipImage === nextProps.chipImage &&
    prevProps.number === nextProps.number &&
    prevProps.ownerIndex === nextProps.ownerIndex &&
    prevProps.gameStarted === nextProps.gameStarted
  );
  return equalTest;
}

export default React.memo(NumberSquare, areEqual);
// export default NumberSquare;