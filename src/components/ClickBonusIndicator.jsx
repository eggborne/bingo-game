import React, {useState, useEffect} from 'react';
import '../css/ClickBonusIndicator.css';

function ClickBonusIndicator(props) {
  const [message, setMessage] = useState(props.message);
  useEffect(() => {
    if (props.message) {
      setMessage(props.message);
    } else {
      setTimeout(() => {
        setMessage('');
      }, 1000)
    }
  }, [props.message])
  let bonusClass = props.showing ? 'click-bonus-indicator showing' : 'click-bonus-indicator'
  let bgColor = 'green';
  if (message === 'SPEED BONUS') {
    bgColor = 'yellowgreen';
  } else if (message === 'STREAK ENDED :(') {
    bgColor = 'brown';
  }
  return (
    <div style={{backgroundColor: bgColor}} className={bonusClass}>
      {message}
    </div>
  );
}
export default ClickBonusIndicator;
