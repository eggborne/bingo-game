import React from 'react';
import '../css/BonusIndicator.css';

function BonusIndicator(props) {
  let bonusClass = '';
  if (props.active) {
    bonusClass = 'active';
  }
  return (
    <div id='bonus-indicator' className={bonusClass}>
      {props.bonusDisplay}
    </div>
  );
}


function areEqual(prevProps, nextProps) {
  return (
    prevProps.openingBonus === nextProps.openingBonus &&
    prevProps.gameNews === nextProps.gameNews &&
    prevProps.bonusDisplay === nextProps.bonusDisplay
  );
}

export default React.memo(BonusIndicator, areEqual);
// export default BonusIndicator;
