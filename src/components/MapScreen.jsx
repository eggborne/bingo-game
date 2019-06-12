import React, { useState } from 'react';
import '../css/MapScreen.css';

function MapScreen(props) {
  console.pink('MapScreen ------------------');
  const [selectedRegion, setSelectedRegion] = useState(undefined);
  let mapClass = props.showing ? 'showing' : '';
  let cash = props.userCash;
  return (
    <div id='map-screen' className={mapClass}>
      <header></header>
        <div id='map-body'>
          <img alt='' src={require('../assets/worldmap.png')} />
        </div>
      <div id='info-footer'>
        <div>Money:</div>
        <div> ${cash}</div>
      </div>
    </div>
  );
}

const isEqual = (prevProps, nextProps) => {
  return (
    prevProps.showing == nextProps.showing &&
    prevProps.userCash == nextProps.userCash
  );
};

export default React.memo(MapScreen, isEqual);
// export default MapScreen;
