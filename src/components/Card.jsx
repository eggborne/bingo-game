import React, { useState, useCallback, useEffect } from 'react';
import { limits, randomInt } from '../scripts/util';
import NumberSquare from './NumberSquare';
import '../css/Card.css';

let bounceTimeout = undefined;
let winPatterns = {
  'Letter X': [[0,4],[1,3],[],[1,3],[0,4]]
}


const instantWin = false;



function Card(props) {
  if (!props.opponent) {
    // // console.warn('Card ------> ', props)
  } else {
    // // console.count('opp card ' + props.index)
  }
  const [hidden, setHidden] = useState(props.ready);
  const [numbers, setNumbers] = useState([[], [], [], [], []]);
  const [blockedNumbers, setBlockedNumbers] = useState([]);
  const [markedNumbers, setMarked] = useState([]);
  const [highlightedNumbers, setHighlighted] = useState([]);
  const [tintedNumbers, setTintedNumbers] = useState([]);
  const [madeFree, setMadeFree] = useState([99]);
  const [active, setActive] = useState(false);
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
    if (props.gameStarted && props.calledBalls.length === 0) {
      // game just started
      if (active) {
        setActive(true);
      }
      if (props.autoFreeSpace || props.opponent) {
        autoDaub(99, true);
      }
    } else {
      if (props.opponent && active) {
        autoDaub(props.calledBalls[props.calledBalls.length - 1]);
      }
    }
  }, [active, props.calledBalls, props.opponent, props.gameStarted]);
  useEffect(() => {
    if (props.ready && props.calledBalls.length === 0) {
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
        console.log(props.username, 'Card setting from cardData', props.cardData)
        setNumbers(props.cardData.numbers);
      }
      // if (won) {
      //   setWon(false);
      // }
      setMarked([]);
      setHighlighted([]);
      setMadeFree([]);
      setBlockedNumbers([]);
      setHidden(false);
    }
  }, [props.gameStarted, props.username, props.calledBalls, props.ready, props.cardData, won])
  useEffect(() => {
    if (markedNumbers.length === 0) {
      if (highlightedNumbers.length > 0) {
        setHighlighted([]);
      }
    } else if (props.calledBalls.length > 0) {
      checkForBingo();
    }
  }, [markedNumbers]);
  useEffect(() => {
    // if (!props.opponent) {
      if (active !== props.gameStarted) {
        setActive(props.gameStarted)
      }
    // }
  }, [props.gameStarted]);

  // useEffect(() => {
  //   if (props.gameStarted) {
  //     checkForBingo();
  //   }
  // }, [props.gameStarted]);

  useEffect(() => {
    if (!props.opponent) {
      let latestFreeSpace = props.freeSpaces[props.freeSpaces.length - 1];
      if (latestFreeSpace && latestFreeSpace.cardIndex === props.index) {
        if (latestFreeSpace.type === 'FREE') {
          setMadeFree([...madeFree, latestFreeSpace.num]);
          if (props.autoFreeSpace) {
            setMarked([...markedNumbers, latestFreeSpace.num, [...madeFree, latestFreeSpace.num]]);
          }
        }
        if (latestFreeSpace.type === 'BEE') {
          console.log('BEE blocked', latestFreeSpace)
          setBlockedNumbers([...blockedNumbers, latestFreeSpace.num])
        }
      }
    }
  }, [props.freeSpaces.length, props.autoFreeSpace]);

  useEffect(() => {
    if (props.ballLimitReached && !hidden) {
      setHidden(true);
    }
  }, [props.ballLimitReached, hidden])
  const checkForBingo = () => {
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
    let numbersMarked = markedNumbers.filter(num => !blockedNumbers.includes(num));
    numbers.map((row, r) => {
      if (row.filter(num => numbersMarked.includes(num)).length === row.length) {
        // row filled
        horizontalLines.push(row);
      }
      row.map((num, n) => {
        if (numbersMarked.includes(num)) {
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

    if (fourCorners.filter(num => numbersMarked.includes(num)).length === 4) {
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

    if (instantWin || hasBingo) {
    // if (hasBingo) {
      setHighlighted(newHighlighted);
      if (props.opponent) {
        if (active && props.gameMode.name === 'Ranked' ||  props.gameMode.name === 'Bonanza') {
          props.onAchieveBingo(true, foundBingos);
          if (props.gameMode.name === 'Ranked') {
            setActive(false);
          }
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

        if (instantWin || bingoCount < foundBingoCount) {
        // if (bingoCount < foundBingoCount) {
        setBingos(bingoCount);
          setWon(true)
          props.onAchieveBingo(false, foundBingos);
          if (props.gameMode.name === 'Ranked') {
            setTimeout(() => {
              setActive(false);
              setBingos({});;
              setWon(false)
            }, 2000)
          } else if (props.gameMode.name === 'Limited Balls') {
            setTimeout(() => {
              setWon(false)
            }, 1000)
          }
        }
      }
    }
  };
  // }, [markedNumbers, props.calledBalls.length]);
  const handleTouchSquare = (event, num) => {
    let numberTouched = event ? parseInt(event.target.innerText) : num;
    setTouchedNumber(numberTouched);
    if (isNaN(numberTouched)) {
      numberTouched = 99;
    }
    if (props.powerupSelected && props.powerupSelected.displayName.indexOf('Spray') > -1 && blockedNumbers.includes(numberTouched)) {
      let newBlocked = [...blockedNumbers];
      let newMadeFree = [...madeFree];
      newBlocked.splice(newBlocked.indexOf(numberTouched), 1);
      newMadeFree.splice(newMadeFree.indexOf(numberTouched), 1);
      setBlockedNumbers(newBlocked);
      setMadeFree(newMadeFree);
      props.onKillBee(props.index, numberTouched);
    } else if (!markedNumbers.includes(numberTouched)) {
      if (props.calledBalls.includes(numberTouched) || madeFree.includes(numberTouched) || (event && props.gameStarted && event.target.innerText === 'FREE')) {
        setMarked([...markedNumbers, numberTouched]);
        if (!props.opponent) {
          props.onDaubSquare(props.calledBalls[props.calledBalls.length - 1] === numberTouched && numberTouched !== 99);
        }
      } else {
        // let arrow = document.getElementById('hint-arrow');
        // if (arrow && !bounceTimeout && !props.gameStarted && !props.calledBalls.length) {
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
        if (!active && !props.calledBalls.length) {
            console.log("clickinavchaib??")
            props.onClickInactiveCard();
          }
        // }


      }
    }
  };
// }, [props.onClickInactiveCard, props.gameStarted, props.calledBalls.length, markedNumbers]);

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
        // let free = madeFree.includes(num) || props.freeSpaces.filter(space => space.cardIndex === props.type === 'FREE' && props.index && space.num === num).length > 0;
        let free = madeFree.includes(num) || props.freeSpaces.filter(space => space.cardIndex === props.index && space.num === num).length > 0;
        let marked = markedNumbers.includes(num);
        let blocked = blockedNumbers.includes(num);
        let endangered = (blocked && props.powerupSelected && props.powerupSelected.displayName.indexOf('Bee Spray') > -1);

        let highlighted = highlightedNumbers.includes(num);
        let tinted = tintedNumbers.includes(num);
        let canBeMarked = (props.calledBalls.includes(num) || free || num === 99);
        return (isOpponent ?
          props.ready && <NumberSquare
            key={'opponent-' + c + '-' + n}
            isOpponent={true}
            queueLength={props.calledBalls.length}
            marked={marked}
            highlighted={highlighted}
            number={num}
          />
          :
          props.ready && <NumberSquare
            key={c + '-' + n}
            isOpponent={false}
            number={num}
            touched={touchedNumber === num}
            canBeMarked={canBeMarked}
            marked={marked}
            madeFree={free}
            blocked={blocked}
            tinted={tinted}
            highlighted={highlighted}
            endangered={endangered}
            chipImage={!blocked && props.chipImage}
            queueLength={props.calledBalls.length}
            lastBall={props.calledBalls[props.calledBalls.length - 1]}
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
    prevProps.chipImage === nextProps.chipImage &&
    prevProps.ready === nextProps.ready &&
    prevProps.calledBalls.length === nextProps.calledBalls.length &&
    prevProps.gameStarted === nextProps.gameStarted &&
    prevProps.powerupSelected === nextProps.powerupSelected &&
    prevProps.freeSpaces.length === nextProps.freeSpaces.length &&
    prevProps.bonusOffered === nextProps.bonusOffered &&
    prevProps.cardData.numbers === nextProps.cardData.numbers &&
    prevProps.username === nextProps.username;
  ;
  return equalTest;
}

export default React.memo(Card, areEqual);
// export default Card;
