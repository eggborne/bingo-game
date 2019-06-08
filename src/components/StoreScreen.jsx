import React, { useState } from 'react';
import StoreModal from './StoreModal';
import '../css/StoreScreen.css';
import { isFullScreen } from '../scripts/util';

let chipPngRed = require('../assets/bingochip.png');
let chipPngBlue = require('../assets/bingochipblue.png');
let chipPngGreen = require('../assets/bingochipgreen.png');
let chipPngOrange = require('../assets/bingochiporange.png');

const prizes = {
  'Chips / Markers': [
    { description: 'Red Chips', type: 'red', imgSrc: chipPngRed, cost: 0, class: 'item-row item-selection' },
    { description: 'Blue Chips', type: 'blue', imgSrc: chipPngBlue, cost: 500, class: 'item-row item-selection' },
    { description: 'Green Chips', type: 'green', imgSrc: chipPngGreen, cost: 1000, class: 'item-row item-selection' },
    { description: 'Orange Chips', type: 'orange', imgSrc: chipPngOrange, cost: 1500, class: 'item-row item-selection' },
  ],
  'Random Game Effects': [
    { description: '+20% FREE chance', type: '+20% FREE space chance', cost: 500, class: 'item-row' },
    { description: '+50% FREE chance', type: '+50% FREE space chance', cost: 5000, class: 'item-row' },
    { description: '+100% FREE chance', type: '+100% FREE space chance', cost: 20000, class: 'item-row' },
  ],
  'Extra Cards': [
    { description: '+1 Card Slot', type: '+1 Card Slot', cost: 2000, class: 'item-row' },
    { description: '+1 Card Slot', type: '+1 Card Slot', cost: 10000, class: 'item-row' },
    { description: '+1 Card Slot', type: '+1 Card Slot', cost: 30000, class: 'item-row' },
    { description: '+1 Card Slot', type: '+1 Card Slot', cost: 75000, class: 'item-row' }]
}

function StoreScreen(props) {
  console.pink('StoreScreen ------------------');
  const [selectedItem, setSelectedItem] = useState(undefined);
  const handleClickBuyButton = () => {
    props.onClickBuyButton(selectedItem);
    setSelectedItem(undefined);
  }
  const handleClickCancelButton = () => {
    setSelectedItem(undefined);
  }
  let userPrizes = props.userPrizes
  let prizeCategories = Object.keys(prizes);
  let storeClass = props.showing ? 'showing' : '';
  let cash = props.userCash;
  return (
    <>
      {props.showing && <StoreModal selectedItem={selectedItem} onClickBuyButton={handleClickBuyButton} onClickCancelButton={handleClickCancelButton} />}
      <div id='store-screen' className={storeClass}>
        <header><div>$</div> STORE <div>$</div></header>
        {props.showing ?
          <div id='store-body'>
            {prizeCategories.map((category, c) =>
              prizes[category].map(((row, r) =>
                <div key={r}>
                  {r === 0 && <div className={`category-label${c === 0 ? ' top' : ''}`}>{category}</div>}
                  <div className={`item-row ${row.class}${userPrizes.filter(prize => row.type === prize.type && row.cost === prize.cost).length ? ' owned' : ''}`} >
                    {category === 'Chips / Markers' && <div><img src={row.imgSrc} /></div>}
                    {category !== 'Chips / Markers' && <div>{row.type}</div>}
                    <div className={cash < row.cost ? 'unavailable' : ''}>${row.cost}</div>
                    <button onPointerDown={() => { setSelectedItem(row) }} className={cash < row.cost ? 'unavailable' : ''}>BUY</button>
                  </div>
                </div>
              ))
            )}
          </div>
          :
          <div></div>
        }
        <div id='info-footer'>
          <div>Money:</div>
          <div> ${cash}</div>
        </div>
      </div>
    </>
  );
}

export default StoreScreen;
