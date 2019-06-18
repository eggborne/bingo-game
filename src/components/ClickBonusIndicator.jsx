import React from 'react';
import '../css/ClickBonusIndicator.css';

function ClickBonusIndicator(props) {
  let bonusClass = props.showing ? 'click-bonus-indicator showing' : 'click-bonus-indicator'
  return (
    <div className={bonusClass}>
      {props.message || 'SPEED BONUS'}
    </div>
  );
}
export default ClickBonusIndicator;
