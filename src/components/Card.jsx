import React, { useState, useCallback, useEffect } from 'react';
import { limits, randomInt } from '../scripts/util';
import NumberSquare from './NumberSquare';
import BingoIndicator from './BingoIndicator';
import '../css/Card.css';

let bounceTimeout = undefined;

const instantWin = false;

const bingoRankings = [
  undefined,
  'FIRST',
  'SECOND',
  'THIRD'
];

function Card(props) {
  const [numbers, setNumbers] = useState(undefined);
  const [blockedNumbers, setBlockedNumbers] = useState([]);
  const [markedNumbers, setMarked] = useState([]);
  const [highlightedNumbers, setHighlighted] = useState([]);
  const [tintedNumbers, setTintedNumbers] = useState([]);
  const [madeFree, setMadeFree] = useState([]);
  const [active, setActive] = useState(false);
  const [bingos, setBingos] = useState([]);
  const [bingoCount, setBingoCount] = useState([]);
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
        let newTinted = [];
        if (props.cardData) {
          setNumbers(props.cardData.numbers);
          props.cardData.numbers.map((row, r) => {
            console.log('RO!', row);
            row.map((num, c) => {
              if (props.gameMode.winPattern.pattern[r].includes(c)) {
                console.error('pushing', num)
                newTinted.push(num);
              }
            })
          })
        }
        console.log('setting newTinted', newTinted)
        setTintedNumbers(newTinted);
      }
      setBingoCount(0);
      setMarked([]);
      setHighlighted([]);
      setMadeFree([]);
      setBlockedNumbers([]);
    }
  }, [props.gameStarted, props.patternName, props.gameMode, props.username, props.calledBalls, props.ready, props.cardData, won]);
  useEffect(() => {
    if (props.gameStarted && numbers && props.calledBalls.length === 0) {
      // game just started
      if (active) {
        // setActive(true);
        if (props.opponent) {
          console.error('SIMULATING GAME!', props.index)
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
          setMadeFree(madeFree => [...madeFree, latestFreeSpace.num]);
          if (props.autoFreeSpace) {
            setMarked(markedNumbers => [...markedNumbers, latestFreeSpace.num, [...madeFree, latestFreeSpace.num]]);
          }
        }
        if (latestFreeSpace.type === 'BEE') {
          setBlockedNumbers([...blockedNumbers, latestFreeSpace.num])
        }
      }
    }
  }, [props.freeSpaces.length, props.autoFreeSpace]);

  useEffect(() => {
    if (props.gameInProgress && !props.opponent && markedNumbers.length > 0) {
      if (props.gameMode.name === 'Bonanza') {
        checkForBingo();
      }
    }
  }, [markedNumbers, props.gameInProgress])

  const checkForWinPattern = () => {
    console.pink('----------------------------------------------------------------------------');
    console.pink((props.opponent ? 'Opponent card ' : 'Player card ') + props.index + ' being checked!')
    let numbersMarked = markedNumbers.filter(num => !blockedNumbers.includes(num));
    let indexesMarked = [[],[],[],[],[]];
    numbersMarked.map((num, n) => {
      numbers.map((row, r) => {
        if (row.includes(num) && props.gameMode.winPattern.pattern[r].includes(row.indexOf(num)) && !indexesMarked[r].includes(row.indexOf(num))) {
          indexesMarked[r].push(row.indexOf(num));
          indexesMarked[r].sort();
        }
      })
    });
    let allIndex = [...indexesMarked[0], ...indexesMarked[1], ...indexesMarked[2], ...indexesMarked[3], ...indexesMarked[4]];
    let allPatternBalls = [...props.gameMode.winPattern.pattern[0], ...props.gameMode.winPattern.pattern[1], ...props.gameMode.winPattern.pattern[2], ...props.gameMode.winPattern.pattern[3], ...props.gameMode.winPattern.pattern[4]];
    if (allIndex.length && allIndex.length === allPatternBalls.length) {
      console.error('OMG WINNER', props.index, 'has a', props.gameMode.name);
      return true;
    }
    return false;
    console.pink('----------------------------------------------------------------------------');
  }

  const checkForBingo = () => {
    let checkStart = window.performance.now();
    let hasBingo = false;
    let dangerRating = 0;
    // console.log('patternName?', props.opponent, props.patternName)
    if (props.patternName === 'Line / 4 Corners') {
      // if (allNumbers(tintedNumbers).length === 0) {
      //   console.log('no tinted numbers!')
      // }
      let fourCorners = [
        numbers[0][0],
        numbers[0][numbers.length - 1],
        numbers[numbers.length - 1][0],
        numbers[numbers.length - 1][numbers.length - 1]
      ];
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
        if (bingos.corners) {
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
        console.info('BINGOCOUNTS! bingoCount, foundBingoCount', bingoCount, foundBingoCount);

        // ...compare old to new

        setBingoCount(foundBingoCount);

        if (bingoCount < foundBingoCount) {
          // setBingos(foundBingos);
          console.log('bingo < found', bingoCount, '<', foundBingoCount, ' so reporting ' + (foundBingoCount - bingoCount) + ' new bingos!!');
          if (!props.opponent) {
            setWon(true);
            props.onAchieveBingo(false, (foundBingoCount-bingoCount), foundBingoCount, props.index);
            if (props.gameMode.name === 'Ranked') {
              setTimeout(() => {
                setActive(false);
                setBingos({});
                setWon(false)
              }, 2000)
            } else if (props.gameMode.name === 'Bonanza') {
              setTimeout(() => {
                setWon(false)
              }, 2000)
            } else if (props.gameMode.name === 'Countdown') {
              setTimeout(() => {
                setWon(false)
              }, 2000)
            }
          } else if (props.opponent) {
            if (props.gameMode.name === 'Ranked') {
              props.onAchieveBingo(true, (foundBingoCount - bingoCount), foundBingoCount, props.index);
              console.error('opponent sending', (foundBingoCount - bingoCount), 'to handleAchieveBingo');
              setActive(false);
              props.reportActive(props.index, false);
            } else if (props.gameMode.name === 'Bonanza') {
              props.onAchieveBingo(true, (foundBingoCount-bingoCount), foundBingoCount, props.index);
              console.error('opponent sending', (foundBingoCount-bingoCount), 'to handleAchieveBingo')
            }
          }
        }
      }
    } else {
      let won = checkForWinPattern();
      if (won) {
        if (props.opponent) {
          if (props.gameMode.name === 'Classic' || props.gameMode.name === 'Ranked') {
            props.onAchieveBingo(true, 1, 1, props.index);
            setActive(false);
            props.reportActive(props.index, false);
          } else if (props.gameMode.name === 'Bonanza' || props.gameMode.name === 'Countdown') {
            props.onAchieveBingo(true, 1, 1, props.index);
            console.error('sending 1 to handleAchieveBingo')
          }
        } else {
          if (props.gameMode.name === 'Ranked' || props.gameMode.name === 'Classic') {
            props.onAchieveBingo(false, 1, 1, props.index);
            console.error('sending 1 to handleAchieveBingo')
            setTimeout(() => {
              setActive(false);
              setBingos({});;
              setWon(false)
            }, 2000);
          } else if (props.gameMode.name === 'Bonanza' || props.gameMode.name === 'Countdown') {
            props.onAchieveBingo(false, 1, 1, props.index);
            console.error('sending 1 to handleAchieveBingo')
            setTimeout(() => {
              setWon(false)
            }, 1200)
          }
        }
      }
    }
    // console.error('checked card', props.index, 'for bingo in', window.performance.now() - checkStart);
  };
  const handleTouchSquare = (event, num) => {
    let numberTouched = parseInt(event.target.id.split('-')[1]);
    setTouchedNumber(numberTouched);
    if (!props.opponent && props.powerupSelected && props.powerupSelected.category.indexOf('Bee') > -1 && blockedNumbers.includes(numberTouched)) {
      let newBlocked = [...blockedNumbers];
      let newMadeFree = [...madeFree];
      newBlocked.splice(newBlocked.indexOf(numberTouched), 1);
      newMadeFree.splice(newMadeFree.indexOf(numberTouched), 1);
      setBlockedNumbers(newBlocked);
      // setMadeFree(newMadeFree);
      props.onKillBee(props.index, numberTouched);
    } else if (!props.opponent && props.powerupSelected && props.powerupSelected.category.indexOf('Free') > -1
      && !markedNumbers.includes(numberTouched)
      && !madeFree.includes(numberTouched)
      && !blockedNumbers.includes(numberTouched)) {
      console.big('making free!~')
      // setMadeFree(madeFree => [...madeFree, numberTouched]);
      if (props.autoFreeSpace) {
        setMarked(markedNumbers => [...markedNumbers, numberTouched]);
      }
      props.onSetFree(props.index, numberTouched);
    } else if (!markedNumbers.includes(numberTouched)) {
      if (props.calledBalls.includes(numberTouched) || madeFree.includes(numberTouched) || (event && props.gameStarted && event.target.innerText === 'FREE')) {
        setMarked(markedNumbers => [...markedNumbers, numberTouched]);
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
    let patternMarkedEachBall = [0];
    let markedThisBall = 1; // starts with center free space
    let patternMarkedThisBall = 0;
    let dangerEachBall = [0];
    let allCardNumbers = allNumbers();
    let allPatternBalls = [...props.gameMode.winPattern.pattern[0], ...props.gameMode.winPattern.pattern[1], ...props.gameMode.winPattern.pattern[2], ...props.gameMode.winPattern.pattern[3], ...props.gameMode.winPattern.pattern[4]];

    props.fullBallSequence.map((calledBall) => {
      if (allCardNumbers.includes(calledBall)) {
        markedThisBall++
        props.gameMode.winPattern.pattern.map((row, r) => {
          row.map((ind, n) => {
            let num = numbers[n][r];
            if (calledBall === num) {
              patternMarkedThisBall++;
            }
          });
        });
      }
      dangerEachBall.push(parseFloat((patternMarkedThisBall / allPatternBalls.length).toPrecision(2)));
      markedEachBall.push(markedThisBall);
    })
    props.reportFullGame(props.index, markedEachBall, dangerEachBall);
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
  let gridClass = `number-grid ${props.gameMode.className}`
  let isOpponent = props.opponent;
  let bingoRank = undefined;
  let rankBonus = undefined;
  let prefix = undefined;
  let suffix = undefined;
  let indicatorShowing = won;
  // indicatorShowing = true;
  if (indicatorShowing) {
    if (props.gameMode.name === 'Bonanza') {
      bingoRank = (props.gameMode.bingoLimit - props.remainingBingos + 1);
      rankBonus = (props.remainingBingos / props.gameMode.bingoLimit) * 1000;
    } else if (props.gameMode.name === 'Ranked') {
      bingoRank = (props.opponentCardCount - props.remainingPlayers + 1);
      rankBonus = (props.remainingPlayers / props.opponentCardCount) * 1000;
    }
    // console.log('bingoRankings', bingoRankings, bingoRankings[2])
    prefix = bingoRank === 1 ? 'FIRST' : '';
    if (bingoRank === 1) {
      props.reportBonus('First Bingo', props.index);
    }
    rankBonus = (props.opponentCardCount / bingoRank) * 15;
    if (rankBonus < 50) {
      rankBonus = 0;
    }
    suffix = '';
  }
  return (
    <div className={cardClass}>
      <BingoIndicator
        showing={indicatorShowing}
        remainingPlayers={props.remainingPlayers}
        remainingWinners={props.remainingWinners}
        remainingBingos={props.remainingBingos}
        opponentCardCount={props.opponentCardCount}
        bingoCount={bingoCount}
        prefix={prefix}
        suffix={suffix}
      />
      <div className='letter-row'>
        <div className='card-head-letter b' />
        <div className='card-head-letter i' />
        <div className='card-head-letter n' />
        <div className='card-head-letter g' />
        <div className='card-head-letter o' />
      </div>
      <div className={gridClass}>{numbers && numbers.map((column, c) => column.map((num, n) => {
        // let free = madeFree.includes(num) || props.freeSpaces.filter(space => space.cardIndex === props.type === 'FREE' && props.index && space.num === num).length > 0;
        let free = madeFree.includes(num) || props.freeSpaces.filter(space => space.cardIndex === props.index && space.num === num).length > 0;
        let marked = markedNumbers.includes(num);
        let canBeMarked = ((props.calledBalls.includes(num)) || free || num === 99);
        let blocked = false;
        let endangered = false;
        let highlighted = false;
        let tinted = false;
        if (!props.opponent) {
          blocked = blockedNumbers.includes(num) || props.freeSpaces.filter(space => space.type === 'BEE' && space.cardIndex === props.index && space.num === num).length > 0;
          endangered = (blocked && props.powerupSelected && props.powerupSelected.category.indexOf('Bee') !== -1);
          highlighted = highlightedNumbers.includes(num);
          if (props.gameInProgress) {
            tinted = tintedNumbers.includes(num);
          }
        }
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
          props.ready && !props.hidden && <NumberSquare
            key={c + '-' + n}
            isOpponent={false}
            number={num}
            touched={touchedNumber === num}
            canBeMarked={canBeMarked}
            marked={marked}
            madeFree={free}
            powerupId={props.powerupSelected ? props.powerupSelected.id : undefined}
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
    prevProps.limitReached === nextProps.limitReached &&
    prevProps.calledBalls.length === nextProps.calledBalls.length &&
    prevProps.gameMode === nextProps.gameMode &&
    prevProps.patternName === nextProps.patternName &&
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
