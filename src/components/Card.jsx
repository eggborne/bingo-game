import React, { useState, useEffect } from 'react';
import { limits, randomInt } from '../scripts/util';
import { drawSpeed } from '../App';
import NumberSquare from './NumberSquare';
import '../css/Card.css';

function Card(props) {
  const [hidden, setHidden] = useState(props.ready);
  const [numbers, setNumbers] = useState([[], [], [], [], []]);
  const [markedNumbers, setMarked] = useState([]);
  const [highlightedNumbers, setHighlighted] = useState([]);
  const [active, setActive] = useState(props.active);
  const [bingos, setBingos] = useState({});
  const [won, setWon] = useState(false);

  useEffect(() => {
    if (props.gameStarted && props.ballQueue.length === 0) {
      setActive(true);
      if (props.autoFreeSpace || props.opponent) {
        autoDaub(99, true);
      }
    } else {
      if (props.opponent && active) {
        autoDaub(props.ballQueue[props.ballQueue.length - 1]);
      } else {
        if (props.opponent) {

        } else {
          if (!props.playersLeft) {
            setActive(false)
          }
        }
      }
    }
  }, [active, autoDaub(), props.ballQueue, props.opponent, props.gameStarted, props.playersLeft]);
  useEffect(() => {
    if (props.ready && !props.gameStarted && props.ballQueue.length === 0) {
      if (props.type === 'random') {
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
      } else {
        let cardData = props.cardData;
        setNumbers(cardData.numbers);
      }
      if (won) {
        setWon(false);
      }
      setMarked([]);
      setHighlighted([]);
      setHidden(false);
    }
  }, [props.gameStarted, props.ballQueue, props.ready, won])
  useEffect(() => {
    if (markedNumbers.length === 0) {
      if (highlightedNumbers.length > 0) {
        setHighlighted([]);
      }
    } else if (props.ballQueue.length) {
      checkForBingo();
    }
  }, [markedNumbers]);
  useEffect(() => {
    if (!props.opponent) {
      if (active !== props.gameStarted) {
        setActive(props.gameStarted)
      }
    }
  }, [props.gameStarted, props.ballQueue]);
  useEffect(() => {
    if (props.gameStarted) {
      checkForBingo();
    }
  }, props.gameStarted)
  function checkForBingo() {
    let hasBingo = false;
    let fourCorners = [
      numbers[0][0],
      numbers[0][numbers.length - 1],
      numbers[numbers.length - 1][0],
      numbers[numbers.length - 1][numbers.length - 1]
    ];
    let dangerRating = 0;
    let columnQuantities = [[], [], [], [], []];
    let horizontalLines = [];
    let verticalLines = [];
    let diagonalNWSE = [];
    let diagonalSWNE = [];
    let cornerBingo = false;
    numbers.map((row, r) => {
      if (row.filter(num => markedNumbers.includes(num)).length === row.length) {
        // row filled
        horizontalLines.push(row);
      }
      row.map((num, n) => {
        if (markedNumbers.includes(num)) {
          columnQuantities[n].push(r);
        }
      });
    });
    columnQuantities.map((column, c) => {
      if (column.length === columnQuantities.length) {
        // column filled
        let vertArray = [...column];
        verticalLines.push({ column: c, numberIndexes: vertArray });
      }
      if (column.includes(c)) {
        diagonalNWSE.push(c);
      }
      let crossIndex = columnQuantities.length - c - 1;
      if (column.includes(crossIndex)) {
        diagonalSWNE.push(numbers[c][crossIndex]);
      }
    });
    if (diagonalNWSE.length === columnQuantities.length) {
      diagonalNWSE.map(ind => {
        diagonalNWSE[ind] = numbers[ind][ind];
      });
    }
    if (diagonalSWNE === columnQuantities.length) {
      diagonalSWNE.map(ind => {
        diagonalSWNE[ind] = numbers[ind][5 - ind];
      });
    }
    let verts = [];
    verticalLines.map((line, l) => {
      verts[l] = [];
      if (line.numberIndexes) {
        line.numberIndexes.map((ind, n) => {
          let newNumber = numbers[n][line.column];
          verts[l][n] = newNumber;
        });
      }
    });
    verticalLines = verts;

    if (fourCorners.filter(num => markedNumbers.includes(num)).length === 4) {
      // has all four corners
      cornerBingo = true;
    }

    let foundBingos = {
      verticalLines: verticalLines,
      horizontalLines: horizontalLines,
      diagonals: { NWSE: diagonalNWSE, SWNE: diagonalSWNE },
      corners: cornerBingo
    };

    let newHighlighted = [...highlightedNumbers];
    for (let cat in foundBingos) {
      if (foundBingos[cat].map) {
        foundBingos[cat].map(arr => {
          newHighlighted = [...newHighlighted, ...arr.filter(num => !highlightedNumbers.includes(num))];
        });
      } else if (cat === 'diagonals') {
        let NWSE = foundBingos[cat].NWSE;
        let SWNE = foundBingos[cat].SWNE;
        if (NWSE.length === columnQuantities.length) {
          newHighlighted = [...newHighlighted, ...NWSE];
        }
        if (SWNE.length === columnQuantities.length) {
          newHighlighted = [...newHighlighted, ...SWNE];
        }
      }
    }
    if (foundBingos.horizontalLines.length) {
      hasBingo = true;
    }
    if (foundBingos.verticalLines.length) {
      hasBingo = true;
    }
    if (foundBingos.diagonals.NWSE.length === 5) {
      hasBingo = true;
    }
    if (foundBingos.diagonals.SWNE.length === 5) {
      hasBingo = true;
    }
    if (cornerBingo) {
      hasBingo = true;
      newHighlighted = [...newHighlighted, ...fourCorners];
    }
    if (hasBingo) {
      setHighlighted(newHighlighted);
      if (props.opponent) {
        if (active) {
          props.onAchieveBingo(props.opponent);
          setActive(false);
        }
      } else {
        let bingoCount = 0;
        let foundBingoCount = 0;
        for (let type in bingos) {
          if (type === 'verticalLines' || type === 'horizontalLines') {
            bingoCount += bingos[type].length
          } else if (type === 'diagonals') {
            if (bingos[type].NWSE.length === 5) {
              bingoCount++;
            }
            if (bingos[type].SWNE.length === 5) {
              bingoCount++;
            }
          }
        }
        for (let type in foundBingos) {
          if (type === 'verticalLines' || type === 'horizontalLines') {
            foundBingoCount += foundBingos[type].length
          } else if (type === 'diagonals') {
            if (foundBingos[type].NWSE.length === 5) {
              foundBingoCount++;
            }
            if (foundBingos[type].SWNE.length === 5) {
              foundBingoCount++;
            }
          }
        }
        if (cornerBingo) {
          foundBingoCount++;
        }
        if (bingoCount < foundBingoCount) {
          setWon(true)
          props.onAchieveBingo(props.opponent);
          setTimeout(() => {
            setActive(false);
            setBingos({});
            setWon(false)
          }, 1000)
        }
      }
    }
  }
  function autoDaub(newBall, noDelay) {
    let allNumbers = [numbers].flat(2);
    if (allNumbers.includes(newBall)) {
      setMarked([...markedNumbers, newBall]);
    }
  }
  const handleTouchSquare = event => {
    let touchedNumber = parseInt(event.target.innerText);
    if (isNaN(touchedNumber)) {
      touchedNumber = 99;
    }
    if (!markedNumbers.includes(touchedNumber)) {
      if (true || props.ballQueue.includes(touchedNumber) || touchedNumber === 99) {
        setMarked([...markedNumbers, touchedNumber]);
      } else {
        console.log("props.gameStarted", props.gameStarted)
        console.log("props.ballQueue.length", props.ballQueue.length)
        if (!props.gameStarted && !props.ballQueue.length) {
          console.log("nt staretd")
          document.getElementById('start-button').classList.add('throbbing');
          setTimeout(() => {
            document.getElementById('start-button').classList.remove('throbbing');
          }, 700)
        } else {
          props.onBadClick();
          event.target.style.backgroundColor = '#99000022';
          let num = event.target;
          setTimeout(() => {
            num.style.backgroundColor = 'initial';
          }, 45);
          setTimeout(() => {
            num.style.backgroundColor = '#99000022';
          }, 90);
          setTimeout(() => {
            num.style.backgroundColor = 'initial';
          }, 135);
          setTimeout(() => {
            num.style.backgroundColor = '#99000022';
          }, 180);
          setTimeout(() => {
            num.style.backgroundColor = 'initial';
          }, 225);
        }
      }
    }
  };
  let cardClass = 'card';
  if (hidden) {
    cardClass += ' hidden';
  }
  if (props.opponent) {
    cardClass += ' opponent';
  }
  if (!active) {
    cardClass += ' inactive';
  }
  if (props.type === 'custom') {
    cardClass += ' custom';
  }
  if (won) {
    cardClass += ' won';
  }
  let isOpponent = props.opponent;
  return (
    <div className={cardClass}>
      <div className='letter-row'>
        <div className='card-head-letter b' />
        <div className='card-head-letter i' />
        <div className='card-head-letter n' />
        <div className='card-head-letter g' />
        <div className='card-head-letter o' />
      </div>
      <div className='number-grid'>{numbers.map((column, c) => column.map((num, n) => {
        let marked = markedNumbers.includes(num);
        let highlighted = highlightedNumbers.includes(num);
        return (isOpponent ?
          <NumberSquare key={(isOpponent && 'opponent-') + c + '-' + n} isOpponent={isOpponent} queueLength={props.ballQueue.length} marked={marked} highlighted={highlighted} number={num} />
          :
          <NumberSquare key={c + '-' + n} marked={marked} highlighted={highlighted} chipImage={props.chipImage} isOpponent={isOpponent} number={num} onTouchSquare={handleTouchSquare} />)
      }))}</div>
    </div>
  );
}

function areEqual(prevProps, nextProps) {
  let equalTest = (prevProps.chipImage == nextProps.chipImage) && prevProps.ready == nextProps.ready && (prevProps.ballQueue == nextProps.ballQueue) && prevProps.gameStarted == nextProps.gameStarted;
  return equalTest;
}

export default React.memo(Card, areEqual);
// export default Card;
