import React, { forwardRef} from 'react';
import '../css/CornerChicken.css';

let chickenPng = require('../assets/chickenstand.png');
let giftboxPng = require('../assets/giftbox.png');
let beePng = require('../assets/shadowbee.png');

const CornerChicken = React.forwardRef((props, ref) => {
  const cornerChickenRef = ref;
  console.orange('CORNER CHICKEN');
  console.count();
  let spotClass = props.showing ?
    (props.showingGift ? 'showing-giftbox' : '')
    : 'hidden';
  let imageSource = props.showingGift ? giftboxPng : chickenPng;
  if (props.openingBonus) {
    if (props.openingBonus.type === 'FREE') {
      imageSource = '';
    }
    if (props.openingBonus.type === 'BEE') {
      spotClass += ' bust';
      imageSource = beePng;
    }
  }
  if (props.currentBeeChance > 8) {
    spotClass += ' danger-3'
  } else if (props.currentBeeChance > 6) {
    spotClass += ' danger-2'
  } else if (props.currentBeeChance > 3) {
    spotClass += ' danger-1'
  } else {
    spotClass += ' danger-0'
  }
  if (!props.showingGiftbox) {}
  let clickEffect = props.showingGift ? props.onClickGift : () => null;

  return (
    <>
    <div id='bonus-spot' className={spotClass}>

      <img ref={cornerChickenRef} onPointerDown={clickEffect} alt='' id='bonus-chicken' src={imageSource} />
      <div id='corner-chicken-overlay'>{100 - (props.currentBeeChance * 10)}</div>
      </div>
    </>
  );
});
function areEqual(prevProps, nextProps) {
  return (
    prevProps.showing === nextProps.showing &&
    prevProps.showingGift === nextProps.showingGift &&
    prevProps.openingBonus === nextProps.openingBonus
  );
}

export default React.memo(CornerChicken, areEqual);
// export default CornerChicken;
