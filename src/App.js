import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import Card from './components/Card';
import CallerArea from './components/CallerArea';
import ButtonBar from './components/ButtonBar';
import ConfirmModal from './components/ConfirmModal';
import LogInScreen from './components/LogInScreen';
import GameEndModal from './components/GameEndModal';
import StoreScreen from './components/StoreScreen';
import Menu from './components/Menu';
import './css/App.css';
import { randomInt, isFullScreen, fullScreenCall, exitFullScreenCall, getTimeSinceFromSeconds, limits } from './scripts/util';
import axios from 'axios';
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
const bgColors = ['#ffeeeeca', '#eeddffca', '#e2ffdeca'];

const defaultUser = {
  loggedIn: false,
  username: 'Guest',
  currency: {
    cash: 0
  },
  stats: {
    totalGames: 0,
    totalBingos: 0
  },
  cards: [{ type: 'random' }, { type: 'random' }],
  prizes: [
    { category: 'Chips / Markers', type: 'red', cost: 0 }
  ],
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
  chipImage: `red`
};

function App() {
  console.green('App -----------------------------------');
  const saveRef = useRef();

  // STATE //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const [gotData, setGotData] = useState(false);
  const [user, setUser] = useState(defaultUser);
  const [options, setOptions] = useState(defaultOptions);
  const [playersLeft, setPlayersLeft] = useState(options.opponentCards.length);
  const [ballsLeft, setBallsLeft] = useState([...Array(76).keys()].slice(1, 76));
  const [ballQueue, setQueue] = useState([]);
  const [gameStarted, setGameStart] = useState(false);
  const [menuOn, setMenuOn] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false); // 'logIn' or 'register'
  const [loggingOut, setLoggingOut] = useState(false);
  const [locked, setLocked] = useState(false);
  const [modalOn, setModalOn] = useState(false);
  const [modalMessage, setModalMessage] = useState('Really reset the game?');
  // const [gameEndMessage, setGameEndMessage] = useState('BINGO');
  const [gameEnded, setGameEnded] = useState(false);
  const [errored, setErrored] = useState(false);
  const [prizePerCard, setPrizePerCard] = useState(25);
  const [changedUserData, setChangedUserData] = useState([]);
  const [menuMode, setMenuMode] = useState('settings');
  const [loginError, setLoginError] = useState('');
  const [storeOpen, setStoreOpen] = useState(false);
  const [winnerLimit, setWinnerLimit] = useState(3);
  const ref = useRef();

  // EFFECTS //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  useEffect(() => {
    let cookie = getCookie('eggborne-bingo');
    if (cookie) {
      logUserIn(cookie.username, null, cookie.token).then(response => {
        if (response.data === 'badUsername') {
          console.error('bad username.');
        } else if (response.data === 'badPassword') {
          console.error('bad password.');
        } else {
          let data = { ...response.data };
          integrateLoggedInUser(data);
        }
      });
    } else {
      setGotData(true);
      user.cards = options.playerCards;
      document.documentElement.style.setProperty('--card-size-landscape', `${1 - options.cardMarginLandscape}`);
      document.documentElement.style.setProperty('--card-size', `${1 - options.cardMargin}`);
    }
    window.addEventListener('fullscreenchange', event => {
      setLocked(isFullScreen());
    });
  }, []);
  useInterval(() => {
    if (gameStarted) {
      ref.current.scrollLeft = -ref.current.scrollWidth;
      setTimeout(() => {
        drawBall();
      }, 300);
      counter++;
      // if (counter % 10 === 0) {
      //   Array.from(document.querySelectorAll('#player-card-area > div > .card > .number-grid')).map((card, i) => {
      //     card.style.backgroundColor = bgColors[randomInt(0, bgColors.length)];
      //   });
      // }
    }
    return this;
  }, options.drawSpeed);
  useEffect(() => {
    ref.current.scrollLeft = ref.current.scrollLeft;
  }, [ref, ballQueue]);
  // useEffect(() => {
  //   console.warn('user changed!');
  // }, [user]);
  // useEffect(() => {
  //   console.warn('options changed!');
  // }, [options]);

  // FUNCTIONS //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  function logOut() {
    setCookie('eggborne-bingo', null, 0);
    setUser(defaultUser);
    setOptions(defaultOptions);
    document.documentElement.style.setProperty('--card-size-landscape', `${1 - defaultOptions.cardMargin}`);
    document.documentElement.style.setProperty('--card-size', `${1 - defaultOptions.cardMarginLandscape}`);
    document.documentElement.style.setProperty('--user-cards-wide', defaultOptions.fitWide);
    document.documentElement.style.setProperty('--user-cards-wide-landscape', defaultOptions.fitWideLandscape);
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
    console.log('data', data)
    let newUser = { ...user };
    newUser.id = data.id;
    newUser.username = data.username;
    newUser.token = data.token;
    console.log('type is', typeof data.cards)
    newUser.stats = JSON.parse(data.stats);
    newUser.currency = JSON.parse(data.currency);
    newUser.prizes = JSON.parse(data.prizes);
    newUser.loggedIn = true;
    if (typeof data.cards === 'string') {
      data.cards = JSON.parse(data.cards);
    }
    newUser.cards = data.cards;

    let newOptions = data.options;
    newOptions.playerCards = newUser.cards;

    document.documentElement.style.setProperty('--user-cards-wide', newOptions.fitWide);
    document.documentElement.style.setProperty('--user-cards-wide-landscape', newOptions.fitWideLandscape);
    document.documentElement.style.setProperty('--card-size', `${1 - newOptions.cardMargin}`);
    document.documentElement.style.setProperty('--card-size-landscape', `${1 - newOptions.cardMarginLandscape}`);

    setPlayersLeft(newOptions.opponentCards.length);
    document.documentElement.style.setProperty('--opponent-cards', newOptions.opponentCards.length);
    setOptions(newOptions);
    setUser(newUser);
    console.log('newOptions set', newOptions)
    console.log('newUser set', newUser)
    if (remember) {
      setCookie('eggborne-bingo', JSON.stringify({ username: newUser.username, token: newUser.token }), 365);
    }
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
    if (ballsCopy.length) {
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
    } else {
      if (options.voiceOn) {
        let spokenOutPhrase = new SpeechSynthesisUtterance(`Oh darn, I'm all out of balls.`);
        spokenOutPhrase.rate = 0.6;
        spokenOutPhrase.pitch = 0.4;
        synth.speak(spokenOutPhrase);
      }
      setGameStart(false);
    }
  };
  const handleClickStartButton = event => {
    setGameStart(!gameStarted);
    if (!gameStarted && ballQueue.length === 0) {
      if (storeOpen) {
        setStoreOpen(false);
      }
    } else if (gameStarted) {
      synth.cancel();
    }
  };
  const handleClickVoiceButton = () => {
    var newOptions = { ...options };
    newOptions.voiceOn = !options.voiceOn;
    if (newOptions.voiceOn) {
      console.log('voice on!');
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
  const handleClickResetButton = () => {
    setModalOn(true);
    setModalMessage('Really reset this game?');
  };
  const handleClickViewButton = () => {
    let newOptions = { ...options };
    newOptions.showOpponentCards = !newOptions.showOpponentCards;
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
    setModalOn(true);
    setModalMessage('Really quit the whole game?');
  };
  const handleClickOkayButton = event => {
    setGameEnded(false);
    resetGame();
  };
  const handleClickAgreeButton = event => {
    if (ballQueue.length) {
      setModalOn(false);
      setTimeout(() => {
        resetGame();
      }, 155);
    } else if (errored) {
      window.location.reload();
    } else if (loggingOut) {
      logOut();
      setLoggingOut(false);
      setModalOn(false);
    } else {
      window.open(window.location, '_self').close();
    }
  };
  const handleClickReloadButton = event => {
    setErrored(true);
    setModalOn(true);
    setModalMessage('Really reload the whole thing?');
  };
  const handleClickCancelButton = () => {
    if (modalOn) {
      setModalOn(false);
      if (errored) {
        setTimeout(() => {
          setErrored(false);
        }, 310);
      }
    } else {
      setLoggingIn(false);
    }
  };
  const handleChangeCallSpeed = newSeconds => {
    let newSpeed = newSeconds * 1000;
    let newOptions = { ...options };
    newOptions.drawSpeed = newSpeed;
    setOptions(newOptions);
    // setDrawSpeed(newSpeed);
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
      }
    } else {
      setChangedUserData([]);
    }
    if (storeOpen) {
      setStoreOpen(false);
    }
    setMenuOn(!menuOn);
  };
  const handleClickMenuArrow = type => {
    console.log('clicked type', type);
    let newOptions = { ...options };
    let newUser = { ...user };
    if (!gameStarted && !ballQueue.length) {
      if (type === 'player-cards-minus') {
        if (newOptions.playerCards.length > 1) {
          newOptions.playerCards.pop();
          newUser.cards = newOptions.playerCards;
          setUser(newUser);
          setOptions(newOptions);
          if (!changedUserData.includes('cards')) {
            setChangedUserData([...changedUserData, 'cards']);
          }
        }
      } else if (type === 'player-cards-plus') {
        if (newOptions.playerCards.length < 30) {
          newOptions.playerCards.push({ type: 'random' });
          newUser.cards = newOptions.playerCards;
          setUser(newUser);
          setOptions(newOptions);
          if (!changedUserData.includes('cards')) {
            setChangedUserData([...changedUserData, 'cards']);
          }
        }
      } else if (type === 'opponent-cards-minus') {
        if (newOptions.opponentCards.length > 1) {
          newOptions.opponentCards.pop();
          setOptions(newOptions);
          setPlayersLeft(newOptions.opponentCards.length);
          document.documentElement.style.setProperty('--opponent-cards', newOptions.opponentCards.length);
          if (!changedUserData.includes('options')) {
            setChangedUserData([...changedUserData, 'options']);
          }
        }
      } else if (type === 'opponent-cards-plus') {
        if (newOptions.opponentCards.length < 30) {
          newOptions.opponentCards.push({ type: 'random' });
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
    user.prizes.filter(prize => allColors.includes(prize.type)).forEach(prize => {
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
    if (opponent) {
      let newPlayers = playersLeft - 1;
      setPlayersLeft(newPlayers);
      if (!newPlayers) {
        if (options.voiceOn) {
          let spokenOutPhrase = new SpeechSynthesisUtterance(`Oh shit, looks like everyone got a Bingo.`);
          spokenOutPhrase.rate = 0.6;
          spokenOutPhrase.pitch = 0.4;
          synth.speak(spokenOutPhrase);
        }
        setGameStart(false);
      }
      if (newPlayers <= options.opponentCards.length - 5) {
        console.error('lose.');
      }
    } else {
      let prizeMoney = playersLeft * prizePerCard;
      let newUser = { ...user };
      newUser.currency.cash += prizeMoney;
      newUser.stats.totalBingos++;
      newUser.stats.totalGames++;
      setUser(newUser);
      if (user.loggedIn) {
        updateUserData(user.username, user.token, 'stats', newUser.stats).then(response => {
          if (response.data === 'UPDATED') {
            console.log('updated stats');
          }
        });
        updateUserData(user.username, user.token, 'currency', newUser.currency).then(response => {
          if (response.data === 'UPDATED') {
            console.log('updated currency');
          }
        });
      }
      setGameStart(false);
      setTimeout(() => {
        setGameEnded(true);
      }, 1000);
      // resetGame();
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
                randomCards[i].numbers = newNumbers;
              }
              let data = { ...response.data };
              data.cards = randomCards;
              console.info('cards', randomCards, 'token', data)
              updateUserData(enteredName, data.token, 'cards', randomCards).then(response => {
                console.log('update cards?', response)
              });
              integrateLoggedInUser(data, remember);
              setLoggingIn(false);
            }
          });
        }
      });
    }
  };

  const handleClickStoreButton = () => {
    setStoreOpen(!storeOpen);
  };
  const handleClickBuyButton = (itemData) => {
    itemData = {
      description: itemData.description,
      type: itemData.type,
      cost: itemData.cost
    };
    console.log('bought', itemData);
    let newUser = { ...user };
    let newPrizes = [...newUser.prizes, itemData];
    newUser.prizes = newPrizes;
    newUser.currency.cash -= itemData.cost;
    setUser(newUser);
    updateUserData(user.username, user.token, 'currency', newUser.currency).then(response => { console.log('curr updated?', response) });
    updateUserData(user.username, user.token, 'prizes', newPrizes).then(response => {
      console.log('updated inv?', response)
    });
  }

  const handleBadClick = () => {
    let newUser = { ...user };
    if (newUser.currency.cash) {
      newUser.currency.cash--;
      setUser(newUser);
      requestAnimationFrame(() => {
        updateUserData(user.username, user.token, 'currency', newUser.currency);
      });
    }
  };
  const resetGame = () => {
    setGameStart(false);
    setPlayersLeft(options.opponentCards.length);
    setTimeout(() => {
      setQueue([]);
      setBallsLeft([...Array(76).keys()].slice(1, 76));
    }, 100);
    synth.cancel();
  };

  // RENDER //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  let isFull = isFullScreen();
  let gameInProgress = ballQueue.length > 0;
  let fitWide = window.innerWidth > window.innerHeight ? options.fitWideLandscape : options.fitWide;
  let playerAreaClass = modalOn ? 'card-area dimmed' : 'card-area';
  let opponentAreaClass = options.showOpponentCards ? 'card-area' : 'card-area hidden';
  let playerCardCount = user.cards.length;
  let opponentCardCount = options.opponentCards.length;
  let remainingPlayers = new Array(playersLeft);
  remainingPlayers.fill(null, 0, playersLeft);
  let dangerClass = 'danger-bar';
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
  if (menuOn) {
    menuButtonClass += ' on';
  }
  let gameBoardClass = '';
  if (menuOn) {
    gameBoardClass += ' blurred';
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
  return (
    <div id='app'>
      <header id='main-header'>
        {!menuOn &&
          (gameStarted || ballQueue.length ? (
            <>
              <div id='danger-meter' className={gameStarted ? '' : 'blurred'}>
                <div id='danger-bar-list'>
                  {remainingPlayers.map((entry, i) => (
                    <div key={i} className={dangerClass} />
                  ))}
                </div>
                <div id='prize-label' className={dangerClass}>
                  <small style={{ fontWeight: 'normal', color: 'white' }}>Prize:</small> ${playersLeft * prizePerCard}
                </div>
              </div>
            </>
          ) : (
            <div id='title'>{`updated ${sinceUpdated} ago`}</div>
          ))}
        {menuOn ? (
          <>
            <div id='header-end'>
              <button onClick={locked ? exitFullLandscape : goFullLandscape} id='fullscreen-toggle' className={fsClass}>
                <i className='material-icons'>{fsClass.includes('full') ? `fullscreen_exit` : `fullscreen`}</i>
              </button>
            </div>
            <button onPointerDown={() => setMenuMode('display')} id='display-button' className={menuMode === 'display' ? `status-button on` : `status-button`}>
              <i className='material-icons'>tv</i>
            </button>
            <button onPointerDown={() => setMenuMode('settings')} id='settings-button' className={menuMode === 'settings' ? `status-button on` : `status-button`}>
              <i className='material-icons'>settings</i>
            </button>
            <button onPointerDown={() => setMenuMode('cards')} id='cards-button' className={menuMode === 'cards' ? `status-button on` : `status-button`} />
          </>
        ) : (
          ''
        )}
        <div
          onPointerDown={() => { if (menuOn) { setMenuMode('account'); } else { if (storeOpen) { setStoreOpen(false); } if (gameStarted) { setMenuMode('account'); setMenuOn(true); } else { if (!user.loggedIn) { setLoggingIn('logIn'); } else { setMenuMode('account'); setMenuOn(true); } } } }}
          id='account-button'
          className={`status-button${menuOn ? ' truncated' : ''}${menuOn && menuMode === 'account' ? ' on' : ''}${user.loggedIn ? ' logged-in' : ''}`}
        >
          <i className='material-icons'>person</i>
          <div id='header-username' className={usernameClass}>
            {displayName.map((name, n) => (<div key={n}>{name}</div>))}
          </div>
          <div>${user.currency.cash}</div>
        </div>
        <button onPointerDown={handleClickMenu} id='menu-button' className={menuButtonClass}>
          <div id='menu-bar-container'>
            <div className='menu-bar' />
            <div className='menu-bar' />
            <div className='menu-bar' />
          </div>
        </button>
      </header>
      <div
        id='game-board'
        className={gameBoardClass}
        onPointerDown={() => {
          if (menuOn) {
            handleClickMenu();
          }
        }}
      >
        <CallerArea ref={ref} ballQueue={ballQueue} gameStarted={gameStarted} />
        <div id='player-card-area' className={playerAreaClass}>
          {gotData && user.cards.map((card, c) => (
            <div key={c} className='card-space'>
              <Card ready={gotData} index={c} type={card.type} chipImage={options.chipImage} autoFreeSpace={options.autoFreeSpace} cardData={user.cards[c] ? user.cards[c] : ''} gameStarted={gameStarted} ballQueue={ballQueue} playersLeft={playersLeft} onAchieveBingo={handleAchieveBingo} onBadClick={handleBadClick} />
            </div>
          ))}
        </div>
        <div id='opponent-card-area' className={opponentAreaClass}>
          {options.opponentCards.map((card, c) => (
            <div key={c} className='card-space'>
              <Card index={c} ready={gotData} type={card.type} opponent={true} gameStarted={gameStarted} ballQueue={ballQueue} onAchieveBingo={handleAchieveBingo} />
            </div>
          ))}
        </div>
      </div>
      {gotData &&
        <>
          <ButtonBar
            gameStarted={gameStarted}
            gameInProgress={gameInProgress}
            closing={!gameStarted && !ballQueue.length}
            storeOpen={storeOpen}
            voiceOn={options.voiceOn}
            showOpponentCards={options.showOpponentCards}
            onClickReloadButton={handleClickReloadButton}
            onClickStartButton={handleClickStartButton}
            onClickStoreButton={handleClickStoreButton}
            onClickViewButton={handleClickViewButton}
            onClickVoiceButton={handleClickVoiceButton}
            onClickResetButton={!gameStarted && !ballQueue.length ? handleClickCloseButton : handleClickResetButton}
          />
          {!user.loggedIn && <LogInScreen showing={loggingIn} loginError={loginError} onClickLogInButton={handleClickLogInButton} onClickRegisterButton={handleClickRegisterButton} onClickCancelButton={handleClickCancelButton} />}
          <ConfirmModal showing={modalOn} message={modalMessage} loggingOut={loggingOut} urgent={!gameStarted && !ballQueue.length} reload={errored} onClickAgreeButton={handleClickAgreeButton} onClickCancelButton={handleClickCancelButton} />
          {gameInProgress && <GameEndModal showing={gameEnded} prizeMoney={playersLeft * prizePerCard} winnerLimit={winnerLimit} totalOpponents={options.opponentCards.length} rank={options.opponentCards.length - playersLeft + 1} lost={options.opponentCards.length - playersLeft + 1 > winnerLimit} onClickOkayButton={handleClickOkayButton} />}
          <Menu
            menuMode={menuMode}
            user={user}
            stats={user.stats}
            chipImage={options.chipImage}
            showOpponentCards={options.showOpponentCards}
            voiceOn={options.voiceOn}
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
        </>
      }
      {!gameInProgress && <StoreScreen showing={storeOpen} userPrizes={user.prizes} userCash={user.currency.cash} onClickBuyButton={handleClickBuyButton}/>}
      <div id='save-icon' ref={saveRef}>
        <i className='material-icons'>save</i>
        <small>Saved</small>
      </div>
    </div>
  );
}

export default App;
