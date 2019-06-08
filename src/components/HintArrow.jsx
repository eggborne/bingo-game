import React from 'react';
import '../css/HintArrow.css';

const getSuffix = (num) => {
  if (num === 1) { return 'st' }
  if (num === 2) { return 'nd' }
  if (num === 3) { return 'rd' }
  if (num >= 4) { return 'th' }
}

function HintArrow(props) {
  return (
    <div className='hint-arrow'><i className='material-icons'>arrow_downward</i></div>
  );
}
function areEqual(prevProps, nextProps) {
  return prevProps.message === nextProps.message && prevProps.showing === nextProps.showing;
}

export default React.memo(HintArrow, areEqual);
// export default HintArrow;
