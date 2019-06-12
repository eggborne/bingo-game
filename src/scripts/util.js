// const limits = [{ min: 1, max: 15 }, { min: 16, max: 30 }, { min: 31, max: 45 }, { min: 46, max: 60 }, { min: 61, max: 75 }]

const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getTimeSinceFromSeconds = sessionLengthInSeconds => {
  let output;
  let sessionMinutes = Math.ceil(sessionLengthInSeconds / 60);
  let minutePlural = 's';
  if (sessionMinutes === 1) {
    minutePlural = '';
  }
  if (sessionMinutes >= 60) {
    let wholeHours = Math.floor(sessionMinutes / 60);
    let minutes = sessionMinutes % 60;
    if (minutes === 1) {
      minutePlural = '';
    }
    let hourPlural = 's';
    if (wholeHours === 1) {
      hourPlural = '';
    }
    if (wholeHours >= 24) {
      let dayPlural = 's';
      let wholeDays = Math.floor(wholeHours / 24);
      if (wholeDays === 1) {
        dayPlural = '';
      }
      output = `${wholeDays} day${dayPlural}`;
    } else {
      if (minutes === 0 || wholeHours >= 6) {
        output = `${wholeHours} hour${hourPlural}`;
      } else {
        output = `${wholeHours} hour${hourPlural} ${minutes} min${minutePlural}`;
      }
    }
  } else {
    if (sessionMinutes === 0) {
      output = 'moments';
    } else {
      output = `${sessionMinutes} min${minutePlural}`;
    }
  }
  return output;
};

function fullScreenCall() {
  let root = document.getElementById('app');
  console.log(root);
  return root.requestFullscreen || root.webkitRequestFullscreen || root.mozRequestFullScreen || root.msRequestFullscreen;
}
function exitFullScreenCall() {
  return document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen || document.msExitFullscreen;
}
function isFullScreen() {
  return document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
}

const limits = [
  [...Array(15).keys()].map(num => num += 1),
  [...Array(15).keys()].map(num => num += 16),
  [...Array(15).keys()].map(num => num += 31),
  [...Array(15).keys()].map(num => num += 46),
  [...Array(15).keys()].map(num => num += 61),
];

const getLetter = num => {
  let ind = 0;
  limits.map((letterRow, l) => {
    if (letterRow.includes(num)) {
      ind = l;
    }
  });
  return ['b', 'i', 'm', 'g', 'o'][ind];
};

const shuffle = (array) => {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

export { limits, getLetter, randomInt, isFullScreen, fullScreenCall, exitFullScreenCall, getTimeSinceFromSeconds, shuffle };
