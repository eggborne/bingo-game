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
  const [numbers, setNumbers] = useState(undefined);
  const [blockedNumbers, setBlockedNumbers] = useState([]);
  const [markedNumbers, setMarked] = useState([]);
  const [highlightedNumbers, setHighlighted] = useState([]);
  const [tintedNumbers, setTintedNumbers] = useState([]);
  const [madeFree, setMadeFree] = useState([]);
  const [active, setActive] = useState(false);
  const [bingos, setBingos] = useState([]);
  const [won, setWon] = useState(false);
  const [touchedNumber, setTouchedNumber] = useState(false);

  const allNumbers = useCallback(() => {
    if (numbers) {
      return [...numbers[0], ...numbers[1], ...numbers[2], ...numbers[3], ...numbers[4]];
    }
    return [];
  }, [numbers]);

  const autoDaub = (num) => {
    // let allNumbers = [numbers].flat(2);
    if (num === 99 || allNumbers().includes(num)) {
      setMarked([...markedNumbers, num]);
      return true;
    }
    return false;
  };
  useEffect(() => {
    if (props.ready && props.calledBalls.length === 0) {
      if (props.opponent) {
        if (!numbers) {
          let newNumbers = [[], [], [], [], []];
          let used = [];
          newNumbers.map((column, i) => {
            for (let n = 0; n < 5; n++) {
              let randomNumber = 99;
              if (i === 2 && n === 2) {
                // free space
              } else {
                randomNumber = randomInt(limits[n][0], limits[n][limits[n].length - 1]);
                while (used.includes(randomNumber)) {
                  randomNumber = randomInt(limits[n][0], limits[n][limits[n].length - 1]);
                }
              }
              column[n] = randomNumber;
              used.push(randomNumber);
            }
          });
          setNumbers(newNumbers);
        }
      } else {
        if (props.cardData) {
          setNumbers(props.cardData.numbers);
        }
      }
      setMarked([]);
      setHighlighted([]);
      setMadeFree([]);
      setBlockedNumbers([]);
    }
  }, [props.gameStarted, props.username, props.calledBalls, props.ready, props.cardData, won]);
  useEffect(() => {
    if (props.gameStarted && numbers && props.calledBalls.length === 0) {
      // game just started
      if (active) {
        setActive(true);
        if (props.opponent) {
          simulateGame();
        }
      }
      if (props.autoFreeSpace || props.opponent) {
        autoDaub(99);
      }
    } else {
      if (props.opponent && active) {
        autoDaub(props.calledBalls[props.calledBalls.length - 1]);
      }
    }
  }, [numbers, props.calledBalls, props.opponent, props.gameInProgress, props.gameStarted]);



  useEffect(() => {
    if (props.opponent && active && props.calledBalls.length > 3) {
      checkForBingo();
    }
  }, [props.calledBalls]);

  useEffect(() => {
    if (active !== props.gameStarted) {
      setActive(props.gameStarted)
      if (props.opponent) {
        props.reportActive(props.index, true);
      }
    }
  }, [props.gameStarted]);

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
          setBlockedNumbers([...blockedNumbers, latestFreeSpace.num])
        }
      }
    }
  }, [props.freeSpaces.length, props.autoFreeSpace]);

  useEffect(() => {
    if (!props.opponent && markedNumbers.length > 0) {
      checkForBingo();
    }
  }, [markedNumbers])

  const findBingosInGame = () => {

  }

  const checkForBingo = () => {
    let checkStart = window.performance.now();
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
    let cornerBingo = 0;
    let numbersMarked = markedNumbers.filter(num => !blockedNumbers.includes(num));
    numbers.map((row, r) => {
      let markedInRow = row.filter(num => numbersMarked.includes(num)).length;
      if (markedInRow === row.length) {
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
      cornerBingo = 1;
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

    setBingos(foundBingos);

    if (instantWin || hasBingo) {
      console.info('BINGOS! CARD', props.index, foundBingos);
      setHighlighted(newHighlighted);

      // count the bingos in state...

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
      if (cornerBingo) {
        bingoCount++;
      }

      // count the amount just found...

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
      console.info('BINGOS! bingos, foundBingos', bingos, foundBingos);
      console.info('BINGOS! bingoCount, foundBingoCount', bingoCount, foundBingoCount);

      // ...compare old to new

      if (instantWin || bingoCount < foundBingoCount) {
        // setBingos(foundBingos);

        if (!props.opponent) {
          setWon(true)
          props.onAchieveBingo(false, foundBingos);
          if (props.gameMode.name === 'Ranked') {
            setTimeout(() => {
              setActive(false);
              setBingos({});;
              setWon(false)
            }, 2000)
          } else if (props.gameMode.name === 'Bonanza') {
            setTimeout(() => {
              setWon(false)
            }, 400)
          } else if (props.gameMode.name === 'Countdown') {
            setTimeout(() => {
              setWon(false)
            }, 400)
          }
        } else {
          if (active && props.gameMode.name === 'Ranked' ||  props.gameMode.name === 'Bonanza') {
            if (props.gameMode.name === 'Ranked') {
              props.onAchieveBingo(true, foundBingoCount);
              setActive(false);
              props.reportActive(props.index, false);
            }
            if (props.gameMode.name === 'Bonanza') {
              props.onAchieveBingo(true, foundBingoCount);
            }
          }
        }
      }
    }
    // console.error('checked card', props.index, 'for bingo in', window.performance.now() - checkStart);
  };
  const handleTouchSquare = (event, num) => {
    let numberTouched = parseInt(event.target.id.split('-')[1]);
    setTouchedNumber(numberTouched);
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
      }
    }
  };
  const handleTouchEndSquare = (event) => {
    setTouchedNumber(undefined);
  };

  const simulateGame = () => {
    let markedEachBall = [1];
    let markedThisBall = 1;
    props.fullBallSequence.map((calledBall) => {
      if (allNumbers().includes(calledBall)) {
        markedThisBall++
      }
      markedEachBall.push(markedThisBall);
    })
    props.reportFullGame(props.index, markedEachBall)
  }

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
  if (props.hidden) {
    cardClass += ' hidden';
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
        let blocked = blockedNumbers.includes(num) || props.freeSpaces.filter(space => space.type === 'BEE' && space.cardIndex === props.index && space.num === num).length > 0;
        let endangered = (blocked && props.powerupSelected && props.powerupSelected.displayName.indexOf('Bee Spray') > -1);

        let highlighted = highlightedNumbers.includes(num);
        let tinted = tintedNumbers.includes(num);
        let canBeMarked = (props.calledBalls.includes(num) || free || num === 99);
        return (isOpponent ?
          props.ready && !props.hidden && <NumberSquare
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
            ownerIndex={props.index}
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
    prevProps.gameInProgress === nextProps.gameInProgress &&
    prevProps.powerupSelected === nextProps.powerupSelected &&
    prevProps.freeSpaces.length === nextProps.freeSpaces.length &&
    prevProps.bonusOffered === nextProps.bonusOffered &&
    prevProps.fullBallSequence === nextProps.fullBallSequence &&
    prevProps.cardData.numbers === nextProps.cardData.numbers &&
    prevProps.username === nextProps.username;
  ;
  return equalTest;
}

export default React.memo(Card, areEqual);
// export default Card;
