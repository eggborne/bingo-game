import React, { useState, useCallback, useEffect } from 'react';
import { limits, getLetter, randomInt } from '../scripts/util';
import NumberSquare from './NumberSquare';
import '../css/Card.css';

let bounceTimeout = undefined;
let winPatterns = {
  'Letter X': [[0,4],[1,3],[],[1,3],[0,4]]
}

function Card(props) {
  if (!props.opponent) {
    // console.warn('Card ------> ' + props.index)
  } else {
    // console.count('opp card ' + props.index)
  }
  const [hidden, setHidden] = useState(props.ready);
  const [numbers, setNumbers] = useState([[], [], [], [], []]);
  const [markedNumbers, setMarked] = useState([]);
  const [highlightedNumbers, setHighlighted] = useState([]);
  const [tintedNumbers, setTintedNumbers] = useState([]);
  const [madeFree, setMadeFree] = useState([]);
  const [active, setActive] = useState(props.active);
  const [bingos, setBingos] = useState({});
  const [won, setWon] = useState(false);
  const [touchedNumber, setTouchedNumber] = useState(false);

  const allNumbers = useCallback(() => {
    return [...numbers[0], ...numbers[1], ...numbers[2], ...numbers[3], ...numbers[4]];
  }, [numbers]);

  const autoDaub = (newBall) => {
    // let allNumbers = [numbers].flat(2);
    if (allNumbers().includes(newBall)) {
      setMarked([...markedNumbers, newBall]);
    }
  };

  useEffect(() => {
    if (props.gameStarted && props.ballQueue.length === 0) {
      // game just started
      setActive(true);
      if (props.autoFreeSpace || props.opponent) {
        autoDaub(99, true);
      }
    } else {
      if (props.opponent && active) {
        autoDaub(props.ballQueue[props.ballQueue.length - 1]);
      }
    }
  }, [active, props.ballQueue, props.opponent, props.gameStarted, props.playersLeft]);
  useEffect(() => {
    if (props.ready && !props.gameStarted && props.ballQueue.length === 0) {
      if (props.opponent) {
        let newNumbers = [[], [], [], [], []];
        let used = [];
        newNumbers.map((column, i) => {
          for (let n = 0; n < 5; n++) {
            let randomNumber = 99;
            if (i === 2 && n === 2) {
              // free space
            } else {
              randomNumber = randomInt(limits[n][0], limits[n][limits[n].length-1]);
              while (used.includes(randomNumber)) {
                randomNumber = randomInt(limits[n][0], limits[n][limits[n].length-1]);
              }
            }
            column[n] = randomNumber;
            used.push(randomNumber);
          }
        });
        if (props.opponent) {
          setNumbers(newNumbers)
        }
      } else if (props.cardData) {
        console.log('had data', props.cardData.numbers)
        setNumbers(props.cardData.numbers);
      }
      if (won) {
        setWon(false);
      }
      setMarked([]);
      setHighlighted([]);
      setMadeFree([]);
      setHidden(false);
    }
  }, [props.gameStarted, props.username, props.ballQueue, props.ready, props.cardData.numbers, props.cardData, numbers, won])
  useEffect(() => {
    if (markedNumbers.length === 0) {
      if (highlightedNumbers.length > 0) {
        setHighlighted([]);
      }
    } else if (props.ballQueue.length > 3) {
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
  }, [props.gameStarted]);
  useEffect(() => {
    let latestFreeSpace = props.bonusFreeSpaces[props.bonusFreeSpaces.length - 1];
    if (latestFreeSpace && latestFreeSpace.cardIndex === props.index) {
      setMadeFree([...madeFree, latestFreeSpace.num]);
      if (props.autoFreeSpace) {
        setMarked([...markedNumbers, latestFreeSpace.num, madeFree]);
      }
    }
  }, [props.bonusFreeSpaces.length, props.autoFreeSpace]);
  useEffect(() => {
    if (props.ballLimitReached && !hidden) {
      setHidden(true);
    }
  }, [props.ballLimitReached, hidden])
  const checkForBingo = async () => {
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
        if (active && props.gameMode.name === 'Ranked') {
          props.onAchieveBingo(true);
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
          if (props.gameMode.name === 'Ranked') {
            setWon(true)
            props.onAchieveBingo(props.opponent);
            setTimeout(() => {
              setActive(false);
              setBingos({});
              setWon(false)
            }, 1000)
          }
          if (props.gameMode.name === 'Limited Balls') {
            props.onAchieveBingo(props.opponent);
          }
        }
      }
    }
  };
  // }, [markedNumbers, props.ballQueue.length]);
  const handleTouchSquare = event => {
    let numberTouched = parseInt(event.target.innerText);
    setTouchedNumber(numberTouched);
    if (isNaN(numberTouched)) {
      numberTouched = 99;
    }
    if (!markedNumbers.includes(numberTouched)) {
      if (props.ballQueue.includes(numberTouched) || madeFree.includes(numberTouched) || (props.gameStarted && event.target.innerText == 'FREE')) {
        console.log('marking', numberTouched)
        setMarked([...markedNumbers, numberTouched]);
        props.onDaubSquare();
      } else {
        // let arrow = document.getElementById('hint-arrow');
        // if (arrow && !bounceTimeout && !props.gameStarted && !props.ballQueue.length) {
        //   arrow.classList.add('pointing');
        //   document.getElementById('start-button').classList.remove('throbbing');
        //   bounceTimeout = setTimeout(() => {
        //     document.getElementById('start-button').classList.add('throbbing');
        //     setTimeout(() => {
        //       document.getElementById('start-button').classList.remove('throbbing');
        //       arrow.classList.remove('pointing');
        //       clearTimeout(bounceTimeout);
        //       bounceTimeout = undefined;
        //     }, 1000)
        //   }, 400)
        // } else {
        // if (props.gameStarted) {
        //   event.target.style.backgroundColor = '#99000022';
        //   let num = event.target;
        //   setTimeout(() => {
        //     num.style.backgroundColor = 'initial';
        //   }, 60);
        //   setTimeout(() => {
        //     num.style.backgroundColor = '#99000022';
        //   }, 120);
        //   setTimeout(() => {
        //     num.style.backgroundColor = 'initial';
        //   }, 180);
        //   setTimeout(() => {
        //     num.style.backgroundColor = '#99000022';
        //   }, 240);
        //   setTimeout(() => {
        //     num.style.backgroundColor = 'initial';
        //   }, 300);
        // } else {
          if (!active) {
            props.onClickInactiveCard();
          }
        // }


      }
    }
  };
// }, [props.onClickInactiveCard, props.gameStarted, props.ballQueue.length, markedNumbers]);

  const handleTouchEndSquare = (event) => {
    setTouchedNumber(undefined);
  };
  let cardClass = 'card';
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
      <div className='number-grid'>{numbers && numbers.map((column, c) => column.map((num, n) => {
        let canBeMarked = props.ballQueue.includes(num);
        let marked = markedNumbers.includes(num);
        let highlighted = highlightedNumbers.includes(num);
        let free = madeFree.includes(num);
        let tinted = tintedNumbers.includes(num);
        return (isOpponent ?
          <NumberSquare
            key={'opponent-' + c + '-' + n}
            isOpponent={true}
            queueLength={props.ballQueue.length}
            marked={marked}
            highlighted={highlighted}
            number={num}
          />
          :
          <NumberSquare
            key={c + '-' + n}
            isOpponent={false}
            number={num}
            touched={touchedNumber === num}
            canBeMarked={canBeMarked}
            marked={marked}
            madeFree={free}
            tinted={tinted}
            highlighted={highlighted}
            chipImage={props.chipImage}
            queueLength={props.ballQueue.length}
            lastBall={props.ballQueue[props.ballQueue.length - 1]}
            onTouchSquare={handleTouchSquare}
            onTouchEndSquare={handleTouchEndSquare}
            gameStarted={props.gameStarted}
          />)
        }))}
      </div>
    </div>
  );
}

function areEqual(prevProps, nextProps) {
  let equalTest =
    prevProps.chipImage == nextProps.chipImage &&
    prevProps.ready == nextProps.ready &&
    prevProps.ballQueue.length == nextProps.ballQueue.length &&
    prevProps.gameStarted == nextProps.gameStarted &&
    prevProps.bonusOffered == nextProps.bonusOffered
    ;
  return equalTest;
}

export default React.memo(Card, areEqual);
// export default Card;
