import React from 'react';
import '../css/CornerChicken.css';

let chickenPng = require('../assets/chicken.png');
let giftboxPng = require('../assets/giftbox.png');

function CornerChicken(props) {
  let imageSource = props.showingGift ? giftboxPng : chickenPng;
  let spotClass = props.showing ?
    (props.showingGift ? 'showing-giftbox' : '')
    : 'hidden';
  let clickEffect = props.showingGift ? props.onClickGift : () => null;

  return (
    <div id='bonus-spot' className={spotClass}>
      <img onPointerDown={clickEffect} alt='' id='bonus-chicken' src={imageSource} />
    </div>
  );
}
function areEqual(prevProps, nextProps) {
  return (
    prevProps.showing == nextProps.showing &&
    prevProps.showingGift == nextProps.showingGift
  );
}

export default React.memo(CornerChicken, areEqual);
// export default CornerChicken;
