import React from 'react';
import '../css/BonusIndicator.css';

function BonusIndicator(props) {
  // console.pink('BonusIndicator ------------------');
  // console.log(props)
  let bonusClass = '';
  if (props.active) {
    bonusClass = 'active';
  }
  return (
    <div id='bonus-indicator' className={bonusClass}>
      {/* {bonusDisplay} {props.openingBonus && props.openingBonus.value + ' card ' + (props.openingBonus.cardIndex + 1)} */}
      {props.bonusDisplay}
    </div>
  );
}


function areEqual(prevProps, nextProps) {
  return (
    prevProps.openingBonus === nextProps.openingBonus &&
    prevProps.gameNews === nextProps.gameNews
  );
}

export default React.memo(BonusIndicator, areEqual);
// export default BonusIndicator;
