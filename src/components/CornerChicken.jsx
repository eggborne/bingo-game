import React, { forwardRef} from 'react';
import '../css/CornerChicken.css';

let chickenPng = require('../assets/eye.png');
let giftboxPng = require('../assets/giftbox.png');
let beePng = require('../assets/shadowbee.png');

const CornerChicken = React.forwardRef((props, ref) => {
  const cornerChickenRef = ref;
  // console.orange('CORNER CHICKEN');
  // console.count();
  let ringClass = '';
  if (props.showingBonusText) {
    ringClass += ' flashing';
    console.error(props.showingBonusText)
    if (props.showingBonusText > 500) {
      ringClass += ' special';
    }
  }
  let spotClass = props.showing ?
    (props.showingGift ? 'showing-giftbox' : '')
    : 'hidden';
  // let imageSource = props.showingGift ? giftboxPng : chickenPng;
  // let imageSource = chickenPng;
  if (props.openingBonus) {
    if (props.openingBonus.type === 'BEE') {
      spotClass = 'bee';
    }
  }

  // if (props.currentBeeChance > 8) {
  //   spotClass += ' danger-3'
  // } else if (props.currentBeeChance > 6) {
  //   spotClass += ' danger-2'
  // } else if (props.currentBeeChance > 3) {
  //   spotClass += ' danger-1'
  // } else {
  //   spotClass += ' danger-0'
  // }

  if (!props.showingGiftbox) {}
  let clickEffect = props.showingGift ? props.onClickGift : () => null;
  let meterHeight = props.bonusMeter / 1000;
  if (meterHeight > 1000) {
    meterHeight = 1000;
  }
  return (
    <>
      <div id='bonus-spot' onPointerDown={props.onClickCorner} className={spotClass}>
      <div className={ringClass} style={{opacity: (meterHeight)}} id='meter-ring'></div>
        <div className={ringClass} style={{transform: `scaleY(${meterHeight})`}} id='meter'></div>
        <img ref={cornerChickenRef} onPointerDown={clickEffect} alt='' id='bonus-chicken' src={chickenPng}/>
        {/* <div id='corner-chicken-overlay'>{props.bonusMeter/1000}</div> */}
        {props.showingGiftbox && <div id='corner-chicken-overlay'>{100 - (props.currentBeeChance * 10)}</div>}
      </div>
    </>
  );
});
function areEqual(prevProps, nextProps) {
  return (
    prevProps.showing === nextProps.showing &&
    prevProps.showingGift === nextProps.showingGift &&
    prevProps.bonusMeter === nextProps.bonusMeter &&
    prevProps.showingBonusText === nextProps.showingBonusText &&
    prevProps.openingBonus === nextProps.openingBonus
  );
}

export default React.memo(CornerChicken, areEqual);
// export default CornerChicken;
