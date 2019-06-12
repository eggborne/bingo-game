import React, { useState, useCallback, useEffect, useRef } from 'react';
import Card from './components/Card';
import CallerArea from './components/CallerArea';
import CornerChicken from './components/CornerChicken';
import ButtonBar from './components/ButtonBar';
import ConfirmModal from './components/ConfirmModal';
import LogInScreen from './components/LogInScreen';
import GameEndModal from './components/GameEndModal';
import BonusIndicator from './components/BonusIndicator';
import StoreScreen from './components/StoreScreen';
import MapScreen from './components/MapScreen';
import Menu from './components/Menu';
import PreGameModal from './components/PreGameModal';
import './css/App.css';
import './css/HintArrow.css';
import { randomInt, isFullScreen, fullScreenCall, exitFullScreenCall, getTimeSinceFromSeconds, limits, shuffle } from './scripts/util';
import axios from 'axios';
import { Howl, Howler } from 'howler';
require('console-green');

const envTime = new Date(process.env.REACT_APP_CURRENT_SECONDS).getTime() / 1000;
const nowTime = new Date().getTime() / 1000;
const diff = Math.round(nowTime - envTime);
const sinceUpdated = getTimeSinceFromSeconds(diff);
let oldHeight = window.innerHeight;
let gameInterval = undefined;

document.documentElement.style.setProperty('--view-height', window.innerHeight + 'px');

// export const saveUser = (username, options) => {
//   return axios({
//     method: 'post',
//     url: 'https://www.eggborne.com/scripts/savenewpazaakuser.php',
//     headers: {
//       'Content-type': 'application/x-www-form-urlencoded'
//     },
//     params: {
//       username: username,
//       options: options
//     }
//   });
// };

export const chipImages = {
  red: require('./assets/bingochip.png'),
  blue: require('./assets/bingochipblue.png'),
  green: require('./assets/bingochipgreen.png'),
  orange: require('./assets/bingochiporange.png')
};

const quips = {
  ending: [undefined, [`Well spank my ass and call me Charlie. You got first place!`, `Holy crap, I can't believe it. Nice job.`, `I think you probably cheated.`], [`You got second place. I suppose we should have a parade.`], [`Ooooh, big whoop. Third place.`, `You came in third. I'm not impressed.`], [`I guess it's better than nothing`, `Fourth place? Really?`]],
  loss: [[`What a load of shit.`], [`Fuck this game straight to hell.`], [`Don't quit your day job.`]]
};

// let daubSound = undefined;
let bonusAlertSound = undefined;
let roundLoseSound = undefined;
let opponentBingoSound = undefined;
let pauseSound = undefined;
let freeSpaceSound = undefined;
let fanfare1 = undefined;
let fanfare2 = undefined;

const loadSounds = () => {
  console.log('loading sounds...');
  Howler.autoUnlock = true;
  bonusAlertSound = new Howl({
    src: ['https://chicken.bingo/static/media/sounds/alert.ogg'],
    volume: 0.5
  });
  roundLoseSound = new Howl({
    src: ['https://chicken.bingo/static/media/sounds/acurrentaffair.ogg'],
    volume: 0.75
  });
  opponentBingoSound = new Howl({
    src: ['https://chicken.bingo/static/media/sounds/crow1.ogg'],
    volume: 0.5
  });
  pauseSound = new Howl({
    src: ['https://chicken.bingo/static/media/sounds/pause.ogg'],
    volume: 0.5
  });
  freeSpaceSound = new Howl({
    src: ['https://chicken.bingo/static/media/sounds/freespace.ogg'],
    volume: 0.5
  });
  fanfare1 = new Howl({
    src: ['https://chicken.bingo/static/media/sounds/fanfare1.ogg'],
    volume: 0.5
  });
  fanfare2 = new Howl({
    src: ['https://chicken.bingo/static/media/sounds/fanfare2.ogg'],
    volume: 0.5
  });
};

const resetPage = () => {
  window.location.reload();
};
export const setCookie = (cname, cvalue, exdays) => {
  var d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  var expires = 'expires=' + d.toUTCString();
  document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
};
const getCookie = cookieName => {
  let cookieObj;
  let name = cookieName + '=';
  let decodedCookie = decodeURIComponent(document.cookie).split('; ');
  cookieObj = decodedCookie.filter(str => str.split('=')[0] === cookieName);
  if (cookieObj.length) {
    cookieObj = JSON.parse(cookieObj[0].split('=')[1]);
  } else {
    cookieObj = undefined;
  }
  return cookieObj;
};

export const logUserIn = (username, pass, token) => {
  return axios({
    method: 'post',
    url: 'https://chicken.bingo/php/bingologuserin.php',
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    },
    data: {
      username: username,
      pass: pass,
      token: token
    }
  });
};
export const checkUsername = username => {
  return axios({
    method: 'post',
    url: 'https://chicken.bingo/php/bingocheckusername.php',
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    },
    data: {
      username: username
    }
  });
};

export const attemptUserCreation = loginObj => {
  return axios({
    method: 'post',
    url: 'https://chicken.bingo/php/bingocreateuser.php',
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    },
    data: JSON.stringify(loginObj)
  });
};
export const updateUserData = (username, token, attribute, newValue) => {
  return axios({
    method: 'post',
    url: 'https://chicken.bingo/php/bingoupdateuser.php',
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    },
    data: {
      username: username,
      token: token,
      attribute: attribute,
      newValue: JSON.stringify(newValue)
    }
  });
};

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
  }
});

const getBingoPhonetic = num => {
  let rando = !randomInt(0, 40);
  if (num > 60) {
    return 'oh';
  }
  if (num > 45) {
    return rando ? 'under the jeez' : 'gee';
  }
  if (num > 30) {
    return 'en';
  }
  if (num > 15) {
    return 'I';
  }
  return rando ? 'under the bees' : 'bee';
};

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
synth.cancel();
const bgColors = ['#ffeeeeca', '#eeddffca', '#e2ffdeca'];

const defaultUser = {
  loggedIn: false,
  username: 'Guest',
  currency: {
    cash: 0
  },
  chickens: [],
  stats: {
    totalGames: 0,
    totalBingos: 0,
    greenArrows: 0,
    rankHistory: [],
    ballsToBingo: []
  },
  cards: [{ type: 'random' }, { type: 'random' }],
  prizes: [{ category: 'Markers', type: 'red', cost: 0 }],
  bonusChance: 15,
  cardSlots: 2,
  id: undefined,
  token: undefined
};
const defaultOptions = {
  playerCards: [{ type: 'random' }, { type: 'random' }],
  opponentCards: [{ type: 'random' }, { type: 'random' }, { type: 'random' }, { type: 'random' }, { type: 'random' }, { type: 'random' }, { type: 'random' }, { type: 'random' }, { type: 'random' }, { type: 'random' }, { type: 'random' }, { type: 'random' }],
  drawSpeed: 4500,
  showOpponentCards: false,
  voiceOn: true,
  soundOn: false,
  musicOn: false,
  autoFreeSpace: false,
  fitWide: 2,
  fitWideLandscape: 2,
  cardMargin: 0.03,
  cardMarginLandscape: 0.05,
  chipImage: `red`,
  preferredGameMode: 'Ranked'
};

const bonuses = [undefined, 'FREE'];
const gameModes = {
  Classic: { name: 'Classic', winPattern: 'Line / 4 Corners' },
  Ranked: { name: 'Ranked', winnerLimit: 4 },
  'Limited Balls': { name: 'Limited Balls', ballLimit: 35 },
  Standoff: { name: 'Standoff', winnerLimit: 4 },
  'Danger Zones': { name: 'Danger Zones' },
  Lightning: { name: 'Lightning', timeLimit: 30 }
};

function App() {
  console.green('App -----------------------------------');
  const saveRef = useRef();

  // STATE //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const [loaded, setLoaded] = useState(false);
  const [gotData, setGotData] = useState(false);
  const [randomBallSet, setRandomBallSet] = useState(
    shuffle(
      Array(75)
        .fill()
        .map((entry, i) => (entry = i))
    )
  );
  const [user, setUser] = useState(defaultUser);
  const [options, setOptions] = useState(defaultOptions);
  const [playersLeft, setPlayersLeft] = useState(options.opponentCards.length);
  const [ballsLeft, setBallsLeft] = useState([...Array(76).keys()].slice(1, 76));
  const [ballQueue, setQueue] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameInProgress, setGameInProgress] = useState(false);
  const [menuOn, setMenuOn] = useState(false);
  const [mapOn, setMapOn] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false); // 'logIn' or 'register'
  const [loggingOut, setLoggingOut] = useState(false);
  const [locked, setLocked] = useState(false);
  const [modalOn, setModalOn] = useState(false);
  const [modalMessage, setModalMessage] = useState('Really reset the game?');
  const [gameEnded, setGameEnded] = useState(false);
  const [errored, setErrored] = useState(false);
  const [prizePerCard, setPrizePerCard] = useState(25);
  const [changedUserData, setChangedUserData] = useState([]);
  const [menuMode, setMenuMode] = useState('settings');
  const [loginError, setLoginError] = useState('');
  const [storeOpen, setStoreOpen] = useState(false);
  const [winnerLimit, setWinnerLimit] = useState(4);
  const [ballLimit, setBallLimit] = useState(6);
  const [timeLimit, setTimeLimit] = useState(0);
  const [winPattern, setWinPattern] = useState('Line / 4 Corners');
  const [offeringBonus, setOfferingBonus] = useState(undefined);
  const [openingBonus, setOpeningBonus] = useState(undefined);
  const [preGameOn, setPreGameOn] = useState(false);
  const [lazy1, setLazy1] = useState(false);
  const [lastDrew, setLastDrew] = useState(0);
  const [currentBingos, setCurrentBingos] = useState([]);
  const [temporaryBonuses, setTemporaryBonuses] = useState({
    freeSpaces: []
  });
  const [gameMode, setGameMode] = useState(gameModes['Ranked']);
  const ref = useRef();
  const meterRef = useRef();

  // EFFECTS //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  useEffect(() => {
    let cookie = getCookie('eggborne-bingo');
    setLoaded(true);
    if (cookie) {
      logUserIn(cookie.username, null, cookie.token).then(response => {
        if (response.data === 'badUsername') {
          console.error('bad username.');
        } else if (response.data === 'badPassword') {
          console.error('bad password.');
        } else {
          let data = { ...response.data };
          if (!response.data) {
            setCookie('eggborne-bingo', null, 0);
            window.location.reload();
          } else {
            integrateLoggedInUser(data, true);
          }
        }
      });
    } else {
      let newUser = { ...user };
      let newOptions = { ...options };
      console.log('no cookie', options, user);
      setGotData(true);
      newUser.cards.map((card, c) => {
        if (card.type === 'random') {
          let newRandomNumbers = getRandomCardNumbers();
          card.numbers = newRandomNumbers;
          if (newOptions.playerCards[c]) {
            newOptions.playerCards[c].numbers = newRandomNumbers;
          }
        }
      });
      setUser(newUser);
      setOptions(newOptions);

      document.documentElement.style.setProperty('--card-size-landscape', `${1 - options.cardMarginLandscape}`);
      document.documentElement.style.setProperty('--card-size', `${1 - options.cardMargin}`);
    }
    // setPreGameOn(true);
    setTimeout(() => {
      setLazy1(true);
      loadSounds();
    }, 500);
    window.addEventListener('fullscreenchange', event => {
      setLocked(isFullScreen());
    });
  }, []);
  useInterval(() => {
    if (gameStarted) {
      console.log('pulling ball at', window.performance.now());
      ref.current.scrollLeft = -ref.current.scrollWidth;
      setTimeout(() => {
        drawBall();
      }, 300);
      counter++;
      if (user.username === 'Mike' || (counter > 0 && counter % randomInt(2, 3) === 0)) {
        let chanceToShow = randomInt(0, 100) < user.bonusChance || user.username === 'Mike';
        if (!offeringBonus && chanceToShow) {
          setTimeout(() => {
            setOfferingBonus(getRandomBonus());
            playSound(bonusAlertSound);
          }, options.drawSpeed / 1.5);
        }
      }
    }
    return this;
  }, options.drawSpeed);

  useEffect(() => {
    ref.current.scrollLeft = ref.current.scrollLeft;
  }, [ref, ballQueue]);
  useEffect(() => {
    if (gameMode.name === 'Limited Balls' && randomBallSet.length === 0) {
      let newRandomBalls = shuffle(
        Array(75)
          .fill()
          .map((entry, i) => (entry = i + 1))
      ).slice(0, ballLimit);
      console.log('randomBallSet was', randomBallSet);
      console.log('got newRandomBalls', newRandomBalls);
      setRandomBallSet(newRandomBalls);
    }
  }, [gameMode.name, ballLimit, randomBallSet.length, randomBallSet]);

  // FUNCTIONS //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const playSound = (sound, force) => {
    if (options.soundOn || force) {
      sound.play();
    }
  };
  function logOut() {
    setCookie('eggborne-bingo', null, 0);
    setUser(defaultUser);
    setOptions(defaultOptions);
    user.cards = defaultOptions.playerCards;
    document.documentElement.style.setProperty('--card-size-landscape', `${1 - defaultOptions.cardMarginLandscape}`);
    document.documentElement.style.setProperty('--card-size', `${1 - defaultOptions.cardMargin}`);
    document.documentElement.style.setProperty('--card-size-landscape', `${1 - defaultOptions.cardMargin}`);
    document.documentElement.style.setProperty('--card-size', `${1 - defaultOptions.cardMarginLandscape}`);
    document.documentElement.style.setProperty('--user-cards-wide', defaultOptions.fitWide);
    document.documentElement.style.setProperty('--user-cards-wide-landscape', defaultOptions.fitWideLandscape);
    if (menuOn) {
      setMenuOn(false);
      console.log('user now', defaultUser);
      console.log('options now', defaultOptions);
    }
  }
  function integrateLoggedInUser(data, remember) {
    for (let row in data) {
      if (typeof parseInt(data[row]) === 'number' && !isNaN(parseInt(data[row]))) {
        data[row] = parseInt(data[row]);
      }
    }
    data.options = JSON.parse(data.options);
    let newUser = { ...user };
    newUser.id = data.id;
    newUser.username = data.username;
    newUser.token = data.token;
    newUser.stats = JSON.parse(data.stats);
    newUser.currency = JSON.parse(data.currency);
    newUser.chickens = JSON.parse(data.chickens);
    newUser.prizes = JSON.parse(data.prizes);
    newUser.loggedIn = true;
    if (typeof data.cards === 'string') {
      data.cards = JSON.parse(data.cards);
    }
    newUser.cards = data.cards;
    newUser.cardSlots = data.cardSlots;
    newUser.bonusChance = data.bonusChance;

    setMenuMode(JSON.parse(data.menuMode));
    let newOptions = data.options;

    newUser.cards.map((card, c) => {
      console.log('newUser card', c, card);
      if (card.type === 'random') {
        let newRandomNumbers = getRandomCardNumbers();
        card.numbers = newRandomNumbers;
        console.log('created', newRandomNumbers);
        if (newOptions.playerCards[c]) {
          newOptions.playerCards[c].numbers = newRandomNumbers;
        }
      }
    });
    document.documentElement.style.setProperty('--user-cards-wide', newOptions.fitWide);
    document.documentElement.style.setProperty('--user-cards-wide-landscape', newOptions.fitWideLandscape);
    document.documentElement.style.setProperty('--card-size', `${1 - newOptions.cardMargin}`);
    document.documentElement.style.setProperty('--card-size-landscape', `${1 - newOptions.cardMarginLandscape}`);

    if (!newOptions.preferredGameMode || !Object.keys(gameModes).includes(newOptions.preferredGameMode)) {
      newOptions.preferredGameMode = defaultOptions.preferredGameMode;
    }
    let newMode = gameModes[newOptions.preferredGameMode];
    setGameMode(newMode);
    if (newMode.ballLimit) {
      setBallLimit(newMode.ballLimit);
    }
    if (newMode.winnerLimit) {
      setWinnerLimit(newMode.winnerLimit);
    }
    if (newMode.winPattern) {
      setWinPattern(newMode.winPattern);
    }
    if (newMode.timeLimit) {
      setTimeLimit(newMode.timeLimit);
    }
    setPlayersLeft(newOptions.opponentCards.length);
    document.documentElement.style.setProperty('--opponent-cards', newOptions.opponentCards.length);
    setOptions(newOptions);
    setUser(newUser);
    if (remember) {
      setCookie('eggborne-bingo', JSON.stringify({ username: newUser.username, token: newUser.token }), 365);
    }
    console.log('got that initial newUser from DB to state:', newUser);
    console.big('gotData!');
    setGotData(true);
  }

  async function goFullLandscape() {
    if (!isFullScreen()) {
      oldHeight = window.innerHeight;
      await fullScreenCall().call(document.body);
      setLocked(true);
      setTimeout(() => {
        document.documentElement.style.setProperty('--view-height', window.innerHeight + 'px');
      }, 800);
    }
  }
  async function exitFullLandscape() {
    if (isFullScreen()) {
      await exitFullScreenCall().call(document);
      document.documentElement.style.setProperty('--view-height', oldHeight + 'px');
      setLocked(false);
    }
  }
  const drawBall = () => {
    let queueCopy = [...ballQueue];
    let ballsCopy = [...ballsLeft];
    setLastDrew(counter);
    if (ballsCopy.length) {
      if (gameMode.name === 'Limited Balls' && !gameEnded && gameStarted && queueCopy.length === ballLimit) {
        // if (options.voiceOn) {
        //   let spokenOutPhrase = new SpeechSynthesisUtterance(`The limit of ` + ballLimit + ` balls has been reached.`);
        //   synth.speak(spokenOutPhrase);
        // }
        playSound(roundLoseSound);
        setGameEnded(true);
        setGameInProgress(false);
        setTimeout(() => {
          setGameStarted(false);
        }, 1500);
      } else {
        let number = ballsCopy.splice(randomInt(0, ballsLeft.length - 1), 1)[0];
        if (options.voiceOn) {
          let spokenLetter = new SpeechSynthesisUtterance(getBingoPhonetic(number));
          let spokenBall = new SpeechSynthesisUtterance(number);
          spokenLetter.rate = 0.4;
          spokenLetter.pitch = 0.5;
          spokenBall.rate = 0.5;
          spokenBall.pitch = 0.5;
          if (number === 13 && !randomInt(0, 20)) {
            spokenLetter.rate = 0.5;
            spokenLetter.pitch = 0.5;
            spokenLetter.text = 'My lucky number, B 13';
            spokenBall.text = '';
          }
          synth.speak(spokenLetter);
          synth.speak(spokenBall);
        }
        queueCopy.push(number);
        setQueue(queueCopy);
        setBallsLeft(ballsCopy);
      }
    } else {
      if (options.voiceOn) {
        let spokenOutPhrase = new SpeechSynthesisUtterance(`Oh darn, I'm all out of balls.`);
        spokenOutPhrase.rate = 0.6;
        spokenOutPhrase.pitch = 0.4;
        synth.speak(spokenOutPhrase);
      }
      setGameStarted(false);
      setGameInProgress(false);
    }
  };
  const getRandomBonus = () => {
    // let randomIndex = 0;
    // let freeSpace = !randomInt(0, 1);
    // let freeSpace = true;
    // if (freeSpace) {
    //   randomIndex = 1;
    // }
    return 'FREE';
  };
  const handleClickStartButton = () => {
    console.log('handle ballQueue', ballQueue);
    if (!gameStarted) {
      let preGameShowing = !document.getElementById('pre-game-modal').classList.contains('hidden');
      console.error('game not started');
      if (ballQueue.length === 0) {
        // start
        counter = 0;
        if (storeOpen) {
          setStoreOpen(false);
        }
        if (mapOn) {
          setMapOn(false);
        }
        if (!preGameShowing) {
          setPreGameOn(true);
        } else {
          setPreGameOn(false);
          startGame();
        }
      } else {
        // unpause

        playSound(pauseSound);
        setGameStarted(true);
      }
    } else {
      if (ballQueue.length) {
        playSound(pauseSound);
        setGameStarted(false);
      }
    }
  };
  const startGame = () => {
    if (preGameOn) {
      setPreGameOn(false);
    }
    setGameInProgress(true);
    setGameStarted(true);
  };
  const handleClickVoiceButton = () => {
    var newOptions = { ...options };
    newOptions.voiceOn = !options.voiceOn;
    if (newOptions.voiceOn) {
    } else {
      synth.cancel();
    }
    setOptions(newOptions);
    if (user.loggedIn) {
      updateUserData(user.username, user.token, 'options', newOptions).then(response => {
        if (response.data === 'UPDATED') {
          saveRef.current.classList.add('showing');
          setTimeout(() => {
            saveRef.current.classList.remove('showing');
          }, 1200);
        }
      });
    }
  };
  const handleClickCloseButton = () => {
    setModalOn('urgent');
    setModalMessage('Really quit the whole game?');
  };
  const handleClickOkayButton = event => {
    setGameEnded(false);
    resetGame();
  };
  const handleClickAgreeButton = event => {
    console.log('clicked innerHTML', event.target.innerHTML);
    synth.cancel();
    if (gameStarted || ballQueue.length) {
      setModalOn(false);
      setTimeout(() => {
        resetGame();
      }, 20);
    } else if (loggingOut) {
      logOut();
      setLoggingOut(false);
      setModalOn(false);
    }
  };
  const handleClickCancelButton = () => {
    if (modalOn) {
      setModalOn(false);
      if (errored) {
        setTimeout(() => {
          setErrored(false);
        }, 310);
      }
    } else if (preGameOn) {
      setPreGameOn(false);
    } else if (loggingIn) {
      setLoggingIn(false);
    }
  };
  const handleChangeCallSpeed = newSeconds => {
    let newSpeed = newSeconds * 1000;
    let newOptions = { ...options };
    newOptions.drawSpeed = newSpeed;
    setOptions(newOptions);
    if (user.loggedIn) {
      if (!changedUserData.includes('options')) {
        setChangedUserData([...changedUserData, 'options']);
      }
    }
  };
  const handleChangeCardMargin = newMargin => {
    let newOptions = { ...options };
    if (window.innerWidth > window.innerHeight) {
      newOptions.cardMarginLandscape = newMargin;
      setOptions(newOptions);
      document.documentElement.style.setProperty('--card-size-landscape', `${1 - newMargin}`);
    } else {
      newOptions.cardMargin = newMargin;
      setOptions(newOptions);
      document.documentElement.style.setProperty('--card-size', `${1 - newMargin}`);
    }
    if (user.loggedIn) {
      if (!changedUserData.includes('options')) {
        setChangedUserData([...changedUserData, 'options']);
      }
    }
  };
  const handleClickMenu = () => {
    console.log('played??');
    if (menuOn) {
      let optionsCopy = { ...options };
      if (user.loggedIn && changedUserData) {
        if (changedUserData.includes('cards')) {
          updateUserData(user.username, user.token, 'cards', user.cards).then(response => {
            if (response.data === 'UPDATED') {
              saveRef.current.classList.add('showing');
              setTimeout(() => {
                saveRef.current.classList.remove('showing');
              }, 1200);
            }
          });
        }
        if (changedUserData.includes('options')) {
          updateUserData(user.username, user.token, 'options', optionsCopy).then(response => {
            if (response.data === 'UPDATED') {
              saveRef.current.classList.add('showing');
              setTimeout(() => {
                saveRef.current.classList.remove('showing');
              }, 1200);
            }
          });
        }
        updateUserData(user.username, user.token, 'menuMode', menuMode);
      }
    } else {
      setChangedUserData([]);
    }
    setMenuOn(!menuOn);
  };
  const handleClickMenuArrow = type => {
    let newOptions = { ...options };
    let newUser = { ...user };
    if (!gameStarted && !ballQueue.length) {
      if (type === 'player-cards-minus') {
        if (newOptions.playerCards.length > 1) {
          newOptions.playerCards.pop();
          // newUser.cards = newOptions.playerCards;
          // setUser(newUser);
          setOptions(newOptions);
          if (!changedUserData.includes('options')) {
            setChangedUserData([...changedUserData, 'options']);
          }
        }
      } else if (type === 'player-cards-plus') {
        if (newOptions.playerCards.length < user.cardSlots) {
          newOptions.playerCards.push(user.cards[newOptions.playerCards.length]);
          // newUser.cards = newOptions.playerCards;
          // setUser(newUser);
          setOptions(newOptions);
          if (!changedUserData.includes('options')) {
            setChangedUserData([...changedUserData, 'options']);
          }
        }
      } else if (type === 'opponent-cards-minus') {
        let minOpponents = user.username === 'Mike' ? 0 : 12;
        if (newOptions.opponentCards.length > minOpponents) {
          if (newOptions.opponentCards.length > 200) {
            newOptions.opponentCards.length -= 100;
          } else if (newOptions.opponentCards.length > 30) {
            newOptions.opponentCards.length -= 10;
          } else {
            newOptions.opponentCards.length -= 1;
          }
          setOptions(newOptions);
          setPlayersLeft(newOptions.opponentCards.length);
          document.documentElement.style.setProperty('--opponent-cards', newOptions.opponentCards.length);
          if (!changedUserData.includes('options')) {
            setChangedUserData([...changedUserData, 'options']);
          }
        }
      } else if (type === 'opponent-cards-plus') {
        let maxOpponents = user.username === 'Mike' ? 1000 : 30;
        if (newOptions.opponentCards.length < maxOpponents) {
          if (newOptions.opponentCards.length < 30) {
            newOptions.opponentCards.push({ type: 'random' });
          } else if (newOptions.opponentCards.length < 100) {
            for (let i = 0; i < 10; i++) {
              newOptions.opponentCards.push({ type: 'random' });
            }
          } else {
            for (let i = 0; i < 100; i++) {
              newOptions.opponentCards.push({ type: 'random' });
            }
          }
          setOptions(newOptions);
          setPlayersLeft(newOptions.opponentCards.length);
          document.documentElement.style.setProperty('--opponent-cards', newOptions.opponentCards.length);
          if (!changedUserData.includes('options')) {
            setChangedUserData([...changedUserData, 'options']);
          }
        }
      }
    }
    if (type === 'toggleFullScreen') {
      if (isFullScreen()) {
        exitFullLandscape();
      } else {
        goFullLandscape();
      }
    } else if (type === 'toggleVoice') {
      newOptions.voiceOn = !newOptions.voiceOn;
      setOptions(newOptions);
      if (!changedUserData.includes('options')) {
        setChangedUserData([...changedUserData, 'options']);
      }
    } else if (type === 'toggleSound') {
      newOptions.soundOn = !newOptions.soundOn;
      if (newOptions.soundOn) {
        console.error('sousdnsd!');
        playSound(bonusAlertSound, true);
      }
      setOptions(newOptions);
      if (!changedUserData.includes('options')) {
        setChangedUserData([...changedUserData, 'options']);
      }
    } else if (type === 'toggleShowOpponentCards') {
      newOptions.showOpponentCards = !newOptions.showOpponentCards;
      setOptions(newOptions);
      if (!changedUserData.includes('options')) {
        setChangedUserData([...changedUserData, 'options']);
      }
    } else if (type === 'toggleAutoFreeSpace') {
      newOptions.autoFreeSpace = !newOptions.autoFreeSpace;
      setOptions(newOptions);
      if (!changedUserData.includes('options')) {
        setChangedUserData([...changedUserData, 'options']);
      }
    }
    let wideOption = window.innerWidth > window.innerHeight ? 'fitWideLandscape' : 'fitWide';
    let cssVar = window.innerWidth > window.innerHeight ? '--user-cards-wide-landscape' : '--user-cards-wide';
    let allColors = Object.keys(chipImages);
    let chipColors = [];
    user.prizes
      .filter(prize => allColors.includes(prize.type))
      .forEach(prize => {
        chipColors.push(prize.type);
      });
    if (type === 'fit-plus') {
      if (newOptions[wideOption] < 24) {
        newOptions[wideOption]++;
        document.documentElement.style.setProperty(cssVar, newOptions[wideOption]);
        setOptions(newOptions);
        if (!changedUserData.includes('options')) {
          setChangedUserData([...changedUserData, 'options']);
        }
      }
    } else if (type === 'fit-minus') {
      if (newOptions[wideOption] > 1) {
        newOptions[wideOption]--;
        document.documentElement.style.setProperty(cssVar, newOptions[wideOption]);
        setOptions(newOptions);
        if (!changedUserData.includes('options')) {
          setChangedUserData([...changedUserData, 'options']);
        }
      }
    } else if (type === 'marker-plus') {
      let newIndex = chipColors.indexOf(newOptions.chipImage) + 1;
      if (newIndex > chipColors.length - 1) {
        newIndex = 0;
      }
      newOptions.chipImage = chipColors[newIndex];
      setOptions(newOptions);
      if (!changedUserData.includes('options')) {
        setChangedUserData([...changedUserData, 'options']);
      }
    } else if (type === 'marker-minus') {
      let newIndex = chipColors.indexOf(newOptions.chipImage) - 1;
      if (newIndex < 0) {
        newIndex = chipColors.length - 1;
      }
      newOptions.chipImage = chipColors[newIndex];
      setOptions(newOptions);
      if (!changedUserData.includes('options')) {
        setChangedUserData([...changedUserData, 'options']);
      }
    }
  };

  const handleAchieveBingo = opponent => {
    if (gameMode.name === 'Ranked') {
      if (opponent) {
        let newPlayers = playersLeft - 1;
        setPlayersLeft(newPlayers);
        if (newPlayers === options.opponentCards.length - winnerLimit && gameStarted) {
          if (options.voiceOn) {
            // synth.cancel();
            // let losingQuip = quips.loss[randomInt(0, quips.loss.length - 1)];
            // let spokenOutPhrase = new SpeechSynthesisUtterance(losingQuip);
            // setTimeout(() => {
            //   synth.speak(spokenOutPhrase);
            // }, 1000);
          }
          roundLoseSound.play();
          let newUser = { ...user };
          newUser.stats.totalGames++;
          if (user.loggedIn) {
            updateUserData(user.username, user.token, 'stats', newUser.stats);
          }
          meterRef.current.classList.remove('critical');
          setGameStarted(false);
          setGameInProgress(false);
          setGameEnded(true);
        } else if (newPlayers > options.opponentCards.length - winnerLimit) {
          opponentBingoSound.stop();
          playSound(opponentBingoSound);
          meterRef.current.classList.add('alert');
          setTimeout(() => {
            if (meterRef.current) {
              meterRef.current.classList.remove('alert');
              meterRef.current.style.backgroundColor = 'transparent';
              if (newPlayers === options.opponentCards.length - winnerLimit + 1) {
                meterRef.current.classList.add('critical');
              }
            } else {
              console.error('no meterRef to change back');
            }
          }, 1320);
        }
      } else {
        if (options.voiceOn) {
          // synth.cancel();
          // let spokenOutPhrase = new SpeechSynthesisUtterance(`Bingo!`);
          // synth.speak(spokenOutPhrase);
        }
        if (gameStarted) {
          let prizeMoney = playersLeft * prizePerCard;
          let rank = options.opponentCards.length - playersLeft + 1;
          console.error('rank is', rank);
          let newUser = { ...user };
          let newBingos = 1;
          let winMusic = rank === 1 ? fanfare1 : fanfare2;
          playSound(winMusic);
          newUser.currency.cash += prizeMoney;
          newUser.stats.totalBingos += newBingos;
          newUser.stats.totalGames++;
          if (rank) {
            newUser.stats.rankHistory.push(rank);
          }
          newUser.stats.ballsToBingo.push(ballQueue.length);
          setUser(newUser);
          if (user.loggedIn) {
            updateUserData(user.username, user.token, 'stats', newUser.stats);
            updateUserData(user.username, user.token, 'currency', newUser.currency);
          }
          setGameStarted(false);
          setTimeout(() => {
            setGameEnded(true);
            setGameInProgress(false);
            if (options.voiceOn) {
              // synth.cancel();
              // let endingQuip = quips.ending[rank][randomInt(0, quips.ending[rank].length - 1)];
              // let spokenOutPhrase = new SpeechSynthesisUtterance(endingQuip);
              // synth.speak(spokenOutPhrase);
            }
          }, 2500);
        }
      }
    }
    if (gameMode.name === 'Limited Balls') {
      if (opponent) {
        // playSound(opponentBingoSound)
      } else {
        playSound(fanfare2);
        let newUser = { ...user };
        newUser.stats.totalBingos++;
        setUser(newUser);
        if (user.loggedIn) {
          updateUserData(user.username, user.token, 'stats', newUser.stats);
        }
        let newBingos = [...currentBingos];
        newBingos.push({});
        setCurrentBingos(newBingos);
      }
    }
  };

  const handleClickLogIn = () => {
    setLoggingIn('logIn');
  };
  const handleClickLogOut = () => {
    setLoggingOut(true);
    setModalOn(true);
    setModalMessage('Really log out?');
  };
  const handleClickLogInButton = (enteredName, enteredPass, remember) => {
    setLoginError('LOGGING IN...');
    logUserIn(enteredName, enteredPass).then(response => {
      if (typeof response.data === 'string') {
        setLoginError(response.data);
        setTimeout(() => {
          setLoginError('');
        }, 2000);
      } else {
        setLoginError('LOGGED IN!');
        setTimeout(() => {
          setLoginError('');
          let data = { ...response.data };
          integrateLoggedInUser(data, remember);
          setLoggingIn(false);
        }, 200);
      }
    });
  };
  const getRandomCardNumbers = () => {
    let newNumbers = [[], [], [], [], []];
    let used = [];
    newNumbers.map((column, i) => {
      for (let n = 0; n < 5; n++) {
        let randomNumber = 99;
        if (i === 2 && n === 2) {
          // free space
        } else {
          // randomNumber = randomInt(limits[n].min, limits[n].max);
          randomNumber = randomInt(limits[n][0], limits[n][limits[n].length - 1]);
          while (used.includes(randomNumber)) {
            // randomNumber = randomInt(limits[n].min, limits[n].max);
            randomNumber = randomInt(limits[n][0], limits[n][limits[n].length - 1]);
          }
        }
        column[n] = randomNumber;
        used.push(randomNumber);
      }
    });
    return newNumbers;
  };
  const handleClickRegisterButton = (enteredName, enteredPass, remember, errorMessage) => {
    setLoginError('REGISTERING...');
    if (errorMessage) {
      setLoginError(errorMessage);
      setTimeout(() => {
        setLoginError('');
      }, 2000);
    } else {
      attemptUserCreation({ username: enteredName, pass: enteredPass, options: JSON.stringify(options), stats: JSON.stringify(user.stats), getToken: true }).then(response => {
        if (typeof response.data === 'string') {
          setLoginError(response.data);
          setTimeout(() => {
            setLoginError('');
          }, 2000);
        } else {
          setLoginError('ACCOUNT CREATED!');
          setTimeout(() => {
            setLoginError('');
          }, 2000);
          logUserIn(enteredName, enteredPass).then(response => {
            if (response.data === 'NO SUCH USER.') {
              console.error('bad username AFTER REGISTER?.');
            } else if (response.data === 'WRONG PASSWORD.') {
              console.error('bad password AFTER REGISTER?.');
            } else {
              // create two random cards
              let randomCards = [{ type: 'custom', numbers: [] }, { type: 'custom', numbers: [] }];
              for (let i = 0; i < 2; i++) {
                let newNumbers = getRandomCardNumbers();
                randomCards[i].numbers = newNumbers;
              }
              let data = { ...response.data };
              data.cards = randomCards;
              updateUserData(enteredName, data.token, 'cards', data.cards).then(response => {
                integrateLoggedInUser(data, remember);
                setLoggingIn(false);
              });
            }
          });
        }
      });
    }
  };

  const handleClickStoreButton = () => {
    setStoreOpen(!storeOpen);
  };
  const handleClickBuyButton = useCallback(
    itemData => {
      itemData = {
        description: itemData.description,
        description: itemData.description,
        type: itemData.type,
        cost: itemData.cost
      };
      let newUser = { ...user };
      let newPrizes = [...newUser.prizes, itemData];
      newUser.prizes = newPrizes;
      newUser.currency.cash -= itemData.cost;
      if (itemData.type === 'Card Slot') {
        newUser.cardSlots++;
        updateUserData(user.username, user.token, 'cardSlots', newUser.cardSlots);
      } else if (itemData.type.split(' ').includes('Bonus')) {
        let extraPercent = parseInt(itemData.type.split(' ')[0]);
        console.orange('giving ' + extraPercent);
        newUser.bonusChance += extraPercent;
        updateUserData(user.username, user.token, 'bonusChance', newUser.bonusChance);
      }
      setUser(newUser);
      updateUserData(user.username, user.token, 'currency', newUser.currency).then(response => {
        console.log('curr updated?', response);
      });
      updateUserData(user.username, user.token, 'prizes', newPrizes).then(response => {
        console.log('updated inv?', response);
      });
    },
    [user]
  );

  const handleClickInactiveCard = () => {
    console.log('gameStarted?', gameStarted);
    console.log('ballQueue.length?', ballQueue.length);
    if (!gameStarted && !preGameOn) {
      setPreGameOn(true);
    }
    // let newUser = { ...user };
    // if (newUser.currency.cash) {
    //   newUser.currency.cash--;
    //   setUser(newUser);
    //   requestAnimationFrame(() => {
    //     updateUserData(user.username, user.token, 'currency', newUser.currency);
    //   });
    // }
  };
  const handleDaubSquare = () => {
    playSound(daubSound);
  };

  const isFreeSpace = (cardIndex, num) => {
    let isFree = false;
    console.log(temporaryBonuses.freeSpaces);
    temporaryBonuses.freeSpaces.map(space => {
      if (space.num === num && space.cardIndex === cardIndex) {
        console.big('MATCH //////////////');
        console.log(num);
        isFree = true;
      } else if (space.num === num) {
        console.big('MATHCED, BUT NOT ON THIS CARD');
        console.log(num);
      }
    });
    return isFree;
  };

  const handleClickGift = () => {
    if (offeringBonus === 'FREE') {
      playSound(freeSpaceSound);
      let newBonuses = { ...temporaryBonuses };
      let playerCards = [...options.playerCards];
      let cardIndex = randomInt(0, playerCards.length - 1);
      let randomCard = playerCards[cardIndex];
      let flat = [...randomCard.numbers[0], ...randomCard.numbers[1], ...randomCard.numbers[2], ...randomCard.numbers[3], ...randomCard.numbers[4]];
      let unfilteredNumbers = flat.filter(num => !ballQueue.includes(num) && num !== 99);
      let uncalledNumbers = flat.filter(num => !ballQueue.includes(num) && !isFreeSpace(cardIndex, num) && num !== 99);
      // let unfilteredNumbers = randomCard.numbers.flat(2).filter(num => !ballQueue.includes(num) && num !== 99);
      // let uncalledNumbers = randomCard.numbers.flat(2).filter(num => !ballQueue.includes(num) && !isFreeSpace(cardIndex, num) && num !== 99);
      // console.info('user cards', [...user.cards]);
      // console.info('playerCards', playerCards);
      // console.info('unfiltered numbers', unfilteredNumbers);
      // console.info('using uncalled numbers', uncalledNumbers);
      // console.log('temp bonuses', temporaryBonuses)
      let randomNumber = uncalledNumbers[randomInt(0, uncalledNumbers.length - 1)];
      newBonuses.freeSpaces.push({ cardIndex: cardIndex, num: randomNumber });
      setTemporaryBonuses(newBonuses);
      setOpeningBonus({ type: offeringBonus, value: randomNumber });
    } else if (typeof offeringBonus === 'number') {
      let newUser = { ...user };
      newUser.currency.cash += offeringBonus;
      setUser(newUser);
      if (user.loggedIn) {
        updateUserData(user.username, user.token, 'currency', newUser.currency);
      }
    } else if (offeringBonus === 'BUST') {
      let newUser = { ...user };
      newUser.currency.cash -= 100;
      if (newUser.currency.cash < 0) {
        newUser.currency.case = 0;
      }
      setUser(newUser);
      updateUserData(user.username, user.token, 'currency', newUser.currency);
    }
    setOfferingBonus(undefined);
    setTimeout(() => {
      setOpeningBonus(false);
    }, 1400);
  };

  const handleClickStopButton = () => {
    setModalOn(true);
    setModalMessage('Really end the current game?');
  };
  const handleClickMapButton = () => {
    setMapOn(!mapOn);
  };
  const handleClickChangeMode = direction => {
    let modesArray = Object.keys(gameModes);
    let currentIndex = modesArray.indexOf(gameMode.name);
    console.log('currentInd', currentIndex);
    let newIndex = undefined;
    if (direction === 'previous') {
      newIndex = currentIndex - 1;
      if (newIndex < 0) {
        newIndex = modesArray.length - 1;
      }
    } else {
      newIndex = currentIndex + 1;
      if (newIndex > modesArray.length - 1) {
        newIndex = 0;
      }
    }
    let newMode = gameModes[modesArray[newIndex]];
    console.log('set newMode', newMode);
    console.log('modesArray[newIndex]', modesArray[newIndex]);
    setGameMode(newMode);
    let newOptions = { ...options };
    newOptions.preferredGameMode = newMode.name;
    if (newMode.ballLimit) {
      setBallLimit(newMode.ballLimit);
    }
    if (newMode.winnerLimit) {
      setWinnerLimit(newMode.winnerLimit);
    }
    if (newMode.winPattern) {
      setWinPattern(newMode.winPattern);
    }
    if (newMode.timeLimit) {
      setTimeLimit(newMode.timeLimit);
    }
    setOptions(newOptions);
    if (user.loggedIn) {
      updateUserData(user.username, user.token, 'options', newOptions).then(response => {
        if (response.data === 'UPDATED') {
          saveRef.current.classList.add('showing');
          setTimeout(() => {
            saveRef.current.classList.remove('showing');
          }, 1200);
        }
      });
    }
  };

  const resetGame = () => {
    if (options.voiceOn) {
      synth.cancel();
    }
    setGameStarted(false);
    setGameInProgress(false);
    setPlayersLeft(options.opponentCards.length);
    setQueue([]);
    setCurrentBingos([]);
    if (randomBallSet.length) {
      setRandomBallSet([]);
    }
    // setTimeout(() => {
    setBallsLeft([...Array(76).keys()].slice(1, 76));
    // }, 20);
    let newOptions = { ...options };
    let newUser = { ...user };
    newUser.cards.map((card, c) => {
      console.log('newUser card', c, card);
      if (card.type === 'random') {
        let newRandomNumbers = getRandomCardNumbers();
        card.numbers = newRandomNumbers;
        console.log('created', newRandomNumbers);
        if (newOptions.playerCards[c]) {
          newOptions.playerCards[c].numbers = newRandomNumbers;
        }
      }
    });
    console.log('newUSer is', newUser);
    setUser(newUser);
    setOptions(newOptions);
  };

  // RENDER //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  let isFull = isFullScreen();
  let fitWide = window.innerWidth > window.innerHeight ? options.fitWideLandscape : options.fitWide;
  let playerAreaClass = modalOn ? 'card-area dimmed' : 'card-area';
  if (!gotData) {
    playerAreaClass += ' hidden';
  }
  let opponentAreaClass = options.showOpponentCards ? 'card-area' : 'card-area hidden';
  // let playerCardCount = user.cards.length;
  let playerCardCount = options.playerCards.length;
  let opponentCardCount = options.opponentCards.length;
  let remainingPlayers = new Array(playersLeft);
  remainingPlayers.fill(null, 0, playersLeft);
  let dangerClass = 'danger-bar';
  let barListClass = '';
  if (gameMode.name === 'Limited Balls') {
    barListClass += ' ball-counter';
  } else if (gameMode.name === 'Ranked') {
    dangerClass += ' green';
  }
  // if (remainingPlayers.length === options.opponentCards.length) {
  //   dangerClass += ' green';
  // } else if (remainingPlayers.length > options.opponentCards.length * 0.75) {
  //   dangerClass += ' yellow';
  // } else if (remainingPlayers.length > options.opponentCards.length * 0.5) {
  //   dangerClass += ' orange';
  // } else if (remainingPlayers.length > options.opponentCards.length * 0.3) {
  //   dangerClass += ' red';
  // } else if (remainingPlayers.length < options.opponentCards.length * 0.3) {
  //   dangerClass += ' dark-red';
  // }
  let fsClass = 'status-button';
  if (isFull) {
    fsClass += ' full';
  }
  let menuButtonClass = 'status-button';
  let gameBoardClass = '';
  if (menuOn) {
    menuButtonClass += ' on';
  }
  let displayName = user.username;
  let usernameClass = 'normal';
  let letterWidth = user.username.split(' ').sort((a, b) => b.length - a.length)[0].length;
  if (letterWidth > 12) {
    displayName = [displayName.substr(0, 8) + '-', displayName.substr(8, displayName.length)];
    usernameClass = 'smaller';
  } else {
    displayName = [displayName];
  }
  let currentCardMargin = window.innerWidth > window.innerHeight ? options.cardMarginLandscape : options.cardMargin;
  let bingosLeft = winnerLimit - (options.opponentCards.length - playersLeft);
  let ballsRemaining = ballLimit - ballQueue.length;
  let prizeMoney = 0;
  if (gameMode.name === 'Ranked') {
    prizeMoney = playersLeft * prizePerCard;
  }
  if (gameMode.name === 'Limited Balls') {
    let basePrize = currentBingos.length * (75 - ballLimit) * 25;
    let volumeBonus = currentBingos.length * currentBingos.length * 10;
    console.log('basePrize', basePrize);
    console.log('volumeBonus', volumeBonus);
    prizeMoney = basePrize + volumeBonus;
  }

  // console.log('randomBallSet',randomBallSet)
  return (
    <div id="app" className={!loaded ? 'zoomed' : ''}>
      <div id="app-background" />

      <header id="main-header">
        {!menuOn &&
          (gameStarted || ballQueue.length ? (
            <>
              <div id="danger-meter" ref={meterRef} className={gameStarted ? '' : 'blurred'}>
                {gameMode.name === 'Ranked' && (
                  <div id="bingos-left-display">
                    <div>
                      <small>Bingos left:</small>
                    </div>
                    <div id="bingos-left-count">{bingosLeft}</div>
                  </div>
                )}
                {/* {gameMode.name === 'Limited Balls' &&
                <div id='balls-left-display'>
                  <div><small>Balls left:</small></div>
                  <div id='balls-left-count'>{ballsRemaining}</div>
                </div>
              } */}
                <div id="danger-bar-list" className={barListClass}>
                  {gameMode.name === 'Ranked'
                    ? remainingPlayers.map((entry, i) => <div key={i} className={dangerClass} />)
                    : gameMode.name === 'Limited Balls'
                    ? Array(ballLimit)
                        .fill()
                        .map((remainingBall, b) => <div key={b} className={b >= ballsRemaining ? dangerClass + ' called' : dangerClass} />)
                    : null}
                </div>
                {gameMode.name === 'Ranked' && (
                  <div id="prize-label" className={dangerClass.split(' ')[1]}>
                    <div>
                      <small>Prize: </small>${playersLeft * prizePerCard}
                    </div>
                  </div>
                )}
                {gameMode.name === 'Limited Balls' && (
                  <div id="bingos-label" className={dangerClass.split(' ')[1]}>
                    <div>
                      <small>Bingos:</small>
                      <br />
                      {currentBingos.length}
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div id="title">
              <div id="logo" className={lazy1 ? '' : 'featured'}>
                chicken.bingo
              </div>
              <small>{`updated ${sinceUpdated} ago`}</small>
            </div>
          ))}
        {menuOn ? (
          <>
            <div id="header-end">
              <button onClick={locked ? exitFullLandscape : goFullLandscape} id="fullscreen-toggle" className={fsClass}>
                <i className="material-icons">{fsClass.includes('full') ? `fullscreen_exit` : `fullscreen`}</i>
              </button>
            </div>
            <button onPointerDown={() => setMenuMode('display')} id="display-button" className={menuMode === 'display' ? `status-button on` : `status-button`}>
              <i className="material-icons">tv</i>
            </button>
            <button onPointerDown={() => setMenuMode('settings')} id="settings-button" className={menuMode === 'settings' ? `status-button on` : `status-button`}>
              <i className="material-icons">settings</i>
            </button>
            <button onPointerDown={() => setMenuMode('cards')} id="cards-button" className={menuMode === 'cards' ? `status-button on` : `status-button`} />
          </>
        ) : (
          ''
        )}
        <div
          onPointerDown={() => {
            if (menuOn) {
              setMenuMode('account');
            } else {
              if (storeOpen) {
                setStoreOpen(false);
              }
              if (gameStarted) {
                setMenuMode('account');
                setMenuOn(true);
              } else {
                if (!user.loggedIn) {
                  setLoggingIn('logIn');
                } else {
                  setMenuMode('account');
                  setMenuOn(true);
                }
              }
            }
          }}
          id="account-button"
          className={`status-button${menuOn ? ' truncated' : ''}${menuOn && menuMode === 'account' ? ' on' : ''}${user.loggedIn ? ' logged-in' : ''}${!gotData ? ' hidden' : ''}`}
        >
          <i className="material-icons">person</i>
          <div id="header-username" className={usernameClass}>
            {displayName.map((name, n) => (
              <div key={n}>{name}</div>
            ))}
          </div>
          <div>${user.currency.cash}</div>
        </div>
        <button onPointerDown={handleClickMenu} id="menu-button" className={menuButtonClass}>
          <div id="menu-bar-container">
            <div className="menu-bar" />
            <div className="menu-bar" />
            <div className="menu-bar" />
          </div>
        </button>
      </header>

      <div
        id="game-board"
        className={gameBoardClass}
        onPointerDown={() => {
          if (menuOn) {
            handleClickMenu();
          }
        }}
      >
        <CallerArea ref={ref} ballQueue={ballQueue} gameStarted={gameStarted} />
        <div id="player-card-area" className={playerAreaClass}>
          {options.playerCards.map((card, c) => (
            <div key={c} className="card-space">
              <Card
                ready={gotData}
                username={user.username}
                index={c}
                type={card.type}
                bonusOffered={offeringBonus}
                ballLimitReached={ballQueue.length > ballLimit}
                bonusFreeSpaces={temporaryBonuses.freeSpaces}
                chipImage={options.chipImage}
                autoFreeSpace={options.autoFreeSpace}
                // cardData={user.cards[c] ? user.cards[c] : ''}
                cardData={card}
                gameStarted={gameStarted}
                ballQueue={ballQueue}
                onDaubSquare={handleDaubSquare}
                playersLeft={playersLeft}
                onAchieveBingo={handleAchieveBingo}
                onClickInactiveCard={handleClickInactiveCard}
                gameMode={gameMode}
              />
            </div>
          ))}
        </div>
        <div id="opponent-card-area" className={opponentAreaClass}>
          {options.opponentCards.map((card, c) => (
            <div key={c} className="card-space">
              <Card index={c} ready={loaded} type={card.type} cardData={card} bonusOffered={offeringBonus} ballLimitReached={ballQueue.length > ballLimit} bonusFreeSpaces={[]} opponent={true} gameStarted={gameStarted} ballQueue={ballQueue} onAchieveBingo={handleAchieveBingo} gameMode={gameMode} />
            </div>
          ))}
        </div>
      </div>
      {gotData && (
        <>
          <ButtonBar gameStarted={gameStarted} gameInProgress={gameInProgress} closing={!gameStarted && !ballQueue.length} storeOpen={storeOpen} mapOn={mapOn} voiceOn={options.voiceOn} queueLength={ballQueue.length} chickenCount={user.chickens.length} showOpponentCards={options.showOpponentCards} onClickStartButton={handleClickStartButton} onClickStopButton={handleClickStopButton} onClickStoreButton={handleClickStoreButton} onClickVoiceButton={handleClickVoiceButton} onClickMapButton={handleClickMapButton} onClickResetButton={handleClickCloseButton} onClickChickensButton={resetPage} />

          {lazy1 && (
            <>
              {!gameStarted && !gameInProgress && (
                <div id="hint-arrow" className={'hint-arrow-container pointing-at-start'}>
                  <i className="material-icons hint-arrow">arrow_downward</i>
                </div>
              )}
              {!user.loggedIn && <LogInScreen showing={loggingIn} loginError={loginError} onClickLogInButton={handleClickLogInButton} onClickRegisterButton={handleClickRegisterButton} onClickCancelButton={handleClickCancelButton} />}
              <ConfirmModal showing={modalOn} message={modalMessage} loggingOut={loggingOut} onClickAgreeButton={handleClickAgreeButton} onClickCancelButton={handleClickCancelButton} />
              {/* {gameInProgress && */}
              <GameEndModal gameMode={gameMode} showing={gameEnded} currentBingos={currentBingos} prizeMoney={prizeMoney} winnerLimit={winnerLimit} ballLimit={ballLimit} totalOpponents={options.opponentCards.length} rank={options.opponentCards.length - playersLeft + 1} lost={options.opponentCards.length - playersLeft + 1 > winnerLimit} onClickOkayButton={handleClickOkayButton} />
              {/* } */}
              <Menu
                menuMode={menuMode}
                user={user}
                chickenCount={user.chickens.length}
                stats={user.stats}
                cardSlots={user.cardSlots}
                bonusChance={user.bonusChance}
                chipImage={options.chipImage}
                showOpponentCards={options.showOpponentCards}
                voiceOn={options.voiceOn}
                soundOn={options.soundOn}
                showing={menuOn}
                gameStarted={gameStarted}
                gameInProgress={gameInProgress}
                drawSpeed={options.drawSpeed}
                playerCardCount={playerCardCount}
                opponentCardCount={opponentCardCount}
                cardMargin={currentCardMargin}
                autoFreeSpace={options.autoFreeSpace}
                fitWide={fitWide}
                isFullScreen={isFull}
                onClickMenu={handleClickMenu}
                onClickMenuArrow={handleClickMenuArrow}
                onChangeCallSpeed={handleChangeCallSpeed}
                onChangeCardMargin={handleChangeCardMargin}
                onClickLogIn={handleClickLogIn}
                onClickLogOut={handleClickLogOut}
              />
              {/* {gameStarted && */}
              <CornerChicken showing={gameStarted || gameInProgress} paused={!gameStarted} gameStarted={gameStarted} showingGift={offeringBonus} onClickGift={handleClickGift} />
              {/* } */}
              {gameInProgress && <BonusIndicator openingBonus={openingBonus && openingBonus.type} gameNews={gameEnded && 'GAME OVER'} />}
              {!gameInProgress && <MapScreen showing={mapOn} userCash={user.currency.cash} chickenCount={user.chickens.length} />}
              {!gameInProgress && <StoreScreen showing={storeOpen} userPrizes={user.prizes} userCash={user.currency.cash} onClickBuyButton={handleClickBuyButton} />}
              <div id="save-icon" ref={saveRef}>
                <i className="material-icons">save</i>
                <small>Saved</small>
              </div>
            </>
          )}
          <PreGameModal showing={preGameOn} gameMode={gameMode} winnerLimit={winnerLimit} ballLimit={ballLimit} winPattern={winPattern} timeLimit={timeLimit} opponentCount={opponentCardCount} onClickChangeMode={handleClickChangeMode} onClickBeginGame={startGame} onClickCancelButton={handleClickCancelButton} />
        </>
      )}
    </div>
  );
}

export default App;
export const daubSound = new Howl({
  src: ['https://chicken.bingo/static/media/sounds/daub.ogg'],
  volume: 0.5
});
