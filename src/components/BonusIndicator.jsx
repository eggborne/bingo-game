import React from 'react';
import '../css/BonusIndicator.css';

function BonusIndicator(props) {
  console.pink('BonusIndicator ------------------');
  console.log(props)
  let bonusClass = '';
  let bonusDisplay = 'FREE SPACE';
  if (props.openingBonus) {
    bonusClass = 'active';
    bonusDisplay = 'FREE SPACE';
  } else if (props.gameNews) {
    bonusDisplay = props.gameNews;
  }
  return (
    <div id='bonus-indicator' className={bonusClass}>
      {bonusDisplay}
    </div>
  );
}

function areEqual(prevProps, nextProps) {
  return (
    prevProps.openingBonus === nextProps.openingBonus
  );
}

// export default React.memo(BonusIndicator, areEqual);
export default BonusIndicator;
