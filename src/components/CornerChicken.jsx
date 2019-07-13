import React, { forwardRef} from 'react';
import '../css/CornerChicken.css';

let horusPng = require('../assets/eye.png');

const CornerChicken = React.forwardRef((props, ref) => {
  const cornerChickenRef = ref;
  let ringClass = '';
  if (props.showingBonusText) {
    ringClass += ' flashing';
    if (props.showingBonusText === 'SUPER SPEED BONUS!') {
      ringClass += ' special';
    }
  }
  let spotClass = '';
  if (props.showing) {
    if (props.showingGift) {
      spotClass += props.bonusLuckActivated ? ' showing-giftbox showing-free-space' : ' showing-giftbox'
    }
  } else {
    spotClass = 'hidden';
  }
  if (props.openingBonus) {
    if (props.openingBonus.type === 'BEE') {
      spotClass = 'bee';
    }
  }
  if (props.bonusLuckActivated) {
    spotClass += ' lucky';
  }
  let clickEffect = props.showingGift ? props.onClickGift : () => null;
  let meterHeight = props.bonusMeter / 1000;
  if (meterHeight > 1) {
    meterHeight = 1;
  }
  return (
    <>
      <div id='bonus-spot' onPointerDown={clickEffect} className={spotClass}>
      <div className={ringClass} style={{opacity: (meterHeight)}} id='meter-ring'></div>
        <div className={ringClass} style={{ transform: `scaleY(${meterHeight})` }} id='meter'></div>
        <img ref={cornerChickenRef} alt='' id='bonus-chicken' src={horusPng}/>
        {/* <div id='corner-chicken-overlay'>{props.bonusMeter/1000}</div> */}
      </div>
    </>
  );
});
function areEqual(prevProps, nextProps) {
  return (
    prevProps.showing === nextProps.showing &&
    prevProps.showingGift === nextProps.showingGift &&
    prevProps.showingGiftbox === nextProps.showingGiftbox &&
    prevProps.bonusMeter === nextProps.bonusMeter &&
    prevProps.showingBonusText === nextProps.showingBonusText &&
    prevProps.bonusLuckActivated === nextProps.bonusLuckActivated &&
    prevProps.openingBonus === nextProps.openingBonus
  );
}

export default React.memo(CornerChicken, areEqual);
// export default CornerChicken;
