import React, { useState, useEffect } from 'react';
import { limits, randomInt } from '../App';
import NumberSquare from './NumberSquare';
import '../css/Card.css';

function Card(props) {
  const [hidden, setHidden] = useState(true);
  const [numbers, setNumbers] = useState([[], [], [], [], []]);
  const [markedNumbers, setMarked] = useState([]);

  useEffect(() => {
    if (props.ballQueue.length === 0) {

      let newNumbers = [[], [], [], [], []];
      let used = [];
      newNumbers.map((column, i) => {
        for (let n = 0; n < 5; n++) {
          let randomNumber = 99;
          if (i === 2 && n === 2) {
            // free space
          } else {
            randomNumber = randomInt(limits[n].min, limits[n].max);
            while (used.includes(randomNumber)) {
              randomNumber = randomInt(limits[n].min, limits[n].max);
            }
          }
          column[n] = randomNumber;
          used.push(randomNumber);
        }
      });
      setNumbers(newNumbers);
      setMarked([]);
      setHidden(false);
    }
  }, [props.ballQueue]);
  // useEffect(() => {
  //   if (props.ballQueue.length === 0) {
  //     console.log('unmarking!')
  //     setMarked([]);
  //   }
  // }, [props.ballQueue])
  const handleTouchSquare = (event) => {
    let touchedNumber = parseInt(event.target.innerText);
    if (isNaN(touchedNumber)) {
      touchedNumber = 99;
    }
    // setTouchingSquare({
    //   number: touchedNumber,
    //   touchPosition: { x: Math.round(event.changedTouches[0].clientX), y: Math.round(event.changedTouches[0].clientY) },
    //   touchTime: `${markedNumbers.includes(touchedNumber) ? window.performance.now() : touchingSquare.touchTime}`
    // });
    if (!markedNumbers.includes(touchedNumber)) {
      if (props.ballQueue.includes(touchedNumber) || touchedNumber === 99) {
        setMarked([...markedNumbers, touchedNumber])
      } else {
        event.target.style.backgroundColor = '#99000022';
        let num = event.target
        setTimeout(() => {
          num.style.backgroundColor = 'initial';
        }, 45)
        setTimeout(() => {
          num.style.backgroundColor = '#99000022';
        }, 90)
        setTimeout(() => {
          num.style.backgroundColor = 'initial';
        }, 135)
        setTimeout(() => {
          num.style.backgroundColor = '#99000022';
        }, 180)
        setTimeout(() => {
          num.style.backgroundColor = 'initial';
        }, 225)
      }
    }
  }
  // const [touchingSquare, setTouchingSquare] = useState({
  //   number: undefined,
  //   touchPosition: { x: undefined, y: undefined },
  //   touchTime: 0
  // });


  const handleTouchEndSquare = event => {
    // setTouchingSquare({
    //   number: undefined,
    //   touchPosition: { x: undefined, y: undefined },
    //   touchTime: 0
    // });
    // let sincePressed = window.performance.now() - touchingSquare.touchTime;
    // let releasePos = { x: Math.round(event.changedTouches[0].clientX), y: Math.round(event.changedTouches[0].clientY) };
  }
  let cardClass = 'card';
  if (hidden) {
    cardClass += ' hidden';
  }
  return (
    <div className={cardClass}>
      <div className='card-head-letter b'>B</div>
      <div className='card-head-letter i'>I</div>
      <div className='card-head-letter n'>N</div>
      <div className='card-head-letter g'>G</div>
      <div className='card-head-letter o'>O</div>
      {numbers.map((column, c) =>
        column.map((num, n) => {
          let marked = markedNumbers.includes(num);
          return <NumberSquare key={c + '-' + n} marked={marked} number={num} onTouchSquare={event => handleTouchSquare(event)} onTouchEndSquare={handleTouchEndSquare} />
        })
      )}
      </div>
  );
}

// function areEqual(prevProps, nextProps) {
//   return prevProps.ballQueue.length === nextProps.ballQueue.length;
// }

// export default React.memo(Card, areEqual);
export default Card;
