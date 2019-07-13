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

const calls = [
  undefined,
  'Kelly’s Eye',
  'One Little Duck',
  'Cup of Tea',
  'Knock at the Door',
  'Man Alive',
  'Tom Mix',
  'Lucky Seven',
  'Garden Gate',
  'Doctor’s Orders',
  'Cameron’s Den',
  'Legs 11',
  'One Dozen',
  'Unlucky for Some',
  'Valentine’s Day',
  'Young and Keen',
  'Sweet 16',
  'Dancing Queen',
  'Coming of Age',
  'Goodbye Teens',
  'One Score',
  'Royal Salute',
  'Two Little Ducks',
  'Thee and Me',
  'Two Dozen',
  'Duck and Dive',
  'Pick and Mix',
  'Gateway to Heaven',
  'Over Weight',
  'Rise and Shine',
  'Dirty Gertie',
  'Get Up and Run',
  'Buckle My Shoe',
  'Dirty Knee',
  'Ask for More',
  'Jump and Jive',
  'Three Dozen',
  'More than 11',
  'Christmas Cake',
  'Steps',
  'Naughty 40',
  'Time for Fun',
  'Winnie the Pooh',
  'Down on Your Knees',
  'Droopy Drawers',
  'Halfway There',
  'Up to Tricks',
  'Four and Seven',
  'Four Dozen',
  'PC',
  'Half a Century',
  'Tweak of the Thumb',
  'Danny La Rue',
  'Stuck in the Tree',
  'Clean the Floor',
  'Snakes Alive',
  'Was She Worth It?',
  'Heinz Varieties',
  'Make Them Wait',
  'Brighton Line',
  'Five Dozen',
  'Bakers Bun',
  'Turn the Screw',
  'Tickle Me 63',
  'Red Raw',
  'Old Age Pension',
  'Clickety Click',
  'Made in Heaven',
  'Saving Grace',
  'Either Way Up',
  'Three Score and 10',
  'Bang on the Drum',
  'Six Dozen',
  'Queen B',
  'Candy Store',
  'Strive and Strive',
  'Trombones',
  'Sunset Strip',
  'Heaven’s Gate',
  'One More Time',
  'Eight and Blank',
  'Stop and Run',
  'Straight On Through',
  'Time for Tea',
  'Seven Dozen',
  'Staying Alive',
  'Between the Sticks',
  'Torquay in Devon',
  'Two Fat Ladies',
  'Nearly There',
  'Top of the Shop'
];

const getLetter = num => {
  let ind = 0;
  limits.map((letterRow, l) => {
    if (letterRow.includes(num)) {
      ind = l;
    }
  });
  return ['b', 'i', 'n', 'g', 'o'][ind];
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

export { limits, getLetter, calls, randomInt, isFullScreen, fullScreenCall, exitFullScreenCall, getTimeSinceFromSeconds, shuffle };
