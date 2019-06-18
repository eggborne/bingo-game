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

let daubSound = undefined;
let bonusAlertSound1 = undefined;
let bonusAlertSound2 = undefined;
let ballSound = undefined;
let refillSound = undefined;
let bonusAlertSound3 = undefined;
let roundOverSound = undefined;
let roundLoseSound = undefined;
let opponentBingoSound = undefined;
let pauseSound = undefined;
let freeSpaceSound = undefined;
let beeSound = undefined;
let fanfare1 = undefined;
let fanfare2 = undefined;

let mediaRoot = 'https://chicken.bingo/static/media';

let loadStartTime = 0;

export const hotShotsVideo = require('./assets/hotshots2.webm')

// mediaRoot = './assets'

const loadSounds = async () => {
  // console.log('loading sounds...');
  loadStartTime = window.performance.now();
  // Howler.autoSuspend = false;
  let promise = new Promise((resolve) => {
    daubSound = new Howl({
      src: [mediaRoot + '/sounds/placechip.ogg'],
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
      volume: 0.5
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
    freeSpaceSound = new Howl({
      src: [mediaRoot + '/sounds/freespace.ogg'],
      volume: 0.5
    });
    beeSound = new Howl({
      src: [mediaRoot + '/sounds/bee.wav'],
      volume: 0.75
    });
    fanfare1 = new Howl({
      src: [mediaRoot + '/sounds/fanfare1.ogg'],
      volume: 0.5
    });
    fanfare2 = new Howl({
      src: [mediaRoot + '/sounds/fanfare2.ogg'],
      volume: 0.5
    });
    resolve('shit');
  })
  await promise;
  return 'suck my balls';
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
    cash: 100000
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
      'Most Bingos': 1,
      'Quickest Bingo': 75,
    },
    'Limited Balls': {
      'Games Played': 0,
      'Games Won': 0,
      'Most Bingos': 1,
      'Quickest Bingo': 75,
    }
  },
  cards: [{ id: 0, type: 'random' }, { id: 1, type: 'random' }],
  prizes: [{ category: 'Markers', type: 'red', cost: 0 }],
  consumables: [],
  bonusChance: 25,
  cardSlots: [{cardId: 0}, {cardId: 1}],
  itemSlots: [{item: undefined}],
  id: undefined,
  token: undefined
};
const defaultOptions = {
  playerCards: [{ id: 0, type: 'random' }, { id: 1, type: 'random' }],
  opponentCards: [{ type: 'random' }, { type: 'random' }, { type: 'random' }, { type: 'random' }, { type: 'random' }, { type: 'random' }, { type: 'random' }, { type: 'random' }, { type: 'random' }, { type: 'random' }, { type: 'random' }, { type: 'random' }],
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
  'Classic': { name: 'Classic', winPattern: 'Line / 4 Corners' },
  'Ranked': { name: 'Ranked', winnerLimit: 10 },
  'Bonanza': { name: 'Bonanza', winnerLimit: 20 },
  'Limited Balls': { name: 'Limited Balls', ballLimit: 35 },
  // 'Standoff': { name: 'Standoff', winnerLimit: 4 },
  // 'Danger Zones': { name: 'Danger Zones' },
  // 'Lightning': { name: 'Lightning', timeLimit: 30 }
};

const applyOptionsCSS = (newOptions) => {
  document.documentElement.style.setProperty('--card-size-landscape', `${1 - newOptions.cardMarginLandscape}`);
  document.documentElement.style.setProperty('--card-size', `${1 - newOptions.cardMargin}`);
  document.documentElement.style.setProperty('--card-size-landscape', `${1 - newOptions.cardMargin}`);
  document.documentElement.style.setProperty('--card-size', `${1 - newOptions.cardMarginLandscape}`);
  document.documentElement.style.setProperty('--user-cards-wide', newOptions.fitWide);
  document.documentElement.style.setProperty('--user-cards-wide-landscape', newOptions.fitWideLandscape);
}

function App() {


  // console.green('App -----------------------------------');
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
  const [winnerLimit, setWinnerLimit] = useState(10);
  const [ballLimit, setBallLimit] = useState(35);
  const [timeLimit, setTimeLimit] = useState(30);
  const [winPattern, setWinPattern] = useState('Line / 4 Corners');
  const [offeringBonus, setOfferingBonus] = useState(undefined);
  const [openingBonus, setOpeningBonus] = useState(undefined);
  const [preGameOn, setPreGameOn] = useState(false);
  const [lazy1, setLazy1] = useState(false);
  const [lastDrew, setLastDrew] = useState(0);
  const [lastDaubed, setLastDaubed] = useState(0);
  const [currentBingos, setCurrentBingos] = useState([]);
  const [daubSpeedHistory, setDaubSpeedHistory] = useState([]);
  const [currentBeeChance, setCurrentBeeChance] = useState(5);
  const [pausedWithMenu, setPausedWithMenu] = useState(false);
  const [powerupSelected, setPowerupSelected] = useState(undefined);
  const [showingBonusText, setShowingBonusText] = useState(false);
  const [temporaryBonuses, setTemporaryBonuses] = useState({
    freeSpaces: []
  });
  const [gameMode, setGameMode] = useState(gameModes['Ranked']);
  const [recordsBroken, setRecordsBroken] = useState(undefined);
  const ref = useRef();
  const chickenRef = useRef();
  const meterRef = useRef();
  const [opponentCardProgress, setOpponentCardProgress] = useState([...defaultOptions.opponentCards])

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
      console.log('guest user applying')
      console.info(user)
      console.info(options)
      console.log('defaults')

      let newUser = { ...user };
      let newOptions = { ...options };
      // console.log('no cookie', options, user);
      setGotData(true);
      newUser.cards.map((card, c) => {
        if (card.type === 'random') {
          card.numbers = getRandomCardNumbers();
          // if (newOptions.playerCards[c]) {
          //   newOptions.playerCards[c].numbers = card.numbers;
          // }
        }
      });

      console.big('final guest user');
      console.info(newUser)
    setUser(newUser);
    // setOptions(defaultOptions);
    // user.cards = defaultOptions.playerCards;

      applyOptionsCSS(newOptions);


    }
    // setPreGameOn(true);
    setTimeout(() => {
      setLazy1(true);
    }, 1500);
    window.addEventListener('fullscreenchange', event => {
      setLocked(isFullScreen());
    });
  }, []);
  useInterval(() => {
    if (gameStarted) {
      // // console.log('pulling ball at', window.performance.now());
      ref.current.scrollLeft = -ref.current.scrollWidth;
      playSound(ballSound);
      setTimeout(() => {
        drawBall();
      }, 300);
      counter++;
      if (!gameEnded && user.username === 'Mike' || (counter > 3 && counter % randomInt(3, 4) === 0)) {
        let chanceToShow = randomInt(0, 100) < user.bonusChance || user.username === 'Mike';
        if (!offeringBonus && chanceToShow) {
          setTimeout(() => {
            setOfferingBonus(getRandomBonus());
            // let bonusAlertSound = randomInt(0, 1) ? bonusAlertSound1 : bonusAlertSound2;

            playSound(bonusAlertSound3);

          }, Math.round(options.drawSpeed / 1.5));
        }
      }
      if (!offeringBonus) {
        if (randomInt(0, 1)) {
          peck().then(() => {
            if (randomInt(0, 1)) {
              peck().then(() => {
              })
            }
          });
        } else {
          flap().then(() => {
            if (!randomInt(0, 3)) {
              flap();
            }
          })
        };
      }
      // if (randomInt(0, 1)) {
      //   document.getElementById('bonus-chicken').src = require('./assets/chickenpeck.png');
      //   setTimeout(() => {
      //     document.getElementById('bonus-chicken').src = require('./assets/chickenstand.png');
      //   }, randomInt(200, 500));
      //   if (randomInt(0, 1)) {

      // if (!offeringBonus) {
      //   document.getElementById('bonus-chicken').src = require('./assets/chickenrun1.png');
      //   setTimeout(() => {
      //     document.getElementById('bonus-chicken').src = require('./assets/chickenrun2.png');
      //     if (randomInt(0, 1)) {
      //       setTimeout(() => {
      //         document.getElementById('bonus-chicken').src = require('./assets/chickenrun1.png');
      //         setTimeout(() => {
      //           document.getElementById('bonus-chicken').src = require('./assets/chickenstand.png');
      //         }, 100);
      //       }, 100);
      //     } else {
      //       setTimeout(() => {
      //         document.getElementById('bonus-chicken').src = require('./assets/chickenstand.png');
      //       }, 100);
      //     }
      //   }, 100);
      //   //   }
      //   // } else {
      //   if (randomInt(0, 1)) {
      //     setTimeout(() => {
      //       document.getElementById('bonus-chicken').src = require('./assets/chickenpeck.png');
      //       setTimeout(() => {
      //         document.getElementById('bonus-chicken').src = require('./assets/chickenstand.png');
      //         setTimeout(() => {
      //           document.getElementById('bonus-chicken').src = require('./assets/chickenpeck.png');
      //           setTimeout(() => {
      //             document.getElementById('bonus-chicken').src = require('./assets/chickenstand.png');
      //           }, randomInt(100, 180));
      //         }, randomInt(100, 180));
      //       }, randomInt(150, 300));
      //     }, randomInt(1000, options.drawSpeed * 0.75));
      //   }
      // }

      // }
    }
    return this;
  }, options.drawSpeed);

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
    // ref.current.scrollLeft = ref.current.scrollLeft;
  }, [ref, calledBalls]);

  useEffect(() => {
    // if (gameMode.name === 'Limited Balls' && currentBallSet.length === 0) {
    if (gameStarted && !currentBallSet.length && !calledBalls.length) {
      let ballSetSize = gameMode.name === 'Limited Balls' ? ballLimit : 75;
      console.log('getting new random ball set');
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
  function logOut() {
    setCookie('eggborne-bingo', null, 0);
    let newUser = defaultUser;
    newUser.cards.map((card, c) => {
      // console.log('newUser card', c, card);
      if (card.type === 'random') {
        let newRandomNumbers = getRandomCardNumbers();
        card.numbers = newRandomNumbers;
        // console.log('created', newRandomNumbers);
        // if (newOptions.playerCards[c]) {
        //   newOptions.playerCards[c].numbers = newRandomNumbers;
        // }
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
    console.warn('before integrate, data is')
    console.info(data)
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
    newUser.stats = {...defaultUser.stats, ...JSON.parse(data.stats)};
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
    console.info('received itemSlots', data.itemSlots)
    console.info('received cardSlots', data.cardSlots)
    if (data.itemSlots) {
      newUser.itemSlots = JSON.parse(data.itemSlots);
    }
    newUser.bonusChance = data.bonusChance;

    setMenuMode(JSON.parse(data.menuMode));
    // setMenuMode(JSON.parse(data.lastShopMode));                  ???
    let newOptions = data.options;

    newUser.cardSlots.map((card, c) => {
      // console.log('newUser card', c, card);
      if (card.type === 'random') {
        let newRandomNumbers = getRandomCardNumbers();
        card.numbers = newRandomNumbers;
        // console.log('created', newRandomNumbers);
        // if (newOptions.playerCards[c]) {
        //   newOptions.playerCards[c].numbers = newRandomNumbers;
        // }
      }
    });
    // document.documentElement.style.setProperty('--user-cards-wide', newOptions.fitWide);
    // document.documentElement.style.setProperty('--user-cards-wide-landscape', newOptions.fitWideLandscape);
    // document.documentElement.style.setProperty('--card-size', `${1 - newOptions.cardMargin}`);
    // document.documentElement.style.setProperty('--card-size-landscape', `${1 - newOptions.cardMarginLandscape}`);

    applyOptionsCSS(newOptions);

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
    if (newOptions.soundOn) {
      loadSounds().then((response) => {
        console.pink(response, 'PRELOAD -------- loaded sounds in ' + Math.round(window.performance.now() - loadStartTime));
        setSoundsLoaded(true);
      });
    }

    console.big('final logged in user');
    console.info(newUser)

    setUser(newUser);

    if (remember) {
      setCookie('eggborne-bingo', JSON.stringify({ username: newUser.username, token: newUser.token }), 365);
    }
    console.log('got that initial newUser from DB to state:', newUser);
    // console.big('gotData!');
    setGotData(true);
  }
  // console.orange('--------------------------adsfdsfdsfdsf--------')
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
    // console.green('exiting')
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
    if (newBallSet.length) {
      let number = newBallSet.pop();
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
      setCurrentBallSet(newBallSet);
      setCalledBalls([...calledBalls, number]);
    } else {
      if (gameMode.name === 'Limited Balls') {
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
    //   if (gameMode.name === 'Limited Balls' && !gameEnded && gameStarted && queueCopy.length === ballLimit) {
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
  //     if (gameMode.name === 'Limited Balls' && !gameEnded && gameStarted && queueCopy.length === ballLimit) {
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
    console.error('getting random bonus - ', currentBeeChance, ' / 10 bee chance!')
    return randomInt(0,10) > currentBeeChance ? 'FREE' : 'BEE';
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
    } else if (preGameOn) {
      setPreGameOn(false);
    } else if (loggingIn) {
      console.log('setting loginin to false')
    }
    setLoggingIn(false);
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
    switch (type) {
      case 'player-cards-minus':
        // if (newOptions.playerCards.length > 1) {
        //   newOptions.playerCards.pop();
        //   // newUser.cards = newOptions.playerCards;
        //   // setUser(newUser);
        //   setOptions(newOptions);
        //   if (!changedUserData.includes('options')) {
        //     setChangedUserData([...changedUserData, 'options']);
        //   }
        // }
        break;
      case 'player-cards-plus':
        if (newOptions.playerCards.length < user.cardSlots.length) {
          // newOptions.playerCards.push(user.cards[newOptions.playerCards.length]);
          // // newUser.cards = newOptions.playerCards;
          // // setUser(newUser);
          // setOptions(newOptions);
          // if (!changedUserData.includes('options')) {
          //   setChangedUserData([...changedUserData, 'options']);
          // }
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
        console.log('toggleFancyCalls');
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
              // playSound(bonusAlertSound2, true)
              setSoundsLoaded(true);
            });
          } else {
            // playSound(bonusAlertSound2, true);
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
        console.error('bad arrow click eh');
    }

    let wideOption = window.innerWidth > window.innerHeight ? 'fitWideLandscape' : 'fitWide';
    let cssVar = window.innerWidth > window.innerHeight ? '--user-cards-wide-landscape' : '--user-cards-wide';
    let allColors = Object.keys(chipImages);
    let chipColors = [];
    user.prizes
      .filter(prize => allColors.includes(prize.type))
      .map(prize => {
        console.log('found', prize.type, 'in', prize)
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
      console.log('image is', newOptions.chipImage)
      let newIndex = chipColors.indexOf(newOptions.chipImage) + 1;
      console.log('index', chipColors.indexOf(newOptions.chipImage))
      console.log('newIndex is', newIndex)
      if (newIndex > chipColors.length - 1) {
        newIndex = 0;
      }
      console.log('changed to', newIndex)
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
  // const handleClickMenuArrow = type => {
  //   let newOptions = { ...options };
  //   let newUser = { ...user };
  //   if (!gameStarted && !calledBalls.length) {

  //     if (type === 'player-cards-minus') {
  //       if (newOptions.playerCards.length > 1) {
  //         newOptions.playerCards.pop();
  //         // newUser.cards = newOptions.playerCards;
  //         // setUser(newUser);
  //         setOptions(newOptions);
  //         if (!changedUserData.includes('options')) {
  //           setChangedUserData([...changedUserData, 'options']);
  //         }
  //       }
  //     } else if (type === 'player-cards-plus') {
  //       if (newOptions.playerCards.length < user.cardSlots) {
  //         newOptions.playerCards.push(user.cards[newOptions.playerCards.length]);
  //         // newUser.cards = newOptions.playerCards;
  //         // setUser(newUser);
  //         setOptions(newOptions);
  //         if (!changedUserData.includes('options')) {
  //           setChangedUserData([...changedUserData, 'options']);
  //         }
  //       }
  //     } else if (type === 'opponent-cards-minus') {
  //       let minOpponents = user.username === 'Mike' ? 0 : 12;
  //       if (newOptions.opponentCards.length > minOpponents) {
  //         if (newOptions.opponentCards.length > 200) {
  //           newOptions.opponentCards.length -= 100;
  //         } else if (newOptions.opponentCards.length > 30) {
  //           newOptions.opponentCards.length -= 10;
  //         } else {
  //           newOptions.opponentCards.length -= 1;
  //         }
  //         setOptions(newOptions);
  //         setPlayersLeft(newOptions.opponentCards.length);
  //         document.documentElement.style.setProperty('--opponent-cards', newOptions.opponentCards.length);
  //         if (!changedUserData.includes('options')) {
  //           setChangedUserData([...changedUserData, 'options']);
  //         }
  //       }
  //     } else if (type === 'opponent-cards-plus') {
  //       let maxOpponents = user.username === 'Mike' ? 1000 : 30;
  //       if (newOptions.opponentCards.length < maxOpponents) {
  //         if (newOptions.opponentCards.length < 30) {
  //           newOptions.opponentCards.push({ type: 'random' });
  //         } else if (newOptions.opponentCards.length < 100) {
  //           for (let i = 0; i < 10; i++) {
  //             newOptions.opponentCards.push({ type: 'random' });
  //           }
  //         } else {
  //           for (let i = 0; i < 100; i++) {
  //             newOptions.opponentCards.push({ type: 'random' });
  //           }
  //         }
  //         setOptions(newOptions);
  //         setPlayersLeft(newOptions.opponentCards.length);
  //         document.documentElement.style.setProperty('--opponent-cards', newOptions.opponentCards.length);
  //         if (!changedUserData.includes('options')) {
  //           setChangedUserData([...changedUserData, 'options']);
  //         }
  //       }
  //     }
  //   }
  //   if (type === 'toggleFullScreen') {
  //     if (isFullScreen()) {
  //       exitFullLandscape();
  //     } else {
  //       goFullLandscape();
  //     }
  //   } else if (type === 'lock-minus') {
  //     let lockTypes = [undefined, 'landscape', 'portrait'];
  //     let ind = lockTypes.indexOf(orientationLock) - 1;
  //     if (ind > 0) {
  //       setOrientationLock(lockTypes[ind]);
  //     } else {
  //       setOrientationLock(lockTypes[lockTypes.length- 1])
  //     }
  //   } else if (type === 'lock-plus') {
  //     let lockTypes = [undefined, 'landscape', 'portrait'];
  //     let ind = lockTypes.indexOf(orientationLock) + 1;
  //     if (ind < lockTypes.length) {
  //       setOrientationLock(lockTypes[ind]);
  //     } else {
  //       setOrientationLock(lockTypes[0])
  //     }
  //   } else if (type === 'toggleVoice') {
  //     if (options.voiceOn) {
  //       synth.cancel();
  //     }
  //     newOptions.voiceOn = !newOptions.voiceOn;
  //     setOptions(newOptions);
  //     if (!changedUserData.includes('options')) {
  //       setChangedUserData([...changedUserData, 'options']);
  //     }
  //   } else if (type === 'toggleFancyCalls') {
  //     console.log('toggleFancyCalls');
  //     if (!newOptions.fancyCalls) {
  //       newOptions.fancyCalls = true;
  //     } else {
  //       newOptions.fancyCalls = false;
  //     }
  //     // newOptions.fancyCalls = !newOptions.fancyCalls;
  //     setOptions(newOptions);
  //     if (!changedUserData.includes('options')) {
  //       setChangedUserData([...changedUserData, 'options']);
  //     }
  //   } else if (type === 'toggleSound') {
  //     if (options.soundOn) {
  //       // Howler.muted(true);
  //     } else {
  //       // Howler.muted(false);
  //       if (!soundsLoaded) {
  //         loadSounds().then((response) => {
  //           console.pink('toggle loaded sounds in ' + (window.performance.now() - loadStartTime));
  //           playSound(bonusAlertSound2, true)
  //           setSoundsLoaded(true);
  //         });
  //       } else {
  //         // playSound(bonusAlertSound2, true);
  //       }
  //     }
  //     newOptions.soundOn = !newOptions.soundOn;
  //     setOptions(newOptions);
  //     if (!changedUserData.includes('options')) {
  //       setChangedUserData([...changedUserData, 'options']);
  //     }
  //   } else if (type === 'toggleShowOpponentCards') {
  //     newOptions.showOpponentCards = !newOptions.showOpponentCards;
  //     setOptions(newOptions);
  //     if (!changedUserData.includes('options')) {
  //       setChangedUserData([...changedUserData, 'options']);
  //     }
  //   } else if (type === 'toggleAutoFreeSpace') {
  //     newOptions.autoFreeSpace = !newOptions.autoFreeSpace;
  //     setOptions(newOptions);
  //     if (!changedUserData.includes('options')) {
  //       setChangedUserData([...changedUserData, 'options']);
  //     }
  //   }
  //   let wideOption = window.innerWidth > window.innerHeight ? 'fitWideLandscape' : 'fitWide';
  //   let cssVar = window.innerWidth > window.innerHeight ? '--user-cards-wide-landscape' : '--user-cards-wide';
  //   let allColors = Object.keys(chipImages);
  //   let chipColors = [];
  //   user.prizes
  //     .filter(prize => allColors.includes(prize.type))
  //     .forEach(prize => {
  //       chipColors.push(prize.type);
  //     });
  //   if (type === 'fit-plus') {
  //     if (newOptions[wideOption] < 24) {
  //       newOptions[wideOption]++;
  //       document.documentElement.style.setProperty(cssVar, newOptions[wideOption]);
  //       setOptions(newOptions);
  //       if (!changedUserData.includes('options')) {
  //         setChangedUserData([...changedUserData, 'options']);
  //       }
  //     }
  //   } else if (type === 'fit-minus') {
  //     if (newOptions[wideOption] > 1) {
  //       newOptions[wideOption]--;
  //       document.documentElement.style.setProperty(cssVar, newOptions[wideOption]);
  //       setOptions(newOptions);
  //       if (!changedUserData.includes('options')) {
  //         setChangedUserData([...changedUserData, 'options']);
  //       }
  //     }
  //   } else if (type === 'marker-plus') {
  //     let newIndex = chipColors.indexOf(newOptions.chipImage) + 1;
  //     if (newIndex > chipColors.length - 1) {
  //       newIndex = 0;
  //     }
  //     newOptions.chipImage = chipColors[newIndex];
  //     setOptions(newOptions);
  //     if (!changedUserData.includes('options')) {
  //       setChangedUserData([...changedUserData, 'options']);
  //     }
  //   } else if (type === 'marker-minus') {
  //     let newIndex = chipColors.indexOf(newOptions.chipImage) - 1;
  //     if (newIndex < 0) {
  //       newIndex = chipColors.length - 1;
  //     }
  //     newOptions.chipImage = chipColors[newIndex];
  //     setOptions(newOptions);
  //     if (!changedUserData.includes('options')) {
  //       setChangedUserData([...changedUserData, 'options']);
  //     }
  //   }
  // };

  const handleAchieveBingo = opponent => {
    if (gameMode.name === 'Ranked' || gameMode.name === 'Bonanza') {
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
        // } else if (newPlayers > options.opponentCards.length - winnerLimit) {
        } else if (newPlayers < 3) {
          if (options.soundOn) {
            opponentBingoSound.stop();
          }
          playSound(opponentBingoSound);
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
          }, 1000);
        }
      } else {
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
          newUser.stats[gameMode.name]['Games Played']++;
          newUser.stats[gameMode.name]['Games Won']++;
          console.warn('oprev quickest ', + newUser.stats[gameMode.name]['Quickest Bingo'])
          console.warn('now', calledBalls.length);
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
            // if (rank === 1) {
            //   document.getElementById('hot-shots-2').style.display = 'block';
            //   document.getElementById('hot-shots-2').play();
            // }
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
    setStoreOpen(!storeOpen);
  };
  const handleClickBuyButton = (itemData, slot) => {
    console.log('clicked to buy', itemData, 'for slot', slot)
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
        newUser.cardSlots.push({cardId: undefined});
        updateUserData(user.username, user.token, 'cardSlots', newUser.cardSlots).then(response => {
          console.log('updated cardSlots?', response)
        });;
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
    let invSlot = newUser.itemSlots.filter((slot) => itemData.description === itemData.description)[0];
    invSlot.item.uses = invSlot.item.totalUses;
    newUser.currency.cash -= refillCost;
    setUser(newUser);
    if (user.loggedIn) {
      updateUserData(user.username, user.token, 'currency', newUser.currency);
      updateUserData(user.username, user.token, 'itemSlots', newUser.itemSlots)
    }
  }

  const handleClickInactiveCard = () => {
    // console.log('gameStarted?', gameStarted);
    // console.log('calledBalls.length?', calledBalls.length);
    if (!gameStarted && !preGameOn) {
      setPreGameOn(true);
      if (options.soundOn && !soundsLoaded) {
        loadSounds().then(() => {
          console.pink('handleClickInactiveCard loaded sounds in ' + Math.round(window.performance.now() - loadStartTime));
          // playSound(bonusAlertSound2)
          setSoundsLoaded(true);
        });
      }
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
  const handleDaubSquare = (mostRecentBall) => {
    playSound(daubSound);
    let newHistory = [];
    if (mostRecentBall) {
      console.log('lastDrew', lastDrew, 'lastDaubed', lastDaubed)
      let lastTimer = lastDrew;
      console.log('lastDaubed > lastDrew', lastDaubed > lastDrew )
      if (lastDaubed > lastDrew) {
        lastTimer = lastDaubed;
        console.log('chaining off last daub')
      }
      let daubSpeed =  Date.now() - lastTimer;
      console.warn('speed:', daubSpeed);
      newHistory = [...daubSpeedHistory, daubSpeed];
      setDaubSpeedHistory(newHistory);
      setLastDaubed(Date.now());
      if (daubSpeed < 1000) {
        playSound(freeSpaceSound);
        setShowingBonusText('2X SPEED BONUS!');
      } else if (daubSpeed < 1800) {
        playSound(freeSpaceSound);
        setShowingBonusText('SPEED BONUS');
      }
      setTimeout(() => {
        setShowingBonusText(false);
      }, 1000)
    } else {
      newHistory = [...daubSpeedHistory, 2000];
      setDaubSpeedHistory(newHistory);
    }
    let total = 0;
    newHistory.map(speed => {
      total += speed;
    });
    if (total && newHistory.length) {
      let averageSpeed = Math.round(total / newHistory.length);
      console.log('average speed!', averageSpeed);
      // let newBeeChance = Math.round(averageSpeed / 300) - 2;
      // if (newBeeChance > 5) {
      //   newBeeChance = 5;
      // }
      // if (newBeeChance < 0) {
      //   newBeeChance = 0;
      // }
      // console.warn('NEW BEE CHANCE ------------>', newBeeChance, ' / 10');
      // if (newBeeChance < 5) {
      //   playSound(bonusAlertSound2);
      // }
      // setCurrentBeeChance(newBeeChance)
    }
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
    // console.log('handle calledBalls', calledBalls);
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
      if (gameInProgress) {
        playSound(pauseSound);
        setGameStarted(false);
      }
    }
  };

  const handleClickGift = () => {
    if (offeringBonus === 'FREE' || offeringBonus === 'BEE') {
      playSound(offeringBonus === 'FREE' ? freeSpaceSound : beeSound);
      let newBonuses = { ...temporaryBonuses };
      let playerCardSlots = [...user.cardSlots];
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
      console.log('sent', { type: offeringBonus, value: randomNumber, cardIndex: cardIndex })
    }
    setOfferingBonus(undefined);
    setTimeout(() => {
      setOpeningBonus(false);
    }, 1200);
    if (powerupSelected) {
      setPowerupSelected(false)
    }
  };

  const handleClickStopButton = () => {
    setModalOn(true);
    setModalMessage('Really end the current game?');
  };
  const handleClickMapButton = () => {
    if (storeOpen) {
      setStoreOpen(false);
    }
    setMapOn(!mapOn);
  };
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
    // console.log('set newMode', newMode);
    // console.log('modesArray[newIndex]', modesArray[newIndex]);
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
    setCurrentBingos([]);
    if (currentBallSet.length) {
      setCurrentBallSet([]);
    }
    let newOptions = { ...options };
    let newUser = { ...user };
    newUser.cards.map((card, c) => {
      // console.log('newUser card', c, card);
      if (card.type === 'random') {
        let newRandomNumbers = getRandomCardNumbers();
        card.numbers = newRandomNumbers;
        // console.log('created', newRandomNumbers);
        // if (newOptions.playerCards[c]) {
        //   newOptions.playerCards[c].numbers = newRandomNumbers;
        // }
      }
    });
    // console.log('newUSer is', newUser);
    setUser(newUser);
    setOptions(newOptions);
  };
  const getProgressFromCard = (cardData) => {
    console.warn('got cardData', cardData)
    let newProgress = { ...opponentCardProgress };
    newProgress[cardData.cardIndex] = cardData;
    console.warn('newProgress', newProgress);
    setOpponentCardProgress(newProgress);
    // }
  }
  const handleClickPowerup = (powerup) => {
    if (powerupSelected !== powerup) {
      setPowerupSelected(powerup);
    } else {
      setPowerupSelected(undefined);
    }
  }
  const handleKillBee = (cardIndex, number) => {
    console.log('powerup?', powerupSelected)
    playSound(beeSound);
    console.log('must debit from powerup?', cardIndex, number);
    let newUser = { ...user };
    newUser.stats.beesKilled++;
    let invSlot = newUser.itemSlots.filter((slot) => slot.item.description === powerupSelected.description)[0];
    invSlot.item.uses--;
    if (invSlot.item.uses === 0) {
      invSlot.item = false;
    }
    setUser(newUser);
    let newTempBonuses = { ...temporaryBonuses };
    console.log('doomed?', cardIndex, number)
    let doomedIndex = -1;
    newTempBonuses.freeSpaces.map((space, i) => {
      console.log('space?', space)
      if (space.cardIndex === cardIndex && space.num === number) {
        doomedIndex = i;
      }
    });
    updateUserData(user.username, user.token, 'itemSlots', newUser.itemSlots)
    updateUserData(user.username, user.token, 'stats', newUser.stats)
    newTempBonuses.freeSpaces.splice(doomedIndex, 1);
    setTemporaryBonuses(newTempBonuses);
    setPowerupSelected(undefined);
  }

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
  }
  if (remainingPlayers.length === options.opponentCards.length) {
    dangerClass += ' green';
  } else if (remainingPlayers.length > options.opponentCards.length * 0.75) {
    dangerClass += ' yellow';
  } else if (remainingPlayers.length > options.opponentCards.length * 0.5) {
    dangerClass += ' orange';
  } else if (remainingPlayers.length > options.opponentCards.length * 0.3) {
    dangerClass += ' red';
  } else if (remainingPlayers.length < options.opponentCards.length * 0.3) {
    dangerClass += ' dark-red';
  }
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
  let ballsRemaining = ballLimit - calledBalls.length;
  let prizeMoney = 0;
  console.log('playersLeft', playersLeft)
  console.log('prizePerCard', prizePerCard)
  if (gameMode.name === 'Ranked') {
    prizeMoney = (playersLeft * prizePerCard);
  }
  if (gameMode.name === 'Limited Balls') {
    let basePrize = currentBingos.length * (75 - ballLimit) * 25;
    let volumeBonus = currentBingos.length * currentBingos.length * 10;
    // console.log('basePrize', basePrize);
    // console.log('volumeBonus', volumeBonus);
    prizeMoney = basePrize + volumeBonus;
  }
  console.big('card slots at render App');
  console.info(user.cardSlots);

  return (
    <div id="app" className={!loaded ? 'zoomed' : ''}>

      <div id="app-background" />
      <header id="main-header">
        {!menuOn &&
          (gameInProgress || calledBalls.length ? (
            <>
              <div id="danger-meter" ref={meterRef} className={gameStarted ? '' : 'blurred'}>
                {(gameMode.name === 'Ranked'  || gameMode.name === 'Bonanza') && (
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
                  {(gameMode.name === 'Ranked'  || gameMode.name === 'Bonanza')
                    // ? remainingPlayers.map((entry, i) => <div key={i} className={dangerClass} />)
                  ? remainingPlayers.map((entry, i) => {
                    // console.log('doing card id', entry.cardId)
                    // if (entry.markedNumbers) {
                    //   if (entry.markedNumbers.length > 12) {
                    //     dangerClass = 'danger-bar dark-red';
                    //   } else if (entry.markedNumbers.length > 10) {
                    //     dangerClass = 'danger-bar red';
                    //   } else if (entry.markedNumbers.length > 8) {
                    //     dangerClass = 'danger-bar orange';
                    //   } else if (entry.markedNumbers.length > 6) {
                    //     dangerClass = 'danger-bar yellow';
                    //   } else {
                    //     dangerClass = 'danger-bar green';
                    //   }
                    //   // if (!entry.active) {
                    //   //   dangerClass = 'danger-bar out-of-game'
                    //   // }
                    //   // console.log('final class is',  entry.markedNumbers.length, dangerClass)
                    // }
                    return <div key={i} className={dangerClass} />
                  })
                  : gameMode.name === 'Limited Balls'
                  ? Array(ballLimit)
                      .fill()
                      .map((remainingBall, b) => <div key={b} className={b >= ballsRemaining ? dangerClass + ' called' : dangerClass} />)
                  : null}
                </div>
                {(gameMode.name === 'Ranked'  || gameMode.name === 'Bonanza') && (
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
          className={`status-button${menuOn && menuMode === 'account' ? ' on' : ''}${user.loggedIn ? ' logged-in' : ''}${!gotData ? ' hidden' : ''}`}
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
        {gameStarted && <CallerArea ref={ref} calledBalls={calledBalls} gameStarted={gameStarted} />}
        <div id="player-card-area" className={playerAreaClass}>
          {user.cardSlots.map((card, c) => {
            card = user.cards[card.cardId];

            console.green('doing user card ----------------------');
            console.log(card)
            console.green('doing user card ----------------------');

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
                gameStarted={gameStarted}
                calledBalls={calledBalls}
                onDaubSquare={handleDaubSquare}
                playersLeft={playersLeft}
                onAchieveBingo={handleAchieveBingo}
                onClickInactiveCard={handleClickInactiveCard}
                gameMode={gameMode}
                powerupSelected={powerupSelected}
                onKillBee={handleKillBee}
              />
            </div>
          )})}
        </div>

        <ClickBonusIndicator showing={showingBonusText} message={showingBonusText} />

        <div id="opponent-card-area" className={opponentAreaClass}>
          {gameInProgress && options.opponentCards.map((card, c) => (
            <div key={c} className="card-space">
              <Card
                index={c}
                ready={loaded}
                type={card.type}
                reportProgress={getProgressFromCard}
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
                powerupSelected={powerupSelected}
                itemSlots={user.itemSlots}
                itemUses={[...[...user.itemSlots].filter(slot => slot.item).map(item => item.uses)]}
                storeOpen={storeOpen}
                mapOn={mapOn}
                itemsEquippedCount={user.itemSlots.filter(slot => slot.item).length}
                // voiceOn={options.voiceOn}
                chickenCount={user.chickens.length}
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

              <GameEndModal gameMode={gameMode} showing={gameEnded} recordsBroken={recordsBroken} currentBingos={currentBingos} prizeMoney={prizeMoney} winnerLimit={winnerLimit} ballLimit={ballLimit} totalOpponents={options.opponentCards.length} rank={options.opponentCards.length - playersLeft + 1} lost={options.opponentCards.length - playersLeft + 1 > winnerLimit} onClickOkayButton={handleClickOkayButton} />
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
              <CornerChicken ref={chickenRef} showing={gameStarted} currentBeeChance={currentBeeChance} openingBonus={openingBonus} paused={!gameStarted} gameStarted={gameStarted} showingGift={offeringBonus} onClickGift={handleClickGift} />
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
          <PreGameModal stats={user.stats} loggedIn={user.loggedIn} showing={preGameOn} gameMode={gameMode} winnerLimit={winnerLimit} ballLimit={ballLimit} winPattern={winPattern} timeLimit={timeLimit} opponentCount={opponentCardCount} onClickChangeMode={handleClickChangeMode} onClickBeginGame={startGame} onClickCancelButton={handleClickCancelButton} onClickLoginButton={handleClickLogIn}/>

    </div>
  );
}

export default App;
