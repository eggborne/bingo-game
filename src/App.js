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
import ClickBonusIndicator from './components/ClickBonusIndicator';
import './css/App.css';
import './css/HintArrow.css';
import { randomInt, isFullScreen, fullScreenCall, exitFullScreenCall, getTimeSinceFromSeconds, limits, shuffle, calls } from './scripts/util';
import axios from 'axios';
import { Howl, Howler } from 'howler';
import { resolve } from 'dns';
require('console-green');

const lockTypes = [undefined, 'landscape', 'portrait'];

const envTime = new Date(process.env.REACT_APP_CURRENT_SECONDS).getTime() / 1000;
const nowTime = new Date().getTime() / 1000;
const diff = Math.round(nowTime - envTime);
const sinceUpdated = getTimeSinceFromSeconds(diff);
let oldHeight = window.innerHeight;
let gameInterval = undefined;

let simStart = 0;

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
  orange: require('./assets/bingochiporange.png'),
  // pepper: require('./assets/pepper.png'),
  tomato: require('./assets/tomato.webp') || require('./assets/tomato.png')
};

let daubSound = undefined;
let bonusAlertSound1 = undefined;
let bonusAlertSound2 = undefined;
let ballSound = undefined;
let spraySound = undefined;
let refillSound = undefined;
let bonusAlertSound3 = undefined;
let roundOverSound = undefined;
let roundLoseSound = undefined;
let opponentBingoSound = undefined;
let pauseSound = undefined;
let getFreeSpaceSound = undefined;
let freeSpaceSound = undefined;
let freeSpaceSound2 = undefined;
let beeSound = undefined;
let fanfare1 = undefined;
let fanfare2 = undefined;
let orchestraHitSound = undefined;

let mediaRoot = 'https://chicken.bingo/static/media';

let loadStartTime = 0;

export const hotShotsVideo = require('./assets/hotshots2.webm')

// mediaRoot = './assets'

const loadSounds = async () => {
  loadStartTime = window.performance.now();
  // Howler.autoSuspend = false;
  let promise = new Promise((resolve) => {
    daubSound = new Howl({
      src: [mediaRoot + '/sounds/shortclick.ogg'],
      volume: 0.5
    });
    ballSound = new Howl({
      src: [mediaRoot + '/sounds/daub.ogg'],
      volume: 0.5
    });
    refillSound = new Howl({
      src: [mediaRoot + '/sounds/refill.ogg'],
      volume: 0.5
    });
    // bonusAlertSound1 = new Howl({
    //   src: [mediaRoot + '/sounds/alert1.ogg'],
    //   volume: 0.5
    // });
    // bonusAlertSound2 = new Howl({
    //   src: [mediaRoot + '/sounds/alert2.ogg'],
    //   volume: 0.5
    // });
    bonusAlertSound3 = new Howl({
      src: [mediaRoot + '/sounds/alert3.ogg'],
      volume: 0.35
    });
    roundOverSound = new Howl({
      src: [mediaRoot + '/sounds/acurrentaffair.ogg'],
      volume: 0.75
    });
    roundLoseSound = new Howl({
      src: [mediaRoot + '/sounds/lose.wav'],
      volume: 0.75
    });
    opponentBingoSound = new Howl({
      src: [mediaRoot + '/sounds/crow1.ogg'],
      volume: 0.5
    });
    pauseSound = new Howl({
      src: [mediaRoot + '/sounds/pause.ogg'],
      volume: 0.35
    });
    refillSound = new Howl({
      src: [mediaRoot + '/sounds/refill.ogg'],
      volume: 0.5
    });
    orchestraHitSound = new Howl({
      src: [mediaRoot + '/sounds/orchestrahit.ogg'],
      volume: 0.5
    });
    getFreeSpaceSound = new Howl({
      src: [mediaRoot + '/sounds/getfreespace.ogg'],
      volume: 1
    });
    freeSpaceSound = new Howl({
      src: [mediaRoot + '/sounds/freespace.ogg'],
      volume: 0.5
    });
    freeSpaceSound2 = new Howl({
      src: [mediaRoot + '/sounds/freespace2.ogg'],
      volume: 0.5
    });
    beeSound = new Howl({
      src: [mediaRoot + '/sounds/bee.wav'],
      volume: 0.75
    });
    spraySound = new Howl({
      src: [mediaRoot + '/sounds/spray.ogg'],
      volume: 0.75
    });
    fanfare1 = new Howl({
      src: [mediaRoot + '/sounds/fanfare1.ogg'],
      volume: 0.5
    });
    fanfare2 = new Howl({
      src: [mediaRoot + '/sounds/fanfare2.ogg'],
      volume: 0.5,
      onload: () => resolve('last loaded')
    });
  })
  let done = await promise;
  console.warn('loaded sounds in', (window.performance.now() - loadStartTime))
  return done;
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

const getBingoPhonetic = (num, letterOnly) => {
  let rando = !letterOnly && !randomInt(0, 40);
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
    cash: 100
  },
  chickens: [],
  stats: {
    totalGames: 0,
    totalBingos: 0,
    beesKilled: 0,
    rankHistory: [],
    ballsToBingo: [],
    'Classic': {
      'Games Played': 0,
      'Games Won': 0,
      'Quickest Bingo': 75,
    },
    'Ranked': {
      'Games Played': 0,
      'Games Won': 0,
      'Best Rank': 1,
      'Quickest Bingo': 75,
    },
    'Bonanza': {
      'Games Played': 0,
      'Games Won': 0,
      'Most Bingos': 1,
      'Quickest Bingo': 75,
    },
    'Countdown': {
      'Games Played': 0,
      'Games Won': 0,
      'Most Bingos': 1,
      'Quickest Bingo': 75,
    }
  },
  cards: [{ id: 0, type: 'random' }, { id: 1, type: 'random' }],
  prizes: [{ id: 0, cost: 10, category: 'Markers', displayName: 'Red Chips', description: 'Red Chips', type: 'red', imgSrc: 'bingochip.png', imgHeight: '10vmin', class: 'item-row item-selection' }],
  consumables: [],
  bonusChance: 50,
  cardSlots: [{cardId: 0}, {cardId: 1}],
  itemSlots: [{item: undefined}],
  chickenSlots: [{chickenId: -1}, {chickenId: -1}],
  id: undefined,
  token: undefined
};
const defaultOptions = {
  playerCards: [{ id: 0, type: 'random' }, { id: 1, type: 'random' }],
  opponentCards: [
    { type: 'random' },
    { type: 'random' },
    { type: 'random' },
    { type: 'random' },
    { type: 'random' },
    { type: 'random' },
    { type: 'random' },
    { type: 'random' },
    { type: 'random' },
    { type: 'random' },
    { type: 'random' },
    { type: 'random' },
    { type: 'random' },
    { type: 'random' },
    { type: 'random' },
    { type: 'random' },
    { type: 'random' },
    { type: 'random' },
    { type: 'random' },
    { type: 'random' },
    { type: 'random' },
    { type: 'random' },
    { type: 'random' },
    { type: 'random' }
  ],
  drawSpeed: 4500,
  showOpponentCards: false,
  voiceOn: true,
  fancyCalls: false,
  soundOn: true,
  musicOn: false,
  autoFreeSpace: true,
  fitWide: 2,
  fitWideLandscape: 2,
  cardMargin: 0.03,
  cardMarginLandscape: 0.05,
  chipImage: `red`,
  preferredGameMode: 'Ranked'
};

const bonuses = ['FREE', 'BEE'];
const gameModes = {
  'Classic': { unlocked: false, name: 'Classic', winPattern: 'Line / 4 Corners' },
  'Ranked': { unlocked: true, name: 'Ranked', winnerLimit: 5 },
  'Bonanza': { unlocked: true, name: 'Bonanza', bingoLimit: 24},
  'Countdown': { unlocked: false, name: 'Countdown', ballLimit: 35 },
  // 'Standoff': { unlocked: false, name: 'Standoff', winnerLimit: 4 },
  // 'Danger Zones': { unlocked: false, name: 'Danger Zones' },
  // 'Lightning': { unlocked: false, name: 'Lightning', timeLimit: 30 }
};

const applyOptionsCSS = (newOptions) => {
  document.documentElement.style.setProperty('--opponent-cards', newOptions.opponentCards.length);
  document.documentElement.style.setProperty('--card-size-landscape', `${1 - newOptions.cardMarginLandscape}`);
  document.documentElement.style.setProperty('--card-size', `${1 - newOptions.cardMargin}`);
  document.documentElement.style.setProperty('--user-cards-wide', newOptions.fitWide);
  document.documentElement.style.setProperty('--user-cards-wide-landscape', newOptions.fitWideLandscape);
}

function App() {
  let appStart = window.performance.now();
  const saveRef = useRef();

  // STATE //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const [loaded, setLoaded] = useState(false);
  const [soundsLoaded, setSoundsLoaded] = useState(false);
  const [gotData, setGotData] = useState(false);
  const [user, setUser] = useState(defaultUser);
  const [options, setOptions] = useState(defaultOptions);
  const [currentBallSet, setCurrentBallSet] = useState([]);
  const [calledBalls, setCalledBalls] = useState([]);
  const [playersLeft, setPlayersLeft] = useState(options.opponentCards.length);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameInProgress, setGameInProgress] = useState(false);
  const [menuOn, setMenuOn] = useState(false);
  const [mapOn, setMapOn] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false); // 'logIn' or 'register'
  const [loggingOut, setLoggingOut] = useState(false);
  const [locked, setLocked] = useState(false);
  const [orientationLock, setOrientationLock] = useState('landscape');
  const [modalOn, setModalOn] = useState(false);
  const [modalMessage, setModalMessage] = useState('Really reset the game?');
  const [gameEnded, setGameEnded] = useState(false);
  const [errored, setErrored] = useState(false);
  const [prizePerCard, setPrizePerCard] = useState(100);
  const [changedUserData, setChangedUserData] = useState([]);
  const [menuMode, setMenuMode] = useState('settings');
  const [loginError, setLoginError] = useState('');
  const [storeOpen, setStoreOpen] = useState(false);
  const [winnerLimit, setWinnerLimit] = useState(4);
  const [ballLimit, setBallLimit] = useState(35);
  const [timeLimit, setTimeLimit] = useState(30);
  const [winPattern, setWinPattern] = useState('Line / 4 Corners');
  const [offeringBonus, setOfferingBonus] = useState(undefined);
  const [openingBonus, setOpeningBonus] = useState(undefined);
  const [preGameOn, setPreGameOn] = useState(false);
  const [lazy1, setLazy1] = useState(false);
  const [lastDrew, setLastDrew] = useState(0);
  const [lastDaubed, setLastDaubed] = useState(0);
  const [currentBingos, setCurrentBingos] = useState(0);
  const [roundBingos, setRoundBingos] = useState(0);
  const [daubSpeedHistory, setDaubSpeedHistory] = useState([]);
  const [currentBeeChance, setCurrentBeeChance] = useState(5);
  const [bonusMeter, setBonusMeter] = useState(0);
  const [bonusRechargeRate, setBonusRechargeRate] = useState(100);
  const [pausedWithMenu, setPausedWithMenu] = useState(false);
  const [powerupSelected, setPowerupSelected] = useState(undefined);
  const [showingBonusText, setShowingBonusText] = useState(false);
  const [temporaryBonuses, setTemporaryBonuses] = useState({
    freeSpaces: []
  });
  const [gameMode, setGameMode] = useState(gameModes['Ranked']);
  const [recordsBroken, setRecordsBroken] = useState(undefined);
  const [speedBonus, setSpeedBonus] = useState(0);
  const ref = useRef();
  const chickenRef = useRef();
  const meterRef = useRef();
  const [opponentCardProgress, setOpponentCardProgress] = useState([...defaultOptions.opponentCards]);

  // EFFECTS //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  useEffect(() => {
    let cookie = getCookie('eggborne-bingo');
    setLoaded(true);
    if (cookie) {
      logUserIn(cookie.username, null, cookie.token).then(response => {
        if (response.data === 'badUsername') {
          // console.error('bad username.');
        } else if (response.data === 'badPassword') {
          // console.error('bad password.');
        } else {
          let data = { ...response.data };
          if (!response.data) {
            console.error('BAD COOKIE!')
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
      newUser.cards.map((card, c) => {
        if (card.type === 'random') {
          card.numbers = getRandomCardNumbers();
        }
      });
      integrateModeRules(newOptions);
      setGotData(true);
      setUser(newUser);
      setOptions(newOptions)
      applyOptionsCSS(newOptions);
      setOpponentCardProgress(newOptions.opponentCards)
    }
    // setPreGameOn(true);
    setTimeout(() => {
      setLazy1(true);
    }, 1000);
    window.addEventListener('fullscreenchange', event => {
      setLocked(isFullScreen());
    });
  }, []);
  useInterval(() => {
    if (gameStarted) {
      if (counter % 1 === 0) {
        ref.current.scrollLeft = -ref.current.scrollWidth;
        playSound(ballSound);
        setTimeout(() => {
          drawBall();
        }, 450);
      }
      if (!gameEnded && !offeringBonus) {
        if (bonusMeter >= 1000) {
          setOfferingBonus(getRandomBonus());
          playSound(orchestraHitSound);
          setBonusMeter(bonusMeter - 1000);
        } else {
          setBonusMeter(bonusMeter + bonusRechargeRate);
        }
      }
      counter += 0.5;
    }
    return this;
  }, Math.round(options.drawSpeed / 2));

  const peck = async () => {
    let promise = new Promise((resolve) => {
      setTimeout(() => {
        chickenRef.current.src = require('./assets/chickenpeck.png');
        setTimeout(() => {
          chickenRef.current.src = require('./assets/chickenstand.png');
        }, 180);
      }, 180);
    })
    let peckDone = await promise;
    return peckDone;
  }
  const flap = async () => {
    let promise = new Promise((resolve) => {
      setTimeout(() => {
        chickenRef.current.src = require('./assets/chickenrun1.png');
        setTimeout(() => {
          chickenRef.current.src = require('./assets/chickenrun2.png');
          setTimeout(() => {
            chickenRef.current.src = require('./assets/chickenstand.png');
          }, 180);
        }, 180);
      }, 180);
    })
    let flapDone = await promise;
    return flapDone;
  }

  useEffect(() => {
    // if (gameMode.name === 'Countdown' && currentBallSet.length === 0) {
    if (gameStarted && !currentBallSet.length) {
      let ballSetSize = gameMode.name === 'Countdown' ? ballLimit : 75;
      let newRandomBalls = shuffle(
        Array(75)
          .fill()
          .map((entry, i) => (entry = i + 1))
      ).slice(0, ballSetSize);
      setCurrentBallSet(newRandomBalls);
      setCalledBalls([]);
    }
  }, [gameStarted, gameMode.name, ballLimit, currentBallSet]);

  // FUNCTIONS //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const playSound = (sound, force) => {
    if (options.soundOn || force) {
      sound.play();
    }
  };
  async function logOut() {
    if (gameStarted) {
      await resetGame();
    }
    setCookie('eggborne-bingo', null, 0);
    let newUser = defaultUser;
    newUser.cards.map((card, c) => {
      if (card.type === 'random') {
        let newRandomNumbers = getRandomCardNumbers();
        card.numbers = newRandomNumbers;
      }
    });
    setUser(newUser);
    setOptions(defaultOptions);
    // document.documentElement.style.setProperty('--card-size-landscape', `${1 - defaultOptions.cardMarginLandscape}`);
    // document.documentElement.style.setProperty('--card-size', `${1 - defaultOptions.cardMargin}`);
    // document.documentElement.style.setProperty('--card-size-landscape', `${1 - defaultOptions.cardMargin}`);
    // document.documentElement.style.setProperty('--card-size', `${1 - defaultOptions.cardMarginLandscape}`);
    // document.documentElement.style.setProperty('--user-cards-wide', defaultOptions.fitWide);
    // document.documentElement.style.setProperty('--user-cards-wide-landscape', defaultOptions.fitWideLandscape);
    applyOptionsCSS(defaultOptions);
    if (menuOn) {
      setMenuOn(false);
    }
  }
  function integrateLoggedInUser(data, remember) {
    for (let row in data) {
      if (typeof parseInt(data[row]) === 'number' && !isNaN(parseInt(data[row]))) {
        data[row] = parseInt(data[row]);
      }
    }
    data.options = JSON.parse(data.options);
    data.options.cardMargin = parseFloat(data.options.cardMargin);
    data.options.cardMarginLandscape = parseFloat(data.options.cardMarginLandscape);
    let newUser = { ...user };
    newUser.id = data.id;
    newUser.username = data.username;
    newUser.token = data.token;
    newUser.stats = { ...defaultUser.stats, ...JSON.parse(data.stats) };
    newUser.currency = JSON.parse(data.currency);
    newUser.chickens = JSON.parse(data.chickens);
    if (data.prizes) {
      newUser.prizes = JSON.parse(data.prizes);
    }
    // newUser.consumables = JSON.parse(data.consumables);
    newUser.loggedIn = true;
    if (typeof data.cards === 'string') {
      data.cards = JSON.parse(data.cards);
    }
    newUser.cards = data.cards;

    newUser.cardSlots = JSON.parse(data.cardSlots);
    if (data.itemSlots) {
      newUser.itemSlots = JSON.parse(data.itemSlots);
    }
    if (data.chickenSlots) {
      newUser.chickenSlots = JSON.parse(data.chickenSlots);
    }
    newUser.bonusChance = data.bonusChance;

    setMenuMode(JSON.parse(data.menuMode));
    // setMenuMode(JSON.parse(data.lastShopMode));                  ???
    let newOptions = data.options;

    newUser.cards.map((card, c) => {
      if (newUser.cardSlots[c].cardId !== -1 && card.type === 'random') {
        let newRandomNumbers = getRandomCardNumbers();
        card.numbers = newRandomNumbers;
      }
    });

    if (!newOptions.preferredGameMode || !Object.keys(gameModes).includes(newOptions.preferredGameMode)) {
      newOptions.preferredGameMode = defaultOptions.preferredGameMode;
    }
    let newMode = gameModes[newOptions.preferredGameMode];
    setGameMode(newMode);
    setPlayersLeft(newOptions.opponentCards.length);
    if (newMode.ballLimit) {
      setBallLimit(newMode.ballLimit);
    }
    if (newMode.winnerLimit) {
      setWinnerLimit(newMode.winnerLimit);
    } else if (newMode.bingoLimit) {
      setWinnerLimit(newMode.bingoLimit)
    } else {
      setWinnerLimit(newOptions.opponentCards.length);
    }
    if (newMode.winPattern) {
      setWinPattern(newMode.winPattern);
    }
    if (newMode.timeLimit) {
      setTimeLimit(newMode.timeLimit);
    }
    setOptions(newOptions);
    applyOptionsCSS(newOptions);
    setOpponentCardProgress(newOptions.opponentCards);
    // if (newOptions.soundOn) {
    //   loadSounds().then((response) => {
    //     console.pink(response, 'PRELOAD -------- loaded sounds in ' + Math.round(window.performance.now() - loadStartTime));
    //     setSoundsLoaded(true);
    //   });
    // }
    setUser(newUser);
    if (remember) {
      setCookie('eggborne-bingo', JSON.stringify({ username: newUser.username, token: newUser.token }), 365);
    }
    console.log('got initial newUser from DB to state:', newUser);
    setGotData(true);
  }
  async function goFullLandscape() {
    if (!isFullScreen()) {
      oldHeight = window.innerHeight;
      await fullScreenCall().call(document.body);
      if (orientationLock) { await window.screen.orientation.lock(orientationLock); }
      setLocked(true);
      setTimeout(() => {
        document.documentElement.style.setProperty('--view-height', window.innerHeight + 'px');
      }, 800);
    }
  }
  async function exitFullLandscape() {
    if (isFullScreen()) {
      await window.screen.orientation.unlock();
      await exitFullScreenCall().call(document);
      document.documentElement.style.setProperty('--view-height', oldHeight + 'px');
      setLocked(false);
    }
  }
  const drawBall = () => {
    setLastDrew(Date.now());
    let newBallSet = [...currentBallSet];
    if (calledBalls.length < currentBallSet.length) {
      let number = newBallSet[calledBalls.length];
      let letter = getBingoPhonetic(number, options.fancyCalls);
      if (options.voiceOn) {
        let spokenLetter = new SpeechSynthesisUtterance(letter);
        let spokenNumber = new SpeechSynthesisUtterance(number);
        // spokenLetter.rate = 0.4;
        spokenLetter.pitch = 0.5;
        // spokenNumber.rate = 0.5;
        spokenNumber.pitch = 0.5;
        if (!options.fancyCalls && number === 13 && !randomInt(0, 10)) {
          spokenLetter.rate = 0.5;
          spokenLetter.pitch = 0.5;
          spokenLetter.text = 'My lucky number, B 13';
          spokenNumber.text = '';
        }
        if (options.fancyCalls) {
          let fancyCall = new SpeechSynthesisUtterance(calls[number])
          // fancyCall.rate = 0.4;
          fancyCall.pitch = 0.5;
          // fancyCall.rate = 0.5;
          fancyCall.pitch = 0.5;
          synth.speak(fancyCall);
        }
        synth.speak(spokenLetter);
        synth.speak(spokenNumber);
      }
      // setCurrentBallSet(newBallSet);
      setCalledBalls([...calledBalls, number]);
      // setTimeout(() => {
      //   updateOpponentCardProgress();
      // }, 500);
    } else {
      if (gameMode.name === 'Countdown') {
        if (!gameEnded) {
          playSound(roundOverSound);
          setGameEnded(true);
          setTimeout(() => {
            setGameInProgress(false);
            setGameStarted(false);
          }, 1500);
        }
      }
    }

    // if (ballSetCopy.length) {
    //   if (gameMode.name === 'Countdown' && !gameEnded && gameStarted && queueCopy.length === ballLimit) {
    //     // if (options.voiceOn) {
    //     //   let spokenOutPhrase = new SpeechSynthesisUtterance(`The limit of ` + ballLimit + ` balls has been reached.`);
    //     //   synth.speak(spokenOutPhrase);
    //     // }
    //     playSound(roundOverSound);
    //     setGameEnded(true);
    //     setTimeout(() => {
    //       setGameInProgress(false);
    //       setGameStarted(false);
    //     }, 1500);
    //   } else {
    //     let number = ballsCopy.splice(randomInt(0, ballsLeft.length - 1), 1)[0];
    //     if (options.voiceOn) {
    //       let spokenLetter = new SpeechSynthesisUtterance(getBingoPhonetic(number));
    //       let spokenNumber = new SpeechSynthesisUtterance(number);
    //       spokenLetter.rate = 0.4;
    //       spokenLetter.pitch = 0.5;
    //       spokenNumber.rate = 0.5;
    //       spokenNumber.pitch = 0.5;
    //       if (number === 13 && !randomInt(0, 10)) {
    //         spokenLetter.rate = 0.5;
    //         spokenLetter.pitch = 0.5;
    //         spokenLetter.text = 'My lucky number, B 13';
    //         spokenNumber.text = '';
    //       }
    //       synth.speak(spokenLetter);
    //       synth.speak(spokenNumber);
    //     }
    //     queueCopy.push(number);
    //     setCalledBalls(queueCopy);
    //     setBallsLeft(ballsCopy);
    //   }
    // } else {
    //   if (options.voiceOn) {
    //     let spokenOutPhrase = new SpeechSynthesisUtterance(`Oh darn, I'm all out of balls.`);
    //     spokenOutPhrase.rate = 0.6;
    //     spokenOutPhrase.pitch = 0.4;
    //     synth.speak(spokenOutPhrase);
    //   }
    //   setGameStarted(false);
    //   setGameInProgress(false);
    // }
  };




  // const drawBall = () => {
  //   let queueCopy = [...calledBalls];
  //   let ballsCopy = [...ballsLeft];
  //   setLastDrew(Date.now());
  //   if (ballsCopy.length) {
  //     if (gameMode.name === 'Countdown' && !gameEnded && gameStarted && queueCopy.length === ballLimit) {
  //       // if (options.voiceOn) {
  //       //   let spokenOutPhrase = new SpeechSynthesisUtterance(`The limit of ` + ballLimit + ` balls has been reached.`);
  //       //   synth.speak(spokenOutPhrase);
  //       // }
  //       playSound(roundOverSound);
  //       setGameEnded(true);
  //       setTimeout(() => {
  //         setGameInProgress(false);
  //         setGameStarted(false);
  //       }, 1500);
  //     } else {
  //       let number = ballsCopy.splice(randomInt(0, ballsLeft.length - 1), 1)[0];
  //       if (options.voiceOn) {
  //         let spokenLetter = new SpeechSynthesisUtterance(getBingoPhonetic(number));
  //         let spokenNumber = new SpeechSynthesisUtterance(number);
  //         spokenLetter.rate = 0.4;
  //         spokenLetter.pitch = 0.5;
  //         spokenNumber.rate = 0.5;
  //         spokenNumber.pitch = 0.5;
  //         if (number === 13 && !randomInt(0, 10)) {
  //           spokenLetter.rate = 0.5;
  //           spokenLetter.pitch = 0.5;
  //           spokenLetter.text = 'My lucky number, B 13';
  //           spokenNumber.text = '';
  //         }
  //         synth.speak(spokenLetter);
  //         synth.speak(spokenNumber);
  //       }
  //       queueCopy.push(number);
  //       setCalledBalls(queueCopy);
  //       setBallsLeft(ballsCopy);
  //     }
  //   } else {
  //     if (options.voiceOn) {
  //       let spokenOutPhrase = new SpeechSynthesisUtterance(`Oh darn, I'm all out of balls.`);
  //       spokenOutPhrase.rate = 0.6;
  //       spokenOutPhrase.pitch = 0.4;
  //       synth.speak(spokenOutPhrase);
  //     }
  //     setGameStarted(false);
  //     setGameInProgress(false);
  //   }
  // };
  const getRandomBonus = () => {
    return randomInt(0, 10) > currentBeeChance ? 'FREE' : 'BEE';
  };
  const startGame = () => {
    if (preGameOn) {
      setPreGameOn(false);
    }
    setGameInProgress(true);
    setGameStarted(true);
  };
  const flashSavedIcon = () => {
    saveRef.current.classList.add('showing');
    setTimeout(() => {
      saveRef.current.classList.remove('showing');
    }, 800);
  }
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
          flashSavedIcon();
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
    synth.cancel();
    if (loggingOut) {
      logOut();
      setLoggingOut(false);
      setModalOn(false);
    } else if (gameStarted || calledBalls.length) {
      setModalOn(false);
      // if (document.getElementById('hot-shots-2')) {
      //   document.getElementById('hot-shots-2').style.display = 'none';
      //   document.getElementById('hot-shots-2').stop();
      // }
      setTimeout(() => {
        resetGame();
      }, 20);
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
    }
    if (preGameOn) {
      setPreGameOn(false);
    }
    if (loggingIn) {
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
    if (menuOn) {
      let optionsCopy = { ...options };
      let userCopy = { ...user };
      if (user.loggedIn && changedUserData) {
        if (changedUserData.includes('cards')) {
          updateUserData(user.username, user.token, 'cards', user.cards).then(response => {
            if (response.data === 'UPDATED') {
              flashSavedIcon();
            }
          });
        }
        if (changedUserData.includes('options')) {
          updateUserData(user.username, user.token, 'options', optionsCopy).then(response => {
            if (response.data === 'UPDATED') {
              flashSavedIcon();
            }
          });
        }
        if (changedUserData.includes('cardSlots')) {
          updateUserData(user.username, user.token, 'cardSlots', userCopy.cardSlots).then(response => {
            if (response.data === 'UPDATED') {
              flashSavedIcon();
            }
          });
        }
        updateUserData(user.username, user.token, 'menuMode', menuMode);
      }
    } else {
      setChangedUserData([]);
    }
    // if (gameStarted) {
    //   setPausedWithMenu(true);
    //   setGameStarted(false);
    // } else {
    //   if (pausedWithMenu) {
    //     setPausedWithMenu(false);
    //     setGameStarted(true);
    //   }
    // }
    setMenuOn(!menuOn);
  };

  const handleClickMenuArrow = type => {
    let newOptions = { ...options };
    let newUser = { ...user };
    let lockIndex = undefined;
    let filledSlots = 0;
    switch (type) {
      case 'player-cards-minus':
        filledSlots = newUser.cardSlots.filter(slot => slot.cardId > -1);
        if (filledSlots.length > 1) {
          newUser.cardSlots[filledSlots.length - 1].cardId = -1;;
          setUser(newUser);
          if (!changedUserData.includes('cardSlots')) {
            setChangedUserData([...changedUserData, 'cardSlots']);
          }
        }
        break;
      case 'player-cards-plus':
        filledSlots = newUser.cardSlots.filter(slot => slot.cardId > -1);
        if (filledSlots.length < user.cardSlots.length) {
          newUser.cardSlots[filledSlots.length].cardId = filledSlots.length;
          setUser(newUser);
          if (!changedUserData.includes('cardSlots')) {
            setChangedUserData([...changedUserData, 'cardSlots']);
          }
        }
        break;
      case 'opponent-cards-minus':
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
        break;
      case 'opponent-cards-plus':
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
        break;
      case 'toggleFullScreen':
        if (isFullScreen()) {
          exitFullLandscape();
        } else {
          goFullLandscape();
        }
        break;
      case 'lock-minus':
        lockIndex = lockTypes.indexOf(orientationLock) - 1;
        if (lockIndex >= 0) {
          setOrientationLock(lockTypes[lockIndex]);
        } else {
          setOrientationLock(lockTypes[lockTypes.length - 1])
        }
        break;
      case 'lock-plus':
        lockIndex = lockTypes.indexOf(orientationLock) + 1;
        if (lockIndex < lockTypes.length) {
          setOrientationLock(lockTypes[lockIndex]);
        } else {
          setOrientationLock(lockTypes[0])
        }
        break;
      case 'toggleVoice':
        if (options.voiceOn) {
          synth.cancel();
        }
        newOptions.voiceOn = !newOptions.voiceOn;
        setOptions(newOptions);
        if (!changedUserData.includes('options')) {
          setChangedUserData([...changedUserData, 'options']);
        }
        break;
      case 'toggleFancyCalls':
        if (!newOptions.fancyCalls) {
          newOptions.fancyCalls = true;
        } else {
          newOptions.fancyCalls = false;
        }
        // newOptions.fancyCalls = !newOptions.fancyCalls;
        setOptions(newOptions);
        if (!changedUserData.includes('options')) {
          setChangedUserData([...changedUserData, 'options']);
        }
        break;
      case 'toggleSound':
        if (options.soundOn) {
          // Howler.muted(true);
        } else {
          // Howler.muted(false);
          if (!soundsLoaded) {
            loadSounds().then((response) => {
              console.pink('toggle loaded sounds in ' + (window.performance.now() - loadStartTime));
              setSoundsLoaded(true);
            });
          }
        }
        newOptions.soundOn = !newOptions.soundOn;
        setOptions(newOptions);
        if (!changedUserData.includes('options')) {
          setChangedUserData([...changedUserData, 'options']);
        }
        break;
      case 'toggleShowOpponentCards':
        newOptions.showOpponentCards = !newOptions.showOpponentCards;
        setOptions(newOptions);
        if (!changedUserData.includes('options')) {
          setChangedUserData([...changedUserData, 'options']);
        }
        break;
      case 'toggleAutoFreeSpace':
        newOptions.autoFreeSpace = !newOptions.autoFreeSpace;
        setOptions(newOptions);
        if (!changedUserData.includes('options')) {
          setChangedUserData([...changedUserData, 'options']);
        }
        break;
      default:
    }

    let wideOption = window.innerWidth > window.innerHeight ? 'fitWideLandscape' : 'fitWide';
    let cssVar = window.innerWidth > window.innerHeight ? '--user-cards-wide-landscape' : '--user-cards-wide';
    let allColors = Object.keys(chipImages);
    let chipColors = [];
    user.prizes
      .filter(prize => allColors.includes(prize.type))
      .map(prize => {
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
      console.log('image is', newOptions.chipImage)
      console.log('index', chipColors.indexOf(newOptions.chipImage))
      let newIndex = chipColors.indexOf(newOptions.chipImage) - 1;
      console.log('newIndex is', newIndex)

      if (newIndex < 0) {
        newIndex = chipColors.length - 1;
      }
      console.log('changed to', newIndex)
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
        console.log('remove a player from playersLeft!')
        let newPlayers = playersLeft - 1;
        setPlayersLeft(newPlayers);
        if (newPlayers === (options.opponentCards.length - winnerLimit) && gameStarted) {
          playSound(roundLoseSound);
          let newUser = { ...user };
          newUser.stats.totalGames++;
          newUser.stats[gameMode.name]['Games Played']++;
          if (user.loggedIn) {
            updateUserData(user.username, user.token, 'stats', newUser.stats);
          }
          meterRef.current.classList.remove('critical');
          setGameStarted(false);
          setGameInProgress(false);
          setGameEnded(true);
          } else if (newPlayers > options.opponentCards.length - winnerLimit + 3) {
        // } else if (newPlayers < 3) {
          if (options.soundOn) {
            opponentBingoSound.stop();
          }
          playSound(opponentBingoSound);
          setRoundBingos(roundBingos + 1)
          meterRef.current.classList.add('alert');
          setTimeout(() => {
            if (meterRef.current) {
              meterRef.current.classList.remove('alert');
              if (newPlayers === options.opponentCards.length - winnerLimit + 1) {
                meterRef.current.classList.add('critical');
              }
              setTimeout(() => {
                meterRef.current.style.backgroundColor = 'transparent';
              }, 100);
            } else {
              // console.error('no meterRef to change back');
            }
          }, 800);
        }
      } else {
        if (gameStarted) {
          let newUser = { ...user };
          // need to determine new bingos?
          let newBingos = 1;
          //
          newUser.stats.totalBingos += newBingos;
          let prizeMoney = playersLeft * prizePerCard;
          let rank = options.opponentCards.length - playersLeft + 1;
          newUser.stats.totalBingos += newBingos;
          let winMusic = rank === 1 ? fanfare1 : fanfare2;
          playSound(winMusic);
          newUser.currency.cash += prizeMoney;
          newUser.stats.totalGames++;
          newUser.stats[gameMode.name]['Games Played']++;
          newUser.stats[gameMode.name]['Games Won']++;
          if (user.loggedIn && calledBalls.length < newUser.stats[gameMode.name]['Quickest Bingo']) {
            // if (user.loggedIn && calledBalls.length < newUser.stats[gameMode.name]['Quickest Bingo']) {
            console.big('NEW QUICKEST BINGO RECORD');
            newUser.stats[gameMode.name]['Quickest Bingo'] = calledBalls.length;
            setRecordsBroken({ type: 'Quickest Bingo', value: calledBalls.length + ' balls' });
          }
          // if (rank) {
          // newUser.stats.rankHistory.push(rank);
          // }
          // newUser.stats.ballsToBingo.push(calledBalls.length);
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
    if (gameMode.name === 'Bonanza') {
      if (opponent) {
        playSound(opponentBingoSound);
        setRoundBingos(roundBingos + 1)
      } else {
        if (roundBingos < winnerLimit) {
          playSound(fanfare2);
          let newUser = { ...user };
          newUser.stats.totalBingos++;
          setUser(newUser);
          if (user.loggedIn) {
            updateUserData(user.username, user.token, 'stats', newUser.stats);
          }
          setCurrentBingos(currentBingos + 1);
          setRoundBingos(roundBingos + 1);
        } else {
          playSound(roundLoseSound);
          let newUser = { ...user };
          newUser.stats.totalGames++;
          newUser.stats[gameMode.name]['Games Played']++;
          if (user.loggedIn) {
            updateUserData(user.username, user.token, 'stats', newUser.stats);
          }
          meterRef.current.classList.remove('critical');
          setGameStarted(false);
          setGameInProgress(false);
          setGameEnded(true);
        }
      }
    }
    if (gameMode.name === 'Countdown') {
      // if (opponent) {
      //   // playSound(opponentBingoSound)
      // } else {
      //   playSound(fanfare2);
      //   let newUser = { ...user };
      //   newUser.stats.totalBingos++;
      //   setUser(newUser);
      //   if (user.loggedIn) {
      //     updateUserData(user.username, user.token, 'stats', newUser.stats);
      //   }
      //   let newBingos = [...currentBingos];
      //   newBingos.push({});
      //   setCurrentBingos(newBingos);
      // }
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
    console.pink('getradomCardNumbers!')
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
              // console.error('bad username AFTER REGISTER?.');
            } else if (response.data === 'WRONG PASSWORD.') {
              // console.error('bad password AFTER REGISTER?.');
            } else {
              // create two random cards
              let randomCards = [{ type: 'random', numbers: [] }, { type: 'random', numbers: [] }];
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
    if (mapOn) {
      setMapOn(false);
    }
    if (preGameOn) {
      setPreGameOn(false);
    }
    setStoreOpen(!storeOpen);
    if (options.soundOn && !soundsLoaded) {
      loadSounds().then((response) => {
        console.pink(response, 'STORE -------- loaded sounds in ' + Math.round(window.performance.now() - loadStartTime));
        setSoundsLoaded(true);
      });
    }
  };
  const handleClickBuyButton = (itemData, slot) => {
    playSound(refillSound);
    let newUser = { ...user };
    if (itemData.consumable) {
      console.big('CONS')
      console.log('adding consumable to itemSlot', slot, itemData);
      console.big('CONS')
      newUser.itemSlots[slot].item = itemData;
      updateUserData(user.username, user.token, 'itemSlots', newUser.itemSlots).then(response => {
        console.log('updated itemSlots?', response, newUser.itemSlots)
      });
    } else {
      console.log('is permanent (prizes)');
      newUser.prizes = [...newUser.prizes, itemData];
      if (itemData.displayName.indexOf('Item Slot') > -1) {
        newUser.itemSlots = [...newUser.itemSlots, { item: false }];
        updateUserData(user.username, user.token, 'itemSlots', newUser.itemSlots).then(response => {
          console.log('updated itemSlots?', response, newUser.itemSlots)
        });
      } else if (itemData.displayName.indexOf('Card Slot') > -1) {
        newUser.cardSlots.push({ cardId: newUser.cardSlots.length });
        newUser.cards.push({ type: 'random', numbers: getRandomCardNumbers() });
        updateUserData(user.username, user.token, 'cardSlots', newUser.cardSlots).then(response => {
          console.log('updated cardSlots?', response)
        });
        updateUserData(user.username, user.token, 'cards', newUser.cards).then(response => {
          console.log('updated cards?', response)
        });
      } else if (itemData.displayName.indexOf('Bonus') > -1) {
        let extraPercent = parseInt(itemData.type);
        // console.orange('giving ' + extraPercent);
        newUser.bonusChance += extraPercent;
        updateUserData(user.username, user.token, 'bonusChance', newUser.bonusChance).then(response => {
          console.log('updated bonusChance?', response)
        });
      }
      updateUserData(user.username, user.token, 'prizes', newUser.prizes).then(response => {
        console.log('updated prizes?', response, [...newUser.prizes, itemData]);
      });
    }
    newUser.currency.cash -= itemData.cost;
    setUser(newUser);
    updateUserData(user.username, user.token, 'currency', newUser.currency).then(response => {
      console.log('curr updated?', response);
    });
    // }, [user]);
  };

  const handleClickRefillItem = (itemData, refillCost) => {
    playSound(refillSound);
    console.log('refilling', itemData, 'for', refillCost);
    let newUser = { ...user };
    let invSlot = newUser.itemSlots.filter((slot) => slot.item.description === itemData.description)[0];
    invSlot.item.uses = invSlot.item.totalUses;
    newUser.currency.cash -= refillCost;
    setUser(newUser);
    if (user.loggedIn) {
      updateUserData(user.username, user.token, 'currency', newUser.currency);
      updateUserData(user.username, user.token, 'itemSlots', newUser.itemSlots)
    }
  }

  const handleClickInactiveCard = () => {
    console.log('power sel?', powerupSelected)
    if (powerupSelected) {
      setPowerupSelected(undefined);
    }
    // console.log('gameStarted?', gameStarted);
    // console.log('calledBalls.length?', calledBalls.length);
    // if (!gameStarted && !preGameOn) {
    //   setPreGameOn(true);
    //   if (options.soundOn && !soundsLoaded) {
    //     loadSounds().then(() => {
    //       console.pink('handleClickInactiveCard loaded sounds in ' + Math.round(window.performance.now() - loadStartTime));
    //       // playSound(bonusAlertSound2)
    //       setSoundsLoaded(true);
    //     });
    //   }
    // }
    // let newUser = { ...user };
    // if (newUser.currency.cash) {
    //   newUser.currency.cash--;
    //   setUser(newUser);
    //   requestAnimationFrame(() => {
    //     updateUserData(user.username, user.token, 'currency', newUser.currency);
    //   });
    // }
  };
  const handleDaubSquare = (mostRecentBall) => {
    playSound(daubSound);
    let newHistory = [];
    if (mostRecentBall) {
      console.log('lastDrew', lastDrew, 'lastDaubed', lastDaubed)
      let lastTimer = lastDrew;
      console.log('lastDaubed > lastDrew', lastDaubed > lastDrew)
      if (lastDaubed > lastDrew) {
        lastTimer = lastDaubed;
        console.log('chaining off last daub')
      }
      if (!offeringBonus && !openingBonus) {
        let daubSpeed = Date.now() - lastTimer;
        console.warn('speed:', daubSpeed);
        // newHistory = [...daubSpeedHistory, daubSpeed];
        // setDaubSpeedHistory(newHistory);
        setLastDaubed(Date.now());
        if (daubSpeed < 2800) {
          let bonusAmount = Math.round((2800 - daubSpeed) / 2.5);
          if (bonusAmount > 400) {
            playSound(freeSpaceSound2);
            bonusAmount *= 1.3;
            setBonusRechargeRate(bonusRechargeRate * 1.5);
            setShowingBonusText('SUPER SPEED BONUS!');
          } else {
            playSound(freeSpaceSound);
            setShowingBonusText('SPEED BONUS!');
          }
          setBonusMeter(bonusMeter + bonusAmount);
        } else {
          setBonusMeter(bonusMeter + 100);
          // setShowingBonusText('SPEED: ' + daubSpeed);
        }

        setTimeout(() => {
          setShowingBonusText(false);
        }, 800)
      }
    } else {
      // newHistory = [...daubSpeedHistory, 2000];
      // setDaubSpeedHistory(newHistory);
    }
    // let total = 0;
    // newHistory.map(speed => {
    //   total += speed;
    // });
    // if (total && newHistory.length) {
    //   let averageSpeed = Math.round(total / newHistory.length);
    //   console.log('average speed!', averageSpeed);
    //   let newBeeChance = Math.round(averageSpeed / 300) - 2;
    //   if (newBeeChance > 5) {
    //     newBeeChance = 5;
    //   }
    //   if (newBeeChance < 0) {
    //     newBeeChance = 0;
    //   }
    //   console.warn('NEW BEE CHANCE ------------>', newBeeChance, ' / 10');
    //   // if (newBeeChance < 5) {
    //   //   playSound(bonusAlertSound2);
    //   // }
    //   setCurrentBeeChance(newBeeChance)
    // }
    if (powerupSelected) {
      setPowerupSelected(false)
    }
  };

  const isFreeSpace = (cardIndex, num) => {
    let isFree = false;
    temporaryBonuses.freeSpaces.map(space => {
      if (space.num === num && space.cardIndex === cardIndex) {
        isFree = true;
      } else if (space.num === num) {
      }
    });
    return isFree;
  };

  const handleClickStartButton = () => {
    console.log('handle calledBalls', gameStarted);
    if (!gameStarted) {
      let preGameShowing = !document.getElementById('pre-game-modal').classList.contains('hidden');
      console.green('pregameshowing ' + preGameShowing)
      console.green('preGameOn ' + preGameOn)
      // console.error('game not started');
      if (!gameInProgress) {
        // start
        counter = 0;
        if (storeOpen) {
          setStoreOpen(false);
        }
        if (mapOn) {
          setMapOn(false);
        }
        if (menuOn) {
          setMenuOn(false);
        }
        if (!preGameShowing) {
          setPreGameOn(true);
          if (options.soundOn && !soundsLoaded) {
            loadSounds().then(() => {
              console.pink('handleClickStartButton loaded sounds in ' + Math.round(window.performance.now() - loadStartTime));
              // playSound(bonusAlertSound2)
              setSoundsLoaded(true);
            });
          }
        } else if (gameMode.unlocked) {
          let newUser = { ...user };
          newUser.cards.map((card, c) => {
            console.log('getrad card', card, 'slots', newUser.cardSlots)
            if (newUser.cardSlots[c].cardId !== -1 && card.type === 'random') {
              let newRandomNumbers = getRandomCardNumbers();
              card.numbers = newRandomNumbers;
            } else {
              console.log('getrad c', c, 'not slotted, or custom')
            }
          });
          setUser(newUser);
          setPreGameOn(false);
          startGame();
        }
      } else {
        // unpause
        playSound(pauseSound);
        setGameStarted(true);
      }
    } else {
      console.log('callced', calledBalls.length, gameInProgress)
      if (gameInProgress) {
        playSound(pauseSound);
        setGameStarted(false);
      }
    }
  };

  const handleClickGift = () => {
    // if (powerupSelected) {
    //   setPowerupSelected(undefined);
    // }
    if (offeringBonus === 'FREE' || offeringBonus === 'BEE') {
      playSound(offeringBonus === 'FREE' ? getFreeSpaceSound : bonusAlertSound3);
      let newBonuses = { ...temporaryBonuses };
      let playerCardSlots = [...user.cardSlots].filter(slot => slot.cardId !== -1);
      let cardIndex = randomInt(0, playerCardSlots.length - 1);
      let randomCard = user.cards[cardIndex];
      let flat = [...randomCard.numbers[0], ...randomCard.numbers[1], ...randomCard.numbers[2], ...randomCard.numbers[3], ...randomCard.numbers[4]];
      // let unfilteredNumbers = flat.filter(num => !calledBalls.includes(num) && num !== 99);
      let uncalledNumbers = flat.filter(num => !calledBalls.includes(num) && !isFreeSpace(cardIndex, num) && num !== 99);
      // let unfilteredNumbers = randomCard.numbers.flat(2).filter(num => !calledBalls.includes(num) && num !== 99);
      // let uncalledNumbers = randomCard.numbers.flat(2).filter(num => !calledBalls.includes(num) && !isFreeSpace(cardIndex, num) && num !== 99);
      let randomNumber = uncalledNumbers[randomInt(0, uncalledNumbers.length - 1)];
      newBonuses.freeSpaces.push({ type: offeringBonus, cardIndex: cardIndex, num: randomNumber });
      setTemporaryBonuses(newBonuses);
      setOpeningBonus({ type: offeringBonus, value: randomNumber, cardIndex: cardIndex });
      if (offeringBonus === 'BEE') {
        setBonusMeter(0);
      }
    }
    setOfferingBonus(undefined);
    setBonusRechargeRate(100);
    setTimeout(() => {
      setOpeningBonus(false);
    }, 800);
  };

  const handleClickStopButton = () => {
    setModalOn(true);
    setModalMessage('Really end the current game?');
  };
  const handleClickMapButton = () => {
    if (storeOpen) {
      setStoreOpen(false);
    }
    if (preGameOn) {
      setPreGameOn(false);
    }
    setMapOn(!mapOn);
  };
  const integrateModeRules = (newMode, newOptions) => {
    if (newMode.ballLimit) {
      setBallLimit(newMode.ballLimit);
    }
    if (newMode.winnerLimit) {
      console.green('HAS winnerlimit! -----------------------------------------------------')
      setWinnerLimit(newMode.winnerLimit);
    } else {
      setWinnerLimit(newOptions.opponentCards.length);
    }
    if (newMode.winPattern) {
      setWinPattern(newMode.winPattern);
    }
    if (newMode.timeLimit) {
      setTimeLimit(newMode.timeLimit);
    }
  }
  const handleClickChangeMode = direction => {
    let modesArray = Object.keys(gameModes);
    let currentIndex = modesArray.indexOf(gameMode.name);
    // console.log('currentInd', currentIndex);
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
    let newOptions = { ...options };
    newOptions.preferredGameMode = newMode.name;
    integrateModeRules(newMode, newOptions);
    setGameMode(newMode);
    setOptions(newOptions);
    if (user.loggedIn) {
      updateUserData(user.username, user.token, 'options', newOptions);
    }
  };

  const resetGame = () => {
    console.green('RESET GAME !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
    console.green('RESET GAME !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
    console.green('RESET GAME !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
    console.green('RESET GAME !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
    console.green('RESET GAME !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
    console.green('RESET GAME !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
    console.green('RESET GAME !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
    console.green('RESET GAME !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
    console.green('RESET GAME !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
    if (options.voiceOn) {
      synth.cancel();
    }
    if (recordsBroken) {
      setRecordsBroken(undefined);
    }
    setGameStarted(false);
    setGameInProgress(false);
    setTemporaryBonuses({
      freeSpaces: []
    });
    setPlayersLeft(options.opponentCards.length);
    setCalledBalls([]);
    setRoundBingos(0);
    setCurrentBingos(0);
    if (currentBallSet.length) {
      setCurrentBallSet([]);
    }
    if (offeringBonus) {
      setOfferingBonus(undefined);
    }
    setOpponentCardProgress(options.opponentCards);
    let newOptions = { ...options };

    setOptions(newOptions);
  };
  const updateOpponentCardProgress = () => {
    let startTime = window.performance.now();
    let newProgress = { ...opponentCardProgress };
    Object.values(newProgress).map((card, c, arr) => {
      card.markedCount = card.fullGameStatus[calledBalls.length];
    })
    setOpponentCardProgress(newProgress);
    console.warn('updateOpponentCardProgress took', window.performance.now() - startTime);
  }
  const getStatusFromCard = (index, active, markedCount) => {
    console.warn('got card active', active, 'index', index)
    let newProgress = { ...opponentCardProgress };
    // newProgress[index].markedCount = newProgress[index].fullGameStatus[calledBalls.length];
    newProgress[index].index = index;
    newProgress[index].active = active;
    setOpponentCardProgress(newProgress);
  }
  const reportFullGame = (index, markedEachBall) => {
    let newProgress = { ...opponentCardProgress };
    if (gameStarted && index === 0) {
      simStart = window.performance.now();
    }
    // newProgress[index].markedCount = markedCount;
    newProgress[index].fullGameStatus = markedEachBall;
    setOpponentCardProgress(newProgress);
    if (index === Object.values(newProgress).length - 1) {
      console.warn('simulated all games in ', window.performance.now() - simStart)
    }
  }
  const handleClickPowerup = (powerup) => {
    if (powerupSelected !== powerup) {
      setPowerupSelected(powerup);
    } else {
      setPowerupSelected(undefined);
    }
  }
  const handleKillBee = (cardIndex, number) => {
    playSound(spraySound);
    let newUser = { ...user };
    newUser.stats.beesKilled++;
    let invSlot = newUser.itemSlots.filter((slot) => slot.item.description === powerupSelected.description)[0];
    invSlot.item.uses--;
    if (invSlot.item.uses === 0) {
      invSlot.item = false;
    }
    setUser(newUser);
    let newTempBonuses = { ...temporaryBonuses };
    let doomedIndex = -1;
    newTempBonuses.freeSpaces.map((space, i) => {
      if (space.cardIndex === cardIndex && space.num === number) {
        doomedIndex = i;
      }
    });
    updateUserData(user.username, user.token, 'itemSlots', newUser.itemSlots);
    updateUserData(user.username, user.token, 'stats', newUser.stats);
    console.log('killing', newTempBonuses.freeSpaces[doomedIndex]);
    console.log('bonuses was', newTempBonuses)
    newTempBonuses.freeSpaces.splice(doomedIndex, 1);
    console.log('bonuses is', newTempBonuses)
    setTemporaryBonuses(newTempBonuses);
    setPowerupSelected(undefined);
  }
  const handleClickCorner = () => {
    // let daubSpeed = Date.now() - options.drawSpeed - lastDrew;
    // allCalledNumbersDaubed();
    // console.error('SPEED? ----------------', daubSpeed);
  }
  const allCalledNumbersDaubed = () => {
    user.cardSlots.map(slot => {
      if (slot.cardId !== -1) {
        let card = user.cards[slot.cardId];
        console.info('CARD -----------------', card)
      }
    })
  }

  // RENDER //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  let itemsFullCount = gotData ? [...user.itemSlots].filter(slot => slot.item && slot.item.uses === slot.item.totalUses).length : undefined;
  let isFull = isFullScreen();
  let fitWide = window.innerWidth > window.innerHeight ? options.fitWideLandscape : options.fitWide;
  let playerAreaClass = modalOn ? 'card-area dimmed' : 'card-area';
  if (!gotData) {
    playerAreaClass += ' hidden';
  }
  let opponentAreaClass = options.showOpponentCards ? 'card-area' : 'card-area hidden';
  let playerCardCount = user.cardSlots.filter(slot => slot.cardId > -1).length;
  let opponentCardCount = options.opponentCards.length;
  let remainingPlayers = new Array(playersLeft);
  remainingPlayers.fill(null, 0, playersLeft);
  let dangerClass = 'danger-bar';
  let barListClass = '';
  if (gameMode.name === 'Countdown') {
    barListClass += ' ball-counter';
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
  // let fsClass = 'status-button';
  // if (isFull) {
  //   fsClass += ' full';
  // }
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
  let bingosLeft = winnerLimit - roundBingos;
  let ballsRemaining = ballLimit - calledBalls.length;
  let prizeMoney = 0;
  if (gameMode.name === 'Ranked') {
    prizeMoney = (playersLeft * prizePerCard);
  }
  if (gameMode.name === 'Countdown') {
    let basePrize = roundBingos * (75 - ballLimit) * 25;
    let volumeBonus = roundBingos * roundBingos * 10;
    prizeMoney = basePrize + volumeBonus;
  }
  return (
    <div id="app" className={!loaded ? 'zoomed' : ''}>

      <div id="app-background" />
      <header id="main-header">
        {!menuOn &&
          (gameInProgress || calledBalls.length ? (
            <>
              <div id="danger-meter" ref={meterRef} className={gameStarted ? '' : 'blurred'}>

                {/* {gameMode.name === 'Countdown' &&
                <div id='balls-left-display'>
                  <div><small>Balls left:</small></div>
                  <div id='balls-left-count'>{ballsRemaining}</div>
                </div>
              } */}
                <div id="danger-bar-list" className={barListClass}>
                  {(gameMode.name === 'Ranked'  || gameMode.name === 'Bonanza')
                  ? Object.values({ ...opponentCardProgress }).filter(entry => entry.active && entry.fullGameStatus).sort((a, b) => a.fullGameStatus[calledBalls.length - 1] - b.fullGameStatus[calledBalls.length - 1]).map((entry, i, arr) => {
                    let markedCount = entry.fullGameStatus ? entry.fullGameStatus[calledBalls.length - 1] : 0;
                    if (markedCount > 12) {
                      dangerClass = 'danger-bar dark-red';
                    } else if (markedCount > 11) {
                      dangerClass = 'danger-bar red';
                    } else if (markedCount > 9) {
                      dangerClass = 'danger-bar orange';
                    } else if (markedCount > 7) {
                      dangerClass = 'danger-bar yellow';
                    } else if (markedCount > 5) {
                      dangerClass = 'danger-bar yellowgreen';
                    } else if (markedCount > 3) {
                      dangerClass = 'danger-bar subgreen';
                    } else {
                      dangerClass = 'danger-bar green';
                    }
                    if (markedCount && !entry.active) {
                      dangerClass = 'danger-bar out-of-game'
                    }
                    // let barWidth = 1 - (markedCount / 20);
                    // let barTransform = window.innerWidth > window.innerHeight ? `scaleY(1.2) scaleX(${barWidth})` : `scaleY(1) scaleY(${barWidth})`;
                    // return <div key={i} style={{ transform: barTransform }} className={dangerClass}/>
                    return <div key={i} className={dangerClass}/>
                  })
                  : gameMode.name === 'Countdown'
                  ? Array(ballLimit)
                      .fill()
                      .map((remainingBall, b) => <div key={b} className={b >= ballsRemaining ? dangerClass + ' called' : dangerClass} />)
                  : null}
                </div>
                {(gameMode.name === 'Ranked'  || gameMode.name === 'Bonanza') && (
                  <div id="bingos-left-display">
                    <div>
                      <small>Winners left:</small>
                    </div>
                    <div id="bingos-left-count">{bingosLeft}</div>
                  </div>
                )}
                {(gameMode.name === 'Ranked') && (
                  <div id="prize-label" className={dangerClass.split(' ')[1]}>
                    <div>
                      <small>Prize: </small>${playersLeft * prizePerCard}
                    </div>
                  </div>
                )}
                {(gameMode.name === 'Bonanza') && (
                  <div id="bingos-label" className={dangerClass.split(' ')[1]}>
                  <div style={{ fontFamily: 'var(--cute-font)' }}>
                    <small>Scored: </small><div style={{fontSize: 'var(--font-size)'}}>{currentBingos}</div>
                    </div>
                  </div>
                )}
                {gameMode.name === 'Countdown' && (
                  <div id="bingos-label" className={dangerClass.split(' ')[1]}>
                    <div>
                      <small>Bingos:</small>
                      <br />
                      {roundBingos}
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div id="title">
              <div id="logo" className={loaded ? '' : 'featured'}>
                <div>c</div>
                <div>h</div>
                <div>i</div>
                <div>c</div>
                <div>k</div>
                <div>e</div>
                <div>n</div>
                <div>.</div>
                <div>b</div>
                <div>i</div>
                <div>n</div>
                <div>g</div>
                <div>o</div>
              </div>
              <small>{`updated ${sinceUpdated} ago`}</small>
            </div>
          ))}
        {menuOn ? (
          <div id='header-buttons'>
            {/* <div id="header-end">
              <button onClick={locked ? exitFullLandscape : goFullLandscape} id="fullscreen-toggle" className={fsClass}>
                <i className="material-icons">{fsClass.includes('full') ? `fullscreen_exit` : `fullscreen`}</i>
              </button>
            </div> */}
            <button onPointerDown={() => setMenuMode('cards')} id="cards-button" className={menuMode === 'cards' ? `status-button on` : `status-button`} />
            <button onPointerDown={() => setMenuMode('caller')} id="caller-button" className={menuMode === 'caller' ? `status-button on` : `status-button`} />
            <button onPointerDown={() => setMenuMode('display')} id="display-button" className={menuMode === 'display' ? `status-button on` : `status-button`}>
              <i className="material-icons">tv</i>
            </button>
            <button onPointerDown={() => setMenuMode('settings')} id="settings-button" className={menuMode === 'settings' ? `status-button on` : `status-button`}>
              <i className="material-icons">settings</i>
            </button>
          </div>
        ) : (
          ''
          )}
        {/* <div><div id='map-button' onPointerDown={handleClickMapButton} className={mapOn ? 'status-button map-on' : 'status-button'}><img alt='' src={globeIconPng} /></div></div> */}
        {(!gameInProgress || menuOn) && <div
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
          className={`status-button${menuOn && menuMode === 'account' ? ' on' : ''}${user.loggedIn ? ' logged-in' : ''}${!gotData ? ' hidden' : ''}`}
        >
          <i className="material-icons">person</i>
          <div id="header-username" className={usernameClass}>
            {displayName.map((name, n) => (
              <div key={n}>{name}</div>
            ))}
          </div>
          <div>${user.currency.cash}</div>
        </div>}
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
      {loaded && <CallerArea ref={ref} calledBalls={calledBalls} gameStarted={gameStarted} />}
        <div id="player-card-area" className={playerAreaClass}>
          {user.cardSlots.filter((slot, i) => slot.cardId > -1).map((card, c) => {
            card = user.cards[card.cardId];
            return (
            <div key={c} className="card-space">
              <Card
                ready={gotData}
                showingOpponents={options.showOpponentCards}
                username={user.username}
                index={c}
                type={card.type}
                bonusOffered={offeringBonus}
                ballLimitReached={calledBalls.length > ballLimit}
                freeSpaces={temporaryBonuses.freeSpaces || []}
                chipImage={options.chipImage}
                autoFreeSpace={options.autoFreeSpace}
                // cardData={user.cards[c] ? user.cards[c] : ''}
                cardData={card}
                gameInProgress={gameInProgress}
                gameStarted={gameStarted}
                calledBalls={calledBalls}
                onDaubSquare={handleDaubSquare}
                // playersLeft={playersLeft}
                onAchieveBingo={handleAchieveBingo}
                // onClickInactiveCard={handleClickInactiveCard}
                gameMode={gameMode}
                powerupSelected={powerupSelected}
                onKillBee={handleKillBee}
              />
            </div>
          )})}
        </div>

        {<ClickBonusIndicator showing={showingBonusText} message={showingBonusText} />}

        <div id="opponent-card-area" className={opponentAreaClass}>
          {Object.values(opponentCardProgress).map((card, c) => (
            <div key={c} className="card-space">
              <Card
                index={c}
                ready={gotData}
                hidden={!card.active}
                type={card.type}
                fullBallSequence={currentBallSet}
                reportActive={getStatusFromCard}
                // reportProgress={updateOpponentCardProgress}
                reportFullGame={reportFullGame}
                cardData={card}
                bonusOffered={offeringBonus}
                ballLimitReached={calledBalls.length > ballLimit}
                freeSpaces={[]}
                opponent={true}
                gameStarted={gameStarted}
                calledBalls={calledBalls}
                onAchieveBingo={handleAchieveBingo}
                gameMode={gameMode}
              />
            </div>
          ))}
        </div>
      </div>
      {gotData && (
        <>
          {/* {!gameStarted && !gameInProgress && (
            <div id="hint-arrow" className={'hint-arrow-container pointing-at-start'}>
              <i className="material-icons hint-arrow">arrow_downward</i>
            </div>
          )} */}
          <ButtonBar
            gameStarted={gameStarted}
            gameInProgress={gameInProgress}
            gameEnded={gameEnded}
            powerupSelected={powerupSelected}
            itemSlots={user.itemSlots}
            storeOpen={storeOpen}
            mapOn={mapOn}
            itemsEquippedCount={user.itemSlots.filter(slot => slot.item).length}
            itemsFullCount={itemsFullCount}
            // voiceOn={options.voiceOn}
            chickenCount={user.chickens.length}
            chickens={user.chickens}
            chickenSlots={user.chickenSlots}
            showOpponentCards={options.showOpponentCards}
            onClickStartButton={handleClickStartButton}
            onClickStopButton={handleClickStopButton}
            onClickStoreButton={handleClickStoreButton}
            onClickMapButton={handleClickMapButton}
            onClickResetButton={handleClickCloseButton}
            onClickChickensButton={resetPage}
            onClickPowerup={handleClickPowerup}
          />
          {!user.loggedIn && <LogInScreen showing={loggingIn} loginError={loginError} onClickLogInButton={handleClickLogInButton} onClickRegisterButton={handleClickRegisterButton} onClickCancelButton={handleClickCancelButton} />}
          <ConfirmModal showing={modalOn} message={modalMessage} loggingOut={loggingOut} onClickAgreeButton={handleClickAgreeButton} onClickCancelButton={handleClickCancelButton} />
          {/* {gameInProgress && */}

          <GameEndModal gameMode={gameMode} showing={gameEnded} recordsBroken={recordsBroken} roundBingos={roundBingos} prizeMoney={prizeMoney} winnerLimit={winnerLimit} ballLimit={ballLimit} totalOpponents={options.opponentCards.length} rank={options.opponentCards.length - playersLeft + 1} lost={options.opponentCards.length - playersLeft + 1 > winnerLimit} onClickOkayButton={handleClickOkayButton} />
          {/* } */}
          <Menu
            menuMode={menuMode}
            user={user}
            chickenCount={user.chickens.length}
            stats={user.stats}
            cardSlots={user.cardSlots}
            itemSlots={user.itemSlots}
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
            orientationLock={orientationLock}
            fancyCalls={options.fancyCalls}
            onClickMenu={handleClickMenu}
            onClickMenuArrow={handleClickMenuArrow}
            onChangeCallSpeed={handleChangeCallSpeed}
            onChangeCardMargin={handleChangeCardMargin}
            onClickLogIn={handleClickLogIn}
            onClickLogOut={handleClickLogOut}
          />
          {/* {gameStarted && */}
          <CornerChicken ref={chickenRef} showing={gameStarted} showingBonusText={showingBonusText} onClickCorner={handleClickCorner} currentBeeChance={currentBeeChance} bonusMeter={bonusMeter} openingBonus={openingBonus} paused={!gameStarted} gameStarted={gameStarted} showingGift={offeringBonus} onClickGift={handleClickGift} />
          {/* } */}
          {gameInProgress && <BonusIndicator active={openingBonus && openingBonus.type === 'FREE'} currentBeechance={currentBeeChance} openingBonus={openingBonus} bonusDisplay={'FREE SPACE!'} gameNews={gameEnded && 'GAME OVER'} />}
          {!gameInProgress && <MapScreen showing={mapOn} userCash={user.currency.cash} chickenCount={user.chickens.length} />}
          {!gameInProgress && <StoreScreen
            showing={storeOpen}
            itemSlots={user.itemSlots}
            userPrizes={user.prizes}
            userCash={user.currency.cash}
            onClickBuyButton={handleClickBuyButton}
            onClickRefillItem={handleClickRefillItem}
          />}
          <div id="save-icon" ref={saveRef}>
            <i className="material-icons">save</i>
            <small>Saved</small>
          </div>
        </>
      )}
      <PreGameModal stats={user.stats} loggedIn={user.loggedIn} showing={preGameOn} gameMode={gameMode} winnerLimit={winnerLimit} bingoLimit={gameMode.bingoLimit} ballLimit={ballLimit} winPattern={winPattern} timeLimit={timeLimit} opponentCount={opponentCardCount} onClickChangeMode={handleClickChangeMode} onClickBeginGame={handleClickStartButton} onClickCancelButton={handleClickCancelButton} onClickLoginButton={handleClickLogIn}/>

    </div>
  );
}

export default App;
