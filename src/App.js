import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import Card from './components/Card';
import CallerArea from './components/CallerArea';
import StatusArea from './components/StatusArea';
import ConfirmModal from './components/ConfirmModal';
import './css/App.css';

function fullScreenCall() {
  let root = document.getElementById('app');
  console.log(root);
  return root.requestFullscreen || root.webkitRequestFullscreen || root.mozRequestFullScreen || root.msRequestFullscreen;
}
function exitFullScreenCall() {
  return document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen || document.msExitFullscreen;
}
export function isFullScreen() {
  return document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
}
// export function toggleFullScreen(app) {
//   let oldHeight = window.innerHeight;
//   app.setState({
//     lastHeight: oldHeight
//   }, () => {
//     if (!isFullScreen()) {
//       fullScreenCall().call(document.getElementById('container'));
//     } else {
//       exitFullScreenCall().call(document);
//     }
//   });

// }

let oldHeight = window.innerHeight;
let gameInterval = undefined;

document.documentElement.style.setProperty('--view-height', window.innerHeight + 'px');

window.oncontextmenu = function(event) {
  event.preventDefault();
  event.stopPropagation();
  return false;
};

let lastResized = window.performance.now();
window.addEventListener('resize', event => {
  if (window.performance.now() - lastResized > 50) {
    setTimeout(() => {
      let newViewHeight = window.innerHeight + 'px';
      document.documentElement.style.setProperty('--view-height', newViewHeight);
      newViewHeight = window.screen.height + 'px';
    }, 5);
    lastResized = window.performance.now();
    console.log('RESIZED! ==============================================================================')
    console.log('RESIZED! ==============================================================================')
  }
});

export const limits = [{ min: 1, max: 15 }, { min: 16, max: 30 }, { min: 31, max: 45 }, { min: 46, max: 60 }, { min: 61, max: 75 }];

const getBingoPhonetic = num => {
  let rando = !randomInt(0, 40);
  if (num > 60) {
    return 'oh';
  }
  if (num > 45) {
    return rando ? 'under the gee\'s' : 'gee';
  }
  if (num > 30) {
    return 'en';
  }
  if (num > 15) {
    return 'eye';
  }
  return rando ? 'under the bees' : 'bee';
};

export const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

let drawSpeed = 4000;
let counter = 0;

function useInterval(callback, delay) {
  const savedCallback = useRef();
  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      gameInterval = setInterval(() => {
        tick();
      }, delay);
      return () => clearInterval(gameInterval);
    }
  }, [delay]);
}

const synth = window.speechSynthesis;
let voices = synth.getVoices();
console.log(voices)
function App() {
  const [ballsLeft, setBallsLeft] = useState([...Array(76).keys()].slice(1, 76));
  const [ballQueue, setQueue] = useState([]);
  const [gameStarted, setGameStart] = useState(false);
  const [locked, setLocked] = useState(false);
  const [modalOn, setModalOn] = useState(false);
  const [modalMessage, setModalMessage] = useState('Really reset the game?');
  const [danger, setDanger] = useState(0);
  const [playerCards, setPlayerCards] = useState([{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}])
  const ref = useRef();

  function drawBall() {
    let queueCopy = [...ballQueue];
    let ballsCopy = [...ballsLeft];
    if (ballsCopy.length) {
      let number = ballsCopy.splice(randomInt(0, ballsLeft.length - 1), 1)[0];
      let spokenBall = new SpeechSynthesisUtterance(getBingoPhonetic(number) + ' - ' + number);
      // spokenBall.rate = 0.5;
      // spokenBall.pitch = 0.5;
      synth.speak(spokenBall);
      queueCopy.push(number);
      setQueue(queueCopy);
      setBallsLeft(ballsCopy);
    } else {
      let spokenOutPhrase = new SpeechSynthesisUtterance(`Owe no. Looks like I'm all out of balls.`);
      // spokenOutPhrase.rate = 0.8;
      // spokenOutPhrase.pitch = 0.4;
      synth.speak(spokenOutPhrase);
      setGameStart(false);
    }
  }
  useInterval(() => {
    if (gameStarted) {
      console.log('drawing.', counter);
      ref.current.scrollLeft = -ref.current.scrollWidth;
      setTimeout(() => {
        drawBall();
      }, 300);
      counter++;
    }
    return this;
  }, drawSpeed);
  useEffect(() => {
    ref.current.scrollLeft = ref.current.scrollLeft;
  }, [ref, ballQueue]);
  async function goFullLandscape() {
    if (!isFullScreen()) {
      oldHeight = window.innerHeight;
      await fullScreenCall().call(document.body);
      await window.screen.orientation.lock("landscape");
      setLocked(true);
      setTimeout(() => {
        document.documentElement.style.setProperty('--view-height', window.innerHeight + 'px');
      }, 1000);
    }
  }
  async function exitFullLandscape() {
    if (isFullScreen()) {
      await exitFullScreenCall().call(document);
      await window.screen.orientation.unlock("landscape");
      document.documentElement.style.setProperty('--view-height', oldHeight + 'px');
    }
    setLocked(false);
  }
  const handleClickStartButton = event => {
    setGameStart(!gameStarted);
    if (!gameStarted && ballQueue.length === 0) {
      let spokenBall = new SpeechSynthesisUtterance('game started');
      synth.speak(spokenBall);
    }
  };
  const handleClickResetButton = () => {
    setModalOn(true);
    setModalMessage('Really reset the game?');
  };
  const handleClickAgreeButton = event => {
    setModalOn(false);
    setTimeout(() => {
      resetGame();
    }, 155);
  };
  const handleClickCancelButton = () => {
    setModalOn(false);
  };
  const resetGame = () => {
    setGameStart(false);
    setQueue([]);
    setBallsLeft([...Array(76).keys()].slice(1, 76));
  }
  let boardClass = modalOn ? 'dimmed' : '';
  let dangerArray = new Array(danger).fill('cock');
  let dangerClass = 'danger-bar';
  if (danger > 20) {
    dangerClass += ' dark-red';
  } else if (danger > 15) {
    dangerClass += ' red';
  } else if (danger > 10) {
    dangerClass += ' orange';
  } else if (danger > 5) {
    dangerClass += ' yellow';
  } else {
    dangerClass += ' green';
  }
  console.log('dange', dangerArray)
  return (
    <div id='app'>
      <header id='main-header'>
        {!locked ?
          <div onClick={goFullLandscape} id='fullscreen-toggle' className='header-button' />
          :
          <div onClick={exitFullLandscape} id='exit-fullscreen-toggle' className='header-button'>LOCKED</div>
        }
        {false ?
          <div id='danger-meter'>
            {dangerArray.map((entry, i) =>
              <div key={i} className={dangerClass}></div>
            )}
          </div>
          :
          <div id='title'>Bingo Bongo</div>
        }
        <div onTouchStart={() => null} id='account-button' className='header-button'></div>
      </header>
      <div id='game-board' className={boardClass}>
        <CallerArea ref={ref} ballQueue={ballQueue} gameStarted={gameStarted} />
        <div id='card-area'>
          {playerCards.map((card, c) =>
            <div key={c} className='card-space'><Card gameStarted={gameStarted} ballQueue={ballQueue} /></div>
          )}

        </div>
      </div>
      <StatusArea gameStarted={gameStarted} onClickStartButton={handleClickStartButton} onClickResetButton={handleClickResetButton} />
      <ConfirmModal showing={modalOn} message={modalMessage} onClickAgreeButton={handleClickAgreeButton} onClickCancelButton={handleClickCancelButton}/>
    </div>
  );
}

export default App;
